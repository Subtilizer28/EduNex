package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    List<QuizAttempt> findByQuizId(Long quizId);
    
    List<QuizAttempt> findByStudentId(Long studentId);
    
    List<QuizAttempt> findByQuizIdAndStudentId(Long quizId, Long studentId);
    
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.quiz.id = :quizId AND qa.student.id = :studentId")
    long countByQuizIdAndStudentId(Long quizId, Long studentId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quiz.id = :quizId AND qa.student.id = :studentId ORDER BY qa.percentage DESC")
    Optional<QuizAttempt> findBestAttempt(Long quizId, Long studentId);
    
    @Query("SELECT AVG(qa.percentage) FROM QuizAttempt qa WHERE qa.quiz.id = :quizId")
    Double getAverageScoreByQuizId(Long quizId);
}
