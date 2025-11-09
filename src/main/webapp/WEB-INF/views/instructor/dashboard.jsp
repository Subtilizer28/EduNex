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
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/instructor/dashboard" class="nav-link active"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/instructor/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
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
            <div class="dashboard-header" style="padding: 1.5rem 0;">
                <div>
                    <h1>Instructor Dashboard</h1>
                    <p>Welcome back, <span id="userName">Instructor</span>!</p>
                </div>
                <button class="btn btn-primary" onclick="openCreateCourseModal()">
                    + Create Course
                </button>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid" style="padding: 1rem 0;">
                <div class="stat-card" style="padding: 1.5rem;">
                    <div class="stat-icon">📚</div>
                    <div class="stat-content">
                        <h3 id="totalCourses">0</h3>
                        <p>Total Courses</p>
                    </div>
                </div>
                <div class="stat-card" style="padding: 1.5rem;">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3 id="totalStudents">0</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                <div class="stat-card" style="padding: 1.5rem;">
                    <div class="stat-icon">📝</div>
                    <div class="stat-content">
                        <h3 id="pendingGrading">0</h3>
                        <p>Pending Grading</p>
                    </div>
                </div>
                <div class="stat-card" style="padding: 1.5rem;">
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
                <div class="dashboard-card" style="grid-column: 1 / -1; padding: 1.5rem;">
                    <div class="card-header" style="padding-bottom: 1rem;">
                        <h2>My Courses</h2>
                        <a href="/instructor/courses" class="btn btn-sm btn-primary">View All</a>
                    </div>
                    <div class="card-content">
                        <div class="courses-list" id="coursesList">
                            <!-- Courses will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="dashboard-card" style="grid-column: 1 / -1; padding: 1.5rem;">
                    <div class="card-header" style="padding-bottom: 1rem;">
                        <h2>Recent Activity</h2>
                    </div>
                    <div class="card-content">
                        <div class="activity-list" id="activityList">
                            <!-- Activity will be loaded here -->
                        </div>
                    </div>
                </div>

                <!-- Pending Assignments -->
                <div class="dashboard-card" style="grid-column: 1 / -1; padding: 1.5rem;">
                    <div class="card-header" style="padding-bottom: 1rem;">
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

                <!-- Student Performance Chart - Big -->
                <div class="dashboard-card" style="grid-column: 1 / span 2; padding: 1.5rem;">
                    <div class="card-header" style="padding-bottom: 1rem;">
                        <h2>Student Performance Overview</h2>
                    </div>
                    <div style="padding: 1rem 0;">
                        <canvas id="performanceChart" style="max-height: 400px;"></canvas>
                    </div>
                </div>

                <!-- Course Distribution Chart - Small -->
                <div class="dashboard-card" style="padding: 1.5rem;">
                    <div class="card-header" style="padding-bottom: 1rem;">
                        <h2>Course Distribution</h2>
                    </div>
                    <div style="padding: 1rem 0;">
                        <canvas id="courseChart" style="max-height: 250px;"></canvas>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="dashboard-card" style="grid-column: 1 / -1; padding: 1.5rem;">
                    <div class="card-header" style="padding-bottom: 1rem;">
                        <h2>Quick Actions</h2>
                    </div>
                    <div class="quick-actions">
                        <button class="action-btn" onclick="openCreateCourseModal()">
                            <span class="action-icon">📚</span>
                            <span>Create Course</span>
                        </button>
                        <button class="action-btn" onclick="openCreateAssignmentModal()">
                            <span class="action-icon">📝</span>
                            <span>Create Assignment</span>
                        </button>
                        <button class="action-btn" onclick="openCreateQuizModal()">
                            <span class="action-icon">❓</span>
                            <span>Create Quiz</span>
                        </button>
                        <button class="action-btn" onclick="location.href='/instructor/courses'">
                            <span class="action-icon">👀</span>
                            <span>View All Courses</span>
                        </button>
                    </div>
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

    <!-- Create Quiz Modal -->
    <div id="createQuizModal" class="modal">
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="closeCreateQuizModal()">&times;</span>
            <h2>Create New Quiz</h2>
            <form id="createQuizForm" style="padding: 1rem 0;">
                <div class="form-group">
                    <label for="quizCourse">Select Course</label>
                    <select id="quizCourse" name="courseId" required>
                        <option value="">-- Select Course --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quizTitle">Quiz Title</label>
                    <input type="text" id="quizTitle" name="title" required>
                </div>
                <div class="form-group">
                    <label for="quizDescription">Description</label>
                    <textarea id="quizDescription" name="description" rows="3" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="quizDuration">Duration (minutes)</label>
                        <input type="number" id="quizDuration" name="duration" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="quizTotalPoints">Total Points</label>
                        <input type="number" id="quizTotalPoints" name="totalPoints" min="1" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Questions</label>
                    <div id="questionsContainer">
                        <!-- Questions will be added here -->
                    </div>
                    <button type="button" class="btn btn-secondary" onclick="addQuestion()" style="margin-top: 1rem;">
                        + Add Question
                    </button>
                </div>
                
                <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Create Quiz</button>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/instructor.js'/>"></script>
</body>
</html>
