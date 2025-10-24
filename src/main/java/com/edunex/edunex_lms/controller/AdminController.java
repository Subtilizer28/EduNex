package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Attendance;
import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.Notification;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.AssignmentRepository;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.QuizRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import com.edunex.edunex_lms.service.AttendanceService;
import com.edunex.edunex_lms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
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
    private final AttendanceService attendanceService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    
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
    
    @GetMapping("/reports/overview")
    public ResponseEntity<Map<String, Object>> getReportsOverview() {
        try {
            Map<String, Object> report = new HashMap<>();
            
            // User statistics
            report.put("totalUsers", userRepository.count());
            report.put("activeUsers", userRepository.findByEnabled(true).size());
            report.put("inactiveUsers", userRepository.findByEnabled(false).size());
            
            // Course statistics
            report.put("totalCourses", courseRepository.count());
            report.put("totalEnrollments", enrollmentRepository.count());
            
            // Assignment statistics  
            report.put("totalAssignments", assignmentRepository.count());
            
            // Quiz statistics
            report.put("totalQuizzes", quizRepository.count());
            
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            log.error("Error generating reports", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to generate reports: " + e.getMessage()));
        }
    }
    
    @PostMapping("/notifications/broadcast")
    public ResponseEntity<Void> broadcastNotification(
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam String type) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            notificationService.createNotification(user.getId(), title, message, type);
        }
        return ResponseEntity.ok().build();
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
    
    @PostMapping("/users/bulk-upload")
    public ResponseEntity<?> bulkUploadUsers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Please select a CSV file to upload"
            ));
        }
        
        if (!file.getOriginalFilename().endsWith(".csv")) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Only CSV files are supported"
            ));
        }
        
        List<Map<String, String>> successList = new ArrayList<>();
        List<Map<String, String>> errorList = new ArrayList<>();
        int totalProcessed = 0;
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                .withFirstRecordAsHeader()
                .withIgnoreHeaderCase()
                .withTrim());
            
            for (CSVRecord record : csvParser) {
                totalProcessed++;
                try {
                    String username = record.get("username");
                    String email = record.get("email");
                    String fullName = record.get("fullName");
                    String password = record.get("password");
                    String roleStr = record.isMapped("role") ? record.get("role") : "STUDENT";
                    
                    if (username == null || username.trim().isEmpty() ||
                        email == null || email.trim().isEmpty() ||
                        fullName == null || fullName.trim().isEmpty() ||
                        password == null || password.trim().isEmpty()) {
                        errorList.add(Map.of(
                            "row", String.valueOf(totalProcessed),
                            "error", "Missing required fields"
                        ));
                        continue;
                    }
                    
                    if (userRepository.existsByUsername(username)) {
                        errorList.add(Map.of(
                            "row", String.valueOf(totalProcessed),
                            "username", username,
                            "error", "Username already exists"
                        ));
                        continue;
                    }
                    
                    if (userRepository.existsByEmail(email)) {
                        errorList.add(Map.of(
                            "row", String.valueOf(totalProcessed),
                            "email", email,
                            "error", "Email already exists"
                        ));
                        continue;
                    }
                    
                    User user = new User();
                    user.setUsername(username.trim());
                    user.setEmail(email.trim());
                    user.setFullName(fullName.trim());
                    user.setPassword(passwordEncoder.encode(password));
                    user.setRole(User.Role.valueOf(roleStr.toUpperCase()));
                    user.setEnabled(true);
                    
                    userRepository.save(user);
                    
                    successList.add(Map.of(
                        "row", String.valueOf(totalProcessed),
                        "username", username,
                        "email", email,
                        "fullName", fullName
                    ));
                    
                } catch (Exception e) {
                    log.error("Error processing row {}", totalProcessed, e);
                    errorList.add(Map.of(
                        "row", String.valueOf(totalProcessed),
                        "error", e.getMessage()
                    ));
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "Bulk upload completed",
                "totalProcessed", totalProcessed,
                "successCount", successList.size(),
                "errorCount", errorList.size(),
                "successList", successList,
                "errorList", errorList
            ));
            
        } catch (Exception e) {
            log.error("Error processing CSV file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "error", "Failed to process CSV file: " + e.getMessage()
            ));
        }
    }
}
