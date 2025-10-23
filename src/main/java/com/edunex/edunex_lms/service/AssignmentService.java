package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.Assignment;
import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.repository.AssignmentRepository;
import com.edunex.edunex_lms.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    
    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    
    private static final String UPLOAD_DIR = "uploads/assignments/";
    
    @Transactional
    public Assignment createAssignment(Assignment assignment, Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        assignment.setCourse(course);
        assignment.setStatus("PUBLISHED");
        return assignmentRepository.save(assignment);
    }
    
    @Transactional
    public Assignment submitAssignment(Long assignmentId, Long studentId, MultipartFile file) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        if (LocalDateTime.now().isAfter(assignment.getDueDate())) {
            assignment.setStatus("LATE");
        } else {
            assignment.setStatus("SUBMITTED");
        }
        
        // Save file
        String fileName = saveFile(file, assignmentId, studentId);
        assignment.setSubmissionFile(fileName);
        assignment.setSubmittedAt(LocalDateTime.now());
        
        return assignmentRepository.save(assignment);
    }
    
    @Transactional
    public Assignment gradeAssignment(Long assignmentId, Double grade, String feedback) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        if (grade < 0 || grade > assignment.getMaxMarks()) {
            throw new RuntimeException("Invalid grade");
        }
        
        assignment.setMarksObtained(grade);
        assignment.setFeedback(feedback);
        assignment.setStatus("GRADED");
        
        return assignmentRepository.save(assignment);
    }
    
    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }
    
    public List<Assignment> getStudentAssignments(Long studentId) {
        // This would need a student_id column in Assignment or join through submissions
        return assignmentRepository.findAll();
    }
    
    public List<Assignment> getPendingAssignments(Long courseId) {
        return assignmentRepository.findByCourseIdAndStatus(courseId, "PUBLISHED");
    }
    
    private String saveFile(MultipartFile file, Long assignmentId, Long studentId) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR + assignmentId + "/" + studentId);
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }
}
