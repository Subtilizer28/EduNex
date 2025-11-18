/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { assignmentAPI } from '@/lib/api';
import type { Assignment } from '@/types';

interface AssignmentWithSubmission extends Assignment {
  submitted: boolean;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  courseName?: string;
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isViewFeedbackModalOpen, setIsViewFeedbackModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithSubmission | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;
    try {
      const response = await assignmentAPI.getStudentAssignments(user.id);
      setAssignments(response.data);
    } catch (error) {
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !submissionText.trim()) {
      toast.error('Please enter your submission');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('submissionText', submissionText);
      formData.append('fileUrl', '');
      await assignmentAPI.submitAssignment(selectedAssignment.id, formData);
      toast.success('Assignment submitted successfully');
      setIsSubmitModalOpen(false);
      setSubmissionText('');
      fetchAssignments();
    } catch (error: unknown) {
      toast.error('Failed to submit assignment', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleViewFeedback = (assignment: AssignmentWithSubmission) => {
    setSelectedAssignment(assignment);
    setIsViewFeedbackModalOpen(true);
  };

  const handleOpenSubmitModal = (assignment: AssignmentWithSubmission) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const getAssignmentStatus = (assignment: AssignmentWithSubmission) => {
    if (assignment.marksObtained !== null && assignment.marksObtained !== undefined) {
      return { label: 'Graded', variant: 'default' as const, icon: CheckCircle };
    }
    if (assignment.status === 'SUBMITTED' || assignment.status === 'LATE_SUBMISSION') {
      return { label: 'Submitted', variant: 'secondary' as const, icon: CheckCircle };
    }
    if (new Date(assignment.dueDate) < new Date()) {
      return { label: 'Overdue', variant: 'destructive' as const, icon: AlertCircle };
    }
    return { label: 'Pending', variant: 'outline' as const, icon: Clock };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading assignments...</div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No assignments available yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assignments</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>View and submit your course assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => {
                const status = getAssignmentStatus(assignment);
                const StatusIcon = status.icon;
                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>{assignment.courseName || assignment.course.courseName}</TableCell>
                    <TableCell>{new Date(assignment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {assignment.marksObtained !== null && assignment.marksObtained !== undefined ? (
                        <span className="font-medium">{assignment.marksObtained}/{assignment.maxMarks}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {assignment.status !== 'SUBMITTED' && assignment.status !== 'LATE_SUBMISSION' && assignment.status !== 'GRADED' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenSubmitModal(assignment)}
                            disabled={new Date(assignment.dueDate) < new Date()}
                          >
                            <Upload className="w-4 h-4 mr-1" />
                            Submit
                          </Button>
                        )}
                        {assignment.marksObtained !== null && assignment.marksObtained !== undefined && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewFeedback(assignment)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Feedback
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submit Assignment Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Assignment: {selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Course: {selectedAssignment?.courseName || selectedAssignment?.course.courseName}</p>
                <p className="text-sm text-muted-foreground">Due: {selectedAssignment && new Date(selectedAssignment.dueDate).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Max Marks: {selectedAssignment?.maxMarks}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="submission">Your Submission</Label>
              <Textarea
                id="submission"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Enter your submission text or paste links to your work..."
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Note: Once submitted, you cannot modify your submission.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsSubmitModalOpen(false); setSubmissionText(''); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAssignment}>Submit Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Feedback Modal */}
      <Dialog open={isViewFeedbackModalOpen} onOpenChange={setIsViewFeedbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignment Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Assignment</Label>
              <p className="text-sm">{selectedAssignment?.title}</p>
            </div>

            <div>
              <Label>Course</Label>
              <p className="text-sm">{selectedAssignment?.courseName || selectedAssignment?.course.courseName}</p>
            </div>

            <div>
              <Label>Grade</Label>
              <p className="text-2xl font-bold">
                {selectedAssignment?.marksObtained}
              </p>
            </div>

            {selectedAssignment?.feedback && (
              <div>
                <Label>Instructor Feedback</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedAssignment.feedback}</p>
                </div>
              </div>
            )}

            {selectedAssignment?.submittedAt && (
              <div>
                <Label>Submitted At</Label>
                <p className="text-sm">{new Date(selectedAssignment.submittedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewFeedbackModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
