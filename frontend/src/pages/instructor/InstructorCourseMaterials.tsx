import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Video, Link2, File, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { courseAPI, courseMaterialAPI } from "@/lib/api";

interface CourseMaterial {
  id: number;
  title: string;
  description: string;
  type: "DOCUMENT" | "VIDEO" | "LINK" | "OTHER";
  url: string;
  courseId: number;
  courseName: string;
  uploadedAt: string;
}

export default function InstructorCourseMaterials() {
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [courses, setCourses] = useState<{ id: number; name: string; code: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number>(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CourseMaterial>>({
    title: "",
    description: "",
    type: "DOCUMENT",
    url: "",
    courseId: 0
  });

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await courseAPI.getInstructorCourses(user.id);
      const courseList = response.data.map((c: { id: number; courseName: string; courseCode: string }) => ({
        id: c.id,
        name: c.courseName,
        code: c.courseCode
      }));
      setCourses(courseList);
      if (courseList.length > 0 && !selectedCourse) {
        setSelectedCourse(courseList[0].id);
      }
    } catch (error) {
      toast.error("Failed to load courses");
    }
  }, [user, selectedCourse]);

  const fetchMaterials = useCallback(async () => {
    if (!selectedCourse) return;
    
    try {
      setLoading(true);
      const response = await courseMaterialAPI.getMaterialsByCourse(selectedCourse);
      setMaterials(response.data);
    } catch (error) {
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourse) {
      fetchMaterials();
    }
  }, [selectedCourse, fetchMaterials]);

  const handleCreateMaterial = async () => {
    if (!formData.title || !formData.url || !formData.courseId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await courseMaterialAPI.createMaterial(formData, formData.courseId);
      toast.success("Material created successfully");
      setIsCreateOpen(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error("Failed to create material");
    }
  };

  const handleUpdateMaterial = async () => {
    if (!formData.id || !formData.title || !formData.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await courseMaterialAPI.updateMaterial(formData.id, formData);
      toast.success("Material updated successfully");
      setIsEditOpen(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error("Failed to update material");
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      await courseMaterialAPI.deleteMaterial(id);
      toast.success("Material deleted successfully");
      fetchMaterials();
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  const handleEditMaterial = (material: CourseMaterial) => {
    setFormData(material);
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "DOCUMENT",
      url: "",
      courseId: selectedCourse
    });
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "DOCUMENT":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "VIDEO":
        return <Video className="h-5 w-5 text-red-600" />;
      case "LINK":
        return <Link2 className="h-5 w-5 text-green-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getMaterialTypeBadge = (type: string) => {
    const colors = {
      DOCUMENT: "bg-blue-100 text-blue-800",
      VIDEO: "bg-red-100 text-red-800",
      LINK: "bg-green-100 text-green-800",
      OTHER: "bg-gray-100 text-gray-800"
    };
    return <Badge className={colors[type as keyof typeof colors]}>{type}</Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Course Materials</h1>
          <p className="text-gray-600 mt-1">Manage learning resources for your courses</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setFormData(prev => ({ ...prev, courseId: selectedCourse })); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Course Material</DialogTitle>
              <DialogDescription>Add a new learning resource for your course</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Course</Label>
                <Select
                  value={formData.courseId?.toString() || ""}
                  onValueChange={(value) => setFormData({ ...formData, courseId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction to Arrays"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the material"
                />
              </div>

              <div>
                <Label>Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: string) => setFormData({ ...formData, type: value as "LINK" | "DOCUMENT" | "VIDEO" | "OTHER" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOCUMENT">Document</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="LINK">Link</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>URL *</Label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/material"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMaterial}>Create Material</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Label>Select Course</Label>
        <Select value={selectedCourse.toString()} onValueChange={(value) => setSelectedCourse(parseInt(value))}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials</CardTitle>
          <CardDescription>Learning resources for your courses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading materials...</div>
          ) : materials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No materials found</p>
              <p className="text-sm">Add learning resources for your course</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMaterialIcon(material.type)}
                        {getMaterialTypeBadge(material.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell className="max-w-md truncate">{material.description}</TableCell>
                    <TableCell>{format(new Date(material.uploadedAt), "PPP")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(material.url, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMaterial(material)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>Update the material details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <Label>Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: string) => setFormData({ ...formData, type: value as "LINK" | "DOCUMENT" | "VIDEO" | "OTHER" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>URL *</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMaterial}>Update Material</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
