/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { adminAPI, enrollmentAPI } from '@/lib/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, BookOpen, UserCheck } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminAnalytics = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const statsResponse = await adminAPI.getStats();
      setStats(statsResponse.data);
    } catch (error: any) {
      toast.error('Failed to load analytics', {
        description: error.response?.data?.message || 'Unable to fetch data',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  // User distribution data
  const userDistribution = [
    { name: 'Students', value: stats?.students || 0 },
    { name: 'Instructors', value: stats?.instructors || 0 },
    { name: 'Admins', value: (stats?.totalUsers || 0) - (stats?.students || 0) - (stats?.instructors || 0) },
  ];

  // Monthly trend data (mock for now - would need backend endpoint)
  const monthlyTrend = [
    { month: 'Jan', users: 45, courses: 8, enrollments: 120 },
    { month: 'Feb', users: 52, courses: 10, enrollments: 150 },
    { month: 'Mar', users: 61, courses: 12, enrollments: 180 },
    { month: 'Apr', users: 70, courses: 15, enrollments: 220 },
    { month: 'May', users: 85, courses: 18, enrollments: 280 },
    { month: 'Jun', users: stats?.totalUsers || 95, courses: stats?.totalCourses || 20, enrollments: stats?.totalEnrollments || 320 },
  ];

  // Course engagement data
  const courseEngagement = [
    { name: 'Active Courses', value: stats?.totalCourses || 0 },
    { name: 'Enrollments', value: stats?.totalEnrollments || 0 },
    { name: 'Assignments', value: stats?.totalAssignments || 0 },
    { name: 'Quizzes', value: stats?.totalQuizzes || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEnrollments || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 23%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">↑ 5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* User Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Engagement Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Course Engagement</CardTitle>
            <CardDescription>Overview of course activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Growth Trends Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
          <CardDescription>6-month overview of platform growth</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Users" />
              <Line type="monotone" dataKey="courses" stroke="#82ca9d" strokeWidth={2} name="Courses" />
              <Line type="monotone" dataKey="enrollments" stroke="#ffc658" strokeWidth={2} name="Enrollments" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
