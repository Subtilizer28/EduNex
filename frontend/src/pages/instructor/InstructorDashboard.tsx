import { StatCard } from '@/components/StatCard';
import { BookOpen, FileText, ClipboardList, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const courseEnrollmentData = [
  { course: 'CS101', students: 45 },
  { course: 'CS102', students: 38 },
  { course: 'CS201', students: 52 },
];

const InstructorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground">Manage your courses and track student progress</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="My Courses"
          value={3}
          icon={BookOpen}
          description="Active courses"
        />
        <StatCard
          title="Assignments to Grade"
          value={12}
          icon={FileText}
          description="Pending submissions"
        />
        <StatCard
          title="Quizzes Created"
          value={8}
          icon={ClipboardList}
          description="Active quizzes"
        />
        <StatCard
          title="Total Students"
          value={135}
          icon={Users}
          description="Across all courses"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course Enrollment</CardTitle>
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
                  dataKey="students"
                  fill="hsl(var(--primary))"
                  name="Students"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { code: 'CS101', name: 'Introduction to Programming', students: '45/60' },
                { code: 'CS102', name: 'Data Structures', students: '38/50' },
                { code: 'CS201', name: 'Advanced Algorithms', students: '52/60' },
              ].map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{course.students}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">students</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments to Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                course: 'CS101',
                title: 'Assignment 1: Variables and Data Types',
                submissions: 42,
                graded: 30,
              },
              {
                course: 'CS102',
                title: 'Assignment 2: Linked Lists',
                submissions: 35,
                graded: 28,
              },
              {
                course: 'CS201',
                title: 'Assignment 3: Dynamic Programming',
                submissions: 48,
                graded: 40,
              },
            ].map((assignment, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {assignment.graded}/{assignment.submissions}
                    </p>
                    <p className="text-xs text-muted-foreground">graded</p>
                  </div>
                  <Button size="sm">Grade</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorDashboard;
