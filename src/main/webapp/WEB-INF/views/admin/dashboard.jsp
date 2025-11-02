<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<c:url value='/css/style.css'/>">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/admin/dashboard" class="nav-link active"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/admin/users" class="nav-link"><i class="fas fa-users"></i> Users</a></li>
                <li class="nav-item"><a href="/admin/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/admin/reports" class="nav-link"><i class="fas fa-chart-bar"></i> Reports</a></li>
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

    <main class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>System Overview & Management</p>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3 id="totalUsers">0</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎓</div>
                    <div class="stat-content">
                        <h3 id="totalStudents">0</h3>
                        <p>Students</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👨‍🏫</div>
                    <div class="stat-content">
                        <h3 id="totalInstructors">0</h3>
                        <p>Instructors</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <h3 id="totalCourses">0</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="dashboard-grid">
                <!-- User Management - Full Width -->
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <div class="card-header">
                        <h2>Recent Users</h2>
                        <a href="/admin/users" class="btn btn-sm btn-primary">Manage All</a>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="recentUsers">
                                <!-- Users will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- System Activity -->
                <div class="dashboard-card" style="grid-column: 1 / -1;">
                    <div class="card-header">
                        <h2>System Activity</h2>
                    </div>
                    <div class="card-content">
                        <div class="activity-list" id="systemActivity">
                            <!-- Activity will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- User Distribution Chart -->
                <div class="dashboard-card full-width">
                    <div class="card-header">
                        <h2>User Distribution</h2>
                    </div>
                    <canvas id="userChart"></canvas>
                </div>

                <!-- Course Enrollment Chart -->
                <div class="dashboard-card full-width">
                    <div class="card-header">
                        <h2>Course Enrollment Trends</h2>
                    </div>
                    <canvas id="enrollmentChart"></canvas>
                </div>

                <!-- System Health -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2>System Health</h2>
                    </div>
                    <div class="health-metrics">
                        <div class="health-item">
                            <span class="health-label">Database</span>
                            <span class="badge badge-success">Healthy</span>
                        </div>
                        <div class="health-item">
                            <span class="health-label">API Response</span>
                            <span class="badge badge-success">Normal</span>
                        </div>
                        <div class="health-item">
                            <span class="health-label">Storage</span>
                            <span class="badge badge-warning">75% Used</span>
                        </div>
                        <div class="health-item">
                            <span class="health-label">Active Sessions</span>
                            <span class="badge badge-info" id="activeSessions">0</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="location.href='/admin/users'">
                            <span class="action-icon">👤</span>
                            <span>Manage Users</span>
                        </button>
                        <button class="action-btn" onclick="location.href='/admin/courses'">
                            <span class="action-icon">📚</span>
                            <span>Manage Courses</span>
                        </button>
                        <button class="action-btn" onclick="location.href='/admin/reports'">
                            <span class="action-icon">📊</span>
                            <span>View Reports</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/admin-dashboard.js'/>"></script>
</body>
</html>
