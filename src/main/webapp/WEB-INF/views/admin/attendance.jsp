<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance Management - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/admin/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/admin/users" class="nav-link"><i class="fas fa-users"></i> Users</a></li>
                <li class="nav-item"><a href="/admin/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/admin/attendance" class="nav-link active"><i class="fas fa-clipboard-check"></i> Attendance</a></li>
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

    <div class="container" style="padding: 2rem;">
        <div class="page-header" style="padding: 1.5rem;">
            <h1><i class="fas fa-clipboard-check"></i> Attendance Management</h1>
            <p>View and manage student attendance records</p>
        </div>

        <!-- Filter Section -->
        <div class="dashboard-card" style="padding: 1.5rem; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;"><i class="fas fa-filter"></i> Filter Attendance</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div class="form-group">
                    <label for="filterCourse">Select Course</label>
                    <select id="filterCourse" class="form-control">
                        <option value="">All Courses</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="filterDate">Select Date</label>
                    <input type="date" id="filterDate" class="form-control">
                </div>
                <div class="form-group">
                    <label>&nbsp;</label>
                    <button onclick="filterAttendance()" class="btn btn-primary">
                        <i class="fas fa-search"></i> Filter
                    </button>
                </div>
            </div>
        </div>

        <!-- Attendance Records -->
        <div class="dashboard-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3><i class="fas fa-list"></i> Attendance Records</h3>
            </div>
            <div id="attendanceContainer"></div>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script src="/js/admin-dashboard.js"></script>
    <script>
        let allCourses = [];
        let currentCourseId = null;
        let currentDate = new Date().toISOString().split('T')[0];

        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('filterDate').value = currentDate;
            loadCourses();
            loadAllAttendance();
        });

        async function loadCourses() {
            try {
                const response = await apiCall('/api/admin/courses', 'GET');
                allCourses = response;
                
                const select = document.getElementById('filterCourse');
                allCourses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.id;
                    option.textContent = `${course.courseCode} - ${course.courseName}`;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading courses:', error);
                showNotification('Failed to load courses', 'error');
            }
        }

        async function filterAttendance() {
            const courseId = document.getElementById('filterCourse').value;
            const date = document.getElementById('filterDate').value;
            
            currentCourseId = courseId || null;
            currentDate = date;

            if (courseId && date) {
                await loadAttendanceByDate(courseId, date);
            } else if (courseId) {
                await loadAttendanceByCourse(courseId);
            } else {
                await loadAllAttendance();
            }
        }

        async function loadAllAttendance() {
            try {
                const container = document.getElementById('attendanceContainer');
                container.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i></div>';
                
                // Load attendance for all courses
                let allAttendance = [];
                for (const course of allCourses) {
                    const response = await apiCall(`/api/attendance/course/${course.id}`, 'GET');
                    allAttendance = allAttendance.concat(response.map(a => ({...a, courseName: course.courseName, courseCode: course.courseCode})));
                }
                
                displayAttendance(allAttendance);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('attendanceContainer').innerHTML = '<div class="empty-state"><p>Failed to load attendance</p></div>';
            }
        }

        async function loadAttendanceByCourse(courseId) {
            try {
                const container = document.getElementById('attendanceContainer');
                container.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i></div>';
                
                const attendance = await apiCall(`/api/attendance/course/${courseId}`, 'GET');
                const course = allCourses.find(c => c.id == courseId);
                const enriched = attendance.map(a => ({...a, courseName: course.courseName, courseCode: course.courseCode}));
                
                displayAttendance(enriched);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('attendanceContainer').innerHTML = '<div class="empty-state"><p>Failed to load attendance</p></div>';
            }
        }

        async function loadAttendanceByDate(courseId, date) {
            try {
                const container = document.getElementById('attendanceContainer');
                container.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i></div>';
                
                const attendance = await apiCall(`/api/attendance/course/${courseId}/date/${date}`, 'GET');
                const course = allCourses.find(c => c.id == courseId);
                const enriched = attendance.map(a => ({...a, courseName: course.courseName, courseCode: course.courseCode}));
                
                displayAttendance(enriched);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('attendanceContainer').innerHTML = '<div class="empty-state"><p>Failed to load attendance</p></div>';
            }
        }

        function displayAttendance(attendance) {
            const container = document.getElementById('attendanceContainer');
            
            if (!attendance || attendance.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-check"></i>
                        <p>No attendance records found</p>
                    </div>`;
                return;
            }

            let tableHTML = '<table class="data-table"><thead><tr>';
            tableHTML += '<th><i class="fas fa-user"></i> Student</th>';
            tableHTML += '<th><i class="fas fa-book"></i> Course</th>';
            tableHTML += '<th><i class="fas fa-calendar"></i> Date</th>';
            tableHTML += '<th><i class="fas fa-check-circle"></i> Status</th>';
            tableHTML += '<th><i class="fas fa-comment"></i> Remarks</th>';
            tableHTML += '<th><i class="fas fa-user-tie"></i> Marked By</th>';
            tableHTML += '</tr></thead><tbody>';
            
            attendance.forEach(record => {
                tableHTML += '<tr>';
                tableHTML += '<td>' + (record.student?.fullName || 'N/A') + '</td>';
                tableHTML += '<td>' + (record.courseCode || '') + ' - ' + (record.courseName || 'N/A') + '</td>';
                tableHTML += '<td>' + formatDate(record.attendanceDate) + '</td>';
                tableHTML += '<td><span class="badge badge-' + getStatusColor(record.status) + '">' + record.status + '</span></td>';
                tableHTML += '<td>' + (record.remarks || '-') + '</td>';
                tableHTML += '<td>' + (record.markedBy?.fullName || 'System') + '</td>';
                tableHTML += '</tr>';
            });
            
            tableHTML += '</tbody></table>';
            
            container.innerHTML = tableHTML;
        }

        function getStatusColor(status) {
            switch(status) {
                case 'PRESENT': return 'success';
                case 'ABSENT': return 'danger';
                case 'LATE': return 'warning';
                case 'EXCUSED': return 'info';
                default: return 'secondary';
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    </script>
</body>
</html>
