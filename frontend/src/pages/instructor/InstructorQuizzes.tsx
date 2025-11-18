import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Eye, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { quizAPI, courseAPI } from "@/lib/api";

interface Question {
  id?: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface Quiz {
  id?: number;
  title: string;
  description: string;
  courseId: number;
  courseName?: string;
  duration: number; // in minutes
  totalPoints: number;
  startDate: string;
  endDate: string;
  questions: Question[];
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED";
}

export default function InstructorQuizzes() {
  const { user } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string; code?: string }[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState<Quiz>({
    title: "",
    description: "",
    courseId: 0,
    duration: 60,
    totalPoints: 0,
    startDate: "",
    endDate: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: "",
    questionType: "MULTIPLE_CHOICE",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await quizAPI.getInstructorQuizzes(user.id);
      setQuizzes(response.data);
    } catch (error) {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    if (!user) return;
    
    try {
      const response = await courseAPI.getInstructorCourses(user.id);
      setCourses(response.data);
    } catch (error) {
      toast.error("Failed to load courses");
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
      toast.error("Please fill in all question fields");
      return;
    }

    const newQuestion = { ...currentQuestion };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
      totalPoints: formData.totalPoints + currentQuestion.points
    });

    // Reset question form
    setCurrentQuestion({
      questionText: "",
      questionType: "MULTIPLE_CHOICE",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    });
    toast.success("Question added");
  };

  const handleRemoveQuestion = (index: number) => {
    const removedQuestion = formData.questions[index];
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index),
      totalPoints: formData.totalPoints - removedQuestion.points
    });
    toast.success("Question removed");
  };

  const handleCreateQuiz = async () => {
    if (!formData.title || !formData.courseId || formData.questions.length === 0) {
      toast.error("Please fill in all required fields and add at least one question");
      return;
    }

    try {
      await quizAPI.createQuiz(formData, formData.courseId);
      toast.success("Quiz created successfully");
      setIsCreateOpen(false);
      resetForm();
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to create quiz");
    }
  };

  const handleUpdateQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      await quizAPI.updateQuiz(selectedQuiz.id, formData);
      toast.success("Quiz updated successfully");
      setIsEditOpen(false);
      resetForm();
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to update quiz");
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await quizAPI.deleteQuiz(quizId);
      toast.success("Quiz deleted successfully");
      fetchQuizzes();
    } catch (error) {
      toast.error("Failed to delete quiz");
    }
  };

  const openEditDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData(quiz);
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseId: 0,
      duration: 60,
      totalPoints: 0,
      startDate: "",
      endDate: "",
      questions: [],
    });
    setCurrentQuestion({
      questionText: "",
      questionType: "MULTIPLE_CHOICE",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    });
    setSelectedQuiz(null);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-gray-500">Completed</Badge>;
      case "INACTIVE":
        return <Badge className="bg-yellow-500">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const QuizForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Quiz Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter quiz title"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter quiz description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="course">Course *</Label>
          <Select
            value={formData.courseId.toString()}
            onValueChange={(value) => setFormData({ ...formData, courseId: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date & Time *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date & Time *</Label>
          <Input
            id="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Questions ({formData.questions.length})</h3>
        
        {formData.questions.map((q, index) => (
          <Card key={index} className="mb-3">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">Q{index + 1}. {q.questionText}</p>
                  <p className="text-sm text-gray-500 mt-1">Type: {q.questionType} | Points: {q.points}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base">Add New Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Question Text *</Label>
              <Textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                placeholder="Enter question"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Question Type</Label>
                <Select
                  value={currentQuestion.questionType}
                  onValueChange={(value: string) => setCurrentQuestion({ ...currentQuestion, questionType: value as "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
                    <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                    <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Points *</Label>
                <Input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>

            {currentQuestion.questionType === "MULTIPLE_CHOICE" && (
              <div>
                <Label>Options</Label>
                {currentQuestion.options?.map((option, i) => (
                  <Input
                    key={i}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(currentQuestion.options || [])];
                      newOptions[i] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="mb-2"
                  />
                ))}
              </div>
            )}

            <div>
              <Label>Correct Answer *</Label>
              <Input
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                placeholder="Enter correct answer"
              />
            </div>

            <Button onClick={handleAddQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm font-medium">Total Points: {formData.totalPoints}</p>
        <p className="text-sm text-gray-600">Total Questions: {formData.questions.length}</p>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading quizzes...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quizzes & Exams</h1>
          <p className="text-gray-600 mt-1">Create and manage quizzes for your courses</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quiz</DialogTitle>
              <DialogDescription>
                Add questions and configure your quiz settings
              </DialogDescription>
            </DialogHeader>
            <QuizForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuiz}>Create Quiz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle>{quiz.title}</CardTitle>
                    {getStatusBadge(quiz.status)}
                  </div>
                  <CardDescription className="mt-2">{quiz.description}</CardDescription>
                  <div className="flex gap-4 mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {quiz.duration} mins
                    </span>
                    <span>📚 {quiz.courseName}</span>
                    <span>🎯 {quiz.totalPoints} points</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Start: {new Date(quiz.startDate).toLocaleString()}</p>
                    <p>End: {new Date(quiz.endDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(quiz)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => quiz.id && handleDeleteQuiz(quiz.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {quizzes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No quizzes created yet</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Quiz</DialogTitle>
            <DialogDescription>
              Update quiz details and questions
            </DialogDescription>
          </DialogHeader>
          <QuizForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateQuiz}>Update Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
