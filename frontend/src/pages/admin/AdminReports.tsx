/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { adminAPI } from '@/lib/api';
import {
  Download,
  FileText,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminReports = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [reports, setReports] = useState<any>({});

  const fetchReportData = useCallback(async () => {
    try {
      const [statsRes, userSummaryRes, coursePerformanceRes, enrollmentTrendsRes, assignmentAnalyticsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUserSummaryReport(),
        adminAPI.getCoursePerformanceReport(),
        adminAPI.getEnrollmentTrendsReport(),
        adminAPI.getAssignmentAnalyticsReport(),
      ]);
      
      setStats(statsRes.data);
      setReports({
        userSummary: userSummaryRes.data,
        coursePerformance: coursePerformanceRes.data,
        enrollmentTrends: enrollmentTrendsRes.data,
        assignmentAnalytics: assignmentAnalyticsRes.data,
      });
    } catch (error: any) {
      toast.error('Failed to load report data', {
        description: error.response?.data?.message || 'Unable to fetch data',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleDownloadReport = (type: string) => {
    toast.success(`Generating ${type} report...`, {
      description: 'Your report will be downloaded shortly',
    });
    // In a real application, this would trigger a PDF/Excel download
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading reports...</div>
      </div>
    );
  }

  const reportTemplates = [
    {
      id: 'user-summary',
      title: 'User Summary Report',
      description: 'Comprehensive overview of all users, roles, and activity',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      metrics: `${reports.userSummary?.totalUsers || stats?.totalUsers || 0} users`,
      data: reports.userSummary,
    },
    {
      id: 'course-performance',
      title: 'Course Performance Report',
      description: 'Detailed analysis of course enrollments and completion rates',
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
      metrics: `${reports.coursePerformance?.totalCourses || stats?.totalCourses || 0} courses`,
      data: reports.coursePerformance,
    },
    {
      id: 'enrollment-trends',
      title: 'Enrollment Trends',
      description: 'Historical data on student enrollments and course popularity',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      metrics: `${reports.enrollmentTrends?.totalEnrollments || stats?.totalEnrollments || 0} enrollments`,
      data: reports.enrollmentTrends,
    },
    {
      id: 'assignment-analytics',
      title: 'Assignment Analytics',
      description: 'Submission rates, grading statistics, and performance metrics',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600',
      metrics: `${reports.assignmentAnalytics?.totalAssignments || stats?.totalAssignments || 0} assignments`,
      data: reports.assignmentAnalytics,
    },
    {
      id: 'attendance-report',
      title: 'Attendance Report',
      description: 'Student attendance records and patterns across all courses',
      icon: Calendar,
      color: 'bg-pink-100 text-pink-600',
      metrics: 'All courses',
      data: null,
    },
    {
      id: 'system-usage',
      title: 'System Usage Report',
      description: 'Platform activity, login statistics, and feature utilization',
      icon: BarChart3,
      color: 'bg-indigo-100 text-indigo-600',
      metrics: 'Platform-wide',
      data: null,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download comprehensive reports</p>
        </div>
        <Button onClick={() => handleDownloadReport('comprehensive')}>
          <Download className="mr-2 h-4 w-4" />
          Download All Reports
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="users">User Reports</SelectItem>
                  <SelectItem value="courses">Course Reports</SelectItem>
                  <SelectItem value="academic">Academic Reports</SelectItem>
                  <SelectItem value="system">System Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full" onClick={fetchReportData}>
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Students: {stats?.students || 0} • Instructors: {stats?.instructors || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEnrollments || 0}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAssignments || 0}</div>
            <p className="text-xs text-muted-foreground">Quizzes: {stats?.totalQuizzes || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Reports</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <report.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary">{report.metrics}</Badge>
                </div>
                <CardTitle className="mt-4">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownloadReport(report.id)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReport(`${report.id}-excel`)}
                  >
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Generated Reports</CardTitle>
          <CardDescription>Your previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'User Summary Report - November 2025', date: '2025-11-15', size: '2.4 MB' },
              { name: 'Course Performance - Q3 2025', date: '2025-10-28', size: '1.8 MB' },
              { name: 'Enrollment Trends - October 2025', date: '2025-10-15', size: '3.1 MB' },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Generated on {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
