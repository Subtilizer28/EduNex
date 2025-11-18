package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.CourseMaterial;
import com.edunex.edunex_lms.entity.Course;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.CourseMaterialRepository;
import com.edunex.edunex_lms.repository.CourseRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseMaterialService {
    
    private final CourseMaterialRepository courseMaterialRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    
    @Transactional
    public CourseMaterial createMaterial(CourseMaterial material, Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        material.setCourse(course);
        material.setUploadedBy(user);
        
        CourseMaterial saved = courseMaterialRepository.save(material);
        
        activityLogService.logActivity(
            "MATERIAL_UPLOADED",
            "Uploaded material: " + material.getTitle() + " for course: " + course.getName(),
            user.getId()
        );
        
        return saved;
    }
    
    @Transactional(readOnly = true)
    public List<CourseMaterial> getMaterialsByCourse(Long courseId) {
        return courseMaterialRepository.findByCourseIdOrderByUploadedAtDesc(courseId);
    }
    
    @Transactional(readOnly = true)
    public List<CourseMaterial> getMaterialsByInstructor(Long instructorId) {
        return courseMaterialRepository.findByUploadedById(instructorId);
    }
    
    @Transactional(readOnly = true)
    public CourseMaterial getMaterialById(Long id) {
        return courseMaterialRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Material not found"));
    }
    
    @Transactional
    public CourseMaterial updateMaterial(Long id, CourseMaterial materialDetails) {
        CourseMaterial material = getMaterialById(id);
        
        material.setTitle(materialDetails.getTitle());
        material.setDescription(materialDetails.getDescription());
        material.setType(materialDetails.getType());
        material.setUrl(materialDetails.getUrl());
        
        return courseMaterialRepository.save(material);
    }
    
    @Transactional
    public void deleteMaterial(Long id) {
        CourseMaterial material = getMaterialById(id);
        courseMaterialRepository.delete(material);
        
        activityLogService.logActivity(
            "MATERIAL_DELETED",
            "Deleted material: " + material.getTitle(),
            material.getUploadedBy().getId()
        );
    }
}
