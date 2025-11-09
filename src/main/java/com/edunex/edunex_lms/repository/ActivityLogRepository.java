package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    List<ActivityLog> findTop20ByOrderByCreatedAtDesc();
    
    List<ActivityLog> findByActivityTypeOrderByCreatedAtDesc(String activityType);
    
    List<ActivityLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT a FROM ActivityLog a WHERE a.entityType = :entityType AND a.entityId = :entityId ORDER BY a.createdAt DESC")
    List<ActivityLog> findByEntity(String entityType, Long entityId);
}
