import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { topics } from '@/data/topics';
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Presentation,
  Download,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';
import { ReadOnlyEditor } from '@/components/ReadOnlyEditor';

const LessonDetail = () => {
  const { id } = useParams();
  const { lessons, isLoading } = useLessons();
  const lesson = lessons?.find((l) => l.id === parseInt(id || '0'));
  const topic = lesson ? topics.find((t) => t.id === lesson.topic_id) : null;
  
  // Helper function to get PowerPoint viewer URL
  const getPowerPointViewerUrl = (url: string) => {
    // Encode URL for Office Online Viewer
    const encodedUrl = encodeURIComponent(url);
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  };

  // Find previous and next lessons in the same topic
  const topicLessons = lesson
    ? lessons?.filter((l) => l.topic_id === lesson.topic_id) || []
    : [];
  const currentIndex = topicLessons.findIndex((l) => l.id === lesson?.id);
  const previousLesson =
    currentIndex > 0 ? topicLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < topicLessons.length - 1
      ? topicLessons[currentIndex + 1]
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải nội dung bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy bài học
          </h1>
          <Link to="/">
            <Button>Quay về trang chủ</Button>
          </Link>
        </div>
      </div>
    );
  }

  let parsedContent: any = null;
  let parseError: string | null = null;
  
  try {
    if (lesson.content) {
      parsedContent = JSON.parse(lesson.content);
      // Kiểm tra nếu content là object rỗng hoặc không hợp lệ
      if (typeof parsedContent !== 'object' || parsedContent === null) {
        parseError = 'Nội dung bài học không hợp lệ';
        parsedContent = null;
      }
    } else {
      parseError = 'Bài học này chưa có nội dung';
    }
  } catch (error) {
    console.error('Error parsing lesson content:', error);
    console.error('Raw content:', lesson.content);
    parseError = 'Không thể đọc nội dung bài học. Vui lòng liên hệ quản trị viên.';
    parsedContent = null;
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
        {/* Sơ đồ tổng hợp bài học */}
        {lesson.summary_diagram_url && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                Sơ đồ tổng hợp bài học
              </h2>
              <div className="rounded-lg border bg-white overflow-hidden">
                <img
                  src={lesson.summary_diagram_url}
                  alt="Sơ đồ tổng hợp bài học"
                  className="w-full h-auto object-contain max-h-[70vh]"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {parsedContent ? (
              <ReadOnlyEditor content={parsedContent} />
            ) : (
              <div className="text-center py-8">
                <p className="text-red-500 font-medium mb-2">
                  {parseError || 'Không thể hiển thị nội dung bài học'}
                </p>
                {lesson.content && (
                  <details className="mt-4 text-left">
                    <summary className="text-sm text-gray-500 cursor-pointer">
                      Xem nội dung thô (debug)
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                      {lesson.content}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        {/* PowerPoint Section */}
        {lesson.powerpoint_url && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Presentation className="h-5 w-5 mr-2 text-blue-600" />
                Tài liệu PowerPoint
              </h2>
              <Tabs defaultValue="view" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="view" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Xem trực tiếp</span>
                  </TabsTrigger>
                  <TabsTrigger value="download" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Tải về</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="view" className="mt-4">
                  <div className="rounded-lg border bg-gray-50 overflow-hidden">
                    <div className="bg-white p-2 border-b flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Xem PowerPoint trực tiếp trên trình duyệt
                      </p>
                      <a
                        href={lesson.powerpoint_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="ghost" size="sm" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Mở trong tab mới
                        </Button>
                      </a>
                    </div>
                    <div className="relative" style={{ paddingBottom: '75%', height: 0, minHeight: '800px' }}>
                      <iframe
                        src={getPowerPointViewerUrl(lesson.powerpoint_url)}
                        className="absolute top-0 left-0 w-full h-full border-0"
                        style={{ minHeight: '800px', height: '100%' }}
                        title="PowerPoint Viewer"
                        allowFullScreen
                      />
                    </div>
                    <div className="bg-white p-3 border-t text-xs text-gray-500 text-center">
                      Nếu không thể xem được, vui lòng{' '}
                      <a
                        href={lesson.powerpoint_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        mở trong tab mới
                      </a>{' '}
                      hoặc{' '}
                      <a
                        href={lesson.powerpoint_url}
                        download
                        className="text-blue-600 hover:underline"
                      >
                        tải về
                      </a>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="download" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Tải về file PowerPoint của bài học này để học tập offline hoặc xem lại sau.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={lesson.powerpoint_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="outline" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Mở trong tab mới
                        </Button>
                      </a>
                      <a
                        href={lesson.powerpoint_url}
                        download
                        className="inline-flex"
                      >
                        <Button className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          Tải về PowerPoint
                        </Button>
                      </a>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

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
