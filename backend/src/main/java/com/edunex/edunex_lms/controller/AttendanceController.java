package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Attendance;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.exception.ResourceNotFoundException;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import com.edunex.edunex_lms.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> request) {
        Long studentId = Long.valueOf(request.get("studentId").toString());
        Long courseId = Long.valueOf(request.get("courseId").toString());
        String status = request.get("status").toString();
        String remarks = request.get("remarks") != null ? request.get("remarks").toString() : null;
        Long markedById = request.get("markedById") != null ? Long.valueOf(request.get("markedById").toString()) : null;
        
        Attendance attendance = attendanceService.markAttendance(studentId, courseId, status, remarks, markedById);
        return ResponseEntity.ok(attendance);
    }
    
    @PostMapping("/mark-multiple")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<?> markMultipleAttendance(@RequestBody Map<String, Object> request) {
        Long courseId = Long.valueOf(request.get("courseId").toString());
        Long markedById = Long.valueOf(request.get("markedById").toString());
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> attendanceList = (List<Map<String, Object>>) request.get("attendanceList");
        
        for (Map<String, Object> item : attendanceList) {
            Long studentId = Long.valueOf(item.get("studentId").toString());
            String status = item.get("status").toString();
            String remarks = item.get("remarks") != null ? item.get("remarks").toString() : null;
            String dateStr = item.get("date") != null ? item.get("date").toString() : null;
            LocalDate date = dateStr != null ? LocalDate.parse(dateStr) : null;
            
            attendanceService.markAttendance(studentId, courseId, status, remarks, markedById, date);
        }
        
        return ResponseEntity.ok(Map.of("message", "Attendance marked successfully"));
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        List<Attendance> attendance = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Attendance>> getCourseAttendance(@PathVariable Long courseId) {
        List<Attendance> attendance = attendanceService.getAttendanceByCourse(courseId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/student/{studentId}/course/{courseId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Attendance>> getStudentCourseAttendance(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        List<Attendance> attendance = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/student/{studentId}/course/{courseId}/rate")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getAttendanceRate(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        Double rate = attendanceService.calculateAttendanceRate(studentId, courseId);
        long total = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId).size();
        long present = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId)
                .stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
        
        Map<String, Object> response = new HashMap<>();
        response.put("rate", rate);
        response.put("total", total);
        response.put("present", present);
        response.put("absent", total - present);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getMyAttendance(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", userDetails.getUsername()));
        
        List<Attendance> attendance = attendanceService.getAttendanceByStudent(user.getId());
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
        
        // Calculate attendance rate per course
        Map<Long, Map<String, Object>> courseAttendance = enrollments.stream()
            .collect(Collectors.toMap(
                e -> e.getCourse().getId(),
                e -> {
                    Double rate = attendanceService.calculateAttendanceRate(user.getId(), e.getCourse().getId());
                    List<Attendance> courseAtt = attendanceService.getAttendanceByStudentAndCourse(user.getId(), e.getCourse().getId());
                    long present = courseAtt.stream()
                        .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                        .count();
                    
                    Map<String, Object> data = new HashMap<>();
                    data.put("courseName", e.getCourse().getCourseName());
                    data.put("courseCode", e.getCourse().getCourseCode());
                    data.put("rate", rate);
                    data.put("total", courseAtt.size());
                    data.put("present", present);
                    data.put("absent", courseAtt.size() - present);
                    return data;
                }
            ));
        
        Map<String, Object> response = new HashMap<>();
        response.put("attendance", attendance);
        response.put("courseAttendance", courseAttendance);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/course/{courseId}/date/{date}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Attendance>> getAttendanceByDate(
            @PathVariable Long courseId,
            @PathVariable String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Attendance> attendance = attendanceService.getAttendanceByDate(courseId, localDate);
        return ResponseEntity.ok(attendance);
    }
}
