<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-logo">EduNex</a>
            <ul class="nav-menu" id="navMenu">
                <li class="nav-item"><a href="/" class="nav-link active"><i class="fas fa-home"></i> Home</a></li>
                <li class="nav-item"><a href="#features" class="nav-link"><i class="fas fa-star"></i> Features</a></li>
                <li class="nav-item"><a href="#about" class="nav-link"><i class="fas fa-info-circle"></i> About</a></li>
                <li class="nav-item" id="loginNavItem"><a href="/login" class="nav-link"><i class="fas fa-sign-in-alt"></i> Login</a></li>
                <li class="nav-item" id="dashboardNavItem" style="display: none;"><a href="#" id="dashboardLink" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</a></li>
                <li class="nav-item" id="logoutNavItem" style="display: none;"><a href="#" id="logoutBtn" class="nav-link"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
    
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to EduNex</h1>
            <p>Learning Management System</p>
            <p class="hero-description">
                Transform your educational experience with our modern LMS. 
                Manage courses, track attendance, take quizzes, and analyze performance all in one place.
            </p>
            <div class="hero-buttons" id="heroButtons">
                <a href="/login" class="btn btn-primary btn-large" id="heroLoginBtn">Sign In</a>
            </div>
        </div>
    </section>
    
    <section id="features" class="features">
        <div class="container">
            <h2>Key Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <h3>Course Management</h3>
                    <p>Create, manage, and organize courses with multimedia content and interactive materials</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <h3>Assignments & Quizzes</h3>
                    <p>Create interactive assessments with automatic grading and instant feedback</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <h3>Analytics & Reports</h3>
                    <p>Track performance with detailed charts, insights, and progress monitoring</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <h3>Attendance Tracking</h3>
                    <p>Monitor and manage student attendance effortlessly with smart tracking</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3>Secure & Scalable</h3>
                    <p>Role-based access control with JWT authentication and enterprise security</p>
                </div>
            </div>
        </div>
    </section>
    
    <section id="about" class="about">
        <div class="container">
            <h2>About EduNex</h2>
            <p>
                EduNex is a comprehensive Learning Management System designed for educational institutions. 
                With support for multiple roles (Admin, Instructor, Student) and a fully responsive design, 
                EduNex makes online education simple and effective.
            </p>
        </div>
    </section>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 EduNex. All rights reserved.</p>
        </div>
    </footer>
    
    <script src="/js/main.js"></script>
    <script src="/js/auth.js"></script>
    <script>
        // Check if user is logged in and update UI
        document.addEventListener('DOMContentLoaded', function() {
            const token = localStorage.getItem('token');
            const user = getCurrentUser();
            
            if (token && user) {
                // Hide login nav and button
                document.getElementById('loginNavItem').style.display = 'none';
                document.getElementById('heroLoginBtn').style.display = 'none';
                
                // Show logout nav
                document.getElementById('logoutNavItem').style.display = 'flex';
                
                // Show dashboard nav and set link based on role
                const dashboardNavItem = document.getElementById('dashboardNavItem');
                const dashboardLink = document.getElementById('dashboardLink');
                dashboardNavItem.style.display = 'flex';
                
                if (user.role === 'ADMIN') {
                    dashboardLink.href = '/admin/dashboard';
                } else if (user.role === 'INSTRUCTOR') {
                    dashboardLink.href = '/instructor/dashboard';
                } else {
                    dashboardLink.href = '/student/dashboard';
                }
                
                // Replace hero button with dashboard button
                const heroButtons = document.getElementById('heroButtons');
                heroButtons.innerHTML = `<a href="${dashboardLink.href}" class="btn btn-primary btn-large"><i class="fas fa-chart-line"></i> Go to Dashboard</a>`;
            }
        });
    </script>
</body>
</html>
