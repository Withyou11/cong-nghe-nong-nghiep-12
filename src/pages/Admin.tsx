import React from 'react';
import { useState, useEffect } from 'react';
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
import { useQuizzes } from '@/hooks/useQuizzes';
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

  const { lessons, isLoading: isLoadingLessons, deleteLesson } = useLessons();
  const { quizzes, isLoading: isLoadingQuizzes } = useQuizzes();
  const { stats, topicStats, isLoading: isLoadingStats } = useStats();

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
    // TODO: Implement quiz submission logic
    console.log('Quiz data:', data);
    toast.success('Bài tập đã được lưu thành công!');
    setShowEditQuizModal(false);
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
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo:</strong> Tài khoản: giaovien | Mật khẩu: 123456
              </p>
            </div>
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
            title="Bài tập"
            value={stats?.totalQuizzes.toString() || '0'}
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
          <TabsList className="grid w-full grid-cols-4">
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
                    {lessons?.map((lesson) => (
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
                    {lessons?.map((lesson) => {
                      const lessonQuizzes =
                        quizzes?.filter((q) => q.lesson_id === lesson.id) || [];
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
                                    {lessonQuizzes.length} bài tập
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {lesson.duration}
                                  </span>
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản lý từ khóa</CardTitle>
                    <CardDescription>
                      Tạo, sửa và xóa các từ khóa
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm từ khóa
                  </Button>
                </div>
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
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{topic.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{topic.title}</Badge>
                            <span className="text-sm text-gray-500">
                              {topic.keywords} từ khóa
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
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
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Bài học mới được tạo
                        </p>
                        <p className="text-xs text-gray-500">2 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Bài tập được cập nhật
                        </p>
                        <p className="text-xs text-gray-500">1 ngày trước</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Search className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Từ khóa mới được thêm
                        </p>
                        <p className="text-xs text-gray-500">3 ngày trước</p>
                      </div>
                    </div>
                  </div>
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
                  setShowEditQuizModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm bài tập mới
              </Button>
            </div>

            {quizzes
              ?.filter((q) => q.lesson_id === selectedLesson?.id)
              .map((quiz) => (
                <div key={quiz.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{quiz.title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {quiz.questions?.length || 0} câu hỏi
                      </Badge>
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
                              'Bạn có chắc chắn muốn xóa bài tập này?'
                            )
                          ) {
                            // TODO: Implement delete quiz
                            toast.success('Đã xóa bài tập thành công!');
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {quiz.questions?.map((question, index) => (
                      <div
                        key={question.id}
                        className="pl-4 border-l-2 border-gray-200"
                      >
                        <p className="text-sm font-medium mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {question.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded ${
                                optIndex === question.correct_answer
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-gray-50'
                              }`}
                            >
                              {String.fromCharCode(65 + optIndex)}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
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
