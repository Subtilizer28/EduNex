/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { adminAPI, enrollmentAPI } from '@/lib/api';
import type { Course, User } from '@/types';

interface CourseWithDetails extends Course {
  enrollmentCount: number;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<CourseWithDetails[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBulkEnrollModalOpen, setIsBulkEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithDetails | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    category: '',
    credits: 3,
    maxStudents: 60,
    instructorId: '',
  });

  const [bulkEnrollData, setBulkEnrollData] = useState({
    prefix: '',
    startRange: 1,
    endRange: 10,
  });

  const fetchCourses = async () => {
    try {
      const response = await adminAPI.getCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await adminAPI.getUsers();
      const instructorList = response.data.filter((user: User) => user.role === 'INSTRUCTOR');
      setInstructors(instructorList);
    } catch (error) {
      console.error('Failed to fetch instructors', error);
    }
  };

  const filterCourses = useCallback(() => {
    if (!searchTerm) {
      setFilteredCourses(courses);
      return;
    }

    const filtered = courses.filter(
      (course) =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses, searchTerm]);

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const handleCreateCourse = async () => {
    try {
      await adminAPI.createCourse({
        ...formData,
        instructorId: parseInt(formData.instructorId),
      });
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
    if (!confirm(`Are you sure you want to delete "${course.courseName}"?\n\nThis will also remove all enrollments for this course.`)) {
      return;
    }

    try {
      await adminAPI.deleteCourse(course.id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error: unknown) {
      toast.error('Failed to delete course', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const handleViewCourse = async (course: CourseWithDetails) => {
    setSelectedCourse(course);
    try {
      const response = await adminAPI.getCourseEnrollments(course.id);
      setEnrolledStudents(response.data);
      setIsViewModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch enrollments');
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
      if (isViewModalOpen) {
        handleViewCourse(selectedCourse);
      }
    } catch (error: unknown) {
      toast.error('Failed to enroll students', {
        description: (error as any).response?.data?.message || 'An error occurred',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      courseName: '',
      courseCode: '',
      description: '',
      category: '',
      credits: 3,
      maxStudents: 60,
      instructorId: '',
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
        <h1 className="text-3xl font-bold">Course Management</h1>
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
              placeholder="Search by course name, code, or instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{course.courseName}</CardTitle>
                  <CardDescription>{course.courseCode}</CardDescription>
                </div>
                <Badge>{course.category || 'General'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                  <p className="font-medium">{course.instructor?.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Credits</p>
                    <p className="font-medium">{course.credits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="font-medium">{course.enrollmentCount} / {course.maxStudents}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewCourse(course)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Core, Elective"
                />
              </div>
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Select value={formData.instructorId} onValueChange={(value) => setFormData({ ...formData, instructorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id.toString()}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

      {/* View Course Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details - {selectedCourse?.courseName}</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Course Code</Label>
                  <p className="text-lg font-medium">{selectedCourse.courseCode}</p>
                </div>
                <div>
                  <Label>Instructor</Label>
                  <p className="text-lg font-medium">{selectedCourse.instructor?.name}</p>
                </div>
                <div>
                  <Label>Credits</Label>
                  <p className="text-lg font-medium">{selectedCourse.credits}</p>
                </div>
                <div>
                  <Label>Enrollment</Label>
                  <p className="text-lg font-medium">{selectedCourse.enrollmentCount} / {selectedCourse.maxStudents}</p>
                </div>
              </div>

              {selectedCourse.description && (
                <div>
                  <Label>Description</Label>
                  <p className="text-sm">{selectedCourse.description}</p>
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg">Enrolled Students</Label>
                  <Button size="sm" onClick={() => setIsBulkEnrollModalOpen(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    Bulk Enroll
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>USN</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrolled Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.map((enrollment: any) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>{enrollment.student.usn}</TableCell>
                        <TableCell>{enrollment.student.name}</TableCell>
                        <TableCell>{enrollment.student.email}</TableCell>
                        <TableCell>{new Date(enrollment.enrolledAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
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
            <p className="text-sm text-muted-foreground">
              This will enroll students with USNs from {bulkEnrollData.prefix}{String(bulkEnrollData.startRange).padStart(3, '0')} to {bulkEnrollData.prefix}{String(bulkEnrollData.endRange).padStart(3, '0')}
            </p>
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
