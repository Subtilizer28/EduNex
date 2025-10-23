<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - EduNex</title>
    <link rel="stylesheet" href="/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="dashboard">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-brand">
                <h2>EduNex</h2>
                <p id="userFullName"></p>
            </div>
            
            <ul class="sidebar-menu">
                <li><a href="/student/dashboard" class="active">📊 Dashboard</a></li>
                <li><a href="/student/courses">📚 My Courses</a></li>
                <li><a href="/student/assignments">✍️ Assignments</a></li>
                <li><a href="/student/quizzes">📝 Quizzes</a></li>
                <li><a href="/student/attendance">📅 Attendance</a></li>
                <li><a href="/student/grades">🎯 Grades</a></li>
                <li><a href="/profile">👤 Profile</a></li>
                <li><a href="#" onclick="EduNex.logout()">🚪 Logout</a></li>
            </ul>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
            <div class="dashboard-header">
                <div>
                    <h1>Student Dashboard</h1>
                    <p>Welcome back, <span id="userName"></span>!</p>
                </div>
                <div>
                    <button class="btn btn-outline" onclick="EduNex.toggleDarkMode()">🌙 Dark Mode</button>
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
            
            <!-- AI Features Notice -->
            <div class="card" id="aiNotice">
                <div class="card-header">
                    <h3 class="card-title">🤖 AI Features</h3>
                </div>
                <p id="aiStatusMessage">Checking AI availability...</p>
            </div>
        </main>
    </div>
    
    <script src="/js/main.js"></script>
    <script src="/js/student-dashboard.js"></script>
</body>
</html>
