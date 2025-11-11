<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assignments - EduNex LMS</title>
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
                <li class="nav-item"><a href="/student/assignments" class="nav-link active"><i class="fas fa-tasks"></i> Assignments</a></li>
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

    <main class="main-content">
        <div class="container">
            <div class="page-header">
                <h1>My Assignments</h1>
                <p>Manage and submit your course assignments</p>
            </div>

            <!-- Filter Section -->
            <div class="filter-section">
                <select id="courseFilter" class="form-control" onchange="filterAssignments()">
                    <option value="">All Courses</option>
                </select>
                <select id="statusFilter" class="form-control" onchange="filterAssignments()">
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="LATE_SUBMISSION">Late</option>
                    <option value="GRADED">Graded</option>
                </select>
            </div>

            <!-- Assignments Grid -->
            <div class="assignments-grid" id="assignmentsGrid">
                <!-- Assignments will be loaded here -->
            </div>
        </div>
    </main>

    <!-- Submit Assignment Modal -->
    <div id="submitModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeSubmitModal()">&times;</span>
            <h2>Submit Assignment</h2>
            <form id="submitForm" onsubmit="submitAssignment(event)">
                <input type="hidden" id="assignmentId">
                
                <div class="form-group">
                    <label>Assignment:</label>
                    <p id="assignmentTitle" class="form-text"></p>
                </div>

                <div class="form-group">
                    <label>Course:</label>
                    <p id="assignmentCourse" class="form-text"></p>
                </div>

                <div class="form-group">
                    <label>Due Date:</label>
                    <p id="assignmentDueDate" class="form-text"></p>
                </div>

                <div class="form-group">
                    <label for="submissionFile">Upload File: *</label>
                    <input type="file" id="submissionFile" class="form-control" required>
                    <small>Accepted formats: PDF, DOC, DOCX, ZIP (Max 10MB)</small>
                </div>

                <div class="form-group">
                    <label for="submissionNotes">Notes (Optional):</label>
                    <textarea id="submissionNotes" class="form-control" rows="4" 
                              placeholder="Add any notes for your instructor..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeSubmitModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit Assignment</button>
                </div>
            </form>
        </div>
    </div>

    <!-- View Assignment Modal -->
    <div id="viewModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeViewModal()">&times;</span>
            <h2 id="viewTitle"></h2>
            
            <div class="assignment-details">
                <div class="detail-row">
                    <strong>Course:</strong>
                    <span id="viewCourse"></span>
                </div>
                <div class="detail-row">
                    <strong>Due Date:</strong>
                    <span id="viewDueDate"></span>
                </div>
                <div class="detail-row">
                    <strong>Total Points:</strong>
                    <span id="viewTotalPoints"></span>
                </div>
                <div class="detail-row">
                    <strong>Status:</strong>
                    <span id="viewStatus" class="badge"></span>
                </div>
                <div class="detail-row">
                    <strong>Your Grade:</strong>
                    <span id="viewGrade"></span>
                </div>
            </div>

            <div class="assignment-description">
                <h3>Description</h3>
                <p id="viewDescription"></p>
            </div>

            <div class="submission-info" id="submissionInfo" style="display: none;">
                <h3>Your Submission</h3>
                <div class="detail-row">
                    <strong>Submitted:</strong>
                    <span id="submittedDate"></span>
                </div>
                <div class="detail-row">
                    <strong>File:</strong>
                    <a id="submittedFile" href="#" target="_blank">Download</a>
                </div>
                <div class="detail-row" id="feedbackRow" style="display: none;">
                    <strong>Feedback:</strong>
                    <p id="feedbackText"></p>
                </div>
            </div>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script src="/js/assignments.js"></script>
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
