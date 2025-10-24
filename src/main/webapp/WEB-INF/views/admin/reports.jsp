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
            <a href="/" class="nav-logo">
                <i class="fas fa-graduation-cap"></i>
                EduNex
            </a>
            <ul class="nav-menu">
                <li class="nav-item">
                    <a href="/admin/dashboard" class="nav-link">
                        <i class="fas fa-chart-line"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/admin/users" class="nav-link">
                        <i class="fas fa-users"></i> Users
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/admin/courses" class="nav-link">
                        <i class="fas fa-book"></i> Courses
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/admin/reports" class="nav-link active">
                        <i class="fas fa-chart-bar"></i> Reports
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/profile" class="nav-link">
                        <i class="fas fa-user"></i> Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-chart-bar"></i> Reports & Analytics</h1>
            <p>System-wide reports and statistics</p>
        </div>

        <div id="reportsOverview">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading reports...
            </div>
        </div>

        <div class="reports-sections" id="reportsSections" style="display: none;">
            <div class="report-section">
                <h2><i class="fas fa-users"></i> User Statistics</h2>
                <div id="userStats" class="stats-grid"></div>
            </div>

            <div class="report-section">
                <h2><i class="fas fa-book"></i> Course Statistics</h2>
                <div id="courseStats" class="stats-grid"></div>
            </div>

            <div class="report-section">
                <h2><i class="fas fa-tasks"></i> Activity Statistics</h2>
                <div id="activityStats" class="stats-grid"></div>
            </div>

            <div class="report-section">
                <h2><i class="fas fa-chart-line"></i> Engagement Overview</h2>
                <div id="engagementStats" class="stats-grid"></div>
            </div>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script src="/js/auth.js"></script>
    <script src="/js/admin-dashboard.js"></script>
    <script>
        // Check authentication and admin role
        if (checkAuth()) {
            const user = getCurrentUser();
            if (user.role !== 'ADMIN') {
                alert('Access denied. Admin privileges required.');
                window.location.href = '/';
            }
        }

        // Load reports on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadReports();
        });

        async function loadReports() {
            try {
                const response = await apiCall('/api/admin/reports/overview');
                displayReports(response);
                document.getElementById('reportsSections').style.display = 'block';
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

            // User Statistics
            const userStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: #3498db;">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalUsers || 0}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #2ecc71;">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.activeUsers || 0}</h3>
                        <p>Active Users</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #9b59b6;">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalStudents || 0}</h3>
                        <p>Students</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #e67e22;">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalInstructors || 0}</h3>
                        <p>Instructors</p>
                    </div>
                </div>
            `;
            document.getElementById('userStats').innerHTML = userStats;

            // Course Statistics
            const courseStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: #3498db;">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalCourses || 0}</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #2ecc71;">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalEnrollments || 0}</h3>
                        <p>Total Enrollments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #f39c12;">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.averageEnrollmentsPerCourse ? data.averageEnrollmentsPerCourse.toFixed(1) : '0.0'}</h3>
                        <p>Avg Enrollments/Course</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #e74c3c;">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.coursesWithEnrollments || 0}</h3>
                        <p>Active Courses</p>
                    </div>
                </div>
            `;
            document.getElementById('courseStats').innerHTML = courseStats;

            // Activity Statistics
            const activityStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: #9b59b6;">
                        <i class="fas fa-tasks"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalAssignments || 0}</h3>
                        <p>Total Assignments</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #1abc9c;">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalQuizzes || 0}</h3>
                        <p>Total Quizzes</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #34495e;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.totalSubmissions || 0}</h3>
                        <p>Total Submissions</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #16a085;">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.pendingSubmissions || 0}</h3>
                        <p>Pending Reviews</p>
                    </div>
                </div>
            `;
            document.getElementById('activityStats').innerHTML = activityStats;

            // Engagement Overview
            const engagementStats = `
                <div class="stat-card">
                    <div class="stat-icon" style="background: #27ae60;">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.engagementRate ? (data.engagementRate * 100).toFixed(1) + '%' : '0%'}</h3>
                        <p>Engagement Rate</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #d35400;">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.completionRate ? (data.completionRate * 100).toFixed(1) + '%' : '0%'}</h3>
                        <p>Completion Rate</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #8e44ad;">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.averageScore ? data.averageScore.toFixed(1) : '0.0'}</h3>
                        <p>Average Score</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon" style="background: #c0392b;">
                        <i class="fas fa-fire"></i>
                    </div>
                    <div class="stat-info">
                        <h3>${data.activeToday || 0}</h3>
                        <p>Active Today</p>
                    </div>
                </div>
            `;
            document.getElementById('engagementStats').innerHTML = engagementStats;
        }
    </script>

    <style>
        .reports-sections {
            margin-top: 30px;
        }

        .report-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .report-section h2 {
            margin-bottom: 20px;
            color: #2c3e50;
            font-size: 1.5em;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .filter-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 250px;
            position: relative;
        }

        .search-box i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #95a5a6;
        }

        .search-box input {
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
        }
    </style>
</body>
</html>
