<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assignments - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<c:url value='/css/style.css'/>">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/instructor/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/instructor/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/instructor/assignments" class="nav-link active"><i class="fas fa-tasks"></i> Assignments</a></li>
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
                    <h1>Assignments</h1>
                    <p>Manage assignments for your courses</p>
                </div>
                <button class="btn btn-primary" onclick="openCreateAssignmentModal()">
                    + Create Assignment
                </button>
            </div>

            <div class="dashboard-card" style="padding: 1.5rem; margin-top: 1rem;">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Course</th>
                                <th>Due Date</th>
                                <th>Max Points</th>
                                <th>Submissions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="assignmentsList">
                            <!-- Assignments will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <!-- Create Assignment Modal -->
    <div id="createAssignmentModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeCreateAssignmentModal()">&times;</span>
            <h2>Create New Assignment</h2>
            <form id="createAssignmentForm" style="padding: 1rem 0;">
                <div class="form-group">
                    <label for="assignmentCourse">Select Course</label>
                    <select id="assignmentCourse" name="courseId" required>
                        <option value="">-- Select Course --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="assignmentTitle">Assignment Title</label>
                    <input type="text" id="assignmentTitle" name="title" required>
                </div>
                <div class="form-group">
                    <label for="assignmentDescription">Description</label>
                    <textarea id="assignmentDescription" name="description" rows="4" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="assignmentMaxPoints">Max Points</label>
                        <input type="number" id="assignmentMaxPoints" name="maxPoints" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="assignmentDueDate">Due Date</label>
                        <input type="datetime-local" id="assignmentDueDate" name="dueDate" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Create Assignment</button>
            </form>
        </div>
    </div>

    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/instructor.js'/>"></script>
    <script>
        if (checkAuth()) {
            const user = getCurrentUser();
            if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
                alert('Access denied. Instructor privileges required.');
                window.location.href = '/';
            }
        }
    </script>
</body>
</html>
