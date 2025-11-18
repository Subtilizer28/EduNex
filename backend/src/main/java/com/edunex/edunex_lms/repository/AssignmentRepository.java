package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.Assignment;
import com.edunex.edunex_lms.entity.Assignment.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByCourseId(Long courseId);
    
    List<Assignment> findByStudentId(Long studentId);
    
    List<Assignment> findByCourseIdAndStudentId(Long courseId, Long studentId);
    
    List<Assignment> findByStatus(SubmissionStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.student IS NULL")
    List<Assignment> findAssignmentsByCourseId(Long courseId);
    
    @Query("SELECT a FROM Assignment a WHERE a.student.id = :studentId AND a.status = :status")
    List<Assignment> findByStudentIdAndStatus(Long studentId, SubmissionStatus status);
    
    @Query("SELECT a FROM Assignment a WHERE a.course.id = :courseId AND a.dueDate < :now AND a.status = 'PENDING'")
    List<Assignment> findOverdueAssignments(Long courseId, LocalDateTime now);
    
    Optional<Assignment> findByIdAndStudentId(Long id, Long studentId);
    
    List<Assignment> findByCourseIdAndTitleAndStudentIsNotNull(Long courseId, String title);
}
