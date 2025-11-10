package com.edunex.edunex_lms.repository;

import com.edunex.edunex_lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsn(String usn);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    List<User> findByEnabled(boolean enabled);
    
    List<User> findByEnabledTrue();
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.enabled = true")
    List<User> findActiveUsersByRole(User.Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(User.Role role);
}
