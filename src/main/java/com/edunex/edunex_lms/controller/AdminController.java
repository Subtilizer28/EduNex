package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.ActivityLog;
import com.edunex.edunex_lms.repository.AssignmentRepository;
import com.edunex.edunex_lms.repository.AttendanceRepository;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.QuizRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import com.edunex.edunex_lms.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {
    
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        User.Role userRole = User.Role.valueOf(role.toUpperCase());
        List<User> users = userRepository.findByRole(userRole);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        try {
            long totalUsers = userRepository.count();
            long students = userRepository.findByRole(User.Role.STUDENT).size();
            long instructors = userRepository.findByRole(User.Role.INSTRUCTOR).size();
            long admins = userRepository.findByRole(User.Role.ADMIN).size();
            long totalCourses = courseRepository.count();
            long totalEnrollments = enrollmentRepository.count();
            long totalAssignments = assignmentRepository.count();
            long totalQuizzes = quizRepository.count();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("students", students);
            stats.put("instructors", instructors);
            stats.put("admins", admins);
            stats.put("totalCourses", totalCourses);
            stats.put("totalEnrollments", totalEnrollments);
            stats.put("totalAssignments", totalAssignments);
            stats.put("totalQuizzes", totalQuizzes);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error loading stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to load statistics: " + e.getMessage()));
        }
    }
    
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            log.error("Error loading courses", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String email = userData.get("email");
            String fullName = userData.get("fullName");
            String password = userData.get("password");
            String roleStr = userData.getOrDefault("role", "STUDENT");
            
            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }
            
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setFullName(fullName);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(User.Role.valueOf(roleStr.toUpperCase()));
            user.setEnabled(true);
            
            User savedUser = userRepository.save(user);
            
            // Log activity
            activityLogService.logActivity(
                "USER_REGISTRATION",
                "New " + savedUser.getRole() + " user registered: " + savedUser.getFullName(),
                savedUser,
                "User",
                savedUser.getId()
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "User created successfully",
                "userId", savedUser.getId()
            ));
        } catch (Exception e) {
            log.error("Error creating user", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create user: " + e.getMessage()
            ));
        }
    }
    
    // Enrollment management - Admin assigns instructor to course
    @PostMapping("/enrollments/instructor")
    public ResponseEntity<?> assignInstructorToCourse(
            @RequestParam Long courseId,
            @RequestParam Long instructorId) {
        try {
            Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
            User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
            
            if (instructor.getRole() != User.Role.INSTRUCTOR) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "User is not an instructor"));
            }
            
            course.setInstructor(instructor);
            courseRepository.save(course);
            
            return ResponseEntity.ok(Map.of(
                "message", "Instructor assigned to course successfully",
                "courseId", courseId,
                "instructorId", instructorId
            ));
        } catch (Exception e) {
            log.error("Error assigning instructor", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to assign instructor: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLog>> getRecentActivities() {
        try {
            List<ActivityLog> activities = activityLogService.getRecentActivities();
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            log.error("Error loading activities", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
