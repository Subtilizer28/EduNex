package com.edunex.edunex_lms.controller;

import com.edunex.edunex_lms.dto.AuthResponse;
import com.edunex.edunex_lms.dto.LoginRequest;
import com.edunex.edunex_lms.dto.RegisterRequest;
import com.edunex.edunex_lms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for authentication operations
 * Handles login and registration requests
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Authenticate user and generate JWT token
     * @param loginRequest Login credentials
     * @return Authentication response with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for user: {}", loginRequest.getUsername());
            AuthResponse response = authService.login(loginRequest);
            log.info("Login successful for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed for user: {}", loginRequest.getUsername(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid username or password");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    
    /**
     * Register new user (Admin only)
     * @param registerRequest Registration details
     * @return Authentication response with JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            log.info("Registration attempt for user: {}", registerRequest.getUsername());
            AuthResponse response = authService.register(registerRequest);
            log.info("Registration successful for user: {}", registerRequest.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Registration failed for user: {}", registerRequest.getUsername(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    /**
     * Validate JWT token
     * @param token JWT token to validate
     * @return Validation status
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix if present
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            
            Map<String, Boolean> response = new HashMap<>();
            response.put("valid", authService.validateToken(jwtToken));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Token validation failed", e);
            Map<String, Boolean> response = new HashMap<>();
            response.put("valid", false);
            return ResponseEntity.ok(response);
        }
    }
}
