<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile - EduNex LMS</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="navbar-brand">
                <a href="/" class="logo">EduNex</a>
            </div>
            <ul class="navbar-menu">
                <li><a href="/student/dashboard">Dashboard</a></li>
                <li><a href="/courses">Courses</a></li>
                <li><a href="/assignments">Assignments</a></li>
                <li><a href="/quizzes">Quizzes</a></li>
                <li><a href="/profile" class="active">Profile</a></li>
                <li><a href="#" onclick="logout()">Logout</a></li>
            </ul>
        </div>
    </nav>

    <main class="main-content">
        <div class="container">
            <div class="page-header">
                <h1>My Profile</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div class="profile-container">
                <!-- Profile Info Card -->
                <div class="card">
                    <div class="card-header">
                        <h2>Personal Information</h2>
                        <button class="btn btn-sm btn-primary" onclick="enableEdit()">Edit Profile</button>
                    </div>
                    <div class="card-body">
                        <form id="profileForm" onsubmit="updateProfile(event)">
                            <div class="profile-avatar">
                                <div class="avatar-placeholder" id="avatarPlaceholder">
                                    <span id="avatarInitials">UN</span>
                                </div>
                                <input type="file" id="avatarInput" accept="image/*" style="display: none;" onchange="previewAvatar(event)">
                                <button type="button" class="btn btn-sm btn-secondary" onclick="document.getElementById('avatarInput').click()">
                                    Change Photo
                                </button>
                            </div>

                            <div class="form-group">
                                <label for="fullName">Full Name *</label>
                                <input type="text" id="fullName" class="form-control" disabled required>
                            </div>

                            <div class="form-group">
                                <label for="username">Username</label>
                                <input type="text" id="username" class="form-control" disabled readonly>
                                <small>Username cannot be changed</small>
                            </div>

                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" class="form-control" disabled required>
                            </div>

                            <div class="form-group">
                                <label for="role">Role</label>
                                <input type="text" id="role" class="form-control" disabled readonly>
                            </div>

                            <div class="form-actions" id="editActions" style="display: none;">
                                <button type="button" class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Password Change Card -->
                <div class="card">
                    <div class="card-header">
                        <h2>Change Password</h2>
                    </div>
                    <div class="card-body">
                        <form id="passwordForm" onsubmit="changePassword(event)">
                            <div class="form-group">
                                <label for="currentPassword">Current Password *</label>
                                <input type="password" id="currentPassword" class="form-control" required>
                            </div>

                            <div class="form-group">
                                <label for="newPassword">New Password *</label>
                                <input type="password" id="newPassword" class="form-control" required minlength="6">
                                <small>Minimum 6 characters</small>
                            </div>

                            <div class="form-group">
                                <label for="confirmPassword">Confirm New Password *</label>
                                <input type="password" id="confirmPassword" class="form-control" required minlength="6">
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Account Statistics -->
                <div class="card">
                    <div class="card-header">
                        <h2>Account Statistics</h2>
                    </div>
                    <div class="card-body">
                        <div class="stats-grid" id="profileStats">
                            <div class="stat-item">
                                <span class="stat-label">Member Since</span>
                                <span class="stat-value" id="memberSince">-</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Last Login</span>
                                <span class="stat-value" id="lastLogin">-</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Account Status</span>
                                <span class="stat-value" id="accountStatus">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Preferences -->
                <div class="card">
                    <div class="card-header">
                        <h2>Preferences</h2>
                    </div>
                    <div class="card-body">
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="emailNotifications" checked>
                                <span>Receive email notifications</span>
                            </label>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="darkMode" onchange="toggleThemePreference()">
                                <span>Dark mode</span>
                            </label>
                        </div>

                        <div class="form-group">
                            <label for="language">Language</label>
                            <select id="language" class="form-control">
                                <option value="en" selected>English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>

                        <div class="form-actions">
                            <button class="btn btn-primary" onclick="savePreferences()">Save Preferences</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script src="/js/main.js"></script>
    <script src="/js/profile.js"></script>
</body>
</html>
