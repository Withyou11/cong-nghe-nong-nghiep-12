import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { useLessons } from '@/hooks/useLessons';
import { useStats } from '@/hooks/useStats';
import {
  useKeywordsByTopic,
  useCreateKeyword,
  useUpdateKeyword,
  useDeleteKeyword,
} from '@/hooks/useKeywords';
import {
  useQuizzes,
  useQuizzesByLesson,
  useCreateQuiz,
  useUpdateQuiz,
  useDeleteQuiz,
} from '@/hooks/useQuizzes';
import { QuizForm, QuizData } from '@/components/QuizForm';

import {
  Settings,
  BookOpen,
  Brain,
  Search,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye,
  Lock,
  Loader2,
  File as FileIcon,
  Download,
  ExternalLink,
  Presentation,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LessonForm } from '@/components/LessonForm';
import { Lesson } from '@/lib/api';
import {
  useExamFiles,
  useUploadExamFile,
  useDeleteExamFile,
} from '@/hooks/useExamFiles';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showEditLessonModal, setShowEditLessonModal] = useState(false);
  const [showQuizManagementModal, setShowQuizManagementModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);

  const { lessons, isLoading: isLoadingLessons, deleteLesson } = useLessons();
  const { quizzes, isLoading: isLoadingQuizzes } = useQuizzes();
  const { quizzes: lessonQuizzes, isLoading: isLoadingLessonQuizzes } =
    useQuizzesByLesson(selectedLesson?.id || null);
  const {
    stats,
    topicStats,
    recentActivity,
    isLoading: isLoadingStats,
  } = useStats();

  // Sắp xếp bài học theo tên
  const sortedLessons = lessons
    ? [...lessons].sort((a, b) =>
        a.title.localeCompare(b.title, 'vi', { numeric: true })
      )
    : [];

  const createQuizMutation = useCreateQuiz();
  const updateQuizMutation = useUpdateQuiz();
  const deleteQuizMutation = useDeleteQuiz();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Đồng bộ selectedLesson với dữ liệu lessons mới (sau khi upload/xóa sơ đồ)
  useEffect(() => {
    if (lessons && selectedLesson) {
      const updated = lessons.find((l) => l.id === selectedLesson.id);
      if (updated && updated !== selectedLesson) {
        setSelectedLesson(updated);
      }
    }
  }, [lessons, selectedLesson?.id]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'giaovien' && loginForm.password === '123456') {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      toast.success('Đăng nhập thành công!');
    } else {
      toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    toast.success('Đăng xuất thành công!');
  };

  const handleQuizSubmit = (data: QuizData) => {
    if (!selectedLesson?.id) {
      toast.error('Không tìm thấy bài học!');
      return;
    }

    console.log('Submitting quiz data:', data);
    console.log('Selected lesson:', selectedLesson);

    if (selectedQuizId) {
      // Update existing quiz
      updateQuizMutation.mutate(
        {
          quizId: selectedQuizId,
          title: selectedLesson.title,
          questions: [
            {
              question: data.question,
              options: data.options,
              correct_answer: data.correctAnswer,
            },
          ],
        },
        {
          onSuccess: () => {
            toast.success('Cập nhật bài tập thành công!');
            setShowEditQuizModal(false);
            setSelectedQuiz(null);
            setSelectedQuizId(null);
          },
          onError: (error) => {
            toast.error('Có lỗi xảy ra khi cập nhật bài tập!');
            console.error('Update quiz error:', error);
          },
        }
      );
    } else {
      // Create new quiz
      console.log('Creating new quiz with lessonId:', selectedLesson.id);
      createQuizMutation.mutate(
        {
          lessonId: selectedLesson.id,
          title: selectedLesson.title,
          questions: [
            {
              question: data.question,
              options: data.options,
              correct_answer: data.correctAnswer,
            },
          ],
        },
        {
          onSuccess: (result) => {
            console.log('Quiz created successfully:', result);
            toast.success('Tạo bài tập thành công!');
            setShowEditQuizModal(false);
            setSelectedQuiz(null);
          },
          onError: (error) => {
            console.error('Create quiz error details:', error);
            toast.error('Có lỗi xảy ra khi tạo bài tập!');
          },
        }
      );
    }
  };

  const handleDeleteQuiz = (quizId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      console.log('Deleting quiz with ID:', quizId);

      deleteQuizMutation.mutate(quizId, {
        onSuccess: () => {
          console.log('Quiz deleted successfully');
          toast.success('Đã xóa bài tập thành công!');
        },
        onError: (error) => {
          console.error('Delete quiz error details:', error);

          // Check for specific error types
          const errorObj = error as { code?: string; message?: string };
          if (errorObj?.code === '42501') {
            toast.error(
              'Lỗi quyền truy cập: Cần cấu hình RLS policy cho DELETE'
            );
          } else if (errorObj?.code === '23503') {
            toast.error('Không thể xóa: Bài tập đang được sử dụng');
          } else {
            toast.error('Có lỗi xảy ra khi xóa bài tập!');
          }
        },
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Đăng nhập quản trị</CardTitle>
            <CardDescription>
              Vui lòng đăng nhập để truy cập trang quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Đăng nhập
              </Button>
            </form>
            {/* <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo:</strong> Tài khoản: giaovien | Mật khẩu: 123456
              </p>
            </div> */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Trang quản trị
                </h1>
                <p className="text-gray-600 mt-1">
                  Quản lý nội dung và thống kê hệ thống
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng số học sinh"
            value="245"
            icon={Users}
            color="bg-blue-500"
          />
          <StatsCard
            title="Bài học"
            value={stats?.totalLessons.toString() || '0'}
            icon={BookOpen}
            color="bg-green-500"
          />
          <StatsCard
            title="Câu hỏi"
            value={stats?.totalQuestions.toString() || '0'}
            icon={Brain}
            color="bg-purple-500"
          />
          <StatsCard
            title="Từ khóa"
            value={stats?.totalKeywords.toString() || '0'}
            icon={Search}
            color="bg-orange-500"
          />
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="lessons" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger
              value="lessons"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Bài học</span>
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Bài tập</span>
            </TabsTrigger>
            <TabsTrigger
              value="keywords"
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Từ khóa</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Thống kê</span>
            </TabsTrigger>
            <TabsTrigger
              value="powerpoints"
              className="flex items-center space-x-2"
            >
              <Presentation className="h-4 w-4" />
              <span>PowerPoint</span>
            </TabsTrigger>
            <TabsTrigger
              value="exam-files"
              className="flex items-center space-x-2"
            >
              <FileIcon className="h-4 w-4" />
              <span>Đề thi THPTQG</span>
            </TabsTrigger>
          </TabsList>

          {/* Lessons Management */}
          <TabsContent value="lessons">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản lý bài học</CardTitle>
                    <CardDescription>
                      Tạo, sửa và xóa các bài học
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddLessonModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm bài học
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingLessons ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">
                              {lesson.topics?.title}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setShowEditLessonModal(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Bạn có chắc chắn muốn xóa bài học này?'
                                )
                              ) {
                                deleteLesson.mutate(lesson.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PowerPoint Management */}
          <TabsContent value="powerpoints">
            <PowerPointManagementSection />
          </TabsContent>

          {/* Exam Files Management */}
          <TabsContent value="exam-files">
            <ExamFilesSection />
          </TabsContent>

          {/* Quizzes Management */}
          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản lý bài tập trắc nghiệm</CardTitle>
                    <CardDescription>
                      Quản lý bài tập cho từng bài học
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingLessons || isLoadingQuizzes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sortedLessons.map((lesson) => {
                      const lessonQuizzesForLesson =
                        quizzes?.filter((q) => q.lesson_id === lesson.id) || [];
                      const totalQuestions = lessonQuizzesForLesson.reduce(
                        (total, quiz) => {
                          return total + (quiz.questions?.length || 0);
                        },
                        0
                      );
                      const estimatedTime = Math.round(totalQuestions * 1.5); // 1.5 phút mỗi câu hỏi

                      return (
                        <div
                          key={lesson.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 p-4 border-b">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-lg">
                                  {lesson.title}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="secondary">
                                    {lessonQuizzesForLesson.length} bài tập
                                  </Badge>
                                  <Badge variant="secondary">
                                    {estimatedTime} phút
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedLesson(lesson);
                                  setShowQuizManagementModal(true);
                                }}
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Quản lý bài tập
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keywords Management */}
          <TabsContent value="keywords">
            <KeywordsAdminSection />
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê theo chủ đề</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topicStats?.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <h4 className="font-medium">{topic.title}</h4>
                            <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                              <span>{topic.lessons} bài học</span>
                              <span>{topic.quizzes} bài tập</span>
                              <span>{topic.keywords} từ khóa</span>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {Math.round(Math.random() * 50 + 50)}% hoàn thành
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  ) : recentActivity && recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => {
                        const getIcon = (iconName: string) => {
                          switch (iconName) {
                            case 'BookOpen':
                              return <BookOpen className="h-4 w-4" />;
                            case 'Brain':
                              return <Brain className="h-4 w-4" />;
                            case 'Search':
                              return <Search className="h-4 w-4" />;
                            case 'FileIcon':
                              return <FileIcon className="h-4 w-4" />;
                            default:
                              return <BookOpen className="h-4 w-4" />;
                          }
                        };

                        const getColorClass = (color: string) => {
                          switch (color) {
                            case 'green':
                              return 'bg-green-100 text-green-600';
                            case 'blue':
                              return 'bg-blue-100 text-blue-600';
                            case 'purple':
                              return 'bg-purple-100 text-purple-600';
                            case 'orange':
                              return 'bg-orange-100 text-orange-600';
                            default:
                              return 'bg-gray-100 text-gray-600';
                          }
                        };

                        const formatTimeAgo = (timestamp: string) => {
                          const now = new Date();
                          const activityTime = new Date(timestamp);
                          const diffInMs =
                            now.getTime() - activityTime.getTime();
                          const diffInHours = Math.floor(
                            diffInMs / (1000 * 60 * 60)
                          );
                          const diffInDays = Math.floor(diffInHours / 24);

                          if (diffInDays > 0) {
                            return `${diffInDays} ngày trước`;
                          } else if (diffInHours > 0) {
                            return `${diffInHours} giờ trước`;
                          } else {
                            return 'Vừa xong';
                          }
                        };

                        return (
                          <div
                            key={activity.id}
                            className="flex items-center space-x-3 p-3 border rounded"
                          >
                            <div
                              className={`w-8 h-8 ${getColorClass(
                                activity.color
                              )} rounded-full flex items-center justify-center`}
                            >
                              {getIcon(activity.icon)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {activity.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {activity.subtitle}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatTimeAgo(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p>Chưa có hoạt động nào</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Lesson Modal */}
      <Dialog open={showAddLessonModal} onOpenChange={setShowAddLessonModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo bài học mới</DialogTitle>
          </DialogHeader>
          <LessonForm
            onSuccess={() => {
              setShowAddLessonModal(false);
            }}
            onCancel={() => setShowAddLessonModal(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lesson Modal */}
      <Dialog open={showEditLessonModal} onOpenChange={setShowEditLessonModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài học</DialogTitle>
          </DialogHeader>
          <LessonForm
            lesson={selectedLesson || undefined}
            onSuccess={() => {
              setShowEditLessonModal(false);
              setSelectedLesson(null);
            }}
            onCancel={() => {
              setShowEditLessonModal(false);
              setSelectedLesson(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Quiz Management Modal */}
      <Dialog
        open={showQuizManagementModal}
        onOpenChange={setShowQuizManagementModal}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quản lý bài tập - {selectedLesson?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setSelectedQuiz({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                  });
                  setSelectedQuizId(null);
                  setShowEditQuizModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm bài tập mới
              </Button>
            </div>

            {isLoadingLessonQuizzes ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : lessonQuizzes && lessonQuizzes.length > 0 ? (
              lessonQuizzes.map((quiz) => (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-lg">{quiz.title}</h4>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedQuiz({
                            question: quiz.questions?.[0]?.question || '',
                            options: quiz.questions?.[0]?.options || [
                              '',
                              '',
                              '',
                              '',
                            ],
                            correctAnswer:
                              quiz.questions?.[0]?.correct_answer || 0,
                          });
                          setShowEditQuizModal(true);
                          setSelectedQuizId(quiz.id);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {quiz.questions?.map((question, index) => (
                      <div
                        key={question.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <p className="text-sm font-medium mb-3 text-gray-900">
                          {question.question}
                        </p>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded border ${
                                optIndex === question.correct_answer
                                  ? 'bg-green-100 border-green-300 text-green-800'
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              <span className="font-medium mr-2">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài tập
                </h3>
                <p className="text-gray-600">
                  Chưa có bài tập nào cho bài học này
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Quiz Modal */}
      <Dialog open={showEditQuizModal} onOpenChange={setShowEditQuizModal}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>
              {selectedQuiz?.question ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
            </DialogTitle>
          </DialogHeader>
          <QuizForm
            onSubmit={handleQuizSubmit}
            mode={selectedQuiz?.question ? 'edit' : 'add'}
            initialData={selectedQuiz || undefined}
            onCancel={() => setShowEditQuizModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;

// ----- PowerPoint management section (inline component) -----
function PowerPointManagementSection() {
  const { lessons, isLoading, uploadLessonPowerpoint, removeLessonPowerpoint } = useLessons();
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const fileInputRefs = React.useRef<Record<number, HTMLInputElement | null>>({});

  const handleFileSelect = (lessonId: number, file: File | null) => {
    if (!file) return;
    
    // Validate file type
    const validTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
    ];
    const validExtensions = ['.ppt', '.pptx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      toast.error('Vui lòng chọn file PowerPoint (.ppt hoặc .pptx)');
      return;
    }

    setSelectedLessonId(lessonId);
    uploadLessonPowerpoint.mutate(
      { lessonId, file },
      {
        onSuccess: () => {
          setSelectedLessonId(null);
        },
        onError: () => {
          setSelectedLessonId(null);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý PowerPoint bài học</CardTitle>
        <CardDescription>
          Tải lên file PowerPoint cho từng bài học. Mỗi bài học chỉ có thể có một file PowerPoint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="space-y-4">
            {[...lessons].sort((a, b) =>
              a.title.localeCompare(b.title, 'vi', { numeric: true })
            ).map((lesson) => (
              <div
                key={lesson.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-lg">{lesson.title}</h3>
                      <Badge variant="secondary">{lesson.topics?.title}</Badge>
                    </div>
                    {lesson.powerpoint_url ? (
                      <div className="mt-2 flex items-center space-x-2">
                        <Presentation className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">
                          Đã có PowerPoint
                        </span>
                        <a
                          href={lesson.powerpoint_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 hover:underline ml-2"
                        >
                          Xem/Tải về
                        </a>
                      </div>
                    ) : (
                      <div className="mt-2 flex items-center space-x-2">
                        <Presentation className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Chưa có PowerPoint
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      ref={(el) => {
                        fileInputRefs.current[lesson.id] = el;
                      }}
                      type="file"
                      accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileSelect(lesson.id, file);
                        e.target.value = '';
                      }}
                    />
                    {lesson.powerpoint_url ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[lesson.id]?.click()}
                          disabled={uploadLessonPowerpoint.isPending}
                        >
                          {uploadLessonPowerpoint.isPending &&
                          selectedLessonId === lesson.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Edit className="h-4 w-4 mr-2" />
                          )}
                          Thay đổi
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLessonPowerpoint.mutate(lesson.id)}
                          disabled={removeLessonPowerpoint.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRefs.current[lesson.id]?.click()}
                        disabled={uploadLessonPowerpoint.isPending}
                      >
                        {uploadLessonPowerpoint.isPending &&
                        selectedLessonId === lesson.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Tải lên PowerPoint
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-8">
            Chưa có bài học nào
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ----- Exam files admin section (inline component) -----
function ExamFilesSection() {
  const { files, isLoading } = useExamFiles();
  const upload = useUploadExamFile();
  const del = useDeleteExamFile();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error('Vui lòng chọn file (.pdf, .docx)');
    if (!title.trim()) return toast.error('Vui lòng nhập tiêu đề');
    upload.mutate(
      { file, title, topicId: null },
      {
        onSuccess: () => {
          toast.success('Tải lên thành công');
          setTitle('');
          setFile(null);
        },
        onError: (err) => {
          console.error(err);
          toast.error('Tải lên thất bại');
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý đề thi THPTQG</CardTitle>
        <CardDescription>Tải lên file Word/PDF, xem và xóa</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-3 items-end"
          onSubmit={onUpload}
        >
          <div className="md:col-span-1">
            <Label htmlFor="exam-title">Tiêu đề</Label>
            <Input
              id="exam-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Đề minh họa Toán 2025"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="exam-file">File (.pdf, .docx)</Label>
            <Input
              id="exam-file"
              type="file"
              accept="application/pdf,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="md:col-span-1">
            <Button type="submit" disabled={upload.isPending}>
              {upload.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Tải lên
            </Button>
          </div>
        </form>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : files.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              Chưa có file nào
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{f.title}</div>
                      <div className="text-xs text-gray-500">
                        {f.file_name} • {(f.file_size / 1024 / 1024).toFixed(2)}{' '}
                        MB • {new Date(f.created_at).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a href={f.public_url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Xem
                      </Button>
                    </a>
                    <a href={f.public_url} download>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Tải
                      </Button>
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => del.mutate(f.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ----- Keywords admin section (inline) -----
function KeywordsAdminSection() {
  const { lessons } = useLessons();
  // lấy list topic từ lessons (nếu cần) hoặc đọc từ statsApi.getTopicStats đã có ở trên (topicStats)
  // Ở đây dựa vào stats đã fetch sẵn qua useStats
  const { topicStats, isLoading: isLoadingStats } = useStats();

  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
  const { keywords, isLoading } = useKeywordsByTopic(activeTopicId);
  const createKeyword = useCreateKeyword();
  const updateKeyword = useUpdateKeyword();
  const deleteKeyword = useDeleteKeyword();

  const [form, setForm] = useState<{
    term: string;
    definition: string;
    id?: number;
  }>({ term: '', definition: '' });
  const isEditing = typeof form.id === 'number';

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Chủ đề</CardTitle>
          <CardDescription>Chọn chủ đề để quản lý từ khóa</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-2">
              {topicStats?.map((t) => (
                <button
                  key={t.id}
                  className={`w-full text-left p-3 border rounded hover:bg-gray-50 ${
                    activeTopicId === t.id ? 'border-green-400 bg-green-50' : ''
                  }`}
                  onClick={() => setActiveTopicId(t.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.title}</span>
                    <Badge variant="secondary">{t.keywords} từ khóa</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Từ khóa theo chủ đề</CardTitle>
          <CardDescription>
            {activeTopicId
              ? 'Thêm/sửa/xóa từ khóa cho chủ đề đã chọn'
              : 'Chọn một chủ đề ở cột bên trái'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!activeTopicId ? (
            <div className="text-gray-600">Hãy chọn một chủ đề để bắt đầu.</div>
          ) : (
            <div className="space-y-6">
              {/* Form add/edit */}
              <form
                className="grid gap-4 md:grid-cols-2 items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.term.trim() || !form.definition.trim()) {
                    return toast.error(
                      'Vui lòng nhập đầy đủ Term và Định nghĩa'
                    );
                  }
                  if (isEditing && form.id) {
                    updateKeyword.mutate(
                      {
                        id: form.id,
                        term: form.term,
                        definition: form.definition,
                        topic_id: activeTopicId,
                      },
                      {
                        onSuccess: () => {
                          toast.success('Cập nhật từ khóa thành công');
                          setForm({ term: '', definition: '' });
                        },
                        onError: () => toast.error('Lỗi khi cập nhật từ khóa'),
                      }
                    );
                  } else {
                    createKeyword.mutate(
                      {
                        topic_id: activeTopicId,
                        term: form.term,
                        definition: form.definition,
                      },
                      {
                        onSuccess: () => {
                          toast.success('Thêm từ khóa thành công');
                          setForm({ term: '', definition: '' });
                        },
                        onError: () => toast.error('Lỗi khi thêm từ khóa'),
                      }
                    );
                  }
                }}
              >
                <div>
                  <Label htmlFor="kw-term">Từ khóa</Label>
                  <Input
                    id="kw-term"
                    value={form.term}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, term: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="kw-def">Định nghĩa</Label>
                  <Input
                    id="kw-def"
                    value={form.definition}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, definition: e.target.value }))
                    }
                  />
                </div>
                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit">
                    {isEditing ? (
                      <>
                        <Edit className="h-4 w-4 mr-2" /> Cập nhật
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" /> Thêm mới
                      </>
                    )}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setForm({ term: '', definition: '' })}
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              </form>

              {/* List keywords */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : keywords.length === 0 ? (
                <div className="text-gray-600">Chưa có từ khóa nào.</div>
              ) : (
                <div className="space-y-2">
                  {keywords.map((k) => (
                    <div
                      key={k.id}
                      className="p-3 border rounded flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium">{k.term}</div>
                        <div className="text-sm text-gray-600">
                          {k.definition}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setForm({
                              id: k.id,
                              term: k.term,
                              definition: k.definition,
                            })
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm('Xóa từ khóa này?')) {
                              deleteKeyword.mutate(
                                { id: k.id, topic_id: k.topic_id },
                                {
                                  onSuccess: () =>
                                    toast.success('Đã xóa từ khóa'),
                                  onError: () => toast.error('Xóa thất bại'),
                                }
                              );
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
