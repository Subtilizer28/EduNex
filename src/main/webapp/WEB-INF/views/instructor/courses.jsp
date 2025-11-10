<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Courses - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<c:url value='/css/style.css'/>">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/instructor/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/instructor/courses" class="nav-link active"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/instructor/assignments" class="nav-link"><i class="fas fa-tasks"></i> Assignments</a></li>
                <li class="nav-item"><a href="/instructor/quizzes" class="nav-link"><i class="fas fa-clipboard-check"></i> Quizzes</a></li>
                <li class="nav-item"><a href="/instructor/attendance" class="nav-link"><i class="fas fa-user-check"></i> Attendance</a></li>
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
            <div class="page-header" style="padding: 1.5rem 0;">
                <div>
                    <h1>My Courses</h1>
                    <p>Manage all your courses</p>
                </div>
                <button class="btn btn-primary" onclick="openCreateCourseModal()">
                    + Create Course
                </button>
            </div>

            <div class="dashboard-card" style="padding: 1.5rem; margin-top: 1rem;">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Credits</th>
                                <th>Students</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="coursesList">
                            <!-- Courses will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Create Course Modal -->
    <div id="createCourseModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeCreateCourseModal()">&times;</span>
            <h2>Create New Course</h2>
            <form id="createCourseForm" style="padding: 1rem 0;">
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

    <!-- View/Edit Course Modal -->
    <div id="viewEditCourseModal" class="modal">
        <div class="modal-content" style="max-width: 700px;">
            <span class="close" onclick="closeViewEditCourseModal()">&times;</span>
            <h2 id="viewEditModalTitle">Course Details</h2>
            <div id="viewEditCourseContent">
                <!-- Course details and edit form will be loaded here -->
            </div>
        </div>
    </div>

    <!-- Bulk Enrollment Modal -->
    <div id="bulkEnrollModal" class="modal" style="display: none;">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>Bulk Enroll Students</h3>
                <span class="close" onclick="closeBulkEnrollModal()">&times;</span>
            </div>
            <div class="modal-body">
                <p><strong>Course:</strong> <span id="bulkEnrollCourseName"></span></p>
                <form id="bulkEnrollForm" onsubmit="event.preventDefault(); submitBulkEnroll();">
                    <div class="form-group">
                        <label for="usnPrefix">USN Prefix:</label>
                        <input type="text" id="usnPrefix" class="form-control" 
                               placeholder="e.g., NNM23CS" required 
                               style="text-transform: uppercase;">
                        <small class="form-text text-muted">
                            The prefix part of the USN (e.g., NNM23CS)
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="startRange">Start Range:</label>
                        <input type="number" id="startRange" class="form-control" 
                               placeholder="e.g., 0" required min="0" max="999">
                        <small class="form-text text-muted">
                            Starting number (will be zero-padded to 3 digits)
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="endRange">End Range:</label>
                        <input type="number" id="endRange" class="form-control" 
                               placeholder="e.g., 360" required min="0" max="999">
                        <small class="form-text text-muted">
                            Ending number (inclusive, max 500 students per batch)
                        </small>
                    </div>
                    <div class="form-group">
                        <small class="form-text text-muted">
                            <strong>Example:</strong> Prefix "NNM23CS" with range 0-360 will enroll students with USNs: NNM23CS000, NNM23CS001, ..., NNM23CS360
                        </small>
                    </div>
                </form>
                <div id="bulkEnrollResult" style="display: none; margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeBulkEnrollModal()">Close</button>
                <button type="button" id="submitBulkEnroll" class="btn btn-success" onclick="submitBulkEnroll()">Enroll Students</button>
            </div>
        </div>
    </div>

    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/instructor.js'/>"></script>
</body>
</html>

