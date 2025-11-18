/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { StatCard } from '@/components/StatCard';
import { BookOpen, FileText, ClipboardList, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { courseAPI, assignmentAPI, quizAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const coursesResponse = await courseAPI.getInstructorCourses(user!.id);
      setCourses(coursesResponse.data || []);
    } catch (error: any) {
      toast.error('Failed to load dashboard data', {
        description: error.response?.data?.message || 'Unable to fetch courses',
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

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);

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
        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses and track student progress</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Courses"
          value={courses.length}
          icon={BookOpen}
          description="Active courses"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          description="Across all courses"
        />
        <StatCard
          title="Assignments"
          value={0}
          icon={FileText}
          description="Create and grade"
        />
        <StatCard
          title="Quizzes"
          value={0}
          icon={ClipboardList}
          description="Active quizzes"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No courses assigned yet</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course: any) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">{course.courseName}</p>
                    <p className="text-sm text-muted-foreground">{course.courseCode}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant="secondary">
                        {course.enrollmentCount || 0}/{course.maxStudents || 0}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">students</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/instructor/courses/${course.id}`)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
