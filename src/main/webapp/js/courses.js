// Courses Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadAllCourses();
    setupEventListeners();
});

let allCourses = [];

async function loadAllCourses() {
    try {
        const response = await apiCall('/api/courses');
        allCourses = await response.json();
        displayCourses(allCourses);
    } catch (error) {
        console.error('Error loading courses:', error);
        showToast('Failed to load courses', 'error');
    }
}

function displayCourses(courses) {
    const grid = document.getElementById('coursesGrid');
    grid.innerHTML = '';
    
    if (courses.length === 0) {
        grid.innerHTML = '<p class="empty-state">No courses found</p>';
        return;
    }
    
    courses.forEach(course => {
        const courseCard = createCourseCard(course);
        grid.appendChild(courseCard);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    const startDate = course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBA';
    const endDate = course.endDate ? new Date(course.endDate).toLocaleDateString() : 'TBA';
    
    card.innerHTML = `
        <div class="course-card-header">
            <h3>${course.courseName}</h3>
            <span class="course-code">${course.courseCode}</span>
        </div>
        <div class="course-card-body">
            <p class="course-description">${course.description || 'No description available'}</p>
            <div class="course-meta">
                <div class="meta-item">
                    <span class="meta-icon">👨‍🏫</span>
                    <span>${course.instructor?.fullName || 'Instructor'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">📚</span>
                    <span>${course.credits} Credits</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">👥</span>
                    <span>${course.enrolledStudents || 0}/${course.maxStudents} Students</span>
                </div>
            </div>
            <div class="course-dates">
                <small>📅 ${startDate} - ${endDate}</small>
            </div>
        </div>
        <div class="course-card-footer">
            <button class="btn btn-secondary" onclick="viewCourseDetails(${course.id})">
                View Details
            </button>
            <button class="btn btn-primary" onclick="enrollInCourse(${course.id})" 
                ${(course.enrolledStudents >= course.maxStudents) ? 'disabled' : ''}>
                ${(course.enrolledStudents >= course.maxStudents) ? 'Full' : 'Enroll'}
            </button>
        </div>
    `;
    
    return card;
}

async function viewCourseDetails(courseId) {
    try {
        const response = await apiCall(`/api/courses/${courseId}`);
        const course = await response.json();
        
        const startDate = course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBA';
        const endDate = course.endDate ? new Date(course.endDate).toLocaleDateString() : 'TBA';
        
        const detailsDiv = document.getElementById('courseDetails');
        detailsDiv.innerHTML = `
            <h2>${course.courseName}</h2>
            <div class="course-detail-header">
                <span class="badge badge-info">${course.courseCode}</span>
                <span class="badge badge-success">${course.credits} Credits</span>
            </div>
            
            <div class="course-detail-section">
                <h3>Course Description</h3>
                <p>${course.description || 'No description available'}</p>
            </div>
            
            <div class="course-detail-section">
                <h3>Course Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Instructor:</strong>
                        <span>${course.instructor?.fullName || 'TBA'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Duration:</strong>
                        <span>${startDate} - ${endDate}</span>
                    </div>
                    <div class="info-item">
                        <strong>Max Students:</strong>
                        <span>${course.maxStudents}</span>
                    </div>
                    <div class="info-item">
                        <strong>Enrolled:</strong>
                        <span>${course.enrolledStudents || 0} students</span>
                    </div>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeCourseModal()">Close</button>
                <button class="btn btn-primary" onclick="enrollInCourse(${course.id})"
                    ${(course.enrolledStudents >= course.maxStudents) ? 'disabled' : ''}>
                    ${(course.enrolledStudents >= course.maxStudents) ? 'Course Full' : 'Enroll Now'}
                </button>
            </div>
        `;
        
        document.getElementById('courseModal').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading course details:', error);
        showToast('Failed to load course details', 'error');
    }
}

async function enrollInCourse(courseId) {
    const user = getCurrentUser();
    
    if (!user) {
        showToast('Please login to enroll', 'error');
        window.location.href = '/login';
        return;
    }
    
    if (user.role !== 'STUDENT') {
        showToast('Only students can enroll in courses', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to enroll in this course?')) {
        try {
            const response = await apiCall(`/api/enrollments?studentId=${user.id}&courseId=${courseId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                showToast('Successfully enrolled in course!', 'success');
                closeCourseModal();
                loadAllCourses();
            } else {
                const error = await response.text();
                throw new Error(error);
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
            showToast(error.message || 'Failed to enroll in course', 'error');
        }
    }
}

function searchCourses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = allCourses.filter(course => 
        course.courseName.toLowerCase().includes(searchTerm) ||
        course.courseCode.toLowerCase().includes(searchTerm) ||
        (course.description && course.description.toLowerCase().includes(searchTerm))
    );
    
    displayCourses(filtered);
}

function setupEventListeners() {
    // Search on Enter key
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchCourses();
        }
    });
    
    // Filter by credits
    document.getElementById('filterCredits').addEventListener('change', applyFilters);
    document.getElementById('filterStatus').addEventListener('change', applyFilters);
}

function applyFilters() {
    const credits = document.getElementById('filterCredits').value;
    const status = document.getElementById('filterStatus').value;
    
    let filtered = [...allCourses];
    
    if (credits) {
        filtered = filtered.filter(course => course.credits === parseInt(credits));
    }
    
    if (status === 'available') {
        filtered = filtered.filter(course => (course.enrolledStudents || 0) < course.maxStudents);
    } else if (status === 'full') {
        filtered = filtered.filter(course => (course.enrolledStudents || 0) >= course.maxStudents);
    }
    
    displayCourses(filtered);
}

function closeCourseModal() {
    document.getElementById('courseModal').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('courseModal');
    if (event.target === modal) {
        closeCourseModal();
    }
}
