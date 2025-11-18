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
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Prevent deactivating admin accounts
            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "success", false, 
                        "error", "Cannot deactivate admin accounts",
                        "message", "Admin accounts cannot be deactivated for security reasons"
                    ));
            }
            
            user.setEnabled(false);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            log.error("Error deactivating user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Prevent deleting admin accounts
            if (user.getRole() == User.Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "success", false,
                        "error", "Cannot delete admin accounts",
                        "message", "Admin accounts cannot be deleted for security reasons"
                    ));
            }
            
            // Delete all enrollments first
            enrollmentRepository.deleteByStudentId(id);
            
            // Delete all attendance records
            attendanceRepository.deleteByStudentId(id);
            
            // Delete user assignments and quiz attempts if any
            // Note: These should be handled by cascade if relationships are set properly
            
            // Finally delete the user
            userRepository.deleteById(id);
            
            log.info("Successfully deleted user with ID: {}", id);
            return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "error", "Failed to delete user: " + e.getMessage()));
        }
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updateData) {
        try {
            User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update fields if provided
            if (updateData.containsKey("username")) {
                String newUsername = (String) updateData.get("username");
                if (userRepository.existsByUsername(newUsername) && !user.getUsername().equals(newUsername)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
                }
                user.setUsername(newUsername);
            }
            
            if (updateData.containsKey("email")) {
                String newEmail = (String) updateData.get("email");
                if (userRepository.existsByEmail(newEmail) && !user.getEmail().equals(newEmail)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
                }
                user.setEmail(newEmail);
            }
            
            if (updateData.containsKey("fullName")) {
                user.setFullName((String) updateData.get("fullName"));
            }
            
            if (updateData.containsKey("role")) {
                String roleStr = (String) updateData.get("role");
                user.setRole(User.Role.valueOf(roleStr.toUpperCase()));
            }
            
            if (updateData.containsKey("usn")) {
                user.setUsn((String) updateData.get("usn"));
            }
            
            if (updateData.containsKey("phone")) {
                user.setPhoneNumber((String) updateData.get("phone"));
            }
            
            // Handle password update with bcrypt hashing
            if (updateData.containsKey("password")) {
                String password = (String) updateData.get("password");
                if (password != null && !password.trim().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(password));
                }
            }
            
            User savedUser = userRepository.save(user);
            
            // Log activity
            activityLogService.logActivity(
                "USER_UPDATE",
                "User updated: " + savedUser.getFullName(),
                savedUser,
                "User",
                savedUser.getId()
            );
            
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update user: " + e.getMessage()));
        }
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
    public ResponseEntity<?> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            
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
        } catch (Exception e) {
            log.error("Error loading courses", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Map<String, Object> courseData) {
        try {
            String courseCode = (String) courseData.get("courseCode");
            String courseName = (String) courseData.get("courseName");
            String description = (String) courseData.get("description");
            String category = (String) courseData.get("category");
            Integer credits = courseData.get("credits") != null ? 
                Integer.parseInt(courseData.get("credits").toString()) : 3;
            Integer maxStudents = courseData.get("maxStudents") != null ? 
                Integer.parseInt(courseData.get("maxStudents").toString()) : 50;
            Long instructorId = courseData.get("instructorId") != null ? 
                Long.parseLong(courseData.get("instructorId").toString()) : null;
            
            // Validate required fields
            if (courseCode == null || courseCode.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course code is required"));
            }
            if (courseName == null || courseName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course name is required"));
            }
            
            // Check if course code already exists
            if (courseRepository.existsByCourseCode(courseCode)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course code already exists"));
            }
            
            Course course = new Course();
            course.setCourseCode(courseCode.toUpperCase());
            course.setCourseName(courseName);
            course.setDescription(description);
            course.setCategory(category);
            course.setCredits(credits);
            course.setMaxStudents(maxStudents);
            course.setIsActive(true);
            
            // Assign instructor if provided
            if (instructorId != null) {
                User instructor = userRepository.findById(instructorId)
                    .orElseThrow(() -> new RuntimeException("Instructor not found"));
                
                if (instructor.getRole() != User.Role.INSTRUCTOR && instructor.getRole() != User.Role.ADMIN) {
                    return ResponseEntity.badRequest()
                        .body(Map.of("error", "Selected user is not an instructor"));
                }
                
                course.setInstructor(instructor);
            } else {
                // If no instructor provided, assign to admin or throw error
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Instructor is required"));
            }
            
            Course savedCourse = courseRepository.save(course);
            
            // Log activity
            activityLogService.logActivity(
                "COURSE_CREATED",
                "New course created: " + savedCourse.getCourseName(),
                savedCourse.getInstructor(),
                "Course",
                savedCourse.getId()
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Course created successfully",
                "courseId", savedCourse.getId(),
                "course", savedCourse
            ));
        } catch (Exception e) {
            log.error("Error creating course", e);
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to create course: " + e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
            
            // Delete all enrollments for this course first
            enrollmentRepository.deleteByCourseId(id);
            
            // Delete the course
            courseRepository.deleteById(id);
            
            log.info("Successfully deleted course with ID: {} and all its enrollments", id);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Course deleted successfully"
            ));
        } catch (Exception e) {
            log.error("Error deleting course: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "success", false, 
                    "error", "Failed to delete course: " + e.getMessage()
                ));
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
