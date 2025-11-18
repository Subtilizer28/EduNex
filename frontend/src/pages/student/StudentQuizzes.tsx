import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, CheckCircle, AlertCircle, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { quizAPI } from "@/lib/api";

interface Quiz {
  id: number;
  title: string;
  description: string;
  courseId: number;
  courseName: string;
  duration: number;
  totalPoints: number;
  startDate: string;
  endDate: string;
  status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED" | "MISSED";
  score?: number;
  attemptDate?: string;
  questionsCount: number;
}

export default function StudentQuizzes() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");

  const fetchQuizzes = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await quizAPI.getStudentQuizzes(user.id);
      setQuizzes(response.data);
    } catch (error) {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleStartQuiz = (quizId: number) => {
    navigate(`/student/quiz/${quizId}/attempt`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-500"><Clock className="h-3 w-3 mr-1" />Available</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500"><AlertCircle className="h-3 w-3 mr-1" />In Progress</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "MISSED":
        return <Badge className="bg-red-500"><AlertCircle className="h-3 w-3 mr-1" />Missed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const isQuizAvailable = (quiz: Quiz) => {
    const now = new Date();
    const start = new Date(quiz.startDate);
    const end = new Date(quiz.endDate);
    return now >= start && now <= end && quiz.status === "AVAILABLE";
  };

  const filterQuizzes = (status: string) => {
    switch (status) {
      case "available":
        return quizzes.filter(q => q.status === "AVAILABLE" || q.status === "IN_PROGRESS");
      case "completed":
        return quizzes.filter(q => q.status === "COMPLETED");
      case "missed":
        return quizzes.filter(q => q.status === "MISSED");
      default:
        return quizzes;
    }
  };

  const QuizCard = ({ quiz }: { quiz: Quiz }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              {getStatusBadge(quiz.status)}
            </div>
            <CardDescription>{quiz.description}</CardDescription>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {quiz.courseName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {quiz.duration} minutes
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {quiz.questionsCount} questions
              </span>
              <span>🎯 {quiz.totalPoints} points</span>
            </div>
            <div className="text-sm text-gray-600 mt-3">
              <p>Available: {new Date(quiz.startDate).toLocaleString()}</p>
              <p>Due: {new Date(quiz.endDate).toLocaleString()}</p>
            </div>
            {quiz.status === "COMPLETED" && quiz.score !== undefined && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  Score: {quiz.score}/{quiz.totalPoints} ({Math.round((quiz.score / quiz.totalPoints) * 100)}%)
                </p>
                <p className="text-xs text-gray-600">
                  Submitted: {quiz.attemptDate && new Date(quiz.attemptDate).toLocaleString()}
                </p>
              </div>
            )}
            {quiz.status === "MISSED" && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-semibold text-red-700">
                  This quiz deadline has passed
                </p>
              </div>
            )}
          </div>
          <div className="ml-4">
            {quiz.status === "AVAILABLE" && isQuizAvailable(quiz) && (
              <Button onClick={() => handleStartQuiz(quiz.id)}>
                Start Quiz
              </Button>
            )}
            {quiz.status === "IN_PROGRESS" && (
              <Button onClick={() => handleStartQuiz(quiz.id)} variant="default">
                Continue Quiz
              </Button>
            )}
            {quiz.status === "COMPLETED" && (
              <Button variant="outline" onClick={() => navigate(`/student/quiz/${quiz.id}/review`)}>
                Review Answers
              </Button>
            )}
            {quiz.status === "AVAILABLE" && !isQuizAvailable(quiz) && (
              <Button disabled>
                Not Yet Available
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading quizzes...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Quizzes & Exams</h1>
        <p className="text-gray-600 mt-1">View and attempt quizzes from your enrolled courses</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">
            Available ({filterQuizzes("available").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({filterQuizzes("completed").length})
          </TabsTrigger>
          <TabsTrigger value="missed">
            Missed ({filterQuizzes("missed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {filterQuizzes("available").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">No available quizzes at the moment</p>
              </CardContent>
            </Card>
          ) : (
            filterQuizzes("available").map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterQuizzes("completed").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500">No completed quizzes yet</p>
              </CardContent>
            </Card>
          ) : (
            filterQuizzes("completed").map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
          )}
        </TabsContent>

        <TabsContent value="missed" className="space-y-4">
          {filterQuizzes("missed").length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-green-300 mb-4" />
                <p className="text-gray-500">Great job! No missed quizzes</p>
              </CardContent>
            </Card>
          ) : (
            filterQuizzes("missed").map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
