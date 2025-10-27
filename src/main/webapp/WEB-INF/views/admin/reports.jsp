<%@ page isELIgnored="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports & Analytics - EduNex LMS</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/admin/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/admin/users" class="nav-link"><i class="fas fa-users"></i> Users</a></li>
                <li class="nav-item"><a href="/admin/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/admin/reports" class="nav-link active"><i class="fas fa-chart-bar"></i> Reports</a></li>
                <li class="nav-item"><a href="/profile" class="nav-link"><i class="fas fa-user"></i> Profile</a></li>
                <li class="nav-item"><a href="#" id="logoutBtn" class="nav-link"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <div>
                <h1><i class="fas fa-chart-bar"></i> Reports & Analytics</h1>
                <p>System-wide reports and statistics</p>
            </div>
            <button id="exportPdfBtn" class="btn btn-primary" style="display: none;">
                <i class="fas fa-file-pdf"></i> Export PDF
            </button>
        </div>

        <div id="reportsOverview">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading reports...
            </div>
        </div>

        <div class="reports-sections" id="reportsSections" style="display: none;">
            <!-- Summary Overview Card -->
            <div class="card summary-card">
                <div class="card-header">
                    <h2><i class="fas fa-chart-pie"></i> Executive Summary</h2>
                    <span class="badge badge-primary" id="reportDate"></span>
                </div>
                <div class="card-body">
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-icon" style="background: rgba(74, 158, 255, 0.1); color: var(--accent);">
                                <i class="fas fa-users fa-2x"></i>
                            </div>
                            <div class="summary-details">
                                <h3 id="summaryUsers">0</h3>
                                <p>Total Users</p>
                                <span class="summary-subtitle" id="summaryUsersBreakdown"></span>
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-icon" style="background: rgba(46, 204, 113, 0.1); color: #2ecc71;">
                                <i class="fas fa-book fa-2x"></i>
                            </div>
                            <div class="summary-details">
                                <h3 id="summaryCourses">0</h3>
                                <p>Total Courses</p>
                                <span class="summary-subtitle" id="summaryCoursesBreakdown"></span>
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-icon" style="background: rgba(155, 89, 182, 0.1); color: #9b59b6;">
                                <i class="fas fa-tasks fa-2x"></i>
                            </div>
                            <div class="summary-details">
                                <h3 id="summaryActivities">0</h3>
                                <p>Total Activities</p>
                                <span class="summary-subtitle" id="summaryActivitiesBreakdown"></span>
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-icon" style="background: rgba(230, 126, 34, 0.1); color: #e67e22;">
                                <i class="fas fa-chart-line fa-2x"></i>
                            </div>
                            <div class="summary-details">
                                <h3 id="summaryEngagement">0%</h3>
                                <p>Engagement Rate</p>
                                <span class="summary-subtitle" id="summaryEngagementBreakdown"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Statistics -->
            <div class="card">
                <div class="card-header">
                    <h2><i class="fas fa-users"></i> User Statistics</h2>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div id="userStats"></div>
                    </div>
                </div>
            </div>

            <!-- Course Statistics -->
            <div class="card">
                <div class="card-header">
                    <h2><i class="fas fa-book"></i> Course Statistics</h2>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div id="courseStats"></div>
                    </div>
                </div>
            </div>

            <!-- Activity Statistics -->
            <div class="card">
                <div class="card-header">
                    <h2><i class="fas fa-tasks"></i> Activity Statistics</h2>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div id="activityStats"></div>
                    </div>
                </div>
            </div>

            <!-- Engagement Overview -->
            <div class="card">
                <div class="card-header">
                    <h2><i class="fas fa-chart-line"></i> Engagement Overview</h2>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div id="engagementStats"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script src="/js/auth.js"></script>
    <script src="/js/admin-dashboard.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        // Check authentication and admin role
        if (checkAuth()) {
            const user = getCurrentUser();
            if (user.role !== 'ADMIN') {
                alert('Access denied. Admin privileges required.');
                window.location.href = '/';
            }
        }

        let reportData = null;

        // Load reports on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadReports();
            document.getElementById('exportPdfBtn').addEventListener('click', exportToPDF);
            
            // Set report date
            const today = new Date();
            document.getElementById('reportDate').textContent = today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        });

        async function loadReports() {
            try {
                const response = await apiCall('/api/admin/reports/overview');
                reportData = response;
                displayReports(response);
                document.getElementById('reportsSections').style.display = 'block';
                document.getElementById('exportPdfBtn').style.display = 'flex';
            } catch (error) {
                console.error('Error loading reports:', error);
                document.getElementById('reportsOverview').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i> Failed to load reports. ${error.message}
                    </div>`;
            }
        }

        function displayReports(data) {
            document.getElementById('reportsOverview').innerHTML = '';

            // Update Summary Card
            document.getElementById('summaryUsers').textContent = data.totalUsers || 0;
            document.getElementById('summaryUsersBreakdown').textContent = 
                `${data.totalStudents || 0} Students, ${data.totalInstructors || 0} Instructors`;
            
            document.getElementById('summaryCourses').textContent = data.totalCourses || 0;
            document.getElementById('summaryCoursesBreakdown').textContent = 
                `${data.coursesWithEnrollments || 0} Active, ${data.totalEnrollments || 0} Enrollments`;
            
            const totalActivities = (data.totalAssignments || 0) + (data.totalQuizzes || 0);
            document.getElementById('summaryActivities').textContent = totalActivities;
            document.getElementById('summaryActivitiesBreakdown').textContent = 
                `${data.totalAssignments || 0} Assignments, ${data.totalQuizzes || 0} Quizzes`;
            
            document.getElementById('summaryEngagement').textContent = 
                data.engagementRate ? (data.engagementRate * 100).toFixed(1) + '%' : '0%';
            document.getElementById('summaryEngagementBreakdown').textContent = 
                `${data.activeUsers || 0} Active Users, ${data.activeToday || 0} Active Today`;

            // User Statistics
            const userStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(74, 158, 255, 0.1); color: var(--accent);">
                        <i class="fas fa-users fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalUsers || 0}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(46, 204, 113, 0.1); color: #2ecc71;">
                        <i class="fas fa-user-check fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.activeUsers || 0}</h3>
                        <p>Active Users</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(155, 89, 182, 0.1); color: #9b59b6;">
                        <i class="fas fa-user-graduate fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalStudents || 0}</h3>
                        <p>Students</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(230, 126, 34, 0.1); color: #e67e22;">
                        <i class="fas fa-chalkboard-teacher fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalInstructors || 0}</h3>
                        <p>Instructors</p>
                    </div>
                </div>
            `;
            document.getElementById('userStats').innerHTML = userStats;

            // Course Statistics
            const courseStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(74, 158, 255, 0.1); color: var(--accent);">
                        <i class="fas fa-book fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalCourses || 0}</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(46, 204, 113, 0.1); color: #2ecc71;">
                        <i class="fas fa-user-plus fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalEnrollments || 0}</h3>
                        <p>Total Enrollments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(241, 196, 15, 0.1); color: #f1c40f;">
                        <i class="fas fa-chart-line fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.averageEnrollmentsPerCourse ? data.averageEnrollmentsPerCourse.toFixed(1) : '0.0'}</h3>
                        <p>Avg Enrollments/Course</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(231, 76, 60, 0.1); color: #e74c3c;">
                        <i class="fas fa-book-open fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.coursesWithEnrollments || 0}</h3>
                        <p>Active Courses</p>
                    </div>
                </div>
            `;
            document.getElementById('courseStats').innerHTML = courseStats;

            // Activity Statistics
            const activityStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(155, 89, 182, 0.1); color: #9b59b6;">
                        <i class="fas fa-tasks fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalAssignments || 0}</h3>
                        <p>Total Assignments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(26, 188, 156, 0.1); color: #1abc9c;">
                        <i class="fas fa-question-circle fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalQuizzes || 0}</h3>
                        <p>Total Quizzes</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(52, 73, 94, 0.1); color: #34495e;">
                        <i class="fas fa-check-circle fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.totalSubmissions || 0}</h3>
                        <p>Total Submissions</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(22, 160, 133, 0.1); color: #16a085;">
                        <i class="fas fa-clock fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.pendingSubmissions || 0}</h3>
                        <p>Pending Reviews</p>
                    </div>
                </div>
            `;
            document.getElementById('activityStats').innerHTML = activityStats;

            // Engagement Overview
            const engagementStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(39, 174, 96, 0.1); color: #27ae60;">
                        <i class="fas fa-percentage fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.engagementRate ? (data.engagementRate * 100).toFixed(1) + '%' : '0%'}</h3>
                        <p>Engagement Rate</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(211, 84, 0, 0.1); color: #d35400;">
                        <i class="fas fa-trophy fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.completionRate ? (data.completionRate * 100).toFixed(1) + '%' : '0%'}</h3>
                        <p>Completion Rate</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(142, 68, 173, 0.1); color: #8e44ad;">
                        <i class="fas fa-star fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.averageScore ? data.averageScore.toFixed(1) : '0.0'}</h3>
                        <p>Average Score</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: rgba(192, 57, 43, 0.1); color: #c0392b;">
                        <i class="fas fa-fire fa-2x"></i>
                    </div>
                    <div class="stat-content">
                        <h3>${data.activeToday || 0}</h3>
                        <p>Active Today</p>
                    </div>
                </div>
            `;
            document.getElementById('engagementStats').innerHTML = engagementStats;
        }

        function exportToPDF() {
            if (!reportData) {
                alert('No report data available to export');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            let yPos = 20;

            // Title
            doc.setFontSize(20);
            doc.setTextColor(74, 158, 255);
            doc.text('EduNex LMS - Reports & Analytics', margin, yPos);
            
            yPos += 10;
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPos);
            
            yPos += 15;
            doc.setDrawColor(74, 158, 255);
            doc.line(margin, yPos, pageWidth - margin, yPos);

            // Executive Summary
            yPos += 10;
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Executive Summary', margin, yPos);
            
            yPos += 10;
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            
            const summaryData = [
                `Total Users: ${reportData.totalUsers || 0} (${reportData.totalStudents || 0} Students, ${reportData.totalInstructors || 0} Instructors)`,
                `Active Users: ${reportData.activeUsers || 0}`,
                `Total Courses: ${reportData.totalCourses || 0} (${reportData.coursesWithEnrollments || 0} Active)`,
                `Total Enrollments: ${reportData.totalEnrollments || 0}`,
                `Engagement Rate: ${reportData.engagementRate ? (reportData.engagementRate * 100).toFixed(1) + '%' : '0%'}`,
                `Active Today: ${reportData.activeToday || 0}`
            ];
            
            summaryData.forEach(line => {
                doc.text(`• ${line}`, margin + 5, yPos);
                yPos += 7;
            });

            // User Statistics
            yPos += 5;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('User Statistics', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            
            const userStats = [
                ['Total Users:', reportData.totalUsers || 0],
                ['Active Users:', reportData.activeUsers || 0],
                ['Students:', reportData.totalStudents || 0],
                ['Instructors:', reportData.totalInstructors || 0]
            ];
            
            userStats.forEach(([label, value]) => {
                doc.text(label, margin + 5, yPos);
                doc.text(String(value), margin + 60, yPos);
                yPos += 6;
            });

            // Course Statistics
            yPos += 5;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Course Statistics', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            
            const courseStats = [
                ['Total Courses:', reportData.totalCourses || 0],
                ['Total Enrollments:', reportData.totalEnrollments || 0],
                ['Avg Enrollments/Course:', reportData.averageEnrollmentsPerCourse ? reportData.averageEnrollmentsPerCourse.toFixed(1) : '0.0'],
                ['Active Courses:', reportData.coursesWithEnrollments || 0]
            ];
            
            courseStats.forEach(([label, value]) => {
                doc.text(label, margin + 5, yPos);
                doc.text(String(value), margin + 60, yPos);
                yPos += 6;
            });

            // Check if we need a new page
            if (yPos > 220) {
                doc.addPage();
                yPos = 20;
            }

            // Activity Statistics
            yPos += 5;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Activity Statistics', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            
            const activityStats = [
                ['Total Assignments:', reportData.totalAssignments || 0],
                ['Total Quizzes:', reportData.totalQuizzes || 0],
                ['Total Submissions:', reportData.totalSubmissions || 0],
                ['Pending Reviews:', reportData.pendingSubmissions || 0]
            ];
            
            activityStats.forEach(([label, value]) => {
                doc.text(label, margin + 5, yPos);
                doc.text(String(value), margin + 60, yPos);
                yPos += 6;
            });

            // Engagement Overview
            yPos += 5;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Engagement Overview', margin, yPos);
            
            yPos += 8;
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            
            const engagementStats = [
                ['Engagement Rate:', reportData.engagementRate ? (reportData.engagementRate * 100).toFixed(1) + '%' : '0%'],
                ['Completion Rate:', reportData.completionRate ? (reportData.completionRate * 100).toFixed(1) + '%' : '0%'],
                ['Average Score:', reportData.averageScore ? reportData.averageScore.toFixed(1) : '0.0'],
                ['Active Today:', reportData.activeToday || 0]
            ];
            
            engagementStats.forEach(([label, value]) => {
                doc.text(label, margin + 5, yPos);
                doc.text(String(value), margin + 60, yPos);
                yPos += 6;
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            // Save the PDF
            const fileName = `EduNex_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
        }
    </script>

    <style>
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .page-header h1 {
            margin: 0;
        }

        .page-header p {
            margin: 0.5rem 0 0 0;
        }

        .reports-sections {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .summary-card {
            background: linear-gradient(135deg, rgba(74, 158, 255, 0.1) 0%, rgba(155, 89, 182, 0.1) 100%);
            border: 1px solid rgba(74, 158, 255, 0.2);
        }

        .summary-card .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }

        .summary-item {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            padding: 1.25rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .summary-item:hover {
            transform: translateY(-2px);
            border-color: var(--accent);
            box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
        }

        .summary-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .summary-details h3 {
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
            color: var(--text-primary);
        }

        .summary-details p {
            font-size: 0.95rem;
            color: var(--text-secondary);
            margin: 0.25rem 0;
            font-weight: 500;
        }

        .summary-subtitle {
            font-size: 0.8rem;
            color: var(--text-tertiary);
            display: block;
            margin-top: 0.25rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            gap: 1.25rem;
        }

        .stat-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.25rem;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            border-color: var(--accent);
            box-shadow: 0 4px 12px rgba(74, 158, 255, 0.15);
        }

        .stat-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .stat-content h3 {
            font-size: 1.75rem;
            font-weight: 700;
            margin: 0;
            color: var(--text-primary);
        }

        .stat-content p {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0.25rem 0 0 0;
        }

        @media (max-width: 768px) {
            .page-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .summary-grid {
                grid-template-columns: 1fr;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</body>
</html>
