package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.entity.CourseMaterial;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.security.UserDetailsImpl;
import com.edunex.edunex_lms.service.CourseMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materials")
@RequiredArgsConstructor
public class CourseMaterialController {
    
    private final CourseMaterialService courseMaterialService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseMaterial> createMaterial(
            @RequestBody CourseMaterial material,
            @RequestParam Long courseId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) userDetails;
        CourseMaterial created = courseMaterialService.createMaterial(material, courseId, userDetailsImpl.getId());
        return ResponseEntity.ok(created);
    }
    
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseMaterial>> getMaterialsByCourse(@PathVariable Long courseId) {
        List<CourseMaterial> materials = courseMaterialService.getMaterialsByCourse(courseId);
        return ResponseEntity.ok(materials);
    }
    
    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<List<CourseMaterial>> getMaterialsByInstructor(@PathVariable Long instructorId) {
        List<CourseMaterial> materials = courseMaterialService.getMaterialsByInstructor(instructorId);
        return ResponseEntity.ok(materials);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseMaterial> getMaterialById(@PathVariable Long id) {
        CourseMaterial material = courseMaterialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseMaterial> updateMaterial(
            @PathVariable Long id,
            @RequestBody CourseMaterial material) {
        CourseMaterial updated = courseMaterialService.updateMaterial(id, material);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        courseMaterialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
