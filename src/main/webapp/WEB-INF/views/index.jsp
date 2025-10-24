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
            <div class="nav-brand">
                <h1>EduNex</h1>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="/login" class="btn btn-primary">Login</a></li>
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
            <p>Intelligent Learning Management System</p>
            <p class="hero-description">
                Transform your educational experience with our modern, AI-powered LMS. 
                Manage courses, track attendance, take quizzes, and analyze performance all in one place.
            </p>
            <div class="hero-buttons">
                <a href="/login" class="btn btn-primary btn-large">Sign In</a>
            </div>
        </div>
    </section>
    
    <section id="features" class="features">
        <div class="container">
            <h2>Key Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-book-open" style="color: var(--primary-color);"></i>
                    </div>
                    <h3>Course Management</h3>
                    <p>Create, manage, and organize courses with multimedia content and interactive materials</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-clipboard-check" style="color: var(--success-color);"></i>
                    </div>
                    <h3>Assignments & Quizzes</h3>
                    <p>Create interactive assessments with automatic grading and instant feedback</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-chart-line" style="color: var(--info-color);"></i>
                    </div>
                    <h3>Analytics & Reports</h3>
                    <p>Track performance with detailed charts, insights, and progress monitoring</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-calendar-check" style="color: var(--warning-color);"></i>
                    </div>
                    <h3>Attendance Tracking</h3>
                    <p>Monitor and manage student attendance effortlessly with smart tracking</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt" style="color: var(--danger-color);"></i>
                    </div>
                    <h3>Secure & Scalable</h3>
                    <p>Role-based access control with JWT authentication and enterprise security</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-brain" style="color: #8B5CF6;"></i>
                    </div>
                    <h3>AI-Powered (Optional)</h3>
                    <p>Get AI-generated quizzes, personalized recommendations, and smart insights</p>
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
    
    <script src="/js/theme.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
