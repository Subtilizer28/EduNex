package com.edunex.edunex_lms.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class AuthEntryPointJwt implements AuthenticationEntryPoint {
    
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        log.error("Unauthorized error: {}", authException.getMessage());
        
        // Add CORS headers to allow frontend to read the error response
        String origin = request.getHeader("Origin");
        if (origin != null && (
            origin.equals("http://localhost:5173") || 
            origin.equals("http://localhost:5174") ||
            origin.equals("http://localhost:3000") ||
            origin.equals("http://localhost:8081") ||
            origin.equals("http://127.0.0.1:5173") ||
            origin.equals("http://127.0.0.1:3000") ||
            origin.equals("http://127.0.0.1:8081")
        )) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            response.setHeader("Access-Control-Allow-Headers", "*");
        }
        
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
    }
}
