// EduNex LMS - Authentication JavaScript
// Handles login and registration

const API_URL = '/api/auth';

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    fullName: data.fullName,
                    role: data.role
                }));
                
                // Redirect based on role
                redirectToDashboard(data.role);
            } else {
                showError(errorMessage, 'Invalid username or password');
            }
        } catch (error) {
            showError(errorMessage, 'Login failed. Please try again.');
            console.error('Login error:', error);
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            fullName: document.getElementById('fullName').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            password: document.getElementById('password').value,
            role: document.getElementById('role').value
        };
        
        const errorMessage = document.getElementById('errorMessage');
        
        // Validation
        if (!formData.role) {
            showError(errorMessage, 'Please select a role');
            return;
        }
        
        if (formData.password.length < 6) {
            showError(errorMessage, 'Password must be at least 6 characters');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const data = await response.json();
                
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    fullName: data.fullName,
                    role: data.role
                }));
                
                // Redirect based on role
                redirectToDashboard(data.role);
            } else {
                showError(errorMessage, 'Registration failed. Username or email may already exist.');
            }
        } catch (error) {
            showError(errorMessage, 'Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    });
}

// Helper Functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function redirectToDashboard(role) {
    switch(role) {
        case 'ADMIN':
            window.location.href = '/admin/dashboard';
            break;
        case 'INSTRUCTOR':
            window.location.href = '/instructor/dashboard';
            break;
        case 'STUDENT':
            window.location.href = '/student/dashboard';
            break;
        default:
            window.location.href = '/';
    }
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
        // User is logged in, check if on auth page
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/register') {
            redirectToDashboard(user.role);
        }
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
