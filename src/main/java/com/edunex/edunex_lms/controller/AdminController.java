package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Attendance;
import com.edunex.edunex_lms.entity.Notification;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.UserRepository;
import com.edunex.edunex_lms.service.AttendanceService;
import com.edunex.edunex_lms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UserRepository userRepository;
    private final AttendanceService attendanceService;
    private final NotificationService notificationService;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        List<User> users = userRepository.findByRole(role);
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<User> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
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
        long totalUsers = userRepository.count();
        long students = userRepository.findByRole("STUDENT").size();
        long instructors = userRepository.findByRole("INSTRUCTOR").size();
        long admins = userRepository.findByRole("ADMIN").size();
        
        Map<String, Object> stats = Map.of(
            "totalUsers", totalUsers,
            "students", students,
            "instructors", instructors,
            "admins", admins
        );
        
        return ResponseEntity.ok(stats);
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
}
