<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instructor Dashboard - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<c:url value='/css/style.css'/>">
</head>
<body>
    <nav class="navbar">
        <div class="container nav-container">
            <a href="/" class="logo">EduNex</a>
            <ul class="nav-menu">
                <li><a href="/instructor/dashboard" class="active">Dashboard</a></li>
                <li><a href="/instructor/courses">My Courses</a></li>
                <li><a href="/instructor/students">Students</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="#" id="logoutBtn">Logout</a></li>
            </ul>
        </div>
    </nav>

    <main class="dashboard">
        <div class="container">
            <div class="dashboard-header">
                <div>
                    <h1>Instructor Dashboard</h1>
                    <p>Welcome back, <span id="userName">Instructor</span>!</p>
                </div>
                <button class="btn btn-primary" onclick="openCreateCourseModal()">
                    + Create Course
                </button>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <h3 id="totalCourses">0</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3 id="totalStudents">0</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📝</div>
                    <div class="stat-content">
                        <h3 id="pendingGrading">0</h3>
                        <p>Pending Grading</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-content">
                        <h3 id="avgRating">0.0</h3>
                        <p>Average Rating</p>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="dashboard-grid">
                <!-- My Courses -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2>My Courses</h2>
                        <a href="/instructor/courses" class="btn-link">View All</a>
                    </div>
                    <div class="courses-list" id="coursesList">
                        <!-- Courses will be loaded here -->
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="dashboard-card">
                    <div class="card-header">
                        <h2>Recent Activity</h2>
                    </div>
                    <div class="activity-list" id="activityList">
                        <!-- Activity will be loaded here -->
                    </div>
                </div>

                <!-- Pending Assignments -->
                <div class="dashboard-card full-width">
                    <div class="card-header">
                        <h2>Assignments to Grade</h2>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Assignment</th>
                                    <th>Submitted</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="pendingAssignments">
                                <!-- Assignments will be loaded here -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Student Performance Chart -->
                <div class="dashboard-card full-width">
                    <div class="card-header">
                        <h2>Student Performance Overview</h2>
                    </div>
                    <canvas id="performanceChart"></canvas>
                </div>
            </div>
        </div>
    </main>

    <!-- Create Course Modal -->
    <div id="createCourseModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeCreateCourseModal()">&times;</span>
            <h2>Create New Course</h2>
            <form id="createCourseForm">
                <div class="form-group">
                    <label for="courseName">Course Name</label>
                    <input type="text" id="courseName" name="courseName" required>
                </div>
                <div class="form-group">
                    <label for="courseCode">Course Code</label>
                    <input type="text" id="courseCode" name="courseCode" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" rows="4" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="credits">Credits</label>
                        <input type="number" id="credits" name="credits" min="1" max="6" required>
                    </div>
                    <div class="form-group">
                        <label for="maxStudents">Max Students</label>
                        <input type="number" id="maxStudents" name="maxStudents" min="1" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="startDate">Start Date</label>
                        <input type="date" id="startDate" name="startDate" required>
                    </div>
                    <div class="form-group">
                        <label for="endDate">End Date</label>
                        <input type="date" id="endDate" name="endDate" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Create Course</button>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/instructor-dashboard.js'/>"></script>
</body>
</html>
