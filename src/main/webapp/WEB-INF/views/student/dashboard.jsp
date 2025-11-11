<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - EduNex</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/student/dashboard" class="nav-link active"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/student/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/student/assignments" class="nav-link"><i class="fas fa-tasks"></i> Assignments</a></li>
                <li class="nav-item"><a href="/student/quizzes" class="nav-link"><i class="fas fa-clipboard-check"></i> Quizzes</a></li>
                <li class="nav-item"><a href="/student/profile" class="nav-link"><i class="fas fa-user"></i> Profile</a></li>
                <li class="nav-item"><a href="#" id="logoutBtn" class="nav-link"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <main class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Welcome back, <span id="userName"></span>!</p>
                </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Enrolled Courses</h3>
                    <div class="stat-value" id="totalCourses">0</div>
                </div>
                <div class="stat-card">
                    <h3>Pending Assignments</h3>
                    <div class="stat-value" id="pendingAssignments">0</div>
                </div>
                <div class="stat-card">
                    <h3>Average Grade</h3>
                    <div class="stat-value" id="averageGrade">0%</div>
                </div>
                <div class="stat-card">
                    <h3>Attendance Rate</h3>
                    <div class="stat-value" id="attendanceRate">0%</div>
                </div>
            </div>
            
            <!-- Charts -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Performance Overview</h3>
                </div>
                <canvas id="performanceChart"></canvas>
            </div>
            
            <!-- Recent Courses -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">My Courses</h3>
                    <a href="/student/courses" class="btn btn-primary">View All</a>
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Instructor</th>
                                <th>Progress</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="coursesTableBody">
                            <tr>
                                <td colspan="5" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Upcoming Assignments -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Upcoming Assignments</h3>
                    <a href="/student/assignments" class="btn btn-primary">View All</a>
                </div>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Assignment</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="assignmentsTableBody">
                            <tr>
                                <td colspan="5" style="text-align: center;">Loading...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Attendance Overview -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Attendance Overview</h3>
                </div>
                <div id="attendanceOverview" style="padding: 1.5rem;">
                    <div style="text-align: center;">Loading...</div>
                </div>
            </div>
        </div>
    </main>
    
    <script src="/js/main.js"></script>
    <script src="/js/student-dashboard.js"></script>
    <script>
        if (checkAuth()) {
            const user = getCurrentUser();
            if (user.role !== 'STUDENT') {
                alert('Access denied. Student privileges required.');
                window.location.href = '/';
            }
        }
    </script>
</body>
</html>
