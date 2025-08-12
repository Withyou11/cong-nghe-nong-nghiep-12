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
import { useTopicStatsByTopic } from '@/hooks/useTopicStats';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  BookOpen,
  Brain,
  Search,
  ArrowLeft,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';

const TopicDetail = () => {
  const { id } = useParams();
  const topicId = parseInt(id || '0');
  const { topicStats, isLoading: isLoadingStats } =
    useTopicStatsByTopic(topicId);

  // Lấy thông tin topic
  const { data: topic, isLoading: isLoadingTopic } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('id', topicId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  // Lấy thông tin lessons và keywords
  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['lessons', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('topic_id', topicId);

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  const { data: keywords, isLoading: isLoadingKeywords } = useQuery({
    queryKey: ['keywords', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('topic_id', topicId);

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  const isLoading =
    isLoadingStats || isLoadingTopic || isLoadingLessons || isLoadingKeywords;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

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

  // Tính toán thống kê
  const totalLessons = lessons?.length || 0;
  const totalQuizzes = topicStats?.length || 0;
  const totalQuestions =
    topicStats?.reduce((sum, stat) => sum + stat.question_count, 0) || 0;
  const totalKeywords = keywords?.length || 0;

  const features = [
    {
      title: 'Danh sách bài học',
      description: `${totalLessons} bài học chi tiết về ${topic.title.toLowerCase()}`,
      icon: BookOpen,
      link: `/topic/${topic.id}/lessons`,
      color: 'bg-green-500',
      stats: `${totalLessons} bài học`,
    },
    {
      title: 'Bài tập trắc nghiệm',
      description: `${totalQuestions} câu hỏi trắc nghiệm để kiểm tra kiến thức`,
      icon: Brain,
      link: `/topic/${topic.id}/quizzes`,
      color: 'bg-blue-500',
      stats: `${totalQuestions} câu hỏi`,
    },
    {
      title: 'Tra cứu từ khóa',
      description: `${totalKeywords} thuật ngữ chuyên môn quan trọng`,
      icon: Search,
      link: `/topic/${topic.id}/keywords`,
      color: 'bg-purple-500',
      stats: `${totalKeywords} từ khóa`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div
        className="bg-cover bg-center relative h-96"
        style={{
          backgroundImage: `url(${
            topic.background_image ||
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex items-center">
          <div className="text-white">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-white hover:bg-white hover:bg-opacity-20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {topic.title}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              {topic.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Topic Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center">
              <div
                className={`w-16 h-16 ${
                  topic.color || 'bg-green-500'
                } rounded-xl flex items-center justify-center mr-4`}
              >
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{topic.title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {topic.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <BookOpen className="h-4 w-4 mr-2" />
                {totalLessons} bài học
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Brain className="h-4 w-4 mr-2" />
                {totalQuestions} câu hỏi
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Search className="h-4 w-4 mr-2" />
                {totalKeywords} từ khóa
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Clock className="h-4 w-4 mr-2" />
                Ước tính: {totalLessons * 45} phút
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div
                      className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {feature.stats}
                      </Badge>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle>Bắt đầu học tập</CardTitle>
            <CardDescription>
              Chọn chức năng bạn muốn sử dụng để bắt đầu hành trình học tập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/topic/${topic.id}/lessons`} className="flex-1">
                <Button className="w-full" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Xem danh sách bài học
                </Button>
              </Link>
              <Link to={`/topic/${topic.id}/quizzes`} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <Brain className="h-4 w-4 mr-2" />
                  Làm bài tập trắc nghiệm
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TopicDetail;
