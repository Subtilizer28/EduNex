package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByCourseId(Long courseId);
    
    List<Quiz> findByIsActiveTrue();
    
    @Query("SELECT q FROM Quiz q WHERE q.course.id = :courseId AND q.isActive = true")
    List<Quiz> findActiveByCourseId(Long courseId);
    
    @Query("SELECT q FROM Quiz q WHERE q.startTime <= :now AND q.endTime >= :now AND q.isActive = true")
    List<Quiz> findActiveQuizzesNow(LocalDateTime now);
    
    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.course.id = :courseId")
    long countByCourseId(Long courseId);
    
    @Query("SELECT q FROM Quiz q WHERE q.course.instructor.id = :instructorId")
    List<Quiz> findByInstructorId(Long instructorId);
    
    List<Quiz> findByCourseIdIn(List<Long> courseIds);
}
