/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { assignmentAPI, courseAPI } from '@/lib/api';
import type { Assignment, Course } from '@/types';

interface Submission {
  id: number;
  studentName: string;
  studentUsn: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export default function InstructorAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewSubmissionsModalOpen, setIsViewSubmissionsModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: 0,
    dueDate: '',
    totalMarks: 100,
  });

  const [gradeData, setGradeData] = useState({
    marks: 0,
    feedback: '',
  });

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchAssignments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;
    try {
      const response = await courseAPI.getInstructorCourses(user.id);
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const fetchAssignments = async () => {
    if (!user) return;
    try {
      const response = await assignmentAPI.getInstructorAssignments(user.id);
      setAssignments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (assignmentId: number) => {
    try {
      const response = await assignmentAPI.getSubmissions(assignmentId);
      setSubmissions(response.data);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    }
  };

  const handleCreateAssignment = async () => {
    try {
      await assignmentAPI.createAssignment(formData);
      toast.success('Assignment created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchAssignments();
    } catch (error: unknown) {
      toast.error('Failed to create assignment', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleDeleteAssignment = async (assignment: Assignment) => {
    if (!confirm(`Are you sure you want to delete "${assignment.title}"?`)) return;

    try {
      await assignmentAPI.deleteAssignment(assignment.id);
      toast.success('Assignment deleted successfully');
      fetchAssignments();
    } catch (error: unknown) {
      toast.error('Failed to delete assignment', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleViewSubmissions = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    await fetchSubmissions(assignment.id);
    setIsViewSubmissionsModalOpen(true);
  };

  const handleGradeSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      marks: submission.grade || 0,
      feedback: submission.feedback || '',
    });
    setIsGradeModalOpen(true);
  };

  const submitGrade = async () => {
    if (!selectedSubmission) return;

    try {
      await assignmentAPI.gradeSubmission(selectedSubmission.id, gradeData);
      toast.success('Grade submitted successfully');
      setIsGradeModalOpen(false);
      if (selectedAssignment) {
        fetchSubmissions(selectedAssignment.id);
      }
    } catch (error: unknown) {
      toast.error('Failed to submit grade', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      courseId: 0,
      dueDate: '',
      totalMarks: 100,
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.title}</TableCell>
                  <TableCell>{assignment.course.courseName}</TableCell>
                  <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{assignment.totalMarks}</TableCell>
                  <TableCell>
                    {isOverdue(assignment.dueDate) ? (
                      <Badge variant="destructive">Overdue</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubmissions(assignment)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Submissions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAssignment(assignment)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Assignment Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Data Structures Lab Assignment"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter assignment description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseId">Course</Label>
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
                        {course.courseName} ({course.courseCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateAssignment}>Create Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Submissions Modal */}
      <Dialog open={isViewSubmissionsModalOpen} onOpenChange={setIsViewSubmissionsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Submissions: {selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>USN</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>{submission.studentName}</TableCell>
                  <TableCell>{submission.studentUsn}</TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {submission.grade !== undefined ? (
                      <Badge variant="default">{submission.grade}/{selectedAssignment?.totalMarks}</Badge>
                    ) : (
                      <Badge variant="outline">Not Graded</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGradeSubmission(submission)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Grade
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Grade Submission Modal */}
      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Student: {selectedSubmission?.studentName} ({selectedSubmission?.studentUsn})</Label>
            </div>
            <div>
              <Label htmlFor="marks">Grade (out of {selectedAssignment?.totalMarks})</Label>
              <Input
                id="marks"
                type="number"
                value={gradeData.marks}
                onChange={(e) => setGradeData({ ...gradeData, marks: parseInt(e.target.value) })}
                min={0}
                max={selectedAssignment?.totalMarks || 100}
              />
            </div>
            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={gradeData.feedback}
                onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                placeholder="Enter feedback for the student..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitGrade}>Submit Grade</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
