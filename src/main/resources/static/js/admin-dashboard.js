// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Ensure authenticated and has ADMIN role
    if (!checkAuth()) return;
    const user = getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
        redirectToDashboard(user?.role);
        return;
    }
    loadAdminData();
    setupEventListeners();
});

function loadAdminData() {
    loadSystemStats();
    loadRecentUsers();
    loadSystemActivity();
    loadUserChart();
    loadEnrollmentChart();
}

async function loadSystemStats() {
    try {
        const stats = await apiCall('/api/admin/stats');
        
        document.getElementById('totalUsers').textContent = stats.totalUsers;
        document.getElementById('totalStudents').textContent = stats.students;
        document.getElementById('totalInstructors').textContent = stats.instructors;
        
        // Load total courses
        const courses = await apiCall('/api/courses');
        document.getElementById('totalCourses').textContent = courses.length;
        
        // Set active sessions (mock data)
        document.getElementById('activeSessions').textContent = Math.floor(Math.random() * 50) + 10;
        
    } catch (error) {
        console.error('Error loading stats:', error);
        // Fallback to zeros without noisy error toast
        document.getElementById('totalUsers').textContent = '0';
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('totalInstructors').textContent = '0';
        document.getElementById('totalCourses').textContent = '0';
        document.getElementById('activeSessions').textContent = '0';
    }
}

async function loadRecentUsers() {
    try {
        const users = await apiCall('/api/admin/users');
        
        // Sort by createdAt DESC and get top 10
        const sortedUsers = users.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        }).slice(0, 10);
        
        const tbody = document.getElementById('recentUsers');
        tbody.innerHTML = '';
        
        sortedUsers.forEach(user => {
            const isEnabled = user.enabled === true || user.enabled === 'true';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="badge badge-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <span class="badge ${isEnabled ? 'badge-success' : 'badge-danger'}">
                        ${isEnabled ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="action-buttons">
                    ${isEnabled 
                        ? `<button class="btn btn-sm btn-warning" onclick="deactivateUser(${user.id})">Deactivate</button>`
                        : `<button class="btn btn-sm btn-success" onclick="activateUser(${user.id})">Activate</button>`
                    }
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadSystemActivity() {
    try {
        const activities = await apiCall('/api/admin/activities');
        const activityList = document.getElementById('systemActivity');
        activityList.innerHTML = '';
        
        if (activities && activities.length > 0) {
            activities.slice(0, 10).forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                
                // Determine icon based on activity type
                let icon = '📝';
                if (activity.activityType === 'USER_REGISTRATION') icon = '👤';
                else if (activity.activityType === 'ASSIGNMENT_CREATED') icon = '📄';
                else if (activity.activityType === 'ASSIGNMENT_SUBMITTED') icon = '✅';
                else if (activity.activityType === 'QUIZ_CREATED') icon = '�';
                else if (activity.activityType === 'QUIZ_ATTEMPTED') icon = '✏️';
                else if (activity.activityType === 'COURSE_CREATED') icon = '📚';
                else if (activity.activityType === 'ENROLLMENT_CREATED') icon = '🎓';
                else if (activity.activityType === 'ATTENDANCE_MARKED') icon = '📋';
                
                const timeAgo = getTimeAgo(activity.createdAt);
                
                activityItem.innerHTML = `
                    <span class="activity-icon">${icon}</span>
                    <div class="activity-content">
                        <p>${activity.description}</p>
                        <span class="activity-time">${timeAgo}</span>
                    </div>
                `;
                activityList.appendChild(activityItem);
            });
        } else {
            activityList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No recent activity</p>';
        }
    } catch (error) {
        console.error('Error loading activities:', error);
        document.getElementById('systemActivity').innerHTML = '<p style="text-align: center; color: var(--danger-color);">Failed to load activities</p>';
    }
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
}

function loadUserChart() {
    const ctx = document.getElementById('userChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Students', 'Instructors', 'Admins'],
            datasets: [{
                data: [850, 45, 5],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(155, 89, 182, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function loadEnrollmentChart() {
    const ctx = document.getElementById('enrollmentChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Enrollments',
                data: [120, 190, 150, 280, 320, 420],
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

async function activateUser(userId) {
    try {
        await apiCall(`/api/admin/users/${userId}/activate`, {
            method: 'PUT'
        });
        showToast('User activated successfully', 'success');
        loadRecentUsers();
    } catch (error) {
        console.error('Error activating user:', error);
        showToast('Failed to activate user', 'error');
    }
}

async function deactivateUser(userId) {
    if (confirm('Are you sure you want to deactivate this user?')) {
        try {
            await apiCall(`/api/admin/users/${userId}/deactivate`, {
                method: 'PUT'
            });
            showToast('User deactivated successfully', 'success');
            loadRecentUsers();
        } catch (error) {
            console.error('Error deactivating user:', error);
            showToast('Failed to deactivate user', 'error');
        }
    }
}

async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        try {
            await apiCall(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });
            showToast('User deleted successfully', 'success');
            loadRecentUsers();
            loadSystemStats();
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Failed to delete user', 'error');
        }
    }
}
