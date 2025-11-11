<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/instructor/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/instructor/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
                <li class="nav-item"><a href="/instructor/assignments" class="nav-link"><i class="fas fa-tasks"></i> Assignments</a></li>
                <li class="nav-item"><a href="/instructor/quizzes" class="nav-link"><i class="fas fa-clipboard-check"></i> Quizzes</a></li>
                <li class="nav-item"><a href="/instructor/attendance" class="nav-link active"><i class="fas fa-user-check"></i> Attendance</a></li>
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
            <p>Mark and track student attendance</p>
        </div>

        <!-- Course Selection -->
        <div class="dashboard-card" style="padding: 1.5rem; margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;"><i class="fas fa-book"></i> Select Course</h3>
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem;">
                <select id="courseSelect" class="form-control" onchange="loadCourseStudents()">
                    <option value="">-- Select a course --</option>
                </select>
                <button onclick="showMarkAttendanceModal()" class="btn btn-primary" id="markAttendanceBtn" disabled>
                    <i class="fas fa-clipboard-check"></i> Mark Attendance
                </button>
            </div>
        </div>

        <!-- Student List -->
        <div class="dashboard-card" style="padding: 1.5rem;" id="studentsSection" style="display: none;">
            <h3 style="margin-bottom: 1.5rem;"><i class="fas fa-users"></i> Enrolled Students</h3>
            <div id="studentsContainer"></div>
        </div>

        <!-- Attendance History -->
        <div class="dashboard-card" style="padding: 1.5rem; margin-top: 2rem;" id="historySection" style="display: none;">
            <h3 style="margin-bottom: 1.5rem;"><i class="fas fa-history"></i> Attendance History</h3>
            <div id="historyContainer"></div>
        </div>
    </div>

    <!-- Mark Attendance Modal -->
    <div id="markAttendanceModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeMarkAttendanceModal()">&times;</span>
            <h2><i class="fas fa-clipboard-check"></i> Mark Attendance</h2>
            <form id="markAttendanceForm" onsubmit="submitAttendance(event)">
                <div id="attendanceList"></div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeMarkAttendanceModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Attendance
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="/js/main.js"></script>
    <script>
        if (checkAuth()) {
            const user = getCurrentUser();
            if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
                alert('Access denied. Instructor privileges required.');
                window.location.href = '/';
            }
        }

        const currentUser = getCurrentUser();
        let currentCourse = null;
        let currentDate = null;        async function loadInstructorCourses() {
            try {
                const courses = await apiCall('/api/courses/instructor/' + currentUser.id, 'GET');
                const select = document.getElementById('courseSelect');
                
                courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.id;
                    option.textContent = course.courseCode + ' - ' + course.courseName;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading courses:', error);
                showNotification('Failed to load courses', 'error');
            }
        }

        async function loadCourseStudents() {
            const courseId = document.getElementById('courseSelect').value;
            if (!courseId) {
                document.getElementById('studentsSection').style.display = 'none';
                document.getElementById('historySection').style.display = 'none';
                document.getElementById('markAttendanceBtn').disabled = true;
                return;
            }

            try {
                currentCourse = courseId;
                document.getElementById('markAttendanceBtn').disabled = false;
                
                const enrollments = await apiCall('/api/enrollments/course/' + courseId, 'GET');
                enrolledStudents = enrollments.map(e => e.student);
                
                displayStudents(enrolledStudents);
                loadAttendanceHistory(courseId);
                
                document.getElementById('studentsSection').style.display = 'block';
                document.getElementById('historySection').style.display = 'block';
            } catch (error) {
                console.error('Error:', error);
                showNotification('Failed to load students', 'error');
            }
        }

        function displayStudents(students) {
            const container = document.getElementById('studentsContainer');
            
            if (!students || students.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No students enrolled</p></div>';
                return;
            }

            let tableHTML = '<table class="data-table"><thead><tr>';
            tableHTML += '<th><i class="fas fa-id-card"></i> USN</th>';
            tableHTML += '<th><i class="fas fa-user"></i> Name</th>';
            tableHTML += '<th><i class="fas fa-envelope"></i> Email</th>';
            tableHTML += '<th><i class="fas fa-chart-line"></i> Attendance Rate</th>';
            tableHTML += '</tr></thead><tbody>';
            
            students.forEach(student => {
                tableHTML += '<tr>';
                tableHTML += '<td>' + (student.usn || 'N/A') + '</td>';
                tableHTML += '<td>' + student.fullName + '</td>';
                tableHTML += '<td>' + student.email + '</td>';
                tableHTML += '<td id="rate-' + student.id + '">Loading...</td>';
                tableHTML += '</tr>';
            });
            
            tableHTML += '</tbody></table>';
            
            container.innerHTML = tableHTML;
            
            // Load attendance rates
            students.forEach(student => {
                loadAttendanceRate(student.id);
            });
        }

        async function loadAttendanceRate(studentId) {
            try {
                const data = await apiCall('/api/attendance/student/' + studentId + '/course/' + currentCourse + '/rate', 'GET');
                const cell = document.getElementById('rate-' + studentId);
                if (cell) {
                    cell.innerHTML = data.rate.toFixed(1) + '% (' + data.present + '/' + data.total + ')';
                }
            } catch (error) {
                const cell = document.getElementById('rate-' + studentId);
                if (cell) cell.innerHTML = 'N/A';
            }
        }

        async function loadAttendanceHistory(courseId) {
            try {
                const attendance = await apiCall('/api/attendance/course/' + courseId, 'GET');
                displayAttendanceHistory(attendance);
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('historyContainer').innerHTML = '<div class="empty-state"><p>Failed to load history</p></div>';
            }
        }

        function displayAttendanceHistory(attendance) {
            const container = document.getElementById('historyContainer');
            
            if (!attendance || attendance.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No attendance records yet</p></div>';
                return;
            }

            // Sort by date descending
            attendance.sort((a, b) => new Date(b.attendanceDate) - new Date(a.attendanceDate));

            let tableHTML = '<table class="data-table"><thead><tr>';
            tableHTML += '<th><i class="fas fa-id-card"></i> USN</th>';
            tableHTML += '<th><i class="fas fa-user"></i> Student</th>';
            tableHTML += '<th><i class="fas fa-calendar"></i> Date</th>';
            tableHTML += '<th><i class="fas fa-check-circle"></i> Status</th>';
            tableHTML += '<th><i class="fas fa-comment"></i> Remarks</th>';
            tableHTML += '</tr></thead><tbody>';
            
            attendance.forEach(record => {
                tableHTML += '<tr>';
                tableHTML += '<td>' + (record.student?.usn || 'N/A') + '</td>';
                tableHTML += '<td>' + (record.student?.fullName || 'N/A') + '</td>';
                tableHTML += '<td>' + formatDate(record.attendanceDate) + '</td>';
                tableHTML += '<td><span class="badge badge-' + getStatusColor(record.status) + '">' + record.status + '</span></td>';
                tableHTML += '<td>' + (record.remarks || '-') + '</td>';
                tableHTML += '</tr>';
            });
            
            tableHTML += '</tbody></table>';
            
            container.innerHTML = tableHTML;
        }

        function showMarkAttendanceModal() {
            if (!currentCourse || enrolledStudents.length === 0) {
                showNotification('Please select a course with enrolled students', 'error');
                return;
            }

            const list = document.getElementById('attendanceList');
            let listHTML = '';
            enrolledStudents.forEach(student => {
                listHTML += '<div class="attendance-item" style="display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 1rem; padding: 1rem; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 1rem;">';
                listHTML += '<div>';
                listHTML += '<strong>' + student.fullName + '</strong><br>';
                listHTML += '<small style="color: var(--text-secondary);">USN: ' + (student.usn || 'N/A') + '</small><br>';
                listHTML += '<small style="color: var(--text-secondary);">' + student.email + '</small>';
                listHTML += '</div>';
                listHTML += '<div class="form-group" style="margin: 0;">';
                listHTML += '<select class="form-control" id="status-' + student.id + '" required>';
                listHTML += '<option value="PRESENT">Present</option>';
                listHTML += '<option value="ABSENT">Absent</option>';
                listHTML += '<option value="LATE">Late</option>';
                listHTML += '<option value="EXCUSED">Excused</option>';
                listHTML += '</select>';
                listHTML += '</div>';
                listHTML += '<div class="form-group" style="margin: 0;">';
                listHTML += '<input type="text" class="form-control" id="remarks-' + student.id + '" placeholder="Remarks (optional)">';
                listHTML += '</div>';
                listHTML += '</div>';
            });
            list.innerHTML = listHTML;

            document.getElementById('markAttendanceModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeMarkAttendanceModal() {
            document.getElementById('markAttendanceModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        async function submitAttendance(event) {
            event.preventDefault();

            const attendanceList = enrolledStudents.map(student => ({
                studentId: student.id,
                status: document.getElementById('status-' + student.id).value,
                remarks: document.getElementById('remarks-' + student.id).value
            }));

            try {
                await apiCall('/api/attendance/mark-multiple', 'POST', {
                    courseId: currentCourse,
                    markedById: currentUser.id,
                    attendanceList: attendanceList
                });

                showNotification('Attendance marked successfully', 'success');
                closeMarkAttendanceModal();
                loadCourseStudents(); // Reload to refresh data
            } catch (error) {
                console.error('Error:', error);
                showNotification(error.message || 'Failed to mark attendance', 'error');
            }
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
