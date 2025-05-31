
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { topics, keywords } from '@/data/topics';
import { ArrowLeft, Search, BookOpen } from 'lucide-react';

const Keywords = () => {
  const { id } = useParams();
  const topic = topics.find(t => t.id === parseInt(id || '0'));
  const topicKeywords = keywords.filter(k => k.topicId === parseInt(id || '0'));
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredKeywords = topicKeywords.filter(keyword =>
    keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    keyword.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy chủ đề</h1>
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
                Tra cứu từ khóa
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
              <div className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mr-4`}>
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>Tra cứu các thuật ngữ chuyên môn và định nghĩa</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {filteredKeywords.length} từ khóa
              </Badge>
              {searchTerm && (
                <Badge variant="outline">
                  Kết quả tìm kiếm: "{searchTerm}"
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm từ khóa hoặc định nghĩa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Keywords List */}
        <div className="space-y-4">
          {filteredKeywords.length > 0 ? (
            filteredKeywords.map((keyword) => (
              <Card key={keyword.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {keyword.term}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {keyword.definition}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : topicKeywords.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có từ khóa
                </h3>
                <p className="text-gray-600 mb-4">
                  Các từ khóa cho chủ đề này đang được cập nhật
                </p>
                <Link to={`/topic/${id}`}>
                  <Button variant="outline">
                    Quay lại chủ đề
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy kết quả
                </h3>
                <p className="text-gray-600 mb-4">
                  Không có từ khóa nào phù hợp với từ khóa tìm kiếm "{searchTerm}"
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Keywords;
