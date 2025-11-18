package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    
    @Transactional
    public Course createCourse(Course course, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        User.Role role = instructor.getRole();
        if (role != User.Role.INSTRUCTOR && role != User.Role.ADMIN) {
            throw new RuntimeException("Only instructors can create courses");
        }
        
        course.setInstructor(instructor);
        return courseRepository.save(course);
    }
    
    @Transactional
    public Course updateCourse(Long courseId, Course updatedCourse) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        course.setCourseName(updatedCourse.getCourseName());
        course.setCourseCode(updatedCourse.getCourseCode());
        course.setDescription(updatedCourse.getDescription());
        course.setCredits(updatedCourse.getCredits());
        course.setMaxStudents(updatedCourse.getMaxStudents());
        
        return courseRepository.save(course);
    }
    
    @Transactional
    public void deleteCourse(Long courseId) {
        log.info("Attempting to delete course with ID: {}", courseId);
        
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        log.info("Found course: {}", course.getCourseName());
        
        // Delete all enrollments first (cascade delete)
        log.info("Deleting enrollments for course ID: {}", courseId);
        enrollmentRepository.deleteByCourseId(courseId);
        
        // Then delete the course
        log.info("Deleting course: {}", course.getCourseName());
        courseRepository.delete(course);
        
        log.info("Course deleted successfully: {}", courseId);
    }
    
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public List<Course> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }
    
    public List<Course> getAvailableCourses() {
        return courseRepository.findAll().stream()
            .filter(Course::getIsActive)
            .toList();
    }
    
    public List<Course> searchCourses(String keyword) {
        return courseRepository.findAll().stream()
            .filter(c -> c.getCourseName().toLowerCase().contains(keyword.toLowerCase()) ||
                        c.getCourseCode().toLowerCase().contains(keyword.toLowerCase()))
            .toList();
    }
}
