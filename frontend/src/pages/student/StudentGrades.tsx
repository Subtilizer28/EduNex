/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { assignmentAPI } from "@/lib/api";

interface AssignmentGrade {
  id: number;
  assignmentTitle: string;
  courseName: string;
  courseCode: string;
  score: number;
  maxScore: number;
  percentage: number;
  submittedDate: string;
  gradedDate: string;
  feedback?: string;
}

interface CourseGrades {
  courseId: number;
  courseName: string;
  courseCode: string;
  assignments: AssignmentGrade[];
  overallPercentage: number;
}

export default function StudentGrades() {
  const { user } = useAuthStore();
  const [courseGrades, setCourseGrades] = useState<CourseGrades[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGrades = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch assignment submissions
      const assignmentsResponse = await assignmentAPI.getStudentAssignments(user.id);
      const gradedAssignments = assignmentsResponse.data.filter(
        (a: any) => a.marksObtained !== null && a.marksObtained !== undefined && a.maxMarks > 0 && a.status === 'GRADED'
      );
      
      // Group by course
      const courseMap = new Map<number, CourseGrades>();
      
      // Process assignments
      gradedAssignments.forEach((assignment: any) => {
        const courseId = assignment.course?.id || assignment.courseId;
        const courseName = assignment.course?.name || assignment.courseName;
        const courseCode = assignment.course?.code || assignment.courseCode;
        
        if (!courseMap.has(courseId)) {
          courseMap.set(courseId, {
            courseId: courseId,
            courseName: courseName,
            courseCode: courseCode,
            assignments: [],
            overallPercentage: 0
          });
        }
        
        const course = courseMap.get(courseId)!;
        course.assignments.push({
          id: assignment.id,
          assignmentTitle: assignment.title,
          courseName: courseName,
          courseCode: courseCode,
          score: assignment.marksObtained,
          maxScore: assignment.maxMarks,
          percentage: (assignment.marksObtained / assignment.maxMarks) * 100,
          submittedDate: assignment.submittedAt,
          gradedDate: assignment.updatedAt,
          feedback: assignment.feedback
        });
      });
      
      // Calculate overall percentage for each course
      const gradesArray = Array.from(courseMap.values()).map(course => {
        const assignmentTotal = course.assignments.reduce((sum, a) => sum + a.score, 0);
        const assignmentMax = course.assignments.reduce((sum, a) => sum + a.maxScore, 0);
        
        return {
          ...course,
          overallPercentage: assignmentMax > 0 ? (assignmentTotal / assignmentMax) * 100 : 0
        };
      });
      
      setCourseGrades(gradesArray);
    } catch (error) {
      toast.error("Failed to load grades");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-blue-600";
    if (percentage >= 70) return "text-yellow-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeLetter = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  const calculateOverallGPA = () => {
    if (courseGrades.length === 0) return "0.00";
    const totalPercentage = courseGrades.reduce((sum, course) => sum + course.overallPercentage, 0);
    const avgPercentage = totalPercentage / courseGrades.length;
    const gpa = (avgPercentage / 100) * 4.0;
    return gpa.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading grades...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Grades</h1>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Overall GPA</div>
                <div className="text-2xl font-bold">{calculateOverallGPA()}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {courseGrades.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No grades available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {courseGrades.map((course) => (
            <Card key={course.courseId}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {course.courseName}
                    </CardTitle>
                    <CardDescription>{course.courseCode}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getGradeColor(course.overallPercentage)}`}>
                      {getGradeLetter(course.overallPercentage)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {course.overallPercentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Assignments ({course.assignments.length})</span>
                  </div>
                  
                  {course.assignments.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No assignment grades available
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Assignment Title</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Graded Date</TableHead>
                          <TableHead>Feedback</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {course.assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.assignmentTitle}</TableCell>
                            <TableCell>
                              {assignment.score}/{assignment.maxScore}
                            </TableCell>
                            <TableCell>
                              <Badge className={getGradeColor(assignment.percentage)}>
                                {assignment.percentage.toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {assignment.gradedDate ? format(new Date(assignment.gradedDate), "MMM dd, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                              {assignment.feedback || "No feedback"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
