<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quizzes - EduNex LMS</title>
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
                <li class="nav-item"><a href="/instructor/assignments" class="nav-link"><i class="fas fa-tasks"></i> Assignments</a></li>
                <li class="nav-item"><a href="/instructor/quizzes" class="nav-link active"><i class="fas fa-clipboard-check"></i> Quizzes</a></li>
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
                    <h1>Quizzes</h1>
                    <p>Manage quizzes for your courses</p>
                </div>
                <button class="btn btn-primary" onclick="openCreateQuizModal()">
                    + Create Quiz
                </button>
            </div>

            <div class="dashboard-card" style="padding: 1.5rem; margin-top: 1rem;">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Course</th>
                                <th>Duration</th>
                                <th>Total Points</th>
                                <th>Questions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="quizzesList">
                            <!-- Quizzes will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

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

    <script src="<c:url value='/js/main.js'/>"></script>
    <script src="<c:url value='/js/auth.js'/>"></script>
    <script src="<c:url value='/js/instructor.js'/>"></script>
</body>
</html>
