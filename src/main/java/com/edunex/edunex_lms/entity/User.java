package com.edunex.edunex_lms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @JsonIgnore
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false)
    private String email;
    
    @NotBlank(message = "Full name is required")
    @Column(nullable = false, length = 100)
    private String fullName;
    
    @Column(length = 20)
    private String phoneNumber;
    
    @Column(length = 500)
    private String profilePicture;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Column(nullable = false)
    private Boolean enabled = true;
    
    @Column(nullable = false)
    private Boolean accountNonLocked = true;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    // Relationships
    @JsonIgnore
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL)
    private List<Course> coursesTeaching = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Assignment> assignments = new ArrayList<>();
    
    @JsonIgnore
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<QuizAttempt> quizAttempts = new ArrayList<>();
    
    public enum Role {
        ADMIN, INSTRUCTOR, STUDENT
    }
}
