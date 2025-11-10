// Instructor Combined JavaScript
let questionCount = 0;
let allCourses = [];

// Page detection and initialization
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    const path = window.location.pathname;
    
    if (path.includes('/instructor/courses')) {
        initCoursesPage();
    } else if (path.includes('/instructor/assignments')) {
        initAssignmentsPage();
    } else if (path.includes('/instructor/quizzes')) {
        initQuizzesPage();
    } else if (path.includes('/instructor/dashboard')) {
        initDashboardPage();
    }
});

// ==================== COURSES PAGE ====================
function initCoursesPage() {
    loadInstructorCourses();
    setupCoursesListeners();
}

async function loadInstructorCourses() {
    try {
        const user = getCurrentUser();
        if (!user) {
            showToast('Please login first', 'error');
            return;
        }
        
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        allCourses = courses;
        displayCourses(allCourses);
    } catch (error) {
        console.error('Error loading courses:', error);
        const tbody = document.getElementById('coursesList');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Failed to load courses. Please try again.</td></tr>';
        }
    }
}

function displayCourses(courses) {
    const tbody = document.getElementById('coursesList');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No courses yet. Create your first course!</td></tr>';
        return;
    }
    
    courses.forEach(course => {
        const row = document.createElement('tr');
        
        const startDate = course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A';
        const endDate = course.endDate ? new Date(course.endDate).toLocaleDateString() : 'N/A';
        const enrollmentCount = course.enrollments?.length || 0;
        const today = new Date();
        const start = course.startDate ? new Date(course.startDate) : null;
        const end = course.endDate ? new Date(course.endDate) : null;
        
        let status = 'Active';
        let statusClass = 'success';
        if (start && today < start) {
            status = 'Upcoming';
            statusClass = 'info';
        } else if (end && today > end) {
            status = 'Completed';
            statusClass = 'secondary';
        }
        
        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.credits}</td>
            <td>${enrollmentCount} / ${course.maxStudents}</td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td><span class="badge badge-${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewCourse(${course.id})">View</button>
                <button class="btn btn-sm btn-primary" onclick="editCourse(${course.id})">Edit</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.style.padding = '1.5rem';
    
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
            <button class="btn btn-primary" onclick="editCourse(${course.id})">
                Edit Course
            </button>
        </div>
    `;
    
    return card;
}

function viewCourseDetails(courseId) {
    viewCourse(courseId);
}

function viewCourse(courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) {
        showToast('Course not found', 'error');
        return;
    }

    document.getElementById('viewEditModalTitle').textContent = 'Course Details';
    const content = document.getElementById('viewEditCourseContent');
    
    const enrollmentCount = course.enrollments?.length || 0;
    const startDate = course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A';
    const endDate = course.endDate ? new Date(course.endDate).toLocaleDateString() : 'N/A';
    
    content.innerHTML = `
        <div class="course-details">
            <div class="detail-group">
                <label>Course Name:</label>
                <p>${course.courseName}</p>
            </div>
            <div class="detail-group">
                <label>Course Code:</label>
                <p>${course.courseCode}</p>
            </div>
            <div class="detail-group">
                <label>Description:</label>
                <p>${course.description || 'N/A'}</p>
            </div>
            <div class="detail-row">
                <div class="detail-group">
                    <label>Credits:</label>
                    <p>${course.credits}</p>
                </div>
                <div class="detail-group">
                    <label>Enrollments:</label>
                    <p>${enrollmentCount} / ${course.maxStudents}</p>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-group">
                    <label>Start Date:</label>
                    <p>${startDate}</p>
                </div>
                <div class="detail-group">
                    <label>End Date:</label>
                    <p>${endDate}</p>
                </div>
            </div>
            <div class="modal-actions" style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="editCourse(${course.id})">Edit Course</button>
                <button class="btn btn-success" onclick="openBulkEnrollModal(${course.id}, '${course.courseName}')">Bulk Enroll</button>
                <button class="btn btn-secondary" onclick="closeViewEditCourseModal()">Close</button>
            </div>
        </div>
    `;
    
    document.getElementById('viewEditCourseModal').style.display = 'block';
}

function editCourse(courseId) {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) {
        showToast('Course not found', 'error');
        return;
    }

    document.getElementById('viewEditModalTitle').textContent = 'Edit Course';
    const content = document.getElementById('viewEditCourseContent');
    
    const startDate = course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '';
    const endDate = course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '';
    
    content.innerHTML = `
        <form id="editCourseForm" style="padding: 1rem 0;">
            <div class="form-group">
                <label for="editCourseName">Course Name</label>
                <input type="text" id="editCourseName" value="${course.courseName}" required>
            </div>
            <div class="form-group">
                <label for="editCourseCode">Course Code</label>
                <input type="text" id="editCourseCode" value="${course.courseCode}" required>
            </div>
            <div class="form-group">
                <label for="editDescription">Description</label>
                <textarea id="editDescription" rows="4" required>${course.description || ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="editCredits">Credits</label>
                    <input type="number" id="editCredits" value="${course.credits}" min="1" max="6" required>
                </div>
                <div class="form-group">
                    <label for="editMaxStudents">Max Students</label>
                    <input type="number" id="editMaxStudents" value="${course.maxStudents}" min="1" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="editStartDate">Start Date</label>
                    <input type="date" id="editStartDate" value="${startDate}" required>
                </div>
                <div class="form-group">
                    <label for="editEndDate">End Date</label>
                    <input type="date" id="editEndDate" value="${endDate}" required>
                </div>
            </div>
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button type="button" class="btn btn-secondary" onclick="closeViewEditCourseModal()">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('editCourseForm').addEventListener('submit', (e) => handleEditCourse(e, courseId));
    document.getElementById('viewEditCourseModal').style.display = 'block';
}

function closeViewEditCourseModal() {
    document.getElementById('viewEditCourseModal').style.display = 'none';
}

async function handleEditCourse(e, courseId) {
    e.preventDefault();
    
    const formData = {
        courseName: document.getElementById('editCourseName').value,
        courseCode: document.getElementById('editCourseCode').value,
        description: document.getElementById('editDescription').value,
        credits: parseInt(document.getElementById('editCredits').value),
        maxStudents: parseInt(document.getElementById('editMaxStudents').value),
        startDate: document.getElementById('editStartDate').value,
        endDate: document.getElementById('editEndDate').value
    };

    try {
        await apiCall(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        showToast('Course updated successfully', 'success');
        closeViewEditCourseModal();
        await loadAllCourses();
    } catch (error) {
        console.error('Error updating course:', error);
        showToast('Failed to update course', 'error');
    }
}

let currentCourseId = null;
let currentCourseName = '';

function openBulkEnrollModal(courseId, courseName) {
    currentCourseId = courseId;
    currentCourseName = courseName;
    document.getElementById('bulkEnrollCourseName').textContent = courseName;
    document.getElementById('bulkEnrollModal').style.display = 'block';
    document.getElementById('bulkEnrollResult').style.display = 'none';
    document.getElementById('bulkEnrollForm').reset();
}

function closeBulkEnrollModal() {
    document.getElementById('bulkEnrollModal').style.display = 'none';
    currentCourseId = null;
    currentCourseName = '';
}

function submitBulkEnroll() {
    const prefix = document.getElementById('usnPrefix').value.trim();
    const startRange = parseInt(document.getElementById('startRange').value);
    const endRange = parseInt(document.getElementById('endRange').value);

    if (!prefix) {
        alert('Please enter a USN prefix');
        return;
    }

    if (isNaN(startRange) || isNaN(endRange)) {
        alert('Please enter valid start and end range numbers');
        return;
    }

    if (startRange > endRange) {
        alert('Start range must be less than or equal to end range');
        return;
    }

    if (endRange - startRange > 500) {
        alert('Range cannot exceed 500 students. Please use smaller batches.');
        return;
    }

    const submitBtn = document.getElementById('submitBulkEnroll');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enrolling...';

    fetch('/api/enrollments/bulk-enroll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            courseId: currentCourseId,
            prefix: prefix,
            startRange: startRange,
            endRange: endRange
        })
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enroll Students';

        const resultDiv = document.getElementById('bulkEnrollResult');
        resultDiv.style.display = 'block';
        
        let resultHtml = '<h4>Bulk Enrollment Results</h4>';
        resultHtml += '<p><strong>Course:</strong> ' + currentCourseName + '</p>';
        resultHtml += '<p><strong>Total Enrolled:</strong> ' + data.enrolledCount + '</p>';
        resultHtml += '<p><strong>Already Enrolled:</strong> ' + data.alreadyEnrolledCount + '</p>';
        resultHtml += '<p><strong>Failed:</strong> ' + data.failedCount + '</p>';

        if (data.failed && data.failed.length > 0) {
            resultHtml += '<h5>Failed Enrollments:</h5><ul>';
            data.failed.forEach(fail => {
                resultHtml += '<li>' + fail.usn + ': ' + fail.reason + '</li>';
            });
            resultHtml += '</ul>';
        }

        resultDiv.innerHTML = resultHtml;
        document.getElementById('bulkEnrollForm').reset();
        
        // Reload courses to update enrollment counts
        loadAllCourses();
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enroll Students';
        console.error('Error:', error);
        alert('Failed to process bulk enrollment. Please try again.');
    });
}

