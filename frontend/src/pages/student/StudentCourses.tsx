import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, FileText, ExternalLink, Video, File, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { enrollmentAPI, courseMaterialAPI } from '@/lib/api';
import type { Course, User } from '@/types';

interface Enrollment {
  id: number;
  student: User;
  course: Course;
  status: string;
  progressPercentage: number;
  finalGrade?: number | null;
  enrolledAt: string;
}

interface CourseMaterial {
  id: number;
  title: string;
  description?: string;
  type: "DOCUMENT" | "VIDEO" | "LINK" | "OTHER";
  fileUrl: string;
  uploadedBy?: User;
  uploadedAt?: string;
}

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Enrollment | null>(null);
  const [courseMaterials, setCourseMaterials] = useState<CourseMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
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

  const fetchCourseMaterials = async (courseId: number) => {
    try {
      setLoadingMaterials(true);
      const response = await courseMaterialAPI.getCourseMaterials(courseId);
      setCourseMaterials(response.data);
    } catch (error) {
      toast.error('Failed to fetch course materials');
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleViewMaterials = (enrollment: Enrollment) => {
    setSelectedCourse(enrollment);
    fetchCourseMaterials(enrollment.course.id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "DOCUMENT":
        return <FileText className="h-4 w-4" />;
      case "VIDEO":
        return <Video className="h-4 w-4" />;
      case "LINK":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      DOCUMENT: "bg-blue-500",
      VIDEO: "bg-purple-500",
      LINK: "bg-green-500",
      OTHER: "bg-gray-500",
    };
    return <Badge className={colors[type as keyof typeof colors] || "bg-gray-500"}>{type}</Badge>;
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
              <CardTitle className="text-xl">{enrollment.course.courseName}</CardTitle>
              <CardDescription>{enrollment.course.courseCode}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium">{enrollment.course.instructor?.fullName || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Credits:</span>
                  <span className="font-medium">{enrollment.course.credits}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Enrolled:</span>
                  <span className="font-medium">{new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Badge variant="outline" className="w-full justify-center">Active</Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewMaterials(enrollment)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Materials
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedCourse?.course.courseName} - Materials</DialogTitle>
                        <DialogDescription>
                          Course resources and learning materials
                        </DialogDescription>
                      </DialogHeader>
                      
                      {loadingMaterials ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-gray-500">Loading materials...</p>
                        </div>
                      ) : courseMaterials.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <FileText className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500">No materials available yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {courseMaterials.map((material) => (
                            <Card key={material.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 mt-1">
                                    {getTypeIcon(material.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-sm">{material.title}</h4>
                                      {getTypeBadge(material.type)}
                                    </div>
                                    {material.description && (
                                      <p className="text-sm text-gray-600 mb-2">
                                        {material.description}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (material.fileUrl) {
                                        window.open(material.fileUrl, "_blank");
                                      } else {
                                        toast.error("No link available");
                                      }
                                    }}
                                    disabled={!material.fileUrl}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
