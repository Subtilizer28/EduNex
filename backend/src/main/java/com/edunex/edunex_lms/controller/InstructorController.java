package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Attendance;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.service.AttendanceService;
import com.edunex.edunex_lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
public class InstructorController {
    
    private final AttendanceService attendanceService;
    private final EnrollmentService enrollmentService;
    
    // Attendance marking functionality
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
    
    // Student enrollment - Instructor enrolls students in their courses
    @PostMapping("/enrollments")
    public ResponseEntity<?> enrollStudent(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);
        return ResponseEntity.ok(Map.of(
            "message", "Student enrolled successfully",
            "enrollmentId", enrollment.getId()
        ));
    }
    
    @GetMapping("/enrollments/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(courseId);
        return ResponseEntity.ok(enrollments);
    }
}
