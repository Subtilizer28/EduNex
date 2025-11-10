package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    
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
    
    @PostMapping("/bulk-enroll")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public ResponseEntity<Map<String, Object>> bulkEnroll(@RequestBody Map<String, Object> request) {
        Long courseId = Long.valueOf(request.get("courseId").toString());
        String prefix = request.get("prefix").toString();
        int startRange = Integer.parseInt(request.get("startRange").toString());
        int endRange = Integer.parseInt(request.get("endRange").toString());
        
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        List<String> enrolled = new ArrayList<>();
        List<String> failed = new ArrayList<>();
        List<String> alreadyEnrolled = new ArrayList<>();
        
        for (int i = startRange; i <= endRange; i++) {
            String usn = prefix + String.format("%03d", i);
            
            try {
                User student = userRepository.findByUsn(usn).orElse(null);
                
                if (student == null) {
                    failed.add(usn + " (User not found)");
                    continue;
                }
                
                if (!student.getRole().equals(User.Role.STUDENT)) {
                    failed.add(usn + " (Not a student)");
                    continue;
                }
                
                // Check if already enrolled
                boolean exists = enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
                if (exists) {
                    alreadyEnrolled.add(usn);
                    continue;
                }
                
                Enrollment enrollment = new Enrollment();
                enrollment.setStudent(student);
                enrollment.setCourse(course);
                enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                enrollmentRepository.save(enrollment);
                
                enrolled.add(usn);
            } catch (Exception e) {
                failed.add(usn + " (" + e.getMessage() + ")");
            }
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("enrolled", enrolled);
        response.put("enrolledCount", enrolled.size());
        response.put("alreadyEnrolled", alreadyEnrolled);
        response.put("alreadyEnrolledCount", alreadyEnrolled.size());
        response.put("failed", failed);
        response.put("failedCount", failed.size());
        
        return ResponseEntity.ok(response);
    }
}
