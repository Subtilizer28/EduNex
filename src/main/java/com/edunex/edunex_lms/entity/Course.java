package com.edunex.edunex_lms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Course code is required")
    @Column(unique = true, nullable = false, length = 20)
    private String courseCode;
    
    @NotBlank(message = "Course name is required")
    @Column(nullable = false, length = 200)
    private String courseName;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 100)
    private String category;
    
    @Column(length = 500)
    private String thumbnailUrl;
    
    @Column(nullable = false)
    private Integer credits = 3;
    
    @Column(nullable = false)
    private Integer maxStudents = 50;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @JsonIgnoreProperties({"password"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
