/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { courseAPI, enrollmentAPI } from '@/lib/api';
import type { Course } from '@/types';

interface CourseWithDetails extends Course {
  enrollmentCount: number;
}

interface Enrollment {
  id: number;
  student: {
    id: number;
    name: string;
    usn: string;
    email: string;
  };
  enrolledAt: string;
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEnrolledStudentsModalOpen, setIsEnrolledStudentsModalOpen] = useState(false);
  const [isBulkEnrollModalOpen, setIsBulkEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithDetails | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    credits: 3,
    maxStudents: 60,
  });

  const [bulkEnrollData, setBulkEnrollData] = useState({
    prefix: '',
    startRange: 1,
    endRange: 10,
  });

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    filterCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, searchTerm]);

  const fetchCourses = async () => {
    if (!user) return;
    try {
      const response = await courseAPI.getInstructorCourses(user.id);
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    if (!searchTerm) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleCreateCourse = async () => {
    if (!user) return;
    try {
      await courseAPI.createCourse(formData, user.id);
      toast.success('Course created successfully');
      setIsCreateModalOpen(false);
      resetForm();
      fetchCourses();
    } catch (error: unknown) {
      toast.error('Failed to create course', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleDeleteCourse = async (course: CourseWithDetails) => {
    if (!confirm(`Are you sure you want to delete "${course.courseName}"?`)) return;

    try {
      await courseAPI.deleteCourse(course.id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error: unknown) {
      toast.error('Failed to delete course', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleBulkEnroll = async () => {
    if (!selectedCourse) return;

    try {
      await enrollmentAPI.bulkEnroll({
        courseId: selectedCourse.id,
        ...bulkEnrollData,
      });
      toast.success('Students enrolled successfully');
      setIsBulkEnrollModalOpen(false);
      setBulkEnrollData({ prefix: '', startRange: 1, endRange: 10 });
    } catch (error: unknown) {
      toast.error('Failed to enroll students', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const fetchEnrolledStudents = async (courseId: number) => {
    try {
      const response = await enrollmentAPI.getCourseEnrollments(courseId);
      setEnrolledStudents(response.data);
    } catch (error: unknown) {
      toast.error('Failed to fetch enrolled students', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleViewEnrolledStudents = async (course: CourseWithDetails) => {
    setSelectedCourse(course);
    await fetchEnrolledStudents(course.id);
    setIsEnrolledStudentsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      courseName: '',
      courseCode: '',
      description: '',
      credits: 3,
      maxStudents: 60,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by course name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{course.courseName}</CardTitle>
              <CardDescription className="text-sm">{course.courseCode}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="font-medium">{course.credits}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="font-medium">{course.enrollmentCount} / {course.maxStudents}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewEnrolledStudents(course)}
                  >
                    <Users className="w-4 h-4 mr-1" />
                    View Students
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsBulkEnrollModalOpen(true);
                      }}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Enroll
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Course Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g., Introduction to Programming"
                />
              </div>
              <div>
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  placeholder="e.g., CS101"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter course description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                  min={1}
                  max={6}
                />
              </div>
              <div>
                <Label htmlFor="maxStudents">Max Students</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>Create Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enrolled Students Modal */}
      <Dialog open={isEnrolledStudentsModalOpen} onOpenChange={setIsEnrolledStudentsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Enrolled Students - {selectedCourse?.courseName}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {enrolledStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No students enrolled yet
              </div>
            ) : (
              <div className="border rounded-md max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>USN</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell className="font-medium">{enrollment.student.usn}</TableCell>
                        <TableCell>{enrollment.student.name || 'N/A'}</TableCell>
                        <TableCell>{enrollment.student.email}</TableCell>
                        <TableCell>
                          {enrollment.enrolledAt 
                            ? new Date(enrollment.enrolledAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : 'N/A'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Enroll Modal */}
      <Dialog open={isBulkEnrollModalOpen} onOpenChange={setIsBulkEnrollModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Enroll Students</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="prefix">USN Prefix</Label>
              <Input
                id="prefix"
                value={bulkEnrollData.prefix}
                onChange={(e) => setBulkEnrollData({ ...bulkEnrollData, prefix: e.target.value })}
                placeholder="e.g., 1MS21CS"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startRange">Start Range</Label>
                <Input
                  id="startRange"
                  type="number"
                  value={bulkEnrollData.startRange}
                  onChange={(e) => setBulkEnrollData({ ...bulkEnrollData, startRange: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="endRange">End Range</Label>
                <Input
                  id="endRange"
                  type="number"
                  value={bulkEnrollData.endRange}
                  onChange={(e) => setBulkEnrollData({ ...bulkEnrollData, endRange: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEnroll}>Enroll Students</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
