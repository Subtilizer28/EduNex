import { StatCard } from '@/components/StatCard';
import { BookOpen, FileText, ClipboardList, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Track your courses and assignments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Enrolled Courses"
          value={5}
          icon={BookOpen}
          description="Active courses"
        />
        <StatCard
          title="Pending Assignments"
          value={3}
          icon={FileText}
          description="Due this week"
        />
        <StatCard
          title="Upcoming Quizzes"
          value={2}
          icon={ClipboardList}
          description="Scheduled"
        />
        <StatCard
          title="Attendance"
          value="92%"
          icon={Calendar}
          description="Overall attendance"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { code: 'CS101', name: 'Introduction to Programming', instructor: 'Dr. Smith', progress: 75 },
              { code: 'CS102', name: 'Data Structures', instructor: 'Prof. Johnson', progress: 60 },
              { code: 'MATH101', name: 'Calculus I', instructor: 'Dr. Williams', progress: 85 },
              { code: 'ENG101', name: 'Technical Writing', instructor: 'Prof. Davis', progress: 50 },
              { code: 'CS201', name: 'Advanced Algorithms', instructor: 'Dr. Brown', progress: 40 },
            ].map((course, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.code} • {course.instructor}</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { course: 'CS101', title: 'Assignment 3', dueDate: 'Due in 2 days', status: 'pending' },
                { course: 'CS102', title: 'Project Submission', dueDate: 'Due in 5 days', status: 'pending' },
                { course: 'MATH101', title: 'Problem Set 4', dueDate: 'Due in 1 week', status: 'pending' },
              ].map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={assignment.status === 'pending' ? 'destructive' : 'default'}>
                      {assignment.dueDate}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { course: 'CS101', assignment: 'Assignment 2', marks: '18/20', grade: 'A' },
                { course: 'MATH101', assignment: 'Quiz 3', marks: '45/50', grade: 'A' },
                { course: 'CS102', assignment: 'Midterm Exam', marks: '85/100', grade: 'B+' },
              ].map((grade, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{grade.assignment}</p>
                    <p className="text-sm text-muted-foreground">{grade.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{grade.grade}</p>
                    <p className="text-xs text-muted-foreground">{grade.marks}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
