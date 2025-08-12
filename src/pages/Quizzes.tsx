import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTopicStatsByTopic } from '@/hooks/useTopicStats';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  XCircle,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

const Quizzes = () => {
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

  // Lấy danh sách bài học của topic
  const { data: lessons, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['lessons', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('topic_id', topicId)
        .order('id');

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });

  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [allQuestions, setAllQuestions] = useState<
    {
      id: number;
      question: string;
      options: string[];
      correct_answer: number;
    }[]
  >([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoadingStats || isLoadingTopic || isLoadingLessons) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bài tập...</p>
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

  const handleStartQuiz = async (lessonId: number) => {
    try {
      // Lấy tất cả câu hỏi của bài học này
      const { data: questions, error } = await supabase
        .from('questions')
        .select(
          `
          id,
          question,
          options,
          correct_answer,
          quizzes!inner(
            lesson_id
          )
        `
        )
        .eq('quizzes.lesson_id', lessonId)
        .order('id');

      if (error) throw error;

      setAllQuestions(questions || []);
      setSelectedLesson(lessonId);
      setAnswers({});
      setShowResults(false);
      setScore(0);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Có lỗi xảy ra khi tải câu hỏi!');
    }
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!allQuestions.length) return;

    let correctAnswers = 0;
    allQuestions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / allQuestions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    toast.success(`Bạn đã hoàn thành bài tập! Điểm số: ${finalScore}/100`);
  };

  const resetQuiz = () => {
    setSelectedLesson(null);
    setAllQuestions([]);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  // Lesson selection view
  if (selectedLesson === null) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                  Bài tập trắc nghiệm
                </h1>
                <p className="text-gray-600 mt-1">{topic.title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 ${
                    topic.color || 'bg-green-500'
                  } rounded-lg flex items-center justify-center mr-4`}
                >
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>
                    Kiểm tra kiến thức của bạn với các bài tập trắc nghiệm
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {lessons && lessons.length > 0 ? (
              lessons.map((lesson) => {
                // Tìm số lượng câu hỏi cho bài học này
                const lessonStats = topicStats?.find(
                  (stat) => stat.lesson_id === lesson.id
                );
                const questionCount = lessonStats?.question_count || 0;
                const estimatedTime = Math.round(questionCount * 1.5); // 1.5 phút mỗi câu hỏi

                return (
                  <Card
                    key={lesson.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">
                            {lesson.title}
                          </h3>
                          <div className="flex space-x-2">
                            <Badge variant="secondary">
                              {questionCount} câu hỏi
                            </Badge>
                            <Badge variant="secondary">
                              {estimatedTime} phút
                            </Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleStartQuiz(lesson.id)}
                          disabled={questionCount === 0}
                        >
                          Bắt đầu làm bài
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có bài tập
                  </h3>
                  <p className="text-gray-600">
                    Các bài tập cho chủ đề này đang được cập nhật
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  if (!showResults && allQuestions.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-4"
                  onClick={resetQuiz}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Bài tập trắc nghiệm
                  </h1>
                  <p className="text-sm text-gray-600">
                    {allQuestions.length} câu hỏi
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (Object.keys(answers).length / allQuestions.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(
                    (Object.keys(answers).length / allQuestions.length) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {allQuestions.map((question, index) => (
              <Card key={question.id}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Câu {index + 1}: {question.question}
                  </h3>

                  <RadioGroup
                    value={answers[question.id]?.toString()}
                    onValueChange={(value) =>
                      handleAnswerSelect(question.id, parseInt(value))
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50"
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`question-${question.id}-option-${optionIndex}`}
                        />
                        <Label
                          htmlFor={`question-${question.id}-option-${optionIndex}`}
                          className="flex-1 cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length !== allQuestions.length}
                size="lg"
              >
                Nộp bài
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults && allQuestions.length > 0) {
    const correctAnswers = allQuestions.filter(
      (q) => answers[q.id] === q.correct_answer
    ).length;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-4"
                onClick={resetQuiz}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Danh sách bài tập
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Kết quả bài tập
                </h1>
                <p className="text-gray-600">Bài tập trắc nghiệm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    score >= 80
                      ? 'bg-green-100'
                      : score >= 60
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}
                >
                  {score >= 80 ? (
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  ) : score >= 60 ? (
                    <CheckCircle className="h-12 w-12 text-yellow-600" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600" />
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Điểm số: {score}/100
                </h2>
                <p className="text-gray-600">
                  {correctAnswers} / {allQuestions.length} câu đúng
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {allQuestions.length}
                  </div>
                  <div className="text-sm text-gray-600">Tổng câu hỏi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Câu đúng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {allQuestions.length - correctAnswers}
                  </div>
                  <div className="text-sm text-gray-600">Câu sai</div>
                </div>
              </div>

              {/* Chi tiết từng câu hỏi */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-center mb-4">
                  Chi tiết từng câu hỏi
                </h3>
                {allQuestions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correct_answer;

                  return (
                    <Card
                      key={question.id}
                      className={`border-2 ${
                        isCorrect
                          ? 'border-green-200 bg-green-50'
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium">
                            Câu {index + 1}: {question.question}
                          </h4>
                          <div
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              isCorrect
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {isCorrect ? 'Đúng' : 'Sai'}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = userAnswer === optionIndex;
                            const isCorrectAnswer =
                              question.correct_answer === optionIndex;

                            return (
                              <div
                                key={optionIndex}
                                className={`p-2 rounded border ${
                                  isCorrectAnswer
                                    ? 'bg-green-100 border-green-300'
                                    : isUserAnswer && !isCorrect
                                    ? 'bg-red-100 border-red-300'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  {isCorrectAnswer && (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  )}
                                  {isUserAnswer && !isCorrect && (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  )}
                                  <span
                                    className={`font-medium ${
                                      isCorrectAnswer
                                        ? 'text-green-800'
                                        : isUserAnswer && !isCorrect
                                        ? 'text-red-800'
                                        : 'text-gray-700'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optionIndex)}.{' '}
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="space-y-4 mt-8">
                <Button onClick={resetQuiz} className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Làm lại bài tập
                </Button>
                <Link to={`/topic/${id}/quizzes`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay về danh sách bài tập
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default Quizzes;
