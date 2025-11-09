// EduNex LMS - Main JavaScript
// General functionality and utilities

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && hamburger) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// Dark Mode Toggle (shadcn style)
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

// Alias for backwards compatibility
function toggleTheme() {
    toggleDarkMode();
}

// Update theme toggle icon
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = themeToggle.querySelector('i');
    
    if (icon) {
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun theme-icon theme-icon-light';
        } else {
            icon.className = 'fas fa-moon theme-icon theme-icon-dark';
        }
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    
    // Add theme toggle listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
});

// Sidebar Toggle for Mobile
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebar = document.querySelector('.sidebar');

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// API Helper Function
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(endpoint, finalOptions);
        
        // Handle unauthorized
        if (response.status === 401) {
            console.error('Unauthorized - redirecting to login');
            logout();
            throw new Error('Unauthorized');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Gracefully handle empty responses or non-JSON bodies
        const contentType = response.headers.get('content-type') || '';
        if (response.status === 204 || contentType.indexOf('application/json') === -1) {
            const text = await response.text();
            return text ? JSON.parse(text) : { ok: true };
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Legacy alias for backward compatibility
async function fetchAPI(endpoint, options = {}) {
    return apiCall(endpoint, options);
}

// Get Current User
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = getCurrentUser();
    
    if (!token || !user) {
        window.location.href = '/login';
        return false;
    }
    
    return true;
}

// Redirect to Dashboard based on role
function redirectToDashboard(role) {
    const dashboards = {
        'ADMIN': '/admin/dashboard',
        'INSTRUCTOR': '/instructor/dashboard',
        'STUDENT': '/student/dashboard'
    };
    
    window.location.href = dashboards[role] || '/login';
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format DateTime
function formatDateTime(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleString(undefined, options);
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? 'var(--success-color)' : 
                          type === 'error' ? 'var(--danger-color)' : 
                          type === 'warning' ? 'var(--warning-color)' : 
                          'var(--info-color)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll to Element
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// File Upload Helper
function validateFile(file, maxSize = 50, allowedTypes = []) {
    // maxSize in MB
    const maxSizeBytes = maxSize * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
        showToast(`File size must be less than ${maxSize}MB`, 'error');
        return false;
    }
    
    if (allowedTypes.length > 0) {
        const fileType = file.type;
        const isAllowed = allowedTypes.some(type => fileType.includes(type));
        
        if (!isAllowed) {
            showToast(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`, 'error');
            return false;
        }
    }
    
    return true;
}

// Export functions for use in other scripts
window.EduNex = {
    toggleDarkMode,
    logout,
    fetchAPI,
    getCurrentUser,
    formatDate,
    formatDateTime,
    showToast,
    smoothScrollTo,
    validateFile
};

// Lightweight Notifications Polling (shows toast for new unread notifications)
function startNotificationPolling() {
    const user = getCurrentUser();
    const token = localStorage.getItem('token');
    if (!user || !token) return;

    const key = `lastNotifId:${user.id}`;
    let lastSeenId = parseInt(localStorage.getItem(key) || '0', 10);

    async function poll() {
        try {
            const unread = await apiCall(`/api/notifications/user/${user.id}/unread`);
            if (Array.isArray(unread) && unread.length) {
                // Sort by id ascending and show only new ones
                unread.sort((a, b) => (a.id || 0) - (b.id || 0));
                const newOnes = unread.filter(n => (n.id || 0) > lastSeenId);
                newOnes.forEach(n => {
                    const prefix = n.title ? `${n.title}: ` : '';
                    const type = (n.type || 'INFO').toString().toLowerCase();
                    showToast(prefix + (n.message || ''), type === 'error' ? 'error' : type);
                    if (n.id && n.id > lastSeenId) lastSeenId = n.id;
                });
                localStorage.setItem(key, String(lastSeenId));
            }
        } catch (e) {
            // Silent fail to avoid noisy UI if API is down
        }
    }

    // Prime once quickly, then every 30s
    poll();
    setInterval(poll, 30000);
}

document.addEventListener('DOMContentLoaded', startNotificationPolling);

// Set up logout button listener
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});
