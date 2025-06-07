import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TopicCard } from '@/components/TopicCard';
import { StatsCard } from '@/components/StatsCard';
import { topics } from '@/data/topics';
import {
  BookOpen,
  Brain,
  Search,
  Users,
  Target,
  Award,
  MessageCircle,
  FileText,
  ChevronRight,
  Leaf,
  Fish,
  Loader2,
} from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';
import { useQuizzes } from '@/hooks/useQuizzes';
import { useKeywords } from '@/hooks/useKeywords';

const Home = () => {
  const { lessons, isLoading: isLoadingLessons } = useLessons();
  const { quizzes, isLoading: isLoadingQuizzes } = useQuizzes();
  const { keywords, isLoading: isLoadingKeywords } = useKeywords();

  const totalLessons = lessons?.length || 0;
  const totalQuizzes = quizzes?.length || 0;
  const totalKeywords = keywords?.length || 0;

  const isLoading = isLoadingLessons || isLoadingQuizzes || isLoadingKeywords;

  const features = [
    {
      icon: BookOpen,
      title: 'Danh sách bài học',
      description: 'Học tập theo từng chủ đề với nội dung chi tiết và dễ hiểu',
      color: 'text-green-600',
    },
    {
      icon: Brain,
      title: 'Bài tập trắc nghiệm',
      description: 'Kiểm tra kiến thức với hệ thống chấm điểm tự động',
      color: 'text-blue-600',
    },
    {
      icon: Search,
      title: 'Tra cứu từ khóa',
      description: 'Tìm kiếm và tra cứu thuật ngữ chuyên ngành nhanh chóng',
      color: 'text-purple-600',
    },
    {
      icon: FileText,
      title: 'Đề luyện thi THPTQG',
      description: 'Luyện tập với đề thi mẫu để chuẩn bị cho kỳ thi quan trọng',
      color: 'text-orange-600',
    },
    {
      icon: MessageCircle,
      title: 'Chatbot hỗ trợ',
      description: 'Hỗ trợ giải đáp thắc mắc 24/7 về nội dung học tập',
      color: 'text-indigo-600',
    },
  ];

  const goals = [
    'Trang bị kiến thức cơ bản về lâm nghiệp và thủy sản',
    'Phát triển kỹ năng thực hành trong lĩnh vực nông nghiệp',
    'Nâng cao nhận thức về bảo vệ môi trường và phát triển bền vững',
    'Chuẩn bị kiến thức cho kỳ thi THPT Quốc gia',
    'Định hướng nghề nghiệp trong lĩnh vực công nghệ nông nghiệp',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <Leaf className="h-8 w-8" />
              </div>
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <Fish className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              WEBSITE HỌC TẬP CÔNG NGHỆ
              <span className="block text-yellow-300 mt-4">
                ĐỊNH HƯỚNG NÔNG NGHIỆP 12
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Nền tảng học tập trực tuyến dành cho học sinh lớp 12 tìm hiểu về
              công nghệ lâm nghiệp và thủy sản
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/topic/1">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Bắt đầu học ngay
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/chat">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  Chatbot hỗ trợ
                  <MessageCircle className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Chủ đề học tập"
                value={topics.length.toString()}
                icon={Target}
                color="bg-green-500"
              />
              <StatsCard
                title="Bài học"
                value={totalLessons.toString()}
                icon={BookOpen}
                color="bg-blue-500"
              />
              <StatsCard
                title="Câu hỏi trắc nghiệm"
                value={totalQuizzes.toString()}
                icon={Brain}
                color="bg-purple-500"
              />
            </div>
          )}
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Các chủ đề học tập
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá {topics.length} chủ đề chính về lâm nghiệp và thủy sản
              với nội dung phong phú và cập nhật
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={{
                  ...topic,
                  lessons:
                    lessons?.filter((l) => l.topic_id === topic.id).length || 0,
                  quizzes:
                    quizzes?.filter((q) => q.topic_id === topic.id).length || 0,
                  keywords:
                    keywords?.filter((k) => k.topic_id === topic.id).length ||
                    0,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hệ thống học tập toàn diện với các công cụ hỗ trợ hiện đại
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mục tiêu giáo dục
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những mục tiêu cụ thể mà chúng tôi hướng đến trong việc giáo dục
              học sinh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-gray-800 font-medium">{goal}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
