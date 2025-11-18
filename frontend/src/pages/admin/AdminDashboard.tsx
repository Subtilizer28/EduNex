import { StatCard } from '@/components/StatCard';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const userTrendData = [
  { month: 'Jan', users: 45 },
  { month: 'Feb', users: 52 },
  { month: 'Mar', users: 61 },
  { month: 'Apr', users: 75 },
  { month: 'May', users: 88 },
  { month: 'Jun', users: 95 },
];

const courseEnrollmentData = [
  { course: 'CS101', enrollments: 45 },
  { course: 'CS102', enrollments: 38 },
  { course: 'CS201', enrollments: 52 },
  { course: 'CS202', enrollments: 41 },
  { course: 'MATH101', enrollments: 60 },
];

const AdminDashboard = () => {
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
          value={245}
          icon={Users}
          description="Active users in the system"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Courses"
          value={48}
          icon={BookOpen}
          description="Available courses"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Enrollments"
          value={1240}
          icon={UserCheck}
          description="Students enrolled"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Completion Rate"
          value="87%"
          icon={TrendingUp}
          description="Average course completion"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Registration Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Enrollment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="course" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="enrollments"
                  fill="hsl(var(--secondary))"
                  name="Enrollments"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
              { action: 'Course created', user: 'Dr. Smith', time: '15 minutes ago' },
              { action: 'Assignment submitted', user: 'Jane Wilson', time: '1 hour ago' },
              { action: 'Quiz completed', user: 'Mike Johnson', time: '2 hours ago' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
