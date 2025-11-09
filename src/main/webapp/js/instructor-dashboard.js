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
    loadCourseChart();
}

async function loadStats() {
    try {
        const user = getCurrentUser();
        
        // Load courses
        const coursesResponse = await apiCall(`/api/courses/instructor/${user.id}`);
        if (!coursesResponse.ok) throw new Error('Failed to load courses');
        const courses = await coursesResponse.json();
        document.getElementById('totalCourses').textContent = courses.length || 0;
        
        // Calculate total students across all courses
        let totalStudents = 0;
        for (const course of courses) {
            try {
                const enrollmentsResponse = await apiCall(`/api/enrollments/course/${course.id}`);
                if (enrollmentsResponse.ok) {
                    const enrollments = await enrollmentsResponse.json();
                    totalStudents += enrollments.length;
                }
            } catch (err) {
                console.warn('Failed to load enrollments for course', course.id);
            }
        }
        document.getElementById('totalStudents').textContent = totalStudents;
        
        // Load pending grading count
        let pendingCount = 0;
        for (const course of courses) {
            try {
                const submissionsResponse = await apiCall(`/api/assignments/course/${course.id}/submissions`);
                if (submissionsResponse.ok) {
                    const submissions = await submissionsResponse.json();
                    pendingCount += submissions.filter(s => s.status === 'SUBMITTED').length;
                }
            } catch (err) {
                console.warn('Failed to load submissions for course', course.id);
            }
        }
        document.getElementById('pendingGrading').textContent = pendingCount;
        
        // Set sample rating
        document.getElementById('avgRating').textContent = '4.5';
        
    } catch (error) {
        console.error('Error loading stats:', error);
        // Set default values
        document.getElementById('totalCourses').textContent = '0';
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('pendingGrading').textContent = '0';
        document.getElementById('avgRating').textContent = '0.0';
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
        if (!coursesResponse.ok) throw new Error('Failed to load courses');
        const courses = await coursesResponse.json();
        
        const tbody = document.getElementById('pendingAssignments');
        tbody.innerHTML = '';
        
        let hasAssignments = false;
        
        for (const course of courses) {
            try {
                const submissionsResponse = await apiCall(`/api/assignments/course/${course.id}/submissions`);
                if (submissionsResponse.ok) {
                    const submissions = await submissionsResponse.json();
                    
                    submissions.filter(s => s.status === 'SUBMITTED').forEach(submission => {
                        hasAssignments = true;
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${submission.student?.fullName || 'Unknown Student'}</td>
                            <td>${course.courseName}</td>
                            <td>${submission.assignment?.title || 'Assignment'}</td>
                            <td>${formatDateTime(submission.submittedAt)}</td>
                            <td><span class="badge badge-warning">Pending</span></td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="gradeAssignment(${submission.id})">Grade</button>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            } catch (err) {
                console.warn('Failed to load submissions for course', course.id);
            }
        }
        
        if (!hasAssignments) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No pending assignments</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading assignments:', error);
        const tbody = document.getElementById('pendingAssignments');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Failed to load assignments</td></tr>';
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
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'],
            datasets: [{
                label: 'Average Score',
                data: [85, 78, 92, 88, 76],
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

function loadCourseChart() {
    const ctx = document.getElementById('courseChart');
    if (!ctx) return;
    
    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Active', 'Completed', 'Upcoming'],
            datasets: [{
                data: [12, 5, 3],
                backgroundColor: [
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(155, 89, 182, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 204, 113, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
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
    
    // Create assignment form
    const createAssignmentForm = document.getElementById('createAssignmentForm');
    if (createAssignmentForm) {
        createAssignmentForm.addEventListener('submit', handleCreateAssignment);
        loadCoursesForDropdown('assignmentCourse');
    }
    
    // Create quiz form
    const createQuizForm = document.getElementById('createQuizForm');
    if (createQuizForm) {
        createQuizForm.addEventListener('submit', handleCreateQuiz);
        loadCoursesForDropdown('quizCourse');
    }
}

async function loadCoursesForDropdown(selectId) {
    try {
        const user = getCurrentUser();
        const response = await apiCall(`/api/courses/instructor/${user.id}`);
        if (!response.ok) return;
        
        const courses = await response.json();
        const select = document.getElementById(selectId);
        if (!select) return;
        
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.courseName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading courses for dropdown:', error);
    }
}

async function handleCreateAssignment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');
    
    const assignmentData = {
        title: formData.get('title'),
        description: formData.get('description'),
        maxPoints: parseInt(formData.get('maxPoints')),
        dueDate: formData.get('dueDate')
    };
    
    try {
        const response = await apiCall(`/api/assignments?courseId=${courseId}`, {
            method: 'POST',
            body: JSON.stringify(assignmentData)
        });
        
        if (response.ok) {
            showToast('Assignment created successfully!', 'success');
            closeCreateAssignmentModal();
            loadPendingAssignments();
            loadStats();
        } else {
            throw new Error('Failed to create assignment');
        }
    } catch (error) {
        console.error('Error creating assignment:', error);
        showToast('Failed to create assignment', 'error');
    }
}

let questionCount = 0;

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-block';
    questionDiv.style.border = '1px solid var(--border-color)';
    questionDiv.style.padding = '1rem';
    questionDiv.style.marginBottom = '1rem';
    questionDiv.style.borderRadius = '8px';
    
    questionDiv.innerHTML = `
        <div class="form-group">
            <label>Question ${questionCount}</label>
            <input type="text" name="question_${questionCount}" placeholder="Enter question" required>
        </div>
        <div class="form-group">
            <label>Option A</label>
            <input type="text" name="optionA_${questionCount}" placeholder="Option A" required>
        </div>
        <div class="form-group">
            <label>Option B</label>
            <input type="text" name="optionB_${questionCount}" placeholder="Option B" required>
        </div>
        <div class="form-group">
            <label>Option C</label>
            <input type="text" name="optionC_${questionCount}" placeholder="Option C" required>
        </div>
        <div class="form-group">
            <label>Option D</label>
            <input type="text" name="optionD_${questionCount}" placeholder="Option D" required>
        </div>
        <div class="form-group">
            <label>Correct Answer</label>
            <select name="correctAnswer_${questionCount}" required>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>
        </div>
        <div class="form-group">
            <label>Points</label>
            <input type="number" name="points_${questionCount}" min="1" value="1" required>
        </div>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeQuestion(this)">Remove Question</button>
    `;
    
    container.appendChild(questionDiv);
}

function removeQuestion(button) {
    button.parentElement.remove();
}

async function handleCreateQuiz(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');
    
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
        const questionText = formData.get(`question_${i}`);
        if (questionText) {
            questions.push({
                questionText: questionText,
                optionA: formData.get(`optionA_${i}`),
                optionB: formData.get(`optionB_${i}`),
                optionC: formData.get(`optionC_${i}`),
                optionD: formData.get(`optionD_${i}`),
                correctAnswer: formData.get(`correctAnswer_${i}`),
                points: parseInt(formData.get(`points_${i}`))
            });
        }
    }
    
    const quizData = {
        title: formData.get('title'),
        description: formData.get('description'),
        duration: parseInt(formData.get('duration')),
        totalPoints: parseInt(formData.get('totalPoints')),
        questions: questions
    };
    
    try {
        const response = await apiCall(`/api/quizzes?courseId=${courseId}`, {
            method: 'POST',
            body: JSON.stringify(quizData)
        });
        
        if (response.ok) {
            showToast('Quiz created successfully!', 'success');
            closeCreateQuizModal();
            questionCount = 0;
        } else {
            throw new Error('Failed to create quiz');
        }
    } catch (error) {
        console.error('Error creating quiz:', error);
        showToast('Failed to create quiz', 'error');
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

function openCreateAssignmentModal() {
    const modal = document.getElementById('createAssignmentModal');
    if (modal) {
        modal.style.display = 'block';
        loadCoursesForDropdown('assignmentCourse');
    }
}

function closeCreateAssignmentModal() {
    const modal = document.getElementById('createAssignmentModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('createAssignmentForm').reset();
    }
}

function openCreateQuizModal() {
    const modal = document.getElementById('createQuizModal');
    if (modal) {
        modal.style.display = 'block';
        loadCoursesForDropdown('quizCourse');
        // Clear questions
        document.getElementById('questionsContainer').innerHTML = '';
        questionCount = 0;
    }
}

function closeCreateQuizModal() {
    const modal = document.getElementById('createQuizModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('createQuizForm').reset();
        document.getElementById('questionsContainer').innerHTML = '';
        questionCount = 0;
    }
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
    const createCourseModal = document.getElementById('createCourseModal');
    const createAssignmentModal = document.getElementById('createAssignmentModal');
    const createQuizModal = document.getElementById('createQuizModal');
    
    if (event.target === createCourseModal) {
        closeCreateCourseModal();
    } else if (event.target === createAssignmentModal) {
        closeCreateAssignmentModal();
    } else if (event.target === createQuizModal) {
        closeCreateQuizModal();
    }
}
