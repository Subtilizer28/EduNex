/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { StatCard } from '@/components/StatCard';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { adminAPI } from '@/lib/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getRecentActivities().catch(() => ({ data: [] })),
      ]);
      
      setStats(statsResponse.data);
      setActivities(activitiesResponse.data || []);
    } catch (error: any) {
      toast.error('Failed to load dashboard data', {
        description: error.response?.data?.message || 'Unable to fetch statistics',
      });
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your learning management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          description={`${stats?.students || 0} students, ${stats?.instructors || 0} instructors`}
        />
        <StatCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          description="Available courses"
        />
        <StatCard
          title="Active Enrollments"
          value={stats?.totalEnrollments || 0}
          icon={UserCheck}
          description="Students enrolled"
        />
        <StatCard
          title="Assignments"
          value={stats?.totalAssignments || 0}
          icon={TrendingUp}
          description={`${stats?.totalQuizzes || 0} quizzes created`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">{stats?.admins || 0}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Instructors</p>
              <p className="text-2xl font-bold">{stats?.instructors || 0}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm font-medium text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{stats?.students || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No recent activities</p>
          ) : (
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{activity.description || activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.entityType} • {activity.actionType}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp || activity.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
