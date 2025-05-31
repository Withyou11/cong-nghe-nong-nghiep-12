
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { lessons, topics } from '@/data/topics';
import { ArrowLeft, Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const LessonDetail = () => {
  const { id } = useParams();
  const lesson = lessons.find(l => l.id === parseInt(id || '0'));
  const topic = lesson ? topics.find(t => t.id === lesson.topicId) : null;
  
  // Find previous and next lessons in the same topic
  const topicLessons = lesson ? lessons.filter(l => l.topicId === lesson.topicId) : [];
  const currentIndex = topicLessons.findIndex(l => l.id === lesson?.id);
  const previousLesson = currentIndex > 0 ? topicLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < topicLessons.length - 1 ? topicLessons[currentIndex + 1] : null;

  if (!lesson || !topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài học</h1>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link to={`/topic/${topic.id}/lessons`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Danh sách bài học
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {topic.title}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {lesson.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Clock className="h-4 w-4 mr-1" />
                {lesson.duration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lesson Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div 
                className="lesson-content"
                dangerouslySetInnerHTML={{ 
                  __html: lesson.content.replace(/\n/g, '<br/>').replace(/#{1,6} /g, '<h2>').replace(/<h2>/g, '<h2 class="text-2xl font-bold mb-4 text-gray-900">').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {previousLesson && (
              <Link to={`/lesson/${previousLesson.id}`}>
                <Button variant="outline" className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Bài trước</div>
                    <div className="font-medium truncate max-w-48">
                      {previousLesson.title}
                    </div>
                  </div>
                </Button>
              </Link>
            )}
          </div>

          <div className="mx-4">
            <Link to={`/topic/${topic.id}/quizzes`}>
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Làm bài tập
              </Button>
            </Link>
          </div>

          <div className="flex-1 flex justify-end">
            {nextLesson && (
              <Link to={`/lesson/${nextLesson.id}`}>
                <Button variant="outline" className="flex items-center">
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Bài tiếp theo</div>
                    <div className="font-medium truncate max-w-48">
                      {nextLesson.title}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
