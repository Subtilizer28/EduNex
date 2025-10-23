// Assignments Page JavaScript
let allAssignments = [];
let enrolledCourses = [];

document.addEventListener('DOMContentLoaded', () => {
    loadEnrolledCourses();
    loadAssignments();
});

async function loadEnrolledCourses() {
    try {
        const response = await fetch('/api/enrollments/my-enrollments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            enrolledCourses = await response.json();
            populateCourseFilter();
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function populateCourseFilter() {
    const filter = document.getElementById('courseFilter');
    enrolledCourses.forEach(enrollment => {
        const option = document.createElement('option');
        option.value = enrollment.course.id;
        option.textContent = enrollment.course.title;
        filter.appendChild(option);
    });
}

async function loadAssignments() {
    try {
        const response = await fetch('/api/assignments/my-assignments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            allAssignments = await response.json();
            displayAssignments(allAssignments);
        } else {
            showError('Failed to load assignments');
        }
    } catch (error) {
        console.error('Error loading assignments:', error);
        showError('Error loading assignments');
    }
}

function displayAssignments(assignments) {
    const grid = document.getElementById('assignmentsGrid');
    
    if (assignments.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No assignments found</p></div>';
        return;
    }

    grid.innerHTML = assignments.map(assignment => `
        <div class="assignment-card" data-status="${assignment.status}">
            <div class="assignment-header">
                <h3>${assignment.title}</h3>
                <span class="badge badge-${getStatusClass(assignment.status)}">
                    ${assignment.status}
                </span>
            </div>
            
            <div class="assignment-info">
                <p class="course-name">📚 ${assignment.course.title}</p>
                <p class="due-date">📅 Due: ${formatDate(assignment.dueDate)}</p>
                <p class="points">🎯 Points: ${assignment.totalPoints}</p>
                ${assignment.grade !== null ? `
                    <p class="grade">✅ Grade: ${assignment.grade}/${assignment.totalPoints}</p>
                ` : ''}
            </div>

            <div class="assignment-description">
                <p>${truncateText(assignment.description, 100)}</p>
            </div>

            <div class="assignment-actions">
                <button class="btn btn-sm btn-secondary" onclick="viewAssignment(${assignment.id})">
                    View Details
                </button>
                ${assignment.status === 'PENDING' || assignment.status === 'LATE_SUBMISSION' ? `
                    <button class="btn btn-sm btn-primary" onclick="openSubmitModal(${assignment.id})">
                        Submit
                    </button>
                ` : ''}
            </div>

            ${isOverdue(assignment.dueDate) && assignment.status === 'PENDING' ? `
                <div class="overdue-badge">OVERDUE</div>
            ` : ''}
        </div>
    `).join('');
}

function filterAssignments() {
    const courseId = document.getElementById('courseFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filtered = allAssignments;

    if (courseId) {
        filtered = filtered.filter(a => a.course.id == courseId);
    }

    if (status) {
        filtered = filtered.filter(a => a.status === status);
    }

    displayAssignments(filtered);
}

function openSubmitModal(assignmentId) {
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    document.getElementById('assignmentId').value = assignmentId;
    document.getElementById('assignmentTitle').textContent = assignment.title;
    document.getElementById('assignmentCourse').textContent = assignment.course.title;
    document.getElementById('assignmentDueDate').textContent = formatDate(assignment.dueDate);
    
    document.getElementById('submitModal').style.display = 'block';
}

function closeSubmitModal() {
    document.getElementById('submitModal').style.display = 'none';
    document.getElementById('submitForm').reset();
}

async function submitAssignment(event) {
    event.preventDefault();
    
    const assignmentId = document.getElementById('assignmentId').value;
    const file = document.getElementById('submissionFile').files[0];
    const notes = document.getElementById('submissionNotes').value;

    if (!file) {
        showError('Please select a file');
        return;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showError('File size must be less than 10MB');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('notes', notes);

    try {
        const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            showSuccess('Assignment submitted successfully!');
            closeSubmitModal();
            loadAssignments();
        } else {
            const error = await response.text();
            showError(error || 'Failed to submit assignment');
        }
    } catch (error) {
        console.error('Error submitting assignment:', error);
        showError('Error submitting assignment');
    }
}

async function viewAssignment(assignmentId) {
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    document.getElementById('viewTitle').textContent = assignment.title;
    document.getElementById('viewCourse').textContent = assignment.course.title;
    document.getElementById('viewDueDate').textContent = formatDate(assignment.dueDate);
    document.getElementById('viewTotalPoints').textContent = assignment.totalPoints;
    document.getElementById('viewStatus').textContent = assignment.status;
    document.getElementById('viewStatus').className = `badge badge-${getStatusClass(assignment.status)}`;
    document.getElementById('viewDescription').textContent = assignment.description;
    
    if (assignment.grade !== null) {
        document.getElementById('viewGrade').textContent = `${assignment.grade}/${assignment.totalPoints}`;
    } else {
        document.getElementById('viewGrade').textContent = 'Not graded yet';
    }

    // Show submission info if submitted
    if (assignment.status !== 'PENDING') {
        document.getElementById('submissionInfo').style.display = 'block';
        if (assignment.submittedAt) {
            document.getElementById('submittedDate').textContent = formatDate(assignment.submittedAt);
        }
        if (assignment.submissionUrl) {
            const fileLink = document.getElementById('submittedFile');
            fileLink.href = assignment.submissionUrl;
            fileLink.textContent = 'Download Submission';
        }
        if (assignment.feedback) {
            document.getElementById('feedbackRow').style.display = 'block';
            document.getElementById('feedbackText').textContent = assignment.feedback;
        }
    } else {
        document.getElementById('submissionInfo').style.display = 'none';
    }
    
    document.getElementById('viewModal').style.display = 'block';
}

function closeViewModal() {
    document.getElementById('viewModal').style.display = 'none';
}

function getStatusClass(status) {
    const classes = {
        'PENDING': 'warning',
        'SUBMITTED': 'info',
        'LATE_SUBMISSION': 'danger',
        'GRADED': 'success'
    };
    return classes[status] || 'secondary';
}

function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showSuccess(message) {
    alert(message); // Replace with toast notification
}

function showError(message) {
    alert(message); // Replace with toast notification
}

// Close modals when clicking outside
window.onclick = function(event) {
    const submitModal = document.getElementById('submitModal');
    const viewModal = document.getElementById('viewModal');
    
    if (event.target === submitModal) {
        closeSubmitModal();
    }
    if (event.target === viewModal) {
        closeViewModal();
    }
}
