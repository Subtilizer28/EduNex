package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.dto.AuthResponse;
import com.edunex.edunex_lms.dto.LoginRequest;
import com.edunex.edunex_lms.dto.RegisterRequest;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.UserRepository;
import com.edunex.edunex_lms.security.JwtUtils;
import com.edunex.edunex_lms.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for authentication operations
 * Handles login, registration, and token validation
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    
    /**
     * Authenticate user and generate JWT token
     * @param loginRequest Login credentials
     * @return Authentication response with token and user details
     * @throws RuntimeException if authentication fails
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(), 
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No role assigned to user"))
                .getAuthority()
                .replace("ROLE_", "");
            
            log.info("User {} logged in successfully with role {}", userDetails.getUsername(), role);
            
            return new AuthResponse(
                jwt, 
                userDetails.getId(), 
                userDetails.getUsername(), 
                userDetails.getEmail(), 
                userDetails.getFullName(), 
                role
            );
        } catch (DisabledException e) {
            log.error("User account is disabled: {}", loginRequest.getUsername());
            throw new RuntimeException("User account is disabled");
        } catch (LockedException e) {
            log.error("User account is locked: {}", loginRequest.getUsername());
            throw new RuntimeException("User account is locked");
        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", loginRequest.getUsername());
            throw new RuntimeException("Invalid username or password");
        } catch (Exception e) {
            log.error("Authentication error for user: {}", loginRequest.getUsername(), e);
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
    
    /**
     * Register new user
     * @param registerRequest Registration details
     * @return Authentication response with token and user details
     * @throws RuntimeException if registration fails
     */
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Validate username
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            log.warn("Registration failed: Username already taken - {}", registerRequest.getUsername());
            throw new RuntimeException("Username is already taken!");
        }
        
        // Validate email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            log.warn("Registration failed: Email already in use - {}", registerRequest.getEmail());
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(User.Role.valueOf(registerRequest.getRole().toUpperCase()));
        user.setEnabled(true);
        user.setAccountNonLocked(true);
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {} with role {}", savedUser.getUsername(), savedUser.getRole());
        
        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                registerRequest.getUsername(), 
                registerRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        return new AuthResponse(
            jwt, 
            savedUser.getId(), 
            savedUser.getUsername(), 
            savedUser.getEmail(), 
            savedUser.getFullName(), 
            savedUser.getRole().name()
        );
    }
    
    /**
     * Validate JWT token
     * @param token JWT token to validate
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            boolean isValid = jwtUtils.validateJwtToken(token);
            if (isValid) {
                String username = jwtUtils.getUserNameFromJwtToken(token);
                log.debug("Token validated successfully for user: {}", username);
            }
            return isValid;
        } catch (Exception e) {
            log.error("Token validation failed", e);
            return false;
        }
    }
    
    /**
     * Get currently authenticated user
     * @return Current user entity
     * @throws RuntimeException if user not found
     */
    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
    
    /**
     * Check if username exists
     * @param username Username to check
     * @return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean usernameExists(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * Check if email exists
     * @param email Email to check
     * @return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
