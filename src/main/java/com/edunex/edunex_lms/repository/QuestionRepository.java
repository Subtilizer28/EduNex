package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByQuizId(Long quizId);
    
    List<Question> findByQuizIdOrderByQuestionOrderAsc(Long quizId);
    
    long countByQuizId(Long quizId);
}
