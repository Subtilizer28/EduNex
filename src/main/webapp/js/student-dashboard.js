// Student Dashboard JavaScript
// Handles data loading and visualization

document.addEventListener('DOMContentLoaded', async () => {
    const user = EduNex.getCurrentUser();
    
    if (!user) {
        window.location.href = '/login';
        return;
    }
    
    // Check if user is a student
    if (user.role !== 'STUDENT') {
        EduNex.showToast('Access denied. Students only.', 'error');
        window.location.href = '/';
        return;
    }
    
    // Display user info
    document.getElementById('userName').textContent = user.fullName;
    document.getElementById('userFullName').textContent = user.fullName;
    
    // Load dashboard data
    await loadDashboardStats();
    await loadCourses();
    await loadAssignments();
    initializeChart();
});

// Load Dashboard Statistics
async function loadDashboardStats() {
    try {
        // Simulated data - Replace with actual API calls
        document.getElementById('totalCourses').textContent = '5';
        document.getElementById('pendingAssignments').textContent = '3';
        document.getElementById('averageGrade').textContent = '85%';
        document.getElementById('attendanceRate').textContent = '92%';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Courses
async function loadCourses() {
    const tbody = document.getElementById('coursesTableBody');
    
    try {
        // Simulated data - Replace with actual API call
        const courses = [
            {
                courseCode: 'CS101',
                courseName: 'Introduction to Programming',
                instructor: 'Dr. John Smith',
                progress: 75,
                status: 'ACTIVE'
            },
            {
                courseCode: 'MATH201',
                courseName: 'Calculus II',
                instructor: 'Prof. Jane Doe',
                progress: 60,
                status: 'ACTIVE'
            },
            {
                courseCode: 'ENG102',
                courseName: 'English Composition',
                instructor: 'Dr. Emily Brown',
                progress: 90,
                status: 'ACTIVE'
            }
        ];
        
        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>${course.courseCode}</td>
                <td>${course.courseName}</td>
                <td>${course.instructor}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="flex: 1; height: 8px; background-color: var(--border-color); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${course.progress}%; height: 100%; background-color: var(--primary-color);"></div>
                        </div>
                        <span>${course.progress}%</span>
                    </div>
                </td>
                <td><span class="badge badge-success">${course.status}</span></td>
            </tr>
        `).join('');
        
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--danger-color);">Failed to load courses</td></tr>';
        console.error('Error loading courses:', error);
    }
}

// Load Assignments
async function loadAssignments() {
    const tbody = document.getElementById('assignmentsTableBody');
    
    try {
        // Simulated data - Replace with actual API call
        const assignments = [
            {
                title: 'Programming Assignment 1',
                course: 'CS101',
                dueDate: '2025-10-30T23:59:00',
                status: 'PENDING'
            },
            {
                title: 'Calculus Problem Set',
                course: 'MATH201',
                dueDate: '2025-10-28T23:59:00',
                status: 'PENDING'
            },
            {
                title: 'Essay Writing',
                course: 'ENG102',
                dueDate: '2025-11-05T23:59:00',
                status: 'PENDING'
            }
        ];
        
        tbody.innerHTML = assignments.map(assignment => `
            <tr>
                <td>${assignment.title}</td>
                <td>${assignment.course}</td>
                <td>${EduNex.formatDateTime(assignment.dueDate)}</td>
                <td><span class="badge badge-warning">${assignment.status}</span></td>
                <td>
                    <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        Submit
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--danger-color);">Failed to load assignments</td></tr>';
        console.error('Error loading assignments:', error);
    }
}

// Initialize Performance Chart
function initializeChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: [{
                label: 'Average Score',
                data: [75, 78, 82, 85, 88, 90],
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Attendance Rate',
                data: [90, 92, 88, 95, 93, 92],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}
