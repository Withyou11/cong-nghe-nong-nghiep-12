import React from 'react';
import { useState } from 'react';
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
import { topics, lessons, quizzes, keywords } from '@/data/topics';

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
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LessonForm } from '@/components/LessonForm';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [showAddLessonModal, setShowAddLessonModal] = useState(false);

  // Mock statistics
  const totalLessons = topics.reduce((sum, topic) => sum + topic.lessons, 0);
  const totalQuizzes = topics.reduce((sum, topic) => sum + topic.quizzes, 0);
  const totalKeywords = topics.reduce((sum, topic) => sum + topic.keywords, 0);
  const totalStudents = 245; // Mock data

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'giaovien' && loginForm.password === '123456') {
      setIsLoggedIn(true);
      toast.success('Đăng nhập thành công!');
    } else {
      toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  // Login form
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

  // Admin dashboard
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
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
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
            value={totalStudents.toString()}
            icon={Users}
            color="bg-blue-500"
          />
          <StatsCard
            title="Bài học"
            value={totalLessons.toString()}
            icon={BookOpen}
            color="bg-green-500"
          />
          <StatsCard
            title="Bài tập"
            value={totalQuizzes.toString()}
            icon={Brain}
            color="bg-purple-500"
          />
          <StatsCard
            title="Từ khóa"
            value={totalKeywords.toString()}
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
                <div className="space-y-4">
                  {lessons.map((lesson) => {
                    const topic = topics.find((t) => t.id === lesson.topicId);
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{topic?.title}</Badge>
                            <span className="text-sm text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                      Tạo, sửa và xóa các bài tập
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm bài tập
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quizzes.map((quiz) => {
                    const topic = topics.find((t) => t.id === quiz.topicId);
                    return (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{quiz.title}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{topic?.title}</Badge>
                            <span className="text-sm text-gray-500">
                              {quiz.questions.length} câu hỏi
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                <div className="space-y-4">
                  {keywords.map((keyword) => {
                    const topic = topics.find((t) => t.id === keyword.topicId);
                    return (
                      <div
                        key={keyword.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{keyword.term}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{topic?.title}</Badge>
                            <p className="text-sm text-gray-600 max-w-md truncate">
                              {keyword.definition}
                            </p>
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
                    );
                  })}
                </div>
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
                  <div className="space-y-4">
                    {topics.map((topic) => (
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

      <Dialog open={showAddLessonModal} onOpenChange={setShowAddLessonModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo bài học mới</DialogTitle>
          </DialogHeader>
          <LessonForm
            onSuccess={() => {
              setShowAddLessonModal(false);
              // Refresh danh sách bài học
              // TODO: Implement refresh logic
            }}
            onCancel={() => setShowAddLessonModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
