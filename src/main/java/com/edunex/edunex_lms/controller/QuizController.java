package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Answer;
import com.edunex.edunex_lms.entity.Question;
import com.edunex.edunex_lms.entity.Quiz;
import com.edunex.edunex_lms.entity.QuizAttempt;
import com.edunex.edunex_lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {
    
    private final QuizService quizService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz, @RequestParam Long courseId) {
        Quiz created = quizService.createQuiz(quiz, courseId);
        return ResponseEntity.ok(created);
    }
    
    @PostMapping("/{quizId}/questions")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Question> addQuestion(@RequestBody Question question, @PathVariable Long quizId) {
        Question created = quizService.addQuestion(question, quizId);
        return ResponseEntity.ok(created);
    }
    
    @PostMapping("/{quizId}/start")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizAttempt> startQuizAttempt(@PathVariable Long quizId, @RequestParam Long studentId) {
        QuizAttempt attempt = quizService.startQuizAttempt(quizId, studentId);
        return ResponseEntity.ok(attempt);
    }
    
    @PostMapping("/attempts/{attemptId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<QuizAttempt> submitQuizAttempt(
            @PathVariable Long attemptId,
            @RequestBody List<Answer> answers) {
        QuizAttempt attempt = quizService.submitQuizAttempt(attemptId, answers);
        return ResponseEntity.ok(attempt);
    }
    
    @PostMapping("/attempts/{attemptId}/grade")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<QuizAttempt> gradeQuiz(@PathVariable Long attemptId) {
        QuizAttempt graded = quizService.gradeQuiz(attemptId);
        return ResponseEntity.ok(graded);
    }
    
    @GetMapping("/{quizId}/results")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<QuizAttempt>> getQuizResults(@PathVariable Long quizId) {
        List<QuizAttempt> results = quizService.getQuizResults(quizId);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/course/{courseId}/available")
    public ResponseEntity<List<Quiz>> getAvailableQuizzes(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizService.getAvailableQuizzes(courseId);
        return ResponseEntity.ok(quizzes);
    }
    
    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long quizId) {
        Quiz quiz = quizService.getQuizById(quizId);
        return ResponseEntity.ok(quiz);
    }
    
    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<Question>> getQuizQuestions(@PathVariable Long quizId) {
        List<Question> questions = quizService.getQuizQuestions(quizId);
        return ResponseEntity.ok(questions);
    }
}
