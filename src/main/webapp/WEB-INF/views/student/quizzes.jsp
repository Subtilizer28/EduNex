<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quizzes - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
        <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/student/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/student/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/student/assignments" class="nav-link"><i class="fas fa-tasks"></i> Assignments</a></li>
                <li class="nav-item"><a href="/student/quizzes" class="nav-link active"><i class="fas fa-clipboard-check"></i> Quizzes</a></li>
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

    <main class="main-content">
        <div class="container">
            <div class="page-header">
                <h1>My Quizzes</h1>
                <p>View and take available quizzes</p>
            </div>

            <!-- Filter Section -->
            <div class="filter-section">
                <select id="courseFilter" class="form-control" onchange="filterQuizzes()">
                    <option value="">All Courses</option>
                </select>
                <select id="statusFilter" class="form-control" onchange="filterQuizzes()">
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <!-- Quizzes Grid -->
            <div class="quizzes-grid" id="quizzesGrid">
                <!-- Quizzes will be loaded here -->
            </div>
        </div>
    </main>

    <!-- Quiz Taking Modal -->
    <div id="quizModal" class="modal">
        <div class="modal-content modal-large">
            <div class="quiz-header">
                <h2 id="quizTitle"></h2>
                <div class="quiz-timer" id="quizTimer">
                    <span>⏱️ Time Remaining: </span>
                    <span id="timerDisplay">00:00</span>
                </div>
            </div>
            
            <form id="quizForm" onsubmit="submitQuiz(event)">
                <input type="hidden" id="quizId">
                <input type="hidden" id="attemptId">
                
                <div id="questionsContainer">
                    <!-- Questions will be loaded here -->
                </div>

                <div class="quiz-footer">
                    <button type="button" class="btn btn-secondary" onclick="saveProgress()">
                        Save Progress
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Submit Quiz
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Quiz Results Modal -->
    <div id="resultsModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeResultsModal()">&times;</span>
            <h2>Quiz Results</h2>
            
            <div class="results-summary">
                <div class="result-card">
                    <h3 id="resultScore"></h3>
                    <p>Your Score</p>
                </div>
                <div class="result-card">
                    <h3 id="resultPercentage"></h3>
                    <p>Percentage</p>
                </div>
                <div class="result-card">
                    <h3 id="resultStatus"></h3>
                    <p>Status</p>
                </div>
            </div>

            <div class="results-details" id="resultsDetails">
                <!-- Detailed results will be shown here -->
            </div>

            <div class="form-actions">
                <button class="btn btn-primary" onclick="closeResultsModal()">Close</button>
            </div>
        </div>
    </div>

    <!-- Quiz Info Modal -->
    <div id="infoModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeInfoModal()">&times;</span>
            <h2 id="infoTitle"></h2>
            
            <div class="quiz-info">
                <div class="info-row">
                    <strong>Course:</strong>
                    <span id="infoCourse"></span>
                </div>
                <div class="info-row">
                    <strong>Duration:</strong>
                    <span id="infoDuration"></span>
                </div>
                <div class="info-row">
                    <strong>Total Marks:</strong>
                    <span id="infoTotalMarks"></span>
                </div>
                <div class="info-row">
                    <strong>Passing Marks:</strong>
                    <span id="infoPassingMarks"></span>
                </div>
                <div class="info-row">
                    <strong>Total Questions:</strong>
                    <span id="infoQuestions"></span>
                </div>
                <div class="info-row">
                    <strong>Attempts Left:</strong>
                    <span id="infoAttempts"></span>
                </div>
            </div>

            <div class="quiz-description">
                <h3>Instructions</h3>
                <p id="infoDescription"></p>
            </div>

            <div class="form-actions">
                <button class="btn btn-secondary" onclick="closeInfoModal()">Cancel</button>
                <button class="btn btn-primary" onclick="startQuiz()">Start Quiz</button>
            </div>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script src="/js/quizzes.js"></script>
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
