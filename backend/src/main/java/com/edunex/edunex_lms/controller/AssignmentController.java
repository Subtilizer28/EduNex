package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Assignment;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.security.UserDetailsImpl;
import com.edunex.edunex_lms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    
    private final AssignmentService assignmentService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment, @RequestParam Long courseId) {
        Assignment created = assignmentService.createAssignment(assignment, courseId);
        return ResponseEntity.ok(created);
    }
    
    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Assignment> submitAssignment(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Get student ID from authenticated user
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) userDetails;
        Assignment submitted = assignmentService.submitAssignment(id, userDetailsImpl.getId(), file);
        return ResponseEntity.ok(submitted);
    }
    
    @PostMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Assignment> gradeAssignment(
            @PathVariable Long id,
            @RequestParam Double grade,
            @RequestParam String feedback) {
        Assignment graded = assignmentService.gradeAssignment(id, grade, feedback);
        return ResponseEntity.ok(graded);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Assignment>> getStudentAssignments(@PathVariable Long studentId) {
        List<Assignment> assignments = assignmentService.getStudentAssignments(studentId);
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Assignment>> getInstructorAssignments(@PathVariable Long instructorId) {
        List<Assignment> assignments = assignmentService.getInstructorAssignments(instructorId);
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/course/{courseId}/pending")
    public ResponseEntity<List<Assignment>> getPendingAssignments(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentService.getPendingAssignments(courseId);
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/my-assignments")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Assignment>> getMyAssignments(@AuthenticationPrincipal UserDetails userDetails) {
        // This will return assignments based on user role
        // For students: their enrolled courses' assignments
        // For instructors: assignments from their courses
        List<Assignment> assignments = assignmentService.getUserAssignments(userDetails.getUsername());
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/{assignmentId}/submissions")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<Assignment>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        // Return all submissions for a specific assignment
        List<Assignment> submissions = assignmentService.getAssignmentSubmissions(assignmentId);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/course/{courseId}/submissions")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Assignment>> getCourseAssignmentSubmissions(
            @PathVariable Long courseId,
            @RequestParam String title) {
        List<Assignment> submissions = assignmentService.getCourseAssignmentSubmissions(courseId, title);
        return ResponseEntity.ok(submissions);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok().build();
    }
}
