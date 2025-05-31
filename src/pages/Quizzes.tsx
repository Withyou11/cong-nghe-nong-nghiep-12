
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { topics, quizzes } from '@/data/topics';
import { ArrowLeft, Brain, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const Quizzes = () => {
  const { id } = useParams();
  const topic = topics.find(t => t.id === parseInt(id || '0'));
  const topicQuizzes = quizzes.filter(q => q.topicId === parseInt(id || '0'));
  
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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

  const currentQuiz = selectedQuiz !== null ? topicQuizzes.find(q => q.id === selectedQuiz) : null;
  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];

  const handleStartQuiz = (quizId: number) => {
    setSelectedQuiz(quizId);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    
    let correctAnswers = 0;
    currentQuiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
    
    toast.success(`Bạn đã hoàn thành bài tập! Điểm số: ${finalScore}/100`);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
  };

  // Quiz selection view
  if (selectedQuiz === null) {
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
                <div className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mr-4`}>
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>Kiểm tra kiến thức của bạn với các bài tập trắc nghiệm</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {topicQuizzes.length > 0 ? (
              topicQuizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                        <div className="flex space-x-2">
                          <Badge variant="secondary">
                            {quiz.questions.length} câu hỏi
                          </Badge>
                          <Badge variant="secondary">
                            {quiz.questions.length * 2} phút
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={() => handleStartQuiz(quiz.id)}>
                        Bắt đầu làm bài
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
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
  if (!showResults && currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" className="mr-4" onClick={resetQuiz}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentQuiz?.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Câu {currentQuestionIndex + 1} / {currentQuiz?.questions.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((currentQuestionIndex + 1) / (currentQuiz?.questions.length || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentQuestionIndex + 1) / (currentQuiz?.questions.length || 1)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
              
              <RadioGroup 
                value={answers[currentQuestion.id]?.toString()} 
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Câu trước
                </Button>
                
                {currentQuestionIndex === (currentQuiz?.questions.length || 1) - 1 ? (
                  <Button 
                    onClick={handleSubmitQuiz}
                    disabled={!answers[currentQuestion.id] && answers[currentQuestion.id] !== 0}
                  >
                    Nộp bài
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestion.id] && answers[currentQuestion.id] !== 0}
                  >
                    Câu tiếp theo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults && currentQuiz) {
    const correctAnswers = currentQuiz.questions.filter(q => answers[q.id] === q.correctAnswer).length;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="mr-4" onClick={resetQuiz}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Danh sách bài tập
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kết quả bài tập</h1>
                <p className="text-gray-600">{currentQuiz.title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Score Card */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <span className={`text-3xl font-bold ${
                  score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {score}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {score >= 80 ? 'Xuất sắc!' : score >= 60 ? 'Khá tốt!' : 'Cần cố gắng thêm!'}
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn đã trả lời đúng {correctAnswers}/{currentQuiz.questions.length} câu hỏi
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => handleStartQuiz(currentQuiz.id)}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Làm lại
                </Button>
                <Button variant="outline" onClick={resetQuiz}>
                  Chọn bài khác
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Chi tiết kết quả:</h3>
            {currentQuiz.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Câu {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`p-2 rounded ${
                                optionIndex === question.correctAnswer 
                                  ? 'bg-green-100 text-green-800' 
                                  : optionIndex === userAnswer && userAnswer !== question.correctAnswer
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-50'
                              }`}
                            >
                              {option}
                              {optionIndex === question.correctAnswer && (
                                <span className="ml-2 text-green-600 font-medium">(Đáp án đúng)</span>
                              )}
                              {optionIndex === userAnswer && userAnswer !== question.correctAnswer && (
                                <span className="ml-2 text-red-600 font-medium">(Bạn chọn)</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Quizzes;
