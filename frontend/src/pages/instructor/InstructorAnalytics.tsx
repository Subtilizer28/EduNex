import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen, FileText, ClipboardList } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { courseAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function InstructorAnalytics() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalQuizzes: 0,
  });

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    try {
      const response = await courseAPI.getInstructorCourses(user.id);
      const courses = response.data;
      
      setStats({
        totalCourses: courses.length,
        totalStudents: courses.reduce((sum: number, c: { enrollmentCount?: number }) => sum + (c.enrollmentCount || 0), 0),
        totalAssignments: 0, // Would need additional API calls
        totalQuizzes: 0,
      });
    } catch (error) {
      toast.error('Failed to fetch analytics');
    }
  }, [user]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Overview of your teaching activities</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            <p className="text-xs text-muted-foreground">Total assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Total quizzes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Statistics</CardTitle>
            <CardDescription>Overview of your courses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Active Courses</span>
                  <span className="text-sm text-muted-foreground">{stats.totalCourses}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min((stats.totalCourses / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Students</span>
                  <span className="text-sm text-muted-foreground">{stats.totalStudents}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${Math.min((stats.totalStudents / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Assignments</span>
                  <span className="text-sm text-muted-foreground">{stats.totalAssignments}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ width: `${Math.min((stats.totalAssignments / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Quizzes</span>
                  <span className="text-sm text-muted-foreground">{stats.totalQuizzes}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500"
                    style={{ width: `${Math.min((stats.totalQuizzes / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Distribution</CardTitle>
            <CardDescription>Students per course average</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex items-end justify-around h-full pb-8 gap-2">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xs text-muted-foreground text-center">Courses</div>
                <div className="w-full bg-blue-500 rounded-t" style={{ height: `${Math.min((stats.totalCourses / 10) * 200, 200)}px` }}></div>
                <div className="text-sm font-bold">{stats.totalCourses}</div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xs text-muted-foreground text-center">Students</div>
                <div className="w-full bg-green-500 rounded-t" style={{ height: `${Math.min((stats.totalStudents / 100) * 200, 200)}px` }}></div>
                <div className="text-sm font-bold">{stats.totalStudents}</div>
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="text-xs text-muted-foreground text-center">Avg/Course</div>
                <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${Math.min((stats.totalCourses > 0 ? stats.totalStudents / stats.totalCourses : 0) * 10, 200)}px` }}></div>
                <div className="text-sm font-bold">{stats.totalCourses > 0 ? Math.round(stats.totalStudents / stats.totalCourses) : 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
