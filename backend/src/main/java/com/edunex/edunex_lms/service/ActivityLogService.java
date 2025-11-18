package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.ActivityLog;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    
    private final ActivityLogRepository activityLogRepository;
    
    @Transactional
    public void logActivity(String activityType, String description, User user, String entityType, Long entityId) {
        ActivityLog log = new ActivityLog();
        log.setActivityType(activityType);
        log.setDescription(description);
        log.setUser(user);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        activityLogRepository.save(log);
    }
    
    @Transactional
    public void logActivity(String activityType, String description) {
        ActivityLog log = new ActivityLog();
        log.setActivityType(activityType);
        log.setDescription(description);
        activityLogRepository.save(log);
    }
    
    public List<ActivityLog> getRecentActivities() {
        return activityLogRepository.findTop20ByOrderByCreatedAtDesc();
    }
    
    public List<ActivityLog> getActivitiesByType(String activityType) {
        return activityLogRepository.findByActivityTypeOrderByCreatedAtDesc(activityType);
    }
    
    public List<ActivityLog> getUserActivities(Long userId) {
        return activityLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