function setupCoursesListeners() {
    const createCourseForm = document.getElementById('createCourseForm');
    if (createCourseForm) {
        createCourseForm.addEventListener('submit', handleCreateCourse);
    }
}

async function handleCreateCourse(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        showToast('Please login first', 'error');
        return;
    }
    
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
            loadInstructorCourses();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create course');
        }
    } catch (error) {
        console.error('Error creating course:', error);
        showToast(error.message || 'Failed to create course', 'error');
    }
}

// ==================== ASSIGNMENTS PAGE ====================
function initAssignmentsPage() {
    loadInstructorAssignments();
    setupAssignmentsListeners();
}

async function loadInstructorAssignments() {
    try {
        const user = getCurrentUser();
        if (!user) {
            showToast('Please login first', 'error');
            return;
        }
        
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        const tbody = document.getElementById('assignmentsList');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        let hasAssignments = false;
        
        for (const course of courses) {
            try {
                const assignments = await apiCall(`/api/assignments/course/${course.id}`);
                
                assignments.forEach(assignment => {
                    hasAssignments = true;
                    const row = document.createElement('tr');
                    
                    const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'N/A';
                    const submissionCount = assignment.submissions?.length || 0;
                    
                    row.innerHTML = `
                        <td>${assignment.title}</td>
                        <td>${course.courseName}</td>
                        <td>${dueDate}</td>
                        <td>${assignment.maxPoints}</td>
                        <td>${submissionCount}</td>
                        <td><span class="badge badge-success">Active</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="viewAssignment(${assignment.id})">View</button>
                            <button class="btn btn-sm btn-primary" onclick="gradeSubmissions(${assignment.id})">Grade</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (err) {
                console.warn('Failed to load assignments for course', course.id, err);
            }
        }
        
        if (!hasAssignments) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No assignments yet. Create your first assignment!</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading assignments:', error);
        const tbody = document.getElementById('assignmentsList');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Failed to load assignments. Please try again.</td></tr>';
        }
    }
}

function viewAssignment(assignmentId) {
    showToast('View assignment details coming soon', 'info');
}

function gradeSubmissions(assignmentId) {
    showToast('Grade submissions coming soon', 'info');
}

function setupAssignmentsListeners() {
    const createAssignmentForm = document.getElementById('createAssignmentForm');
    if (createAssignmentForm) {
        createAssignmentForm.addEventListener('submit', handleCreateAssignment);
        loadCoursesForDropdown('assignmentCourse');
    }
}

async function handleCreateAssignment(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const courseId = formData.get('courseId');
    
    if (!courseId) {
        showToast('Please select a course', 'error');
        return;
    }
    
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
            loadInstructorAssignments();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create assignment');
        }
    } catch (error) {
        console.error('Error creating assignment:', error);
        showToast(error.message || 'Failed to create assignment', 'error');
    }
}

// ==================== QUIZZES PAGE ====================
function initQuizzesPage() {
    loadInstructorQuizzes();
    setupQuizzesListeners();
}

async function loadInstructorQuizzes() {
    try {
        const user = getCurrentUser();
        if (!user) {
            showToast('Please login first', 'error');
            return;
        }
        
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        const tbody = document.getElementById('quizzesList');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        let hasQuizzes = false;
        
        for (const course of courses) {
            try {
                const quizzes = await apiCall(`/api/quizzes/course/${course.id}`);
                
                quizzes.forEach(quiz => {
                    hasQuizzes = true;
                    const row = document.createElement('tr');
                    
                    const questionCount = quiz.questions?.length || 0;
                    
                    row.innerHTML = `
                        <td>${quiz.title}</td>
                        <td>${course.courseName}</td>
                        <td>${quiz.duration} min</td>
                        <td>${quiz.totalPoints}</td>
                        <td>${questionCount}</td>
                        <td><span class="badge badge-success">Active</span></td>
                        <td>
                            <button class="btn btn-sm btn-secondary" onclick="viewQuiz(${quiz.id})">View</button>
                            <button class="btn btn-sm btn-primary" onclick="viewAttempts(${quiz.id})">Attempts</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            } catch (err) {
                console.warn('Failed to load quizzes for course', course.id, err);
            }
        }
        
        if (!hasQuizzes) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No quizzes yet. Create your first quiz!</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading quizzes:', error);
        const tbody = document.getElementById('quizzesList');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Failed to load quizzes. Please try again.</td></tr>';
        }
    }
}

function viewQuiz(quizId) {
    showToast('View quiz details coming soon', 'info');
}

function viewAttempts(quizId) {
    showToast('View quiz attempts coming soon', 'info');
}

function setupQuizzesListeners() {
    const createQuizForm = document.getElementById('createQuizForm');
    if (createQuizForm) {
        createQuizForm.addEventListener('submit', handleCreateQuiz);
        loadCoursesForDropdown('quizCourse');
    }
}

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-block';
    questionDiv.style.border = '1px solid var(--border-color)';
    questionDiv.style.padding = '1rem';
    questionDiv.style.marginBottom = '1rem';
    questionDiv.style.borderRadius = '8px';
    questionDiv.style.backgroundColor = 'var(--bg-secondary)';
    
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
    
    if (!courseId) {
        showToast('Please select a course', 'error');
        return;
    }
    
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
    
    if (questions.length === 0) {
        showToast('Please add at least one question', 'error');
        return;
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
            loadInstructorQuizzes();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create quiz');
        }
    } catch (error) {
        console.error('Error creating quiz:', error);
        showToast(error.message || 'Failed to create quiz', 'error');
    }
}

