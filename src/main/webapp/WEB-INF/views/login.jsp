<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="auth-page">
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h1>EduNex</h1>
                <p>Learning Management System</p>
            </div>
            
            <form id="loginForm" class="auth-form">
                <h2>Sign In</h2>
                
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div id="errorMessage" class="error-message"></div>
                
                <button type="submit" class="btn btn-primary">Login</button>
                
                <p class="auth-footer">
                    Don't have an account? <a href="/register">Register here</a>
                </p>
            </form>
        </div>
    </div>
    
    <script src="/js/auth.js"></script>
</body>
</html>
