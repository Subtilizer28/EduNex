// Profile Page JavaScript
let originalProfileData = {};
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    checkDarkMode();
});

async function loadUserProfile() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            currentUser = await response.json();
            displayProfile(currentUser);
        } else {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Failed to load profile');
    }
}

function displayProfile(user) {
    // Set avatar initials
    const initials = user.fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    document.getElementById('avatarInitials').textContent = initials;

    // Set form values
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('role').value = user.role || '';

    // Set statistics
    if (user.createdAt) {
        document.getElementById('memberSince').textContent = formatDate(user.createdAt);
    }
    
    document.getElementById('accountStatus').textContent = user.enabled ? 'Active' : 'Inactive';

    // Store original data
    originalProfileData = {
        fullName: user.fullName,
        email: user.email
    };
}

function enableEdit() {
    document.getElementById('fullName').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('editActions').style.display = 'flex';
}

function cancelEdit() {
    document.getElementById('fullName').value = originalProfileData.fullName;
    document.getElementById('email').value = originalProfileData.email;
    document.getElementById('fullName').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('editActions').style.display = 'none';
}

async function updateProfile(event) {
    event.preventDefault();

    const updatedData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value
    };

    try {
        const response = await fetch('/api/auth/update-profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            showSuccess('Profile updated successfully!');
            originalProfileData = updatedData;
            document.getElementById('fullName').disabled = true;
            document.getElementById('email').disabled = true;
            document.getElementById('editActions').style.display = 'none';
        } else {
            const error = await response.text();
            showError(error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showError('Error updating profile');
    }
}

async function changePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        showError('New passwords do not match!');
        return;
    }

    if (newPassword.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    try {
        const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        if (response.ok) {
            showSuccess('Password changed successfully!');
            document.getElementById('passwordForm').reset();
        } else {
            const error = await response.text();
            showError(error || 'Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showError('Error changing password');
    }
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            showError('Image size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const placeholder = document.getElementById('avatarPlaceholder');
            placeholder.style.backgroundImage = `url(${e.target.result})`;
            placeholder.style.backgroundSize = 'cover';
            placeholder.style.backgroundPosition = 'center';
            document.getElementById('avatarInitials').style.display = 'none';
        };
        reader.readAsDataURL(file);

        // Upload avatar
        uploadAvatar(file);
    }
}

async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const response = await fetch('/api/auth/upload-avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            showSuccess('Avatar updated successfully!');
        } else {
            showError('Failed to upload avatar');
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        showError('Error uploading avatar');
    }
}

function checkDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.getElementById('darkMode').checked = darkMode;
}

function toggleThemePreference() {
    toggleTheme();
}

async function savePreferences() {
    const preferences = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        darkMode: document.getElementById('darkMode').checked,
        language: document.getElementById('language').value
    };

    // Save to localStorage
    localStorage.setItem('emailNotifications', preferences.emailNotifications);
    localStorage.setItem('language', preferences.language);

    try {
        const response = await fetch('/api/auth/update-preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferences)
        });

        if (response.ok) {
            showSuccess('Preferences saved successfully!');
        } else {
            showError('Failed to save preferences (saved locally)');
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        showSuccess('Preferences saved locally');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showSuccess(message) {
    alert(message); // Replace with toast notification
}

function showError(message) {
    alert(message); // Replace with toast notification
}
