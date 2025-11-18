package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.*;
import com.edunex.edunex_lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ActivityLogService activityLogService;
    
    @Transactional
    public Quiz createQuiz(Quiz quiz, Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        quiz.setCourse(course);
        quiz.setIsActive(true);
        Quiz saved = quizRepository.save(quiz);
        
        // Log activity
        activityLogService.logActivity(
            "QUIZ_CREATED",
            "New quiz created: " + saved.getTitle() + " in course " + course.getCourseName(),
            course.getInstructor(),
            "Quiz",
            saved.getId()
        );
        
        return saved;
    }
    
    @Transactional
    public Question addQuestion(Question question, Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        question.setQuiz(quiz);
        return questionRepository.save(question);
    }
    
    @Transactional
    public QuizAttempt startQuizAttempt(Long quizId, Long studentId) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Check if student has attempts left
        long attemptCount = quizAttemptRepository.countByQuizIdAndStudentId(quizId, studentId);
        if (attemptCount >= quiz.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts reached");
        }
        
        // Check if quiz is active
        LocalDateTime now = LocalDateTime.now();
        if (quiz.getStartTime() != null && now.isBefore(quiz.getStartTime())) {
            throw new RuntimeException("Quiz has not started yet");
        }
        if (quiz.getEndTime() != null && now.isAfter(quiz.getEndTime())) {
            throw new RuntimeException("Quiz has ended");
        }
        
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setStudent(student);
        attempt.setStartedAt(now);
        attempt.setAttemptNumber((int) attemptCount + 1);
        attempt.setStatus(QuizAttempt.AttemptStatus.IN_PROGRESS);
        
        return quizAttemptRepository.save(attempt);
    }
    
    @Transactional
    public QuizAttempt submitQuizAttempt(Long attemptId, Map<Long, String> answers) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus(QuizAttempt.AttemptStatus.SUBMITTED);
        
        // Note: Answer storage simplified - answers are passed but not persisted individually
        // In a full implementation, you would store answers in a separate table or as JSON
        
        QuizAttempt saved = quizAttemptRepository.save(attempt);
        
        // Log activity
        activityLogService.logActivity(
            "QUIZ_ATTEMPTED",
            "Quiz attempted: " + attempt.getQuiz().getTitle() + " by " + attempt.getStudent().getFullName(),
            attempt.getStudent(),
            "QuizAttempt",
            saved.getId()
        );
        
        return saved;
    }
    
    @Transactional
    public QuizAttempt gradeQuiz(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        // Simplified grading - In a full implementation, you would:
        // 1. Retrieve stored answers from a separate table or JSON field
        // 2. Compare with correct answers from questions
        // 3. Calculate score
        
        // For now, mark as graded with placeholder scoring
        attempt.setStatus(QuizAttempt.AttemptStatus.GRADED);
        
        if (attempt.getTotalMarks() != null && attempt.getMarksObtained() != null && attempt.getTotalMarks() > 0) {
            double percentage = ((double) attempt.getMarksObtained() / attempt.getTotalMarks()) * 100;
            attempt.setPercentage(percentage);
        }
        
        return quizAttemptRepository.save(attempt);
    }
    
    public List<QuizAttempt> getQuizResults(Long quizId) {
        return quizAttemptRepository.findByQuizId(quizId);
    }
    
    public List<Quiz> getAvailableQuizzes(Long courseId) {
        return quizRepository.findActiveByCourseId(courseId);
    }
    
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
    
    public List<Question> getQuizQuestions(Long quizId) {
        return questionRepository.findByQuizIdOrderByQuestionOrderAsc(quizId);
    }
    
    public List<Quiz> getAvailableQuizzesForUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get user's enrolled courses
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(userId);
        List<Long> courseIds = enrollments.stream()
            .map(e -> e.getCourse().getId())
            .collect(Collectors.toList());
        
        // Get active quizzes from those courses
        List<Quiz> quizzes = new ArrayList<>();
        for (Long courseId : courseIds) {
            quizzes.addAll(quizRepository.findActiveByCourseId(courseId));
        }
        
        return quizzes;
    }
    
    public List<QuizAttempt> getUserAttempts(Long quizId, Long userId) {
        return quizAttemptRepository.findByQuizIdAndStudentId(quizId, userId);
    }
    
    public List<Quiz> getInstructorQuizzes(Long instructorId) {
        return quizRepository.findByInstructorId(instructorId);
    }
    
    public List<Quiz> getStudentQuizzes(Long studentId) {
        // Get student's enrolled courses
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        List<Long> courseIds = enrollments.stream()
            .map(e -> e.getCourse().getId())
            .collect(Collectors.toList());
        
        // Get quizzes from those courses
        if (courseIds.isEmpty()) {
            return new ArrayList<>();
        }
        return quizRepository.findByCourseIdIn(courseIds);
    }
    
    @Transactional
    public Quiz updateQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setDurationMinutes(quizDetails.getDurationMinutes());
        quiz.setTotalMarks(quizDetails.getTotalMarks());
        quiz.setPassingMarks(quizDetails.getPassingMarks());
        quiz.setStartTime(quizDetails.getStartTime());
        quiz.setEndTime(quizDetails.getEndTime());
        
        return quizRepository.save(quiz);
    }
    
    @Transactional
    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        quizRepository.delete(quiz);
        
        activityLogService.logActivity(
            "QUIZ_DELETED",
            "Quiz deleted: " + quiz.getTitle(),
            quiz.getCourse().getInstructor(),
            "Quiz",
            id
        );
    }
}
