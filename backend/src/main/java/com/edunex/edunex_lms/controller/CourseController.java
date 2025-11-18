package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    private final EnrollmentRepository enrollmentRepository;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Course> createCourse(@RequestBody Course course, @RequestParam Long instructorId) {
        Course created = courseService.createCourse(course, instructorId);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Course updated = courseService.updateCourse(id, course);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return ResponseEntity.ok(course);
    }
    
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<?> getCoursesByInstructor(@PathVariable Long instructorId) {
        List<Course> courses = courseService.getCoursesByInstructor(instructorId);
        
        // Create response with enrollment counts
        List<Map<String, Object>> coursesWithEnrollments = courses.stream().map(course -> {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("id", course.getId());
            courseData.put("courseCode", course.getCourseCode());
            courseData.put("courseName", course.getCourseName());
            courseData.put("description", course.getDescription());
            courseData.put("category", course.getCategory());
            courseData.put("thumbnailUrl", course.getThumbnailUrl());
            courseData.put("credits", course.getCredits());
            courseData.put("maxStudents", course.getMaxStudents());
            courseData.put("isActive", course.getIsActive());
            courseData.put("instructor", course.getInstructor());
            courseData.put("createdAt", course.getCreatedAt());
            courseData.put("updatedAt", course.getUpdatedAt());
            
            // Get enrollment count
            long enrollmentCount = enrollmentRepository.countByCourseId(course.getId());
            courseData.put("enrollmentCount", enrollmentCount);
            
            return courseData;
        }).toList();
        
        return ResponseEntity.ok(coursesWithEnrollments);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        List<Course> courses = courseService.getAvailableCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String keyword) {
        List<Course> courses = courseService.searchCourses(keyword);
        return ResponseEntity.ok(courses);
    }
}
