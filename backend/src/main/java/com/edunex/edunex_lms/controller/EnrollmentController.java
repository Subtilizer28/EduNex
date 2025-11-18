package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> getCourseEnrollments(@PathVariable Long courseId) {
        // Use JOIN FETCH to eagerly load student data
        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdWithStudent(courseId);
        
        // Map to DTOs to avoid lazy loading issues
        List<Map<String, Object>> enrollmentDTOs = enrollments.stream().map(enrollment -> {
            Map<String, Object> dto = new HashMap<>();
            dto.put("id", enrollment.getId());
            dto.put("enrolledAt", enrollment.getEnrolledAt());
            dto.put("status", enrollment.getStatus());
            dto.put("progressPercentage", enrollment.getProgressPercentage());
            
            // Student info - now safely accessible due to JOIN FETCH
            if (enrollment.getStudent() != null) {
                Map<String, Object> studentInfo = new HashMap<>();
                studentInfo.put("id", enrollment.getStudent().getId());
                studentInfo.put("username", enrollment.getStudent().getUsername());
                studentInfo.put("fullName", enrollment.getStudent().getFullName());
                studentInfo.put("email", enrollment.getStudent().getEmail());
                studentInfo.put("usn", enrollment.getStudent().getUsn());
                dto.put("student", studentInfo);
            }
            
            return dto;
        }).toList();
        
        return ResponseEntity.ok(enrollmentDTOs);
    }
    
    @PostMapping("/enroll")
    @PreAuthorize("hasAnyRole('STUDENT','ADMIN','INSTRUCTOR')")
    public ResponseEntity<?> enrollInCourse(
            @RequestBody(required = false) Map<String, Object> request,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            Long courseId = null;
            Long studentId = null;

            if (request != null && request.get("courseId") != null) {
                courseId = Long.valueOf(request.get("courseId").toString());
            }
            if (request != null && request.get("studentId") != null) {
                studentId = Long.valueOf(request.get("studentId").toString());
            }

            if (courseId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing courseId", "success", false));
            }

            // Determine the student: if studentId provided (admin/instructor action) use it,
            // otherwise use the authenticated user (self-enroll)
            User actingUser = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            User student;
            if (studentId != null) {
                // Only ADMIN or INSTRUCTOR may enroll other students
                if (!(actingUser.getRole() == User.Role.ADMIN || actingUser.getRole() == User.Role.INSTRUCTOR)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Not authorized to enroll other students", "success", false));
                }

                student = userRepository.findById(studentId).orElse(null);
                if (student == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Student not found", "success", false));
                }
            } else {
                // Self-enroll: ensure the acting user is a student
                if (actingUser.getRole() != User.Role.STUDENT) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only students can self-enroll", "success", false));
                }
                student = actingUser;
            }

            if (!student.getRole().equals(User.Role.STUDENT)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User is not a student", "success", false));
            }

            Course course = courseRepository.findById(courseId).orElse(null);
            if (course == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Course not found", "success", false));
            }

            // Check if already enrolled
            boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
            if (alreadyEnrolled) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Student is already enrolled in this course", "success", false));
            }

            // Create and save enrollment
            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setCourse(course);
            enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
            Enrollment saved = enrollmentRepository.save(enrollment);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Student enrolled successfully",
                "enrollment", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage(), "success", false));
        }
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
        List<Map<String, String>> failed = new ArrayList<>();
        List<String> alreadyEnrolled = new ArrayList<>();
        
        for (int i = startRange; i <= endRange; i++) {
            String usn = prefix + String.format("%03d", i);
            
            try {
                User student = userRepository.findByUsn(usn).orElse(null);
                
                if (student == null) {
                    Map<String, String> failureInfo = new HashMap<>();
                    failureInfo.put("usn", usn);
                    failureInfo.put("reason", "User not found");
                    failed.add(failureInfo);
                    continue;
                }
                
                if (!student.getRole().equals(User.Role.STUDENT)) {
                    Map<String, String> failureInfo = new HashMap<>();
                    failureInfo.put("usn", usn);
                    failureInfo.put("reason", "Not a student");
                    failed.add(failureInfo);
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
                Map<String, String> failureInfo = new HashMap<>();
                failureInfo.put("usn", usn);
                failureInfo.put("reason", e.getMessage());
                failed.add(failureInfo);
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
