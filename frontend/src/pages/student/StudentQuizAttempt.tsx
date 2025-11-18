import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { quizAPI } from "@/lib/api";

interface Question {
  id: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  options?: string[];
  points: number;
}

interface Answer {
  questionId: number;
  answer: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  courseName: string;
  duration: number;
  totalPoints: number;
  questions: Question[];
}

export default function StudentQuizAttempt() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleAutoSubmit = useCallback(async () => {
    toast.error("Time's up! Submitting your quiz automatically.");
    const submitQuiz = async () => {
      try {
        setIsSubmitting(true);
        await quizAPI.submitQuizAttempt(parseInt(quizId || "0"), answers);
        
        toast.success("Quiz submitted successfully!");
        navigate("/student/quizzes");
      } catch (error) {
        toast.error("Failed to submit quiz");
      } finally {
        setIsSubmitting(false);
      }
    };
    await submitQuiz();
  }, [quizId, answers, navigate]);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuizById(parseInt(quizId || "0"));
      const quizData = response.data;
      
      setQuiz(quizData);
      setTimeRemaining(quizData.duration * 60);
      
      const initialAnswers = quizData.questions.map((q: Question) => ({
        questionId: q.id,
        answer: ""
      }));
      setAnswers(initialAnswers);
    } catch (error) {
      toast.error("Failed to load quiz");
      navigate("/student/quizzes");
    } finally {
      setLoading(false);
    }
  }, [quizId, navigate]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        if (prev <= 300 && !showWarning) {
          setShowWarning(true);
          toast.warning("5 minutes remaining!");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showWarning, handleAutoSubmit]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, answer } : a);
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  const getCurrentAnswer = (questionId: number) => {
    return answers.find(a => a.questionId === questionId)?.answer || "";
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const unanswered = answers.filter(a => !a.answer).length;
    if (unanswered > 0) {
      const confirmed = confirm(
        `You have ${unanswered} unanswered question(s). Do you want to submit anyway?`
      );
      if (!confirmed) return;
    }

    if (!confirm("Are you sure you want to submit your quiz? You cannot change your answers after submission.")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await quizAPI.submitQuizAttempt(parseInt(quizId || "0"), answers);
      
      toast.success("Quiz submitted successfully!");
      navigate("/student/quizzes");
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return answers.filter(a => a.answer).length;
  };

  const isQuestionAnswered = (questionId: number) => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer && answer.answer;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="flex items-center justify-center h-screen">Quiz not found</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <p className="text-sm text-gray-600">{quiz.courseName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="default"
                size="lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-base">Questions</CardTitle>
                <CardDescription>
                  {getAnsweredCount()} of {quiz.questions.length} answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((q, index) => (
                    <Button
                      key={q.id}
                      variant={index === currentQuestionIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleQuestionJump(index)}
                      className={`relative ${
                        isQuestionAnswered(q.id) && index !== currentQuestionIndex
                          ? "border-green-500 bg-green-50"
                          : ""
                      }`}
                    >
                      {index + 1}
                      {isQuestionAnswered(q.id) && (
                        <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="col-span-3">
            {timeRemaining <= 300 && timeRemaining > 0 && (
              <Alert className="mb-4 border-red-500 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600">
                  Less than 5 minutes remaining! Make sure to submit your quiz before time runs out.
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                    </CardDescription>
                  </div>
                  <Progress value={progress} className="w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg font-medium">{currentQuestion.questionText}</p>
                </div>

                {/* Multiple Choice */}
                {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
                  <RadioGroup
                    value={getCurrentAnswer(currentQuestion.id)}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {/* True/False */}
                {currentQuestion.questionType === "TRUE_FALSE" && (
                  <RadioGroup
                    value={getCurrentAnswer(currentQuestion.id)}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="space-y-3">
                      {["True", "False"].map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="flex-1 cursor-pointer text-base">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {/* Short Answer */}
                {currentQuestion.questionType === "SHORT_ANSWER" && (
                  <Textarea
                    value={getCurrentAnswer(currentQuestion.id)}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="text-base"
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {quiz.questions.length}
                  </span>

                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Quiz"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
