package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {
    
    private final EnrollmentService enrollmentService;
    
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> enrollStudent(@RequestParam Long studentId, @RequestParam Long courseId) {
        Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(enrollment);
    }
    
    @PutMapping("/{id}/drop")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> dropCourse(@PathVariable Long id) {
        enrollmentService.dropCourse(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> getStudentEnrollments(@PathVariable Long studentId) {
        List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(studentId);
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(courseId);
        return ResponseEntity.ok(enrollments);
    }
    
    @PutMapping("/{id}/progress")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Enrollment> updateProgress(@PathVariable Long id, @RequestParam Double progress) {
        Enrollment enrollment = enrollmentService.updateProgress(id, progress);
        return ResponseEntity.ok(enrollment);
    }
    
    @PutMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Enrollment> calculateFinalGrade(@PathVariable Long id, @RequestParam Double grade) {
        Enrollment enrollment = enrollmentService.calculateFinalGrade(id, grade);
        return ResponseEntity.ok(enrollment);
    }
}
