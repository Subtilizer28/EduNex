package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCourseCode(String courseCode);
    
    List<Course> findByInstructor(User instructor);
    
    List<Course> findByInstructorId(Long instructorId);
    
    List<Course> findByIsActiveTrue();
    
    List<Course> findByCategory(String category);
    
    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.category IS NOT NULL")
    List<String> findAllCategories();
    
    @Query("SELECT c FROM Course c WHERE c.isActive = true")
    List<Course> findAvailableCourses();
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.instructor.id = :instructorId")
    long countByInstructorId(Long instructorId);
}
