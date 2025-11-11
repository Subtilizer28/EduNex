<%@ page isELIgnored="true" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management - EduNex LMS</title>
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu">
                <li class="nav-item"><a href="/admin/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item"><a href="/admin/users" class="nav-link active"><i class="fas fa-users"></i> Users</a></li>
                <li class="nav-item"><a href="/admin/courses" class="nav-link"><i class="fas fa-book"></i> Courses</a></li>
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
            <h1><i class="fas fa-users"></i> User Management</h1>
            <p>Manage system users and their roles</p>
        </div>

        <div class="filter-section">
            <div class="filter-group">
                <label for="roleFilter"><i class="fas fa-filter"></i> Filter by Role:</label>
                <select id="roleFilter" onchange="filterUsers()">
                    <option value="">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="STUDENT">Student</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="statusFilter"><i class="fas fa-toggle-on"></i> Filter by Status:</label>
                <select id="statusFilter" onchange="filterUsers()">
                    <option value="">All Status</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search users..." oninput="filterUsers()">
            </div>
        </div>

        <div id="usersTable">
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading users...
            </div>
        </div>
    </div>

    <!-- User Details Modal -->
    <div id="userModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeUserModal()">&times;</span>
            <h2>User Details</h2>
            <div id="userDetailsContent"></div>
        </div>
    </div>

    <!-- Add to Course Modal -->
    <div id="addToCourseModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeAddToCourseModal()">&times;</span>
            <h2>Add Student to Course</h2>
            <div class="form-group">
                <label for="courseSelect">Select Course:</label>
                <select id="courseSelect" class="form-control">
                    <option value="">Loading courses...</option>
                </select>
            </div>
            <div class="form-group">
                <button onclick="addStudentToCourse()" class="btn btn-primary">Add to Course</button>
                <button onclick="closeAddToCourseModal()" class="btn btn-secondary">Cancel</button>
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

        // Load users on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadAllUsers();
        });

        let allUsers = [];

        async function loadAllUsers() {
            try {
                const response = await apiCall('/api/admin/users');
                allUsers = response;
                displayUsers(allUsers);
            } catch (error) {
                console.error('Error loading users:', error);
                document.getElementById('usersTable').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i> Failed to load users. ${error.message}
                    </div>`;
            }
        }

        function displayUsers(users) {
            const container = document.getElementById('usersTable');
            
            if (!users || users.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-users"></i>
                        <p>No users found</p>
                    </div>`;
                return;
            }

            const table = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th><i class="fas fa-hashtag"></i> ID</th>
                            <th><i class="fas fa-id-card"></i> USN</th>
                            <th><i class="fas fa-user"></i> Name</th>
                            <th><i class="fas fa-envelope"></i> Email</th>
                            <th><i class="fas fa-user-tag"></i> Role</th>
                            <th><i class="fas fa-toggle-on"></i> Status</th>
                            <th><i class="fas fa-calendar"></i> Created</th>
                            <th><i class="fas fa-cog"></i> Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.usn || '-'}</td>
                                <td>${user.fullName || 'N/A'}</td>
                                <td>${user.email}</td>
                                <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
                                <td>
                                    <span class="badge badge-${user.enabled ? 'success' : 'danger'}">
                                        ${user.enabled ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>${formatDate(user.createdAt)}</td>
                                <td class="action-buttons">
                                    <button onclick="viewUserDetails(${user.id})" 
                                            class="btn btn-sm btn-info"
                                            title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    ${user.role === 'STUDENT' ? `
                                    <button onclick="openAddToCourseModal(${user.id})" 
                                            class="btn btn-sm btn-primary"
                                            title="Add to Course">
                                        <i class="fas fa-plus"></i>
                                    </button>
                                    ` : ''}
                                    <button onclick="toggleUserStatus(${user.id}, ${user.enabled})" 
                                            class="btn btn-sm ${user.enabled ? 'btn-warning' : 'btn-success'}"
                                            title="${user.enabled ? 'Deactivate' : 'Activate'}">
                                        <i class="fas fa-${user.enabled ? 'ban' : 'check'}"></i>
                                    </button>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            container.innerHTML = table;
        }

        function filterUsers() {
            const roleFilter = document.getElementById('roleFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const searchInput = document.getElementById('searchInput').value.toLowerCase();

            let filtered = allUsers.filter(user => {
                const matchesRole = !roleFilter || user.role === roleFilter;
                const matchesStatus = !statusFilter || user.enabled.toString() === statusFilter;
                const matchesSearch = !searchInput || 
                    (user.fullName && user.fullName.toLowerCase().includes(searchInput)) ||
                    user.email.toLowerCase().includes(searchInput);
                
                return matchesRole && matchesStatus && matchesSearch;
            });

            displayUsers(filtered);
        }

        async function toggleUserStatus(userId, currentStatus) {
            const action = currentStatus ? 'deactivate' : 'activate';
            if (!confirm(`Are you sure you want to ${action} this user?`)) {
                return;
            }

            try {
                await apiCall(`/api/admin/users/${userId}/${action}`, {
                    method: 'PUT'
                });
                alert(`User ${action}d successfully`);
                loadAllUsers();
            } catch (error) {
                console.error(`Error ${action}ing user:`, error);
                alert(`Failed to ${action} user: ${error.message}`);
            }
        }

        function viewUserDetails(userId) {
            const user = allUsers.find(u => u.id === userId);
            if (!user) return;

            const content = `
                <div class="user-details-grid">
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-user"></i> Full Name:</span>
                        <span class="detail-value">${user.fullName || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-envelope"></i> Email:</span>
                        <span class="detail-value">${user.email}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-user-tag"></i> Username:</span>
                        <span class="detail-value">${user.username}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-user-shield"></i> Role:</span>
                        <span class="detail-value"><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-toggle-on"></i> Status:</span>
                        <span class="detail-value"><span class="badge badge-${user.enabled ? 'success' : 'danger'}">${user.enabled ? 'Active' : 'Inactive'}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-phone"></i> Phone:</span>
                        <span class="detail-value">${user.phoneNumber || 'N/A'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-calendar-plus"></i> Created At:</span>
                        <span class="detail-value">${formatDate(user.createdAt)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-calendar-check"></i> Updated At:</span>
                        <span class="detail-value">${formatDate(user.updatedAt)}</span>
                    </div>
                </div>
            `;
            
            document.getElementById('userDetailsContent').innerHTML = content;
            document.getElementById('userModal').style.display = 'block';
        }

        function closeUserModal() {
            document.getElementById('userModal').style.display = 'none';
        }

        let selectedStudentId = null;

        async function openAddToCourseModal(userId) {
            selectedStudentId = userId;
            document.getElementById('addToCourseModal').style.display = 'block';
            
            try {
                const courses = await apiCall('/api/admin/courses');
                const select = document.getElementById('courseSelect');
                select.innerHTML = '<option value="">Select a course</option>' + 
                    courses.map(c => `<option value="${c.id}">${c.courseCode} - ${c.courseName}</option>`).join('');
            } catch (error) {
                console.error('Error loading courses:', error);
                alert('Failed to load courses');
            }
        }

        function closeAddToCourseModal() {
            document.getElementById('addToCourseModal').style.display = 'none';
            selectedStudentId = null;
        }

        async function addStudentToCourse() {
            const courseId = document.getElementById('courseSelect').value;
            if (!courseId || !selectedStudentId) {
                alert('Please select a course');
                return;
            }

            try {
                const response = await fetch('/api/enrollments/enroll', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        studentId: selectedStudentId,
                        courseId: parseInt(courseId)
                    })
                });

                const result = await response.json();
                
                if (response.ok && result.success) {
                    alert('Student enrolled successfully');
                    closeAddToCourseModal();
                } else {
                    // Handle known error responses
                    if (response.status === 409) {
                        alert('This student is already enrolled in the selected course');
                    } else if (response.status === 404) {
                        alert('Error: ' + (result.error || 'Student or course not found'));
                    } else if (response.status === 403) {
                        alert('Error: ' + (result.error || 'Not authorized'));
                    } else {
                        alert('Failed to enroll student: ' + (result.error || 'Unknown error'));
                    }
                }
            } catch (error) {
                console.error('Error adding student to course:', error);
                alert('Network error: Failed to communicate with server');
            }
        }

        window.onclick = function(event) {
            const userModal = document.getElementById('userModal');
            const courseModal = document.getElementById('addToCourseModal');
            if (event.target == userModal) {
                closeUserModal();
            }
            if (event.target == courseModal) {
                closeAddToCourseModal();
            }
        }
    </script>
</body>
</html>