// ==================== DASHBOARD PAGE ====================
function initDashboardPage() {
    loadInstructorData();
    setupDashboardListeners();
}

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
        
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        document.getElementById('totalCourses').textContent = courses.length || 0;
        
        let totalStudents = 0;
        for (const course of courses) {
            try {
                const enrollments = await apiCall(`/api/enrollments/course/${course.id}`);
                totalStudents += enrollments.length;
            } catch (err) {
                console.warn('Failed to load enrollments for course', course.id);
            }
        }
        document.getElementById('totalStudents').textContent = totalStudents;
        
        let pendingCount = 0;
        for (const course of courses) {
            try {
                const submissions = await apiCall(`/api/assignments/course/${course.id}/submissions`);
                pendingCount += submissions.filter(s => s.status === 'SUBMITTED').length;
            } catch (err) {
                console.warn('Failed to load submissions for course', course.id);
            }
        }
        document.getElementById('pendingGrading').textContent = pendingCount;
        
        document.getElementById('avgRating').textContent = '4.5';
        
    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('totalCourses').textContent = '0';
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('pendingGrading').textContent = '0';
        document.getElementById('avgRating').textContent = '0.0';
    }
}

async function loadCourses() {
    try {
        const user = getCurrentUser();
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        
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
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        
        const tbody = document.getElementById('pendingAssignments');
        tbody.innerHTML = '';
        
        let hasAssignments = false;
        
        for (const course of courses) {
            try {
                const submissions = await apiCall(`/api/assignments/course/${course.id}/submissions`);
                
                submissions.filter(s => s.status === 'SUBMITTED').forEach(submission => {
                    hasAssignments = true;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${submission.student?.usn || 'N/A'}</td>
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
            } catch (err) {
                console.warn('Failed to load submissions for course', course.id);
            }
        }
        
        if (!hasAssignments) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No pending assignments</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading assignments:', error);
        const tbody = document.getElementById('pendingAssignments');
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Failed to load assignments</td></tr>';
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

function setupDashboardListeners() {
    const createCourseForm = document.getElementById('createCourseForm');
    if (createCourseForm) {
        createCourseForm.addEventListener('submit', handleCreateCourse);
    }
    
    const createAssignmentForm = document.getElementById('createAssignmentForm');
    if (createAssignmentForm) {
        createAssignmentForm.addEventListener('submit', handleCreateAssignment);
        loadCoursesForDropdown('assignmentCourse');
    }
    
    const createQuizForm = document.getElementById('createQuizForm');
    if (createQuizForm) {
        createQuizForm.addEventListener('submit', handleCreateQuiz);
        loadCoursesForDropdown('quizCourse');
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

// ==================== SHARED UTILITIES ====================
async function loadCoursesForDropdown(selectId) {
    try {
        const user = getCurrentUser();
        if (!user) return;
        
        const courses = await apiCall(`/api/courses/instructor/${user.id}`);
        const select = document.getElementById(selectId);
        if (!select) return;
        
        select.innerHTML = '<option value="">-- Select Course --</option>';
        
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

// ==================== MODAL CONTROLS ====================
function openCreateCourseModal() {
    document.getElementById('createCourseModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCreateCourseModal() {
    document.getElementById('createCourseModal').style.display = 'none';
    document.getElementById('createCourseForm').reset();
    document.body.style.overflow = 'auto';
}

function openCreateAssignmentModal() {
    const modal = document.getElementById('createAssignmentModal');
    if (modal) {
        modal.style.display = 'block';
        loadCoursesForDropdown('assignmentCourse');
        document.body.style.overflow = 'hidden';
    }
}

function closeCreateAssignmentModal() {
    const modal = document.getElementById('createAssignmentModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('createAssignmentForm').reset();
        document.body.style.overflow = 'auto';
    }
}

function openCreateQuizModal() {
    const modal = document.getElementById('createQuizModal');
    if (modal) {
        modal.style.display = 'block';
        loadCoursesForDropdown('quizCourse');
        document.getElementById('questionsContainer').innerHTML = '';
        questionCount = 0;
        document.body.style.overflow = 'hidden';
    }
}

function closeCreateQuizModal() {
    const modal = document.getElementById('createQuizModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('createQuizForm').reset();
        document.getElementById('questionsContainer').innerHTML = '';
        questionCount = 0;
        document.body.style.overflow = 'auto';
    }
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
