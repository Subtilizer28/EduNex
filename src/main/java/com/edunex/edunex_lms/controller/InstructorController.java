package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Attendance;
import com.edunex.edunex_lms.entity.Notification;
import com.edunex.edunex_lms.service.AttendanceService;
import com.edunex.edunex_lms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
public class InstructorController {
    
    private final AttendanceService attendanceService;
    private final NotificationService notificationService;
    
    @PostMapping("/attendance")
    public ResponseEntity<Attendance> markAttendance(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestParam String status) {
        Attendance attendance = attendanceService.markAttendance(studentId, courseId, status);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/attendance/course/{courseId}")
    public ResponseEntity<List<Attendance>> getCourseAttendance(@PathVariable Long courseId) {
        List<Attendance> attendance = attendanceService.getAttendanceByCourse(courseId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/attendance/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<Attendance>> getStudentCourseAttendance(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        List<Attendance> attendance = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/attendance/rate")
    public ResponseEntity<Double> getAttendanceRate(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        Double rate = attendanceService.calculateAttendanceRate(studentId, courseId);
        return ResponseEntity.ok(rate);
    }
    
    @PostMapping("/notifications/send")
    public ResponseEntity<Notification> sendNotification(
            @RequestParam Long userId,
            @RequestParam String title,
            @RequestParam String message,
            @RequestParam String type) {
        Notification notification = notificationService.createNotification(userId, title, message, type);
        return ResponseEntity.ok(notification);
    }
}
