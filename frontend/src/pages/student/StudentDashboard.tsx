/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { StatCard } from '@/components/StatCard';
import { BookOpen, FileText, ClipboardList, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { enrollmentAPI, assignmentAPI, attendanceAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const [enrollmentsRes, assignmentsRes, attendanceRes] = await Promise.all([
        enrollmentAPI.getMyEnrollments(),
        assignmentAPI.getStudentAssignments(user.id),
        attendanceAPI.getMyAttendance(),
      ]);

      setEnrollments(enrollmentsRes.data || []);
      setAssignments(assignmentsRes.data || []);
      setAttendanceRecords(attendanceRes.data || []);
    } catch (error: any) {
      toast.error('Failed to load dashboard data', {
        description: error.response?.data?.message || 'Unable to fetch data',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // Calculate stats
  const pendingAssignments = assignments.filter(
    (a) => a.submissionStatus === 'PENDING' || !a.submissionStatus
  ).length;

  const upcomingQuizzes = 0; // Placeholder - would need quiz API

  const attendancePercentage = attendanceRecords.length > 0
    ? Math.round(
        (attendanceRecords.filter((a) => a.status === 'PRESENT').length /
          attendanceRecords.length) *
          100
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your courses and assignments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Enrolled Courses"
          value={enrollments.length}
          icon={BookOpen}
          description="Active courses"
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments}
          icon={FileText}
          description="Due this week"
        />
        <StatCard
          title="Upcoming Quizzes"
          value={upcomingQuizzes}
          icon={ClipboardList}
          description="Scheduled"
        />
        <StatCard
          title="Attendance"
          value={`${attendancePercentage}%`}
          icon={Calendar}
          description="Overall attendance"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No courses enrolled yet</p>
          ) : (
            <div className="space-y-4">
              {enrollments.map((enrollment: any) => (
                <div key={enrollment.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <p className="font-medium">{enrollment.course?.courseName || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">
                        {enrollment.course?.courseCode || 'N/A'} • {enrollment.course?.instructor?.fullName || 'N/A'}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/student/courses/${enrollment.course?.id}`)}
                    >
                      View
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{enrollment.progress || 0}%</span>
                    </div>
                    <Progress value={enrollment.progress || 0} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending assignments</p>
            ) : (
              <div className="space-y-4">
                {assignments.slice(0, 5).map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{assignment.title || 'Untitled Assignment'}</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.course?.courseCode || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={assignment.submissionStatus === 'PENDING' ? 'destructive' : 'default'}>
                        {assignment.dueDate
                          ? new Date(assignment.dueDate).toLocaleDateString()
                          : 'No due date'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.filter((a: any) => a.marks !== null && a.marks !== undefined).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No grades available yet</p>
            ) : (
              <div className="space-y-4">
                {assignments
                  .filter((a: any) => a.marks !== null && a.marks !== undefined)
                  .slice(0, 5)
                  .map((assignment: any) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{assignment.title || 'Untitled'}</p>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course?.courseCode || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {assignment.marks || 0}/{assignment.maxMarks || 100}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round(((assignment.marks || 0) / (assignment.maxMarks || 100)) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
