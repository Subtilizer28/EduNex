package com.edunex.edunex_lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String activityType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column
    private String entityType;
    
    @Column
    private Long entityId;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum ActivityType {
        USER_REGISTRATION,
        ASSIGNMENT_CREATED,
        ASSIGNMENT_SUBMITTED,
        QUIZ_CREATED,
        QUIZ_ATTEMPTED,
        COURSE_CREATED,
        ENROLLMENT_CREATED,
        ATTENDANCE_MARKED
    }
}
