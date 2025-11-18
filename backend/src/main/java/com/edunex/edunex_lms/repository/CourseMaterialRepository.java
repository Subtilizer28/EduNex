package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Long> {
    
    List<CourseMaterial> findByCourseId(Long courseId);
    
    List<CourseMaterial> findByCourseIdOrderByUploadedAtDesc(Long courseId);
    
    List<CourseMaterial> findByUploadedById(Long uploadedById);
}
