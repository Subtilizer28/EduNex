package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.*;
import com.edunex.edunex_lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {
    
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AnswerRepository answerRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Quiz createQuiz(Quiz quiz, Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        quiz.setCourse(course);
        quiz.setActive(true);
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
        attempt.setStartTime(now);
        attempt.setAttemptNumber((int) attemptCount + 1);
        
        return quizAttemptRepository.save(attempt);
    }
    
    @Transactional
    public QuizAttempt submitQuizAttempt(Long attemptId, List<Answer> answers) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
            .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        attempt.setEndTime(LocalDateTime.now());
        
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
        double totalScore = 0.0;
        double maxScore = 0.0;
        
        for (Answer answer : answers) {
            Question question = answer.getQuestion();
            maxScore += question.getMarks();
            
            // Auto-grade MCQ and True/False
            if (question.getType().equals("MCQ") || question.getType().equals("TRUE_FALSE")) {
                if (answer.getAnswerText().equalsIgnoreCase(question.getCorrectAnswer())) {
                    answer.setMarksObtained(question.getMarks());
                    totalScore += question.getMarks();
                } else {
                    answer.setMarksObtained(0.0);
                }
                answerRepository.save(answer);
            }
        }
        
        attempt.setScore(totalScore);
        
        // Calculate percentage
        if (maxScore > 0) {
            double percentage = (totalScore / maxScore) * 100;
            attempt.setScore(percentage);
        }
        
        return quizAttemptRepository.save(attempt);
    }
    
    public List<QuizAttempt> getQuizResults(Long quizId) {
        return quizAttemptRepository.findByQuizId(quizId);
    }
    
    public List<Quiz> getAvailableQuizzes(Long courseId) {
        return quizRepository.findByCourseIdAndActiveTrue(courseId);
    }
    
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
    
    public List<Question> getQuizQuestions(Long quizId) {
        return questionRepository.findByQuizIdOrderByQuestionNumberAsc(quizId);
    }
}
