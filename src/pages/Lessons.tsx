import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { topics } from '@/data/topics';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';

const Lessons = () => {
  const { id } = useParams();
  const topic = topics.find((t) => t.id === parseInt(id || '0'));
  const { lessons, isLoading } = useLessons();
  const topicLessons =
    lessons?.filter((l) => l.topic_id === parseInt(id || '0')) || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy chủ đề
          </h1>
          <Link to="/">
            <Button>Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link to={`/topic/${id}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Danh sách bài học
              </h1>
              <p className="text-gray-600 mt-1">{topic.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center">
              <div
                className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mr-4`}
              >
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{topicLessons.length} bài học</Badge>
              <Badge variant="secondary">
                Thời gian: {topicLessons.length * 45} phút
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : topicLessons.length > 0 ? (
            topicLessons.map((lesson, index) => (
              <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <span className="text-green-600 font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có bài học
                </h3>
                <p className="text-gray-600 mb-4">
                  Các bài học cho chủ đề này đang được cập nhật
                </p>
                <Link to={`/topic/${id}`}>
                  <Button variant="outline">Quay lại chủ đề</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
