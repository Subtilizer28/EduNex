<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Courses - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<c:url value='/css/style.css'/>">
</head>
<body>
    <nav class="navbar">
        <div class="container nav-container">
            <a href="/" class="logo">EduNex</a>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/courses" class="active">Courses</a></li>
                <li><a href="/student/dashboard">Dashboard</a></li>
                <li><a href="/profile">Profile</a></li>
                <li><a href="#" id="logoutBtn">Logout</a></li>
            </ul>
            <button class="theme-toggle" id="themeToggle">
                <span class="theme-icon">🌙</span>
            </button>
        </div>
    </nav>

    <main class="courses-page">
        <div class="container">
            <div class="page-header">
                <h1>Available Courses</h1>
                <p>Browse and enroll in courses</p>
            </div>

            <!-- Search and Filter -->
            <div class="search-section">
                <div class="search-bar">
                    <input type="text" id="searchInput" placeholder="Search courses..." class="search-input">
                    <button class="btn btn-primary" onclick="searchCourses()">Search</button>
                </div>
                <div class="filters">
                    <select id="filterCredits" class="filter-select">
                        <option value="">All Credits</option>
                        <option value="1">1 Credit</option>
                        <option value="2">2 Credits</option>
                        <option value="3">3 Credits</option>
                        <option value="4">4 Credits</option>
                    </select>
                    <select id="filterStatus" class="filter-select">
                        <option value="">All Status</option>
                        <option value="available">Available</option>
                        <option value="full">Full</option>
                    </select>
                </div>
            </div>

            <!-- Courses Grid -->
            <div class="courses-grid" id="coursesGrid">
                <!-- Courses will be loaded here -->
            </div>
        </div>
    </main>

    <!-- Course Details Modal -->
    <div id="courseModal" class="modal">
        <div class="modal-content modal-large">
            <span class="close" onclick="closeCourseModal()">&times;</span>
            <div id="courseDetails">
                <!-- Course details will be loaded here -->
            </div>
        </div>
    </div>

    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/courses.js'/>"></script>
</body>
</html>
