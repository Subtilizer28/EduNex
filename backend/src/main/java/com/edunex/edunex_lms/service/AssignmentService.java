package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.Assignment;
import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.Enrollment;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.AssignmentRepository;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.EnrollmentRepository;
import com.edunex.edunex_lms.repository.UserRepository;
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
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {
    
    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ActivityLogService activityLogService;
    
    private static final String UPLOAD_DIR = "uploads/assignments/";
    
    @Transactional
    public Assignment createAssignment(Assignment assignment, Long courseId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        assignment.setCourse(course);
        assignment.setStatus(Assignment.SubmissionStatus.PENDING);
        Assignment saved = assignmentRepository.save(assignment);
        
        // Log activity
        activityLogService.logActivity(
            "ASSIGNMENT_CREATED",
            "New assignment created: " + saved.getTitle() + " in course " + course.getCourseName(),
            course.getInstructor(),
            "Assignment",
            saved.getId()
        );
        
        return saved;
    }
    
    @Transactional
    public Assignment submitAssignment(Long assignmentId, Long studentId, MultipartFile file) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        // Get the student
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        // Set student on the assignment
        assignment.setStudent(student);
        
        if (LocalDateTime.now().isAfter(assignment.getDueDate())) {
            assignment.setStatus(Assignment.SubmissionStatus.LATE_SUBMISSION);
        } else {
            assignment.setStatus(Assignment.SubmissionStatus.SUBMITTED);
        }
        
        // Save file if provided
        if (file != null && !file.isEmpty()) {
            String fileName = saveFile(file, assignmentId, studentId);
            assignment.setSubmissionUrl(fileName);
        }
        assignment.setSubmittedAt(LocalDateTime.now());
        
        Assignment saved = assignmentRepository.save(assignment);
        
        // Log activity
        activityLogService.logActivity(
            "ASSIGNMENT_SUBMITTED",
            "Assignment submitted: " + assignment.getTitle() + " by " + student.getFullName(),
            student,
            "Assignment",
            assignmentId
        );
        
        return saved;
    }
    
    @Transactional
    public Assignment gradeAssignment(Long assignmentId, Double grade, String feedback) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        if (grade < 0 || grade > assignment.getMaxMarks()) {
            throw new RuntimeException("Invalid grade");
        }
        
        assignment.setMarksObtained(grade.intValue());
        assignment.setFeedback(feedback);
        assignment.setStatus(Assignment.SubmissionStatus.GRADED);
        
        return assignmentRepository.save(assignment);
    }
    
    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }
    
    public List<Assignment> getStudentAssignments(Long studentId) {
        // This would need a student_id column in Assignment or join through submissions
        return assignmentRepository.findAll();
    }
    
    public List<Assignment> getInstructorAssignments(Long instructorId) {
        // Get assignments from instructor's courses
        List<Course> courses = courseRepository.findByInstructorId(instructorId);
        List<Assignment> assignments = new ArrayList<>();
        for (Course course : courses) {
            assignments.addAll(assignmentRepository.findByCourseId(course.getId()));
        }
        return assignments;
    }
    
    public List<Assignment> getPendingAssignments(Long courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
            .filter(a -> a.getStatus() == Assignment.SubmissionStatus.PENDING ||
                        a.getStatus() == Assignment.SubmissionStatus.SUBMITTED)
            .toList();
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
    
    public List<Assignment> getUserAssignments(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.STUDENT) {
            // Get assignments from enrolled courses
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
            List<Long> courseIds = enrollments.stream()
                .map(e -> e.getCourse().getId())
                .collect(Collectors.toList());
            
            List<Assignment> assignments = new ArrayList<>();
            for (Long courseId : courseIds) {
                assignments.addAll(assignmentRepository.findByCourseId(courseId));
            }
            return assignments;
        } else if (user.getRole() == User.Role.INSTRUCTOR) {
            // Get assignments from instructor's courses
            List<Course> courses = courseRepository.findByInstructorId(user.getId());
            List<Assignment> assignments = new ArrayList<>();
            for (Course course : courses) {
                assignments.addAll(assignmentRepository.findByCourseId(course.getId()));
            }
            return assignments;
        } else {
            // Admin gets all assignments
            return assignmentRepository.findAll();
        }
    }
    
    @Transactional(readOnly = true)
    public List<Assignment> getAssignmentSubmissions(Long assignmentId) {
        // Find the original assignment to verify it exists
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        // Find all submissions (assignments with the same base assignment but different students)
        // In this schema, submissions are stored as separate Assignment records with student_id set
        List<Assignment> submissions = assignmentRepository.findByCourseIdAndTitleAndStudentIsNotNull(
            assignment.getCourse().getId(), 
            assignment.getTitle()
        );
        
        return submissions;
    }
    
    @Transactional(readOnly = true)
    public List<Assignment> getCourseAssignmentSubmissions(Long courseId, String title) {
        return assignmentRepository.findByCourseIdAndTitleAndStudentIsNotNull(courseId, title);
    }
    
    @Transactional
    public void deleteAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
            .orElseThrow(() -> new RuntimeException("Assignment not found"));
        
        // Log activity
        activityLogService.logActivity(
            "ASSIGNMENT_DELETED",
            "Assignment '" + assignment.getTitle() + "' was deleted"
        );
        
        assignmentRepository.delete(assignment);
    }
}
