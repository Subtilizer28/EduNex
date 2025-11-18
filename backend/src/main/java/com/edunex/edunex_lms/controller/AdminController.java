package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.ActivityLog;
import com.edunex.edunex_lms.exception.ResourceNotFoundException;
import com.edunex.edunex_lms.exception.InvalidOperationException;
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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        User.Role userRole = User.Role.valueOf(role.toUpperCase());
        List<User> users = userRepository.findByRole(userRole);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setEnabled(true);
        User savedUser = userRepository.save(user);
        activityLogService.logActivity("USER_ACTIVATED", "User " + user.getFullName() + " activated", 
            null, "User", id);
        return ResponseEntity.ok(savedUser);
    }
    
    @PutMapping("/users/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        if (user.getRole() == User.Role.ADMIN) {
            throw new InvalidOperationException("Cannot deactivate admin accounts for security reasons");
        }
        
        user.setEnabled(false);
        User savedUser = userRepository.save(user);
        activityLogService.logActivity("USER_DEACTIVATED", "User " + user.getFullName() + " deactivated", 
            null, "User", id);
        return ResponseEntity.ok(savedUser);
    }
    
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        if (user.getRole() == User.Role.ADMIN) {
            throw new InvalidOperationException("Cannot delete admin accounts for security reasons");
        }
        
        String userName = user.getFullName();
        
        // Delete related records
        enrollmentRepository.deleteByStudentId(id);
        attendanceRepository.deleteByStudentId(id);
        userRepository.deleteById(id);
        
        activityLogService.logActivity("USER_DELETED", "User " + userName + " deleted", 
            null, "User", id);
        
        log.info("Successfully deleted user: {} (ID: {})", userName, id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User deleted successfully"));
    }
    
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updateData) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        // Update fields if provided
        if (updateData.containsKey("username")) {
            String newUsername = (String) updateData.get("username");
            if (userRepository.existsByUsername(newUsername) && !user.getUsername().equals(newUsername)) {
                throw new InvalidOperationException("Username already exists");
            }
            user.setUsername(newUsername);
        }
        
        if (updateData.containsKey("email")) {
            String newEmail = (String) updateData.get("email");
            if (userRepository.existsByEmail(newEmail) && !user.getEmail().equals(newEmail)) {
                throw new InvalidOperationException("Email already exists");
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
        
        activityLogService.logActivity("USER_UPDATE", "User updated: " + savedUser.getFullName(),
            savedUser, "User", savedUser.getId());
        
        return ResponseEntity.ok(savedUser);
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
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
    }
    
    @GetMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        
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
            courseData.put("enrollmentCount", enrollmentRepository.countByCourseId(course.getId()));
            return courseData;
        }).toList();
        
        return ResponseEntity.ok(coursesWithEnrollments);
    }
    
    @PostMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@RequestBody Map<String, Object> courseData) {
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
        
        if (courseCode == null || courseCode.trim().isEmpty()) {
            throw new InvalidOperationException("Course code is required");
        }
        if (courseName == null || courseName.trim().isEmpty()) {
            throw new InvalidOperationException("Course name is required");
        }
        if (instructorId == null) {
            throw new InvalidOperationException("Instructor is required");
        }
        
        if (courseRepository.existsByCourseCode(courseCode)) {
            throw new InvalidOperationException("Course code already exists");
        }
        
        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));
        
        if (instructor.getRole() != User.Role.INSTRUCTOR && instructor.getRole() != User.Role.ADMIN) {
            throw new InvalidOperationException("Selected user is not an instructor");
        }
        
        Course course = new Course();
        course.setCourseCode(courseCode.toUpperCase());
        course.setCourseName(courseName);
        course.setDescription(description);
        course.setCategory(category);
        course.setCredits(credits);
        course.setMaxStudents(maxStudents);
        course.setIsActive(true);
        course.setInstructor(instructor);
        
        Course savedCourse = courseRepository.save(course);
        
        activityLogService.logActivity("COURSE_CREATED", 
            "New course created: " + savedCourse.getCourseName(),
            savedCourse.getInstructor(), "Course", savedCourse.getId());
        
        log.info("Course created: {} by instructor: {}", savedCourse.getCourseCode(), instructor.getFullName());
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
    }
    
    @DeleteMapping("/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteCourse(@PathVariable Long id) {
        Course course = courseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        
        String courseName = course.getCourseName();
        enrollmentRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);
        
        activityLogService.logActivity("COURSE_DELETED",
            "Course deleted: " + courseName, null, "Course", id);
        
        log.info("Successfully deleted course: {} (ID: {})", courseName, id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Course deleted successfully"));
    }
    
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, String> userData) {
        String username = userData.get("username");
        String email = userData.get("email");
        String fullName = userData.get("fullName");
        String password = userData.get("password");
        String roleStr = userData.getOrDefault("role", "STUDENT");
        
        if (userRepository.existsByUsername(username)) {
            throw new InvalidOperationException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new InvalidOperationException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.valueOf(roleStr.toUpperCase()));
        user.setEnabled(true);
        
        User savedUser = userRepository.save(user);
        
        activityLogService.logActivity("USER_REGISTRATION",
            "New " + savedUser.getRole() + " user registered: " + savedUser.getFullName(),
            savedUser, "User", savedUser.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "message", "User created successfully",
            "userId", savedUser.getId(),
            "user", savedUser
        ));
    }
    
    @PostMapping("/enrollments/instructor")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> assignInstructorToCourse(
            @RequestParam Long courseId,
            @RequestParam Long instructorId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        User instructor = userRepository.findById(instructorId)
            .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));
        
        if (instructor.getRole() != User.Role.INSTRUCTOR && instructor.getRole() != User.Role.ADMIN) {
            throw new InvalidOperationException("User is not an instructor");
        }
        
        course.setInstructor(instructor);
        courseRepository.save(course);
        
        activityLogService.logActivity("INSTRUCTOR_ASSIGNED",
            "Instructor " + instructor.getFullName() + " assigned to course " + course.getCourseName(),
            instructor, "Course", courseId);
        
        log.info("Instructor {} assigned to course {}", instructor.getFullName(), course.getCourseName());
        return ResponseEntity.ok(Map.of(
            "message", "Instructor assigned to course successfully",
            "courseId", courseId,
            "instructorId", instructorId
        ));
    }
    
    @GetMapping("/activities")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ActivityLog>> getRecentActivities() {
        List<ActivityLog> activities = activityLogService.getRecentActivities();
        return ResponseEntity.ok(activities);
    }
    
    @PostMapping("/users/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> bulkCreateUsers(@RequestBody Map<String, Object> requestData) {
        String prefix = (String) requestData.get("prefix");
        Integer startRange = (Integer) requestData.get("startRange");
        Integer endRange = (Integer) requestData.get("endRange");
        String role = (String) requestData.getOrDefault("role", "STUDENT");
        String password = (String) requestData.getOrDefault("password", "password123");
        
        if (prefix == null || startRange == null || endRange == null) {
            throw new InvalidOperationException("prefix, startRange, and endRange are required");
        }
        if (startRange > endRange) {
            throw new InvalidOperationException("startRange cannot be greater than endRange");
        }
        if (endRange - startRange > 100) {
            throw new InvalidOperationException("Cannot create more than 100 users at once");
        }
        
        List<User> createdUsers = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (int i = startRange; i <= endRange; i++) {
            try {
                String usn = prefix + String.format("%03d", i);
                
                if (userRepository.existsByUsername(usn)) {
                    errors.add("User with USN " + usn + " already exists");
                    continue;
                }
                
                User user = new User();
                user.setUsername(usn);
                user.setUsn(usn);
                user.setEmail(usn.toLowerCase() + "@student.edu");
                user.setFullName("Student " + usn);
                user.setPassword(passwordEncoder.encode(password));
                user.setRole(User.Role.valueOf(role.toUpperCase()));
                user.setEnabled(true);
                
                createdUsers.add(userRepository.save(user));
            } catch (Exception e) {
                errors.add("Failed to create user " + prefix + i + ": " + e.getMessage());
            }
        }
        
        activityLogService.logActivity("BULK_USER_CREATE",
            "Bulk created " + createdUsers.size() + " users", null, "User", null);
        
        log.info("Bulk user creation completed: {} users created, {} errors", createdUsers.size(), errors.size());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "created", createdUsers.size(),
            "errors", errors,
            "users", createdUsers
        ));
    }
    
    @PostMapping("/courses/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> bulkCreateCourses(@RequestBody List<Map<String, Object>> coursesData) {
        if (coursesData == null || coursesData.isEmpty()) {
            throw new InvalidOperationException("Course data is required");
        }
        if (coursesData.size() > 50) {
            throw new InvalidOperationException("Cannot create more than 50 courses at once");
        }
        
        List<Course> createdCourses = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        for (Map<String, Object> courseData : coursesData) {
            try {
                String courseCode = (String) courseData.get("courseCode");
                String courseName = (String) courseData.get("courseName");
                String description = (String) courseData.get("description");
                String category = (String) courseData.getOrDefault("category", "General");
                Integer credits = (Integer) courseData.getOrDefault("credits", 3);
                Integer maxStudents = (Integer) courseData.getOrDefault("maxStudents", 50);
                Long instructorId = ((Number) courseData.get("instructorId")).longValue();
                
                if (courseCode == null || courseName == null || instructorId == null) {
                    errors.add("Missing required fields for course: " + courseName);
                    continue;
                }
                
                if (courseRepository.existsByCourseCode(courseCode)) {
                    errors.add("Course with code " + courseCode + " already exists");
                    continue;
                }
                
                User instructor = userRepository.findById(instructorId)
                    .orElseThrow(() -> new ResourceNotFoundException("Instructor", "id", instructorId));
                
                if (instructor.getRole() != User.Role.INSTRUCTOR && instructor.getRole() != User.Role.ADMIN) {
                    errors.add("User " + instructor.getFullName() + " is not an instructor");
                    continue;
                }
                
                Course course = new Course();
                course.setCourseCode(courseCode);
                course.setCourseName(courseName);
                course.setDescription(description);
                course.setCategory(category);
                course.setCredits(credits);
                course.setMaxStudents(maxStudents);
                course.setInstructor(instructor);
                course.setIsActive(true);
                
                createdCourses.add(courseRepository.save(course));
            } catch (Exception e) {
                errors.add("Failed to create course: " + e.getMessage());
            }
        }
        
        activityLogService.logActivity("BULK_COURSE_CREATE",
            "Bulk created " + createdCourses.size() + " courses", null, "Course", null);
        
        log.info("Bulk course creation completed: {} courses created, {} errors", 
            createdCourses.size(), errors.size());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "created", createdCourses.size(),
            "errors", errors,
            "courses", createdCourses
        ));
    }
}
