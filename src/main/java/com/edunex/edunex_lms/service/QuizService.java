package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.*;
import com.edunex.edunex_lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AnswerRepository answerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    
    @Transactional
    public Quiz createQuiz(Quiz quiz, Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        quiz.setCourse(course);
        quiz.setIsActive(true);
        return quizRepository.save(quiz);
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
    public QuizAttempt submitQuizAttempt(Long attemptId, List<Answer> answers) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        attempt.setSubmittedAt(LocalDateTime.now());
        attempt.setStatus(QuizAttempt.AttemptStatus.SUBMITTED);
        
        // Save all answers
        for (Answer answer : answers) {
            answer.setQuizAttempt(attempt);
            answerRepository.save(answer);
        }
        
        // Auto-grade if possible
        gradeQuiz(attemptId);
        
        return quizAttemptRepository.save(attempt);
    }
    
    @Transactional
    public QuizAttempt gradeQuiz(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        List<Answer> answers = answerRepository.findByQuizAttemptId(attemptId);
        int totalScore = 0;
        int maxScore = 0;
        
        for (Answer answer : answers) {
            Question question = answer.getQuestion();
            maxScore += question.getMarks();
            
            // Auto-grade MCQ and True/False
            if (question.getQuestionType() == Question.QuestionType.MCQ || 
                question.getQuestionType() == Question.QuestionType.TRUE_FALSE) {
                if (answer.getStudentAnswer() != null && 
                    answer.getStudentAnswer().equalsIgnoreCase(question.getCorrectAnswer())) {
                    answer.setIsCorrect(true);
                    answer.setMarksAwarded(question.getMarks());
                    totalScore += question.getMarks();
                } else {
                    answer.setIsCorrect(false);
                    answer.setMarksAwarded(0);
                }
                answerRepository.save(answer);
            }
        }
        
        attempt.setMarksObtained(totalScore);
        attempt.setTotalMarks(maxScore);
        
        // Calculate percentage
        if (maxScore > 0) {
            double percentage = ((double) totalScore / maxScore) * 100;
            attempt.setPercentage(percentage);
        }
        
        attempt.setStatus(QuizAttempt.AttemptStatus.GRADED);
        
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
}
