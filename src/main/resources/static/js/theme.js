// Theme Management
(function() {
    'use strict';
    
    // Get theme from localStorage or default to light
    const getTheme = () => {
        return localStorage.getItem('theme') || 'light';
    };
    
    // Set theme
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    };
    
    // Update theme toggle icon
    const updateThemeIcon = (theme) => {
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
    };
    
    // Toggle theme
    window.toggleTheme = function() {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };
    
    // Initialize theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        const theme = getTheme();
        setTheme(theme);
        
        // Add theme toggle button to navigation if it doesn't exist
        const nav = document.querySelector('.nav-menu');
        if (nav && !document.getElementById('theme-toggle')) {
            const themeToggle = document.createElement('li');
            themeToggle.innerHTML = `
                <button id="theme-toggle" class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
                    <i id="theme-icon" class="fas fa-moon"></i>
                </button>
            `;
            nav.appendChild(themeToggle);
            updateThemeIcon(theme);
        }
    });
})();
