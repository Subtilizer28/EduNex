import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { enrollmentAPI } from '@/lib/api';

interface Enrollment {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  credits: number;
  instructorName: string;
  enrolledAt: string;
}

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchEnrollments = async () => {
    if (!user) return;
    try {
      const response = await enrollmentAPI.getStudentEnrollments(user.id);
      setEnrollments(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">You are not enrolled in any courses yet.</p>
            <p className="text-sm text-muted-foreground mt-2">Contact your administrator to enroll in courses.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Badge variant="secondary">{enrollments.length} Course{enrollments.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment) => (
          <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{enrollment.courseName}</CardTitle>
              <CardDescription>{enrollment.courseCode}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium">{enrollment.instructorName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Credits:</span>
                  <span className="font-medium">{enrollment.credits}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Enrolled:</span>
                  <span className="font-medium">{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                </div>

                <div className="pt-4 border-t">
                  <Badge variant="outline" className="w-full justify-center">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
