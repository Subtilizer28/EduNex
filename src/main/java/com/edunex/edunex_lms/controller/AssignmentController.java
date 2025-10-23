package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.Assignment;
import com.edunex.edunex_lms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
            @RequestParam Long studentId,
            @RequestParam("file") MultipartFile file) {
        Assignment submitted = assignmentService.submitAssignment(id, studentId, file);
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
    public ResponseEntity<List<Assignment>> getStudentAssignments(@PathVariable Long studentId) {
        List<Assignment> assignments = assignmentService.getStudentAssignments(studentId);
        return ResponseEntity.ok(assignments);
    }
    
    @GetMapping("/course/{courseId}/pending")
    public ResponseEntity<List<Assignment>> getPendingAssignments(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentService.getPendingAssignments(courseId);
        return ResponseEntity.ok(assignments);
    }
}
