import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon, UserCheck, UserX, Clock, Download, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { courseAPI, attendanceAPI, enrollmentAPI } from "@/lib/api";

interface AttendanceRecord {
  studentId: number;
  studentName: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  remarks: string;
}

interface AttendanceSession {
  id: number;
  date: string;
  courseId: number;
  courseName: string;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
}

export default function InstructorAttendance() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<{ id: number; name: string; code: string }[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number>(0);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isMarkingOpen, setIsMarkingOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await courseAPI.getInstructorCourses(user!.id);
      setCourses(response.data);
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0].id);
      }
    } catch (error) {
      toast.error("Failed to load courses");
    }
  }, [user]);

  const fetchEnrolledStudents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await enrollmentAPI.getCourseEnrollments(selectedCourse);
      const enrollments = response.data;
      
      const records = enrollments.map((enrollment: { student: { id: number; name: string } }) => ({
        studentId: enrollment.student.id,
        studentName: enrollment.student.name,
        status: "PRESENT" as const,
        remarks: ""
      }));
      setAttendanceRecords(records);
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, [selectedCourse]);

  const fetchAttendanceSessions = useCallback(async () => {
    if (!selectedCourse) return;
    
    try {
      const response = await attendanceAPI.getCourseAttendance(selectedCourse);
      const sessions = response.data;
      
      const sessionMap = new Map<string, AttendanceSession>();
      sessions.forEach((record: { id: number; date: string; course: { id: number; name: string }; status: string }) => {
        const date = record.date;
        if (!sessionMap.has(date)) {
          sessionMap.set(date, {
            id: record.id,
            date: date,
            courseId: record.course.id,
            courseName: record.course.name,
            totalStudents: 0,
            present: 0,
            absent: 0,
            late: 0
          });
        }
        const session = sessionMap.get(date)!;
        session.totalStudents++;
        if (record.status === "PRESENT") session.present++;
        else if (record.status === "ABSENT") session.absent++;
        else if (record.status === "LATE") session.late++;
      });
      
      setAttendanceSessions(Array.from(sessionMap.values()));
    } catch (error) {
      toast.error("Failed to load attendance sessions");
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchAttendanceSessions();
    }
  }, [user, fetchCourses, fetchAttendanceSessions]);

  useEffect(() => {
    if (selectedCourse && isMarkingOpen) {
      fetchEnrolledStudents();
    }
  }, [selectedCourse, isMarkingOpen, fetchEnrolledStudents]);

  const handleStatusChange = (studentId: number, status: "PRESENT" | "ABSENT" | "LATE") => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, remarks } : record
      )
    );
  };

  const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
    setAttendanceRecords(prev =>
      prev.map(record => ({ ...record, status }))
    );
    toast.success(`Marked all students as ${status.toLowerCase()}`);
  };

  const handleSaveAttendance = async () => {
    try {
      const attendanceData = attendanceRecords.map(record => ({
        studentId: record.studentId,
        courseId: selectedCourse,
        date: format(selectedDate, "yyyy-MM-dd"),
        status: record.status,
        remarks: record.remarks
      }));

      await attendanceAPI.markMultipleAttendance(attendanceData);
      
      toast.success("Attendance saved successfully");
      setIsMarkingOpen(false);
      fetchAttendanceSessions();
    } catch (error) {
      toast.error("Failed to save attendance");
    }
  };

  const handleExportAttendance = () => {
    toast.success("Exporting attendance data...");
  };

  const getAttendanceStats = () => {
    const present = attendanceRecords.filter(r => r.status === "PRESENT").length;
    const absent = attendanceRecords.filter(r => r.status === "ABSENT").length;
    const late = attendanceRecords.filter(r => r.status === "LATE").length;
    const total = attendanceRecords.length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
    
    return { present, absent, late, total, percentage };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Badge className="bg-green-500">Present</Badge>;
      case "ABSENT":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "LATE":
        return <Badge className="bg-yellow-500">Late</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const stats = getAttendanceStats();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Mark and track student attendance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportAttendance} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isMarkingOpen} onOpenChange={setIsMarkingOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
                <DialogDescription>
                  Record attendance for your students
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Course</Label>
                    <Select value={selectedCourse.toString()} onValueChange={(value) => setSelectedCourse(parseInt(value))}>
                      <SelectTrigger>
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

                  <div>
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {attendanceRecords.length > 0 && (
                  <>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMarkAll("PRESENT")}>
                        Mark All Present
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMarkAll("ABSENT")}>
                        Mark All Absent
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                        <p className="text-sm text-gray-600">Present</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                        <p className="text-sm text-gray-600">Late</p>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attendanceRecords.map((student) => (
                          <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell>
                              <Select
                                value={student.status}
                                onValueChange={(value: string) => handleStatusChange(student.studentId, value as "PRESENT" | "ABSENT" | "LATE")}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="PRESENT">Present</SelectItem>
                                  <SelectItem value="ABSENT">Absent</SelectItem>
                                  <SelectItem value="LATE">Late</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Textarea
                                value={student.remarks}
                                onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                                placeholder="Optional remarks"
                                className="min-h-[60px]"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsMarkingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAttendance}>
                        Save Attendance
                      </Button>
                    </div>
                  </>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <p>Loading students...</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <Label>Select Course</Label>
        <Select value={selectedCourse.toString()} onValueChange={(value) => {
          setSelectedCourse(parseInt(value));
          fetchAttendanceSessions();
        }}>
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
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>View past attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No attendance records found</p>
              <p className="text-sm">Start by marking attendance for a class</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Late</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{format(new Date(session.date), "PPP")}</TableCell>
                    <TableCell>{session.courseName}</TableCell>
                    <TableCell>{session.totalStudents}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{session.present}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-red-500">{session.absent}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500">{session.late}</Badge>
                    </TableCell>
                    <TableCell>
                      {((session.present + session.late) / session.totalStudents * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
