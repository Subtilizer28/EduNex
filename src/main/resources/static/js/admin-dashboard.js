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
        
        const tbody = document.getElementById('recentUsers');
        tbody.innerHTML = '';
        
        users.slice(0, 10).forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="badge badge-info">${user.role}</span></td>
                <td>
                    <span class="badge ${user.active ? 'badge-success' : 'badge-danger'}">
                        ${user.active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    ${user.active 
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

function loadSystemActivity() {
    const activityList = document.getElementById('systemActivity');
    activityList.innerHTML = `
        <div class="activity-item">
            <span class="activity-icon">👤</span>
            <div class="activity-content">
                <p>New user registered</p>
                <span class="activity-time">2 minutes ago</span>
            </div>
        </div>
        <div class="activity-item">
            <span class="activity-icon">📚</span>
            <div class="activity-content">
                <p>New course created: Advanced Java</p>
                <span class="activity-time">15 minutes ago</span>
            </div>
        </div>
        <div class="activity-item">
            <span class="activity-icon">✅</span>
            <div class="activity-content">
                <p>100 students enrolled today</p>
                <span class="activity-time">1 hour ago</span>
            </div>
        </div>
        <div class="activity-item">
            <span class="activity-icon">⚠️</span>
            <div class="activity-content">
                <p>System backup completed</p>
                <span class="activity-time">3 hours ago</span>
            </div>
        </div>
    `;
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
    const broadcastForm = document.getElementById('broadcastForm');
    if (broadcastForm) {
        broadcastForm.addEventListener('submit', handleBroadcast);
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

async function handleBroadcast(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const message = formData.get('message');
    const type = formData.get('type');
    
    try {
        await apiCall(
            `/api/admin/notifications/broadcast?title=${encodeURIComponent(title)}&message=${encodeURIComponent(message)}&type=${type}`,
            { method: 'POST' }
        );
        showToast('Broadcast sent successfully!', 'success');
        closeBroadcastModal();
    } catch (error) {
        console.error('Error sending broadcast:', error);
        showToast('Failed to send broadcast', 'error');
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

function openBroadcastModal() {
    document.getElementById('broadcastModal').style.display = 'block';
}

function closeBroadcastModal() {
    document.getElementById('broadcastModal').style.display = 'none';
    document.getElementById('broadcastForm').reset();
}

// Modal click outside to close
window.onclick = function(event) {
    const modal = document.getElementById('broadcastModal');
    if (event.target === modal) {
        closeBroadcastModal();
    }
}
