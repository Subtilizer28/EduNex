<%@ page isELIgnored="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Management - EduNex LMS</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/admin/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/admin/users" class="nav-link"><i class="fas fa-users"></i> Users</a></li>
                <li class="nav-item"><a href="/admin/courses" class="nav-link active"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/admin/attendance" class="nav-link"><i class="fas fa-clipboard-check"></i> Attendance</a></li>
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

    <div class="container">
        <div class="page-header">
            <h1><i class="fas fa-book"></i> Course Management</h1>
            <p>Overview and management of all courses</p>
        </div>

        <div class="filter-section">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search courses..." oninput="filterCourses()">
            </div>
        </div>

        <div id="coursesGrid">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading courses...
            </div>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script src="/js/auth.js"></script>
    <script src="/js/admin-dashboard.js"></script>
    <script>
        // Check authentication and admin role
        if (checkAuth()) {
            const user = getCurrentUser();
            if (user.role !== 'ADMIN') {
                alert('Access denied. Admin privileges required.');
                window.location.href = '/';
            }
        }

        // Load courses on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadAllCourses();
        });

        let allCourses = [];

        async function loadAllCourses() {
            try {
                const response = await apiCall('/api/admin/courses');
                allCourses = response;
                displayCourses(allCourses);
            } catch (error) {
                console.error('Error loading courses:', error);
                document.getElementById('coursesGrid').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i> Failed to load courses. ${error.message}
                    </div>`;
            }
        }

        function displayCourses(courses) {
            const container = document.getElementById('coursesGrid');
            
            if (!courses || courses.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-book"></i>
                        <p>No courses found</p>
                    </div>`;
                return;
            }

            const table = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th><i class="fas fa-hashtag"></i> ID</th>
                            <th><i class="fas fa-book"></i> Course Name</th>
                            <th><i class="fas fa-user-tie"></i> Instructor</th>
                            <th><i class="fas fa-users"></i> Enrollments</th>
                            <th><i class="fas fa-calendar"></i> Created</th>
                            <th><i class="fas fa-cog"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${courses.map(course => `
                            <tr>
                                <td>${course.id}</td>
                                <td>
                                    <strong>${course.courseName}</strong>
                                    <br>
                                    <small style="color: #666;">${course.courseCode}</small>
                                </td>
                                <td>${course.instructor ? course.instructor.fullName : 'N/A'}</td>
                                <td>
                                    <span class="badge badge-info">
                                        ${course.enrollments ? course.enrollments.length : 0} students
                                    </span>
                                </td>
                                <td>${formatDate(course.createdAt)}</td>
                                <td class="action-buttons">
                                    <button onclick="viewCourseDetails(${course.id})" 
                                            class="btn btn-sm btn-info"
                                            title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button onclick="viewEnrollments(${course.id})" 
                                            class="btn btn-sm btn-primary"
                                            title="View Enrollments">
                                        <i class="fas fa-users"></i>
                                    </button>
                                    <button onclick="openBulkEnrollModal(${course.id}, '${course.courseName}')" 
                                            class="btn btn-sm btn-success"
                                            title="Bulk Enroll">
                                        <i class="fas fa-user-plus"></i> Bulk
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            container.innerHTML = table;
        }

        function filterCourses() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();

            let filtered = allCourses.filter(course => {
                const matchesSearch = !searchInput || 
                    course.courseName.toLowerCase().includes(searchInput) ||
                    course.courseCode.toLowerCase().includes(searchInput) ||
                    (course.description && course.description.toLowerCase().includes(searchInput));
                
                return matchesSearch;
            });

            displayCourses(filtered);
        }

        function viewCourseDetails(courseId) {
            const course = allCourses.find(c => c.id === courseId);
            if (!course) return;

            const instructor = course.instructor ? 
                course.instructor.fullName : 'N/A';
            const enrollments = course.enrollments ? course.enrollments.length : 0;

            alert(`Course Details:\n\nName: ${course.courseName}\nCode: ${course.courseCode}\nInstructor: ${instructor}\nEnrollments: ${enrollments}\nDescription: ${course.description || 'N/A'}\nCreated: ${formatDate(course.createdAt)}`);
        }

        function viewEnrollments(courseId) {
            const course = allCourses.find(c => c.id === courseId);
            if (!course || !course.enrollments || course.enrollments.length === 0) {
                alert('No enrollments found for this course.');
                return;
            }

            let enrollmentList = 'Enrollments for ' + course.courseName + ':\n\n';
            course.enrollments.forEach((enrollment, index) => {
                const student = enrollment.student;
                const usn = student.usn ? ' [' + student.usn + ']' : '';
                enrollmentList += (index + 1) + '. ' + student.fullName + usn + ' (' + student.email + ')\n';
            });


            alert(enrollmentList);
        }

        let currentCourseId = null;
        let currentCourseName = '';

        function openBulkEnrollModal(courseId, courseName) {
            currentCourseId = courseId;
            currentCourseName = courseName;
            document.getElementById('bulkEnrollCourseName').textContent = courseName;
            document.getElementById('bulkEnrollModal').style.display = 'block';
            document.getElementById('bulkEnrollResult').style.display = 'none';
            document.getElementById('bulkEnrollForm').reset();
        }

        function closeBulkEnrollModal() {
            document.getElementById('bulkEnrollModal').style.display = 'none';
            currentCourseId = null;
            currentCourseName = '';
        }

        function submitBulkEnroll() {
            const prefix = document.getElementById('usnPrefix').value.trim();
            const startRange = parseInt(document.getElementById('startRange').value);
            const endRange = parseInt(document.getElementById('endRange').value);

            if (!prefix) {
                alert('Please enter a USN prefix');
                return;
            }

            if (isNaN(startRange) || isNaN(endRange)) {
                alert('Please enter valid start and end range numbers');
                return;
            }

            if (startRange > endRange) {
                alert('Start range must be less than or equal to end range');
                return;
            }

            if (endRange - startRange > 500) {
                alert('Range cannot exceed 500 students. Please use smaller batches.');
                return;
            }

            const submitBtn = document.getElementById('submitBulkEnroll');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enrolling...';

            fetch('/api/enrollments/bulk-enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    courseId: currentCourseId,
                    prefix: prefix,
                    startRange: startRange,
                    endRange: endRange
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enroll Students';

                const resultDiv = document.getElementById('bulkEnrollResult');
                resultDiv.style.display = 'block';
                
                let resultHtml = '<h4>Bulk Enrollment Results</h4>';
                resultHtml += '<p><strong>Course:</strong> ' + currentCourseName + '</p>';
                resultHtml += '<p><strong>Total Enrolled:</strong> ' + data.enrolledCount + '</p>';
                resultHtml += '<p><strong>Already Enrolled:</strong> ' + data.alreadyEnrolledCount + '</p>';
                resultHtml += '<p><strong>Failed:</strong> ' + data.failedCount + '</p>';

                if (data.failed && data.failed.length > 0) {
                    resultHtml += '<h5>Failed Enrollments:</h5><ul>';
                    data.failed.forEach(fail => {
                        resultHtml += '<li>' + fail.usn + ': ' + fail.reason + '</li>';
                    });
                    resultHtml += '</ul>';
                }

                resultDiv.innerHTML = resultHtml;
                document.getElementById('bulkEnrollForm').reset();
                
                // Reload courses to update enrollment counts
                loadAllCourses();
            })
            .catch(error => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enroll Students';
                console.error('Error:', error);
                alert('Failed to process bulk enrollment. Please try again.');
            });
        }
    </script>

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

    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 0;
            border: 1px solid #888;
            border-radius: 8px;
            max-width: 500px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .modal-header {
            padding: 20px;
            background-color: var(--primary-color, #4CAF50);
            color: white;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }

        .modal-body {
            padding: 20px;
        }

        .modal-footer {
            padding: 15px 20px;
            background-color: #f8f9fa;
            border-radius: 0 0 8px 8px;
            text-align: right;
        }

        .close {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            background: none;
            border: none;
        }

        .close:hover,
        .close:focus {
            opacity: 0.8;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }

        .form-control {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .form-text {
            display: block;
            margin-top: 0.25rem;
            font-size: 0.875rem;
            color: #6c757d;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }

        .btn-secondary {
            background-color: #6c757d;
            color: white;
        }

        .btn-success {
            background-color: #28a745;
            color: white;
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    </style>
</body>
</html>

