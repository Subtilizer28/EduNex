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
                <li class="nav-item">
                    <a href="/admin/dashboard" class="nav-link">
                        <i class="fas fa-chart-line"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/admin/users" class="nav-link active">
                        <i class="fas fa-users"></i> Users
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/admin/courses" class="nav-link">
                        <i class="fas fa-book"></i> Courses
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/admin/reports" class="nav-link">
                        <i class="fas fa-chart-bar"></i> Reports
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/profile" class="nav-link">
                        <i class="fas fa-user"></i> Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </li>
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
                                <td>${user.firstName} ${user.lastName}</td>
                                <td>${user.email}</td>
                                <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
                                <td>
                                    <span class="badge badge-${user.enabled ? 'success' : 'danger'}">
                                        ${user.enabled ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>${formatDate(user.createdAt)}</td>
                                <td class="action-buttons">
                                    <button onclick="toggleUserStatus(${user.id}, ${user.enabled})" 
                                            class="btn btn-sm ${user.enabled ? 'btn-warning' : 'btn-success'}"
                                            title="${user.enabled ? 'Deactivate' : 'Activate'}">
                                        <i class="fas fa-${user.enabled ? 'ban' : 'check'}"></i>
                                    </button>
                                    <button onclick="viewUserDetails(${user.id})" 
                                            class="btn btn-sm btn-info"
                                            title="View Details">
                                        <i class="fas fa-eye"></i>
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
                    user.firstName.toLowerCase().includes(searchInput) ||
                    user.lastName.toLowerCase().includes(searchInput) ||
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

            alert(`User Details:\n\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.enabled ? 'Active' : 'Inactive'}\nCreated: ${formatDate(user.createdAt)}`);
        }
    </script>
</body>
</html>
