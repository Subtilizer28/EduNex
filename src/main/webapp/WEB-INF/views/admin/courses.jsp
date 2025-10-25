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
                                <td>${course.instructor ? course.instructor.firstName + ' ' + course.instructor.lastName : 'N/A'}</td>
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
                `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A';
            const enrollments = course.enrollments ? course.enrollments.length : 0;

            alert(`Course Details:\n\nName: ${course.courseName}\nCode: ${course.courseCode}\nInstructor: ${instructor}\nEnrollments: ${enrollments}\nDescription: ${course.description || 'N/A'}\nCreated: ${formatDate(course.createdAt)}`);
        }

        function viewEnrollments(courseId) {
            const course = allCourses.find(c => c.id === courseId);
            if (!course || !course.enrollments || course.enrollments.length === 0) {
                alert('No enrollments found for this course.');
                return;
            }

            let enrollmentList = `Enrollments for ${course.courseName}:\n\n`;
            course.enrollments.forEach((enrollment, index) => {
                const student = enrollment.student;
                enrollmentList += `${index + 1}. ${student.firstName} ${student.lastName} (${student.email})\n`;
            });

            alert(enrollmentList);
        }
    </script>
</body>
</html>
