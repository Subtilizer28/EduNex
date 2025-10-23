// Instructor Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadInstructorData();
    setupEventListeners();
});

function loadInstructorData() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('userName').textContent = user.fullName;
    
    loadStats();
    loadCourses();
    loadPendingAssignments();
    loadActivityFeed();
    loadPerformanceChart();
}

async function loadStats() {
    try {
        const user = getCurrentUser();
        
        // Load courses
        const coursesResponse = await apiCall(`/api/courses/instructor/${user.id}`);
        const courses = await coursesResponse.json();
        document.getElementById('totalCourses').textContent = courses.length;
        
        // Calculate total students across all courses
        let totalStudents = 0;
        for (const course of courses) {
            const enrollmentsResponse = await apiCall(`/api/enrollments/course/${course.id}`);
            const enrollments = await enrollmentsResponse.json();
            totalStudents += enrollments.length;
        }
        document.getElementById('totalStudents').textContent = totalStudents;
        
        // Load pending grading count
        let pendingCount = 0;
        for (const course of courses) {
            const assignmentsResponse = await apiCall(`/api/assignments/course/${course.id}`);
            const assignments = await assignmentsResponse.json();
            pendingCount += assignments.filter(a => a.status === 'SUBMITTED').length;
        }
        document.getElementById('pendingGrading').textContent = pendingCount;
        
        // Set sample rating
        document.getElementById('avgRating').textContent = '4.5';
        
    } catch (error) {
        console.error('Error loading stats:', error);
        showToast('Failed to load statistics', 'error');
    }
}

async function loadCourses() {
    try {
        const user = getCurrentUser();
        const response = await apiCall(`/api/courses/instructor/${user.id}`);
        const courses = await response.json();
        
        const coursesList = document.getElementById('coursesList');
        coursesList.innerHTML = '';
        
        if (courses.length === 0) {
            coursesList.innerHTML = '<p class="empty-state">No courses yet. Create your first course!</p>';
            return;
        }
        
        courses.slice(0, 5).forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-item';
            courseCard.innerHTML = `
                <h3>${course.courseName}</h3>
                <p>${course.courseCode}</p>
                <div class="course-meta">
                    <span class="badge badge-info">${course.credits} Credits</span>
                    <span class="badge badge-success">Active</span>
                </div>
            `;
            coursesList.appendChild(courseCard);
        });
        
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadPendingAssignments() {
    try {
        const user = getCurrentUser();
        const coursesResponse = await apiCall(`/api/courses/instructor/${user.id}`);
        const courses = await coursesResponse.json();
        
        const tbody = document.getElementById('pendingAssignments');
        tbody.innerHTML = '';
        
        let hasAssignments = false;
        
        for (const course of courses) {
            const assignmentsResponse = await apiCall(`/api/assignments/course/${course.id}`);
            const assignments = await assignmentsResponse.json();
            
            assignments.filter(a => a.status === 'SUBMITTED').forEach(assignment => {
                hasAssignments = true;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>Student Name</td>
                    <td>${course.courseName}</td>
                    <td>${assignment.title}</td>
                    <td>${formatDateTime(assignment.submittedAt)}</td>
                    <td><span class="badge badge-warning">Pending</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="gradeAssignment(${assignment.id})">Grade</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        
        if (!hasAssignments) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No pending assignments</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

function loadActivityFeed() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = `
        <div class="activity-item">
            <span class="activity-icon">👤</span>
            <div class="activity-content">
                <p>New student enrolled in Web Development</p>
                <span class="activity-time">5 minutes ago</span>
            </div>
        </div>
        <div class="activity-item">
            <span class="activity-icon">📝</span>
            <div class="activity-content">
                <p>Assignment submitted by John Doe</p>
                <span class="activity-time">1 hour ago</span>
            </div>
        </div>
        <div class="activity-item">
            <span class="activity-icon">❓</span>
            <div class="activity-content">
                <p>New question posted in forum</p>
                <span class="activity-time">2 hours ago</span>
            </div>
        </div>
    `;
}

function loadPerformanceChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4'],
            datasets: [{
                label: 'Average Score',
                data: [85, 78, 92, 88],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function setupEventListeners() {
    // Create course form
    const createCourseForm = document.getElementById('createCourseForm');
    if (createCourseForm) {
        createCourseForm.addEventListener('submit', handleCreateCourse);
    }
}

async function handleCreateCourse(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    const formData = new FormData(e.target);
    
    const courseData = {
        courseName: formData.get('courseName'),
        courseCode: formData.get('courseCode'),
        description: formData.get('description'),
        credits: parseInt(formData.get('credits')),
        maxStudents: parseInt(formData.get('maxStudents')),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate')
    };
    
    try {
        const response = await apiCall(`/api/courses?instructorId=${user.id}`, {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
        
        if (response.ok) {
            showToast('Course created successfully!', 'success');
            closeCreateCourseModal();
            loadCourses();
            loadStats();
        } else {
            throw new Error('Failed to create course');
        }
    } catch (error) {
        console.error('Error creating course:', error);
        showToast('Failed to create course', 'error');
    }
}

function openCreateCourseModal() {
    document.getElementById('createCourseModal').style.display = 'block';
}

function closeCreateCourseModal() {
    document.getElementById('createCourseModal').style.display = 'none';
    document.getElementById('createCourseForm').reset();
}

function gradeAssignment(assignmentId) {
    const grade = prompt('Enter grade (0-100):');
    const feedback = prompt('Enter feedback:');
    
    if (grade !== null && feedback !== null) {
        apiCall(`/api/assignments/${assignmentId}/grade?grade=${grade}&feedback=${encodeURIComponent(feedback)}`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                showToast('Assignment graded successfully!', 'success');
                loadPendingAssignments();
            }
        })
        .catch(error => {
            console.error('Error grading assignment:', error);
            showToast('Failed to grade assignment', 'error');
        });
    }
}

function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
}

// Modal click outside to close
window.onclick = function(event) {
    const modal = document.getElementById('createCourseModal');
    if (event.target === modal) {
        closeCreateCourseModal();
    }
}
