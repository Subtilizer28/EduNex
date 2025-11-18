package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.Attendance;
import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.AttendanceRepository;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Attendance markAttendance(Long studentId, Long courseId, String status) {
        return markAttendance(studentId, courseId, status, null, null);
    }
    
    @Transactional
    public Attendance markAttendance(Long studentId, Long courseId, String status, String remarks, Long markedById) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        LocalDate today = LocalDate.now();
        
        // Check if attendance already marked today
        if (attendanceRepository.findByStudentIdAndCourseIdAndAttendanceDate(studentId, courseId, today).isPresent()) {
            throw new RuntimeException("Attendance already marked for today");
        }
        
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setCourse(course);
        attendance.setAttendanceDate(today);
        attendance.setStatus(Attendance.AttendanceStatus.valueOf(status.toUpperCase()));
        attendance.setRemarks(remarks);
        
        if (markedById != null) {
            User markedBy = userRepository.findById(markedById)
                .orElseThrow(() -> new RuntimeException("Marker not found"));
            attendance.setMarkedBy(markedBy);
        }
        
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
    
    public List<Attendance> getAttendanceByCourse(Long courseId) {
        return attendanceRepository.findByCourseId(courseId);
    }
    
    public List<Attendance> getAttendanceByStudentAndCourse(Long studentId, Long courseId) {
        return attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
    }
    
    public Double calculateAttendanceRate(Long studentId, Long courseId) {
        List<Attendance> attendances = attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);
        
        if (attendances.isEmpty()) {
            return 0.0;
        }
        
        long presentCount = attendances.stream()
            .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
            .count();
        
        return (double) presentCount / attendances.size() * 100;
    }
    
    public List<Attendance> getAttendanceByDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndDate(courseId, date);
    }
}
