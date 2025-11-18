package com.edunex.edunex_lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @Column(nullable = false)
    private Integer attemptNumber = 1;
    
    @Column(nullable = false)
    private Integer marksObtained = 0;
    
    @Column(nullable = false)
    private Integer totalMarks;
    
    @Column(nullable = false)
    private Double percentage = 0.0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime startedAt;
    
    @Column
    private LocalDateTime submittedAt;
    
    public enum AttemptStatus {
        IN_PROGRESS, SUBMITTED, GRADED
    }
}
