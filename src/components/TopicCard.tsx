
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Brain, Search } from 'lucide-react';
import { Topic } from '@/data/topics';

interface TopicCardProps {
  topic: Topic;
}

export const TopicCard = ({ topic }: TopicCardProps) => {
  return (
    <Link to={`/topic/${topic.id}`}>
      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-lg font-semibold group-hover:text-green-600 transition-colors">
            {topic.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {topic.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              {topic.lessons} bài học
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              {topic.quizzes} bài tập
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Search className="h-3 w-3 mr-1" />
              {topic.keywords} từ khóa
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
