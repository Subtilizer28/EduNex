// Quizzes Page JavaScript
let allQuizzes = [];
let enrolledCourses = [];
let currentQuiz = null;
let currentAttempt = null;
let timerInterval = null;
let questions = [];

document.addEventListener('DOMContentLoaded', () => {
    loadEnrolledCourses();
    loadQuizzes();
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

async function loadQuizzes() {
    try {
        const response = await fetch('/api/quizzes/available', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            allQuizzes = await response.json();
            displayQuizzes(allQuizzes);
        } else {
            showError('Failed to load quizzes');
        }
    } catch (error) {
        console.error('Error loading quizzes:', error);
        showError('Error loading quizzes');
    }
}

function displayQuizzes(quizzes) {
    const grid = document.getElementById('quizzesGrid');
    
    if (quizzes.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No quizzes available</p></div>';
        return;
    }

    grid.innerHTML = quizzes.map(quiz => {
        const status = getQuizStatus(quiz);
        return `
            <div class="quiz-card" data-status="${status}">
                <div class="quiz-header">
                    <h3>${quiz.title}</h3>
                    <span class="badge badge-${getStatusBadge(status)}">
                        ${status.toUpperCase()}
                    </span>
                </div>
                
                <div class="quiz-info">
                    <p class="course-name">📚 ${quiz.course.title}</p>
                    <p class="duration">⏱️ Duration: ${quiz.durationMinutes} minutes</p>
                    <p class="marks">🎯 Total Marks: ${quiz.totalMarks}</p>
                    <p class="questions">📝 Questions: ${quiz.questionCount || 0}</p>
                    ${quiz.attemptsUsed !== undefined ? `
                        <p class="attempts">🔄 Attempts: ${quiz.attemptsUsed}/${quiz.maxAttempts}</p>
                    ` : ''}
                </div>

                <div class="quiz-actions">
                    <button class="btn btn-sm btn-secondary" onclick="showQuizInfo(${quiz.id})">
                        View Details
                    </button>
                    ${status === 'available' ? `
                        <button class="btn btn-sm btn-primary" onclick="showQuizInfo(${quiz.id})">
                            Start Quiz
                        </button>
                    ` : ''}
                    ${status === 'completed' ? `
                        <button class="btn btn-sm btn-info" onclick="viewResults(${quiz.id})">
                            View Results
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function filterQuizzes() {
    const courseId = document.getElementById('courseFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filtered = allQuizzes;

    if (courseId) {
        filtered = filtered.filter(q => q.course.id == courseId);
    }

    if (status) {
        filtered = filtered.filter(q => getQuizStatus(q) === status);
    }

    displayQuizzes(filtered);
}

function getQuizStatus(quiz) {
    if (!quiz.attemptsUsed) return 'available';
    if (quiz.attemptsUsed >= quiz.maxAttempts) return 'completed';
    return 'available';
}

function getStatusBadge(status) {
    const badges = {
        'available': 'success',
        'in-progress': 'warning',
        'completed': 'info'
    };
    return badges[status] || 'secondary';
}

async function showQuizInfo(quizId) {
    currentQuiz = allQuizzes.find(q => q.id === quizId);
    
    document.getElementById('infoTitle').textContent = currentQuiz.title;
    document.getElementById('infoCourse').textContent = currentQuiz.course.title;
    document.getElementById('infoDuration').textContent = `${currentQuiz.durationMinutes} minutes`;
    document.getElementById('infoTotalMarks').textContent = currentQuiz.totalMarks;
    document.getElementById('infoPassingMarks').textContent = currentQuiz.passingMarks;
    document.getElementById('infoQuestions').textContent = currentQuiz.questionCount || 0;
    document.getElementById('infoDescription').textContent = currentQuiz.description || 'No additional instructions';
    
    const attemptsLeft = currentQuiz.maxAttempts - (currentQuiz.attemptsUsed || 0);
    document.getElementById('infoAttempts').textContent = attemptsLeft;
    
    document.getElementById('infoModal').style.display = 'block';
}

function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

async function startQuiz() {
    closeInfoModal();
    
    try {
        // Start quiz attempt
        const response = await fetch(`/api/quizzes/${currentQuiz.id}/start`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            currentAttempt = await response.json();
            await loadQuestions();
            displayQuizModal();
            startTimer();
        } else {
            const error = await response.text();
            showError(error || 'Failed to start quiz');
        }
    } catch (error) {
        console.error('Error starting quiz:', error);
        showError('Error starting quiz');
    }
}

async function loadQuestions() {
    try {
        const response = await fetch(`/api/quizzes/${currentQuiz.id}/questions`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            questions = await response.json();
        }
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function displayQuizModal() {
    document.getElementById('quizTitle').textContent = currentQuiz.title;
    document.getElementById('quizId').value = currentQuiz.id;
    document.getElementById('attemptId').value = currentAttempt.id;
    
    const container = document.getElementById('questionsContainer');
    container.innerHTML = questions.map((question, index) => `
        <div class="question-card">
            <div class="question-header">
                <h4>Question ${index + 1}</h4>
                <span class="marks">${question.marks} marks</span>
            </div>
            
            <p class="question-text">${question.questionText}</p>
            
            <div class="answers">
                ${renderAnswerOptions(question, index)}
            </div>
        </div>
    `).join('');
    
    document.getElementById('quizModal').style.display = 'block';
}

function renderAnswerOptions(question, qIndex) {
    if (question.questionType === 'MCQ' || question.questionType === 'TRUE_FALSE') {
        const options = question.questionType === 'TRUE_FALSE' 
            ? ['True', 'False'] 
            : question.options || [];
        
        return options.map((option, oIndex) => `
            <label class="answer-option">
                <input type="radio" name="question_${question.id}" value="${option}" required>
                <span>${option}</span>
            </label>
        `).join('');
    } else {
        return `
            <textarea name="question_${question.id}" class="form-control" rows="4" 
                      placeholder="Type your answer here..." required></textarea>
        `;
    }
}

function startTimer() {
    let timeLeft = currentQuiz.durationMinutes * 60; // Convert to seconds
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('timerDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz(new Event('submit'));
        }
        
        // Warning at 5 minutes
        if (timeLeft === 300) {
            alert('5 minutes remaining!');
        }
    }, 1000);
}

async function submitQuiz(event) {
    event.preventDefault();
    
    if (!confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
        return;
    }
    
    clearInterval(timerInterval);
    
    // Collect answers
    const answers = [];
    questions.forEach(question => {
        const input = document.querySelector(`[name="question_${question.id}"]`);
        if (input) {
            const answer = input.type === 'radio' 
                ? document.querySelector(`[name="question_${question.id}"]:checked`)?.value || ''
                : input.value;
            
            answers.push({
                questionId: question.id,
                studentAnswer: answer
            });
        }
    });
    
    try {
        const response = await fetch(`/api/quizzes/${currentAttempt.id}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ answers })
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('quizModal').style.display = 'none';
            showResults(result);
            loadQuizzes(); // Reload to update status
        } else {
            showError('Failed to submit quiz');
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        showError('Error submitting quiz');
    }
}

async function saveProgress() {
    showSuccess('Progress saved (feature coming soon)');
}

async function viewResults(quizId) {
    try {
        const response = await fetch(`/api/quizzes/${quizId}/my-attempts`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const attempts = await response.json();
            if (attempts.length > 0) {
                showResults(attempts[attempts.length - 1]); // Show latest attempt
            }
        }
    } catch (error) {
        console.error('Error loading results:', error);
    }
}

function showResults(attempt) {
    document.getElementById('resultScore').textContent = 
        `${attempt.marksObtained}/${attempt.totalMarks}`;
    document.getElementById('resultPercentage').textContent = 
        `${attempt.percentage.toFixed(2)}%`;
    document.getElementById('resultStatus').textContent = 
        attempt.status === 'PASSED' ? '✅ PASSED' : '❌ FAILED';
    
    // Show detailed results if available
    if (attempt.answers) {
        const details = document.getElementById('resultsDetails');
        details.innerHTML = `
            <h3>Question-wise Results</h3>
            ${attempt.answers.map((answer, index) => `
                <div class="result-item">
                    <p><strong>Question ${index + 1}:</strong></p>
                    <p>Your Answer: ${answer.studentAnswer}</p>
                    <p>Marks: ${answer.marksAwarded}/${answer.question.marks}</p>
                    ${answer.isCorrect !== undefined ? 
                        `<span class="${answer.isCorrect ? 'correct' : 'incorrect'}">
                            ${answer.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                        </span>` : ''
                    }
                </div>
            `).join('')}
        `;
    }
    
    document.getElementById('resultsModal').style.display = 'block';
}

function closeResultsModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

function showSuccess(message) {
    alert(message); // Replace with toast notification
}

function showError(message) {
    alert(message); // Replace with toast notification
}

// Close modals when clicking outside
window.onclick = function(event) {
    const infoModal = document.getElementById('infoModal');
    const resultsModal = document.getElementById('resultsModal');
    
    if (event.target === infoModal) {
        closeInfoModal();
    }
    if (event.target === resultsModal) {
        closeResultsModal();
    }
}

// Prevent accidental page close during quiz
window.addEventListener('beforeunload', (e) => {
    if (timerInterval) {
        e.preventDefault();
        e.returnValue = '';
    }
});
