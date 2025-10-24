package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    
    @GetMapping("/my-enrollments")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        return ResponseEntity.ok(enrollments);
    }
    
    @PostMapping("/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> enrollInCourse(
            @RequestParam Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already enrolled
        List<Enrollment> existing = enrollmentRepository.findByStudentId(user.getId());
        boolean alreadyEnrolled = existing.stream()
            .anyMatch(e -> e.getCourse().getId().equals(courseId));
        
        if (alreadyEnrolled) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        // Create new enrollment - this should use EnrollmentService
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(user);
        enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
        Enrollment saved = enrollmentRepository.save(enrollment);
        
        return ResponseEntity.ok(saved);
    }
}
