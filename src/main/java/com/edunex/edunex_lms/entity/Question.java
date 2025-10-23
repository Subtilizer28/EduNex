package com.edunex.edunex_lms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;
    
    @NotBlank(message = "Question text is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType;
    
    @Column(columnDefinition = "TEXT")
    private String optionA;
    
    @Column(columnDefinition = "TEXT")
    private String optionB;
    
    @Column(columnDefinition = "TEXT")
    private String optionC;
    
    @Column(columnDefinition = "TEXT")
    private String optionD;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String correctAnswer;
    
    @Column(nullable = false)
    private Integer marks = 1;
    
    @Column(nullable = false)
    private Integer questionOrder = 0;
    
    public enum QuestionType {
        MCQ, TRUE_FALSE, SHORT_ANSWER
    }
}
