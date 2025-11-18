import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingUp, TrendingDown, UserCheck, UserX, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { attendanceAPI } from "@/lib/api";

interface AttendanceRecord {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
  remarks?: string;
}

interface CourseAttendance {
  courseId: number;
  courseName: string;
  courseCode: string;
  totalClasses: number;
  attended: number;
  absent: number;
  late: number;
  percentage: number;
}

export default function StudentAttendance() {
  const { user } = useAuthStore();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await attendanceAPI.getMyAttendance();
      
      // Parse the actual API structure: {courseAttendance: {}, attendance: []}
      const attendanceArray = response.data.attendance || [];
      const courseAttendanceData = response.data.courseAttendance || {};
      
      const records: AttendanceRecord[] = attendanceArray.map((record: any) => ({
        id: record.id,
        courseId: record.course.id,
        courseName: record.course.courseName,
        courseCode: record.course.courseCode,
        date: record.attendanceDate,
        status: record.status,
        remarks: record.remarks
      }));
      setAttendanceRecords(records);

      // Convert courseAttendance object to array
      const courseStats: CourseAttendance[] = Object.entries(courseAttendanceData).map(([courseId, data]: [string, any]) => ({
        courseId: parseInt(courseId),
        courseName: data.courseName,
        courseCode: data.courseCode,
        totalClasses: data.total,
        attended: data.present,
        absent: data.absent,
        late: 0,
        percentage: data.rate
      }));

      setCourseAttendance(courseStats);
    } catch (error) {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <Badge className="bg-green-500"><UserCheck className="h-3 w-3 mr-1" />Present</Badge>;
      case "ABSENT":
        return <Badge className="bg-red-500"><UserX className="h-3 w-3 mr-1" />Absent</Badge>;
      case "LATE":
        return <Badge className="bg-yellow-500"><Calendar className="h-3 w-3 mr-1" />Late</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getOverallAttendance = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === "PRESENT").length;
    const late = attendanceRecords.filter(r => r.status === "LATE").length;
    const absent = attendanceRecords.filter(r => r.status === "ABSENT").length;
    const percentage = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;
    
    return { total, present, late, absent, percentage };
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return { color: "text-green-600", icon: TrendingUp, label: "Excellent" };
    if (percentage >= 75) return { color: "text-blue-600", icon: TrendingUp, label: "Good" };
    if (percentage >= 65) return { color: "text-yellow-600", icon: TrendingDown, label: "Average" };
    return { color: "text-red-600", icon: TrendingDown, label: "Poor" };
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading attendance...</div>;
  }

  const overall = getOverallAttendance();
  const overallPercentage = typeof overall.percentage === 'number' ? overall.percentage : parseFloat(overall.percentage);
  const status = getAttendanceStatus(overallPercentage);
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-gray-600 mt-1">Track your attendance across all courses</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overall Attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-3xl font-bold ${status.color}`}>
                  {overall.percentage}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                  <span className={`text-sm ${status.color}`}>{status.label}</span>
                </div>
              </div>
              <CalendarDays className={`h-8 w-8 ${status.color} opacity-50`} />
            </div>
            <Progress value={overallPercentage} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Classes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{overall.total}</p>
            <p className="text-sm text-gray-600 mt-1">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Present</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{overall.present}</p>
            <p className="text-sm text-gray-600 mt-1">
              {overall.late > 0 && `+ ${overall.late} late`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Absent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{overall.absent}</p>
            <p className="text-sm text-gray-600 mt-1">Classes missed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="by-course" className="space-y-6">
        <TabsList>
          <TabsTrigger value="by-course">By Course</TabsTrigger>
          <TabsTrigger value="recent">Recent Records</TabsTrigger>
        </TabsList>

        <TabsContent value="by-course">
          <Card>
            <CardHeader>
              <CardTitle>Course-wise Attendance</CardTitle>
              <CardDescription>Your attendance breakdown for each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseAttendance.map((course) => {
                  const courseStatus = getAttendanceStatus(course.percentage);
                  return (
                    <Card key={course.courseId}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{course.courseName}</h3>
                            <p className="text-sm text-gray-600">{course.courseCode}</p>
                          </div>
                          <Badge 
                            className={
                              course.percentage >= 85 ? "bg-green-500" :
                              course.percentage >= 75 ? "bg-blue-500" :
                              course.percentage >= 65 ? "bg-yellow-500" :
                              "bg-red-500"
                            }
                          >
                            {course.percentage.toFixed(1)}%
                          </Badge>
                        </div>

                        <Progress value={course.percentage} className="mb-4" />

                        <div className="grid grid-cols-4 gap-4 text-center text-sm">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">{course.totalClasses}</p>
                            <p className="text-gray-600">Total</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-600">{course.attended}</p>
                            <p className="text-gray-600">Present</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-yellow-600">{course.late}</p>
                            <p className="text-gray-600">Late</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-red-600">{course.absent}</p>
                            <p className="text-gray-600">Absent</p>
                          </div>
                        </div>

                        {course.percentage < 75 && (
                          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              ⚠️ Warning: Your attendance is below the minimum requirement (75%)
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
              <CardDescription>Your latest attendance entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                        <TableCell className="font-medium">{record.courseName}</TableCell>
                        <TableCell>{record.courseCode}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-gray-600">
                          {record.remarks || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
