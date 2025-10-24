package com.edunex.edunex_lms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class for JWT token operations
 * Handles token generation, validation, and extraction
 */
@Component
@Slf4j
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    @Value("${jwt.issuer:EduNex-LMS}")
    private String jwtIssuer;
    
    @Value("${jwt.audience:EduNex-Users}")
    private String jwtAudience;
    
    /**
     * Generate signing key from secret
     * @return SecretKey for signing JWT tokens
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * Generate JWT token from authentication object
     * @param authentication Spring Security Authentication object
     * @return JWT token string
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuer(jwtIssuer)
            .setAudience(jwtAudience)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .claim("userId", userPrincipal.getId())
            .claim("role", userPrincipal.getAuthorities().iterator().next().getAuthority())
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }
    
    /**
     * Extract username from JWT token
     * @param token JWT token string
     * @return username
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    /**
     * Validate JWT token
     * @param authToken JWT token to validate
     * @return true if valid, false otherwise
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        
        return false;
    }
    
    /**
     * Get token expiration date
     * @param token JWT token string
     * @return Expiration date
     */
    public Date getExpirationDateFromJwtToken(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
    }
    
    /**
     * Check if token is expired
     * @param token JWT token string
     * @return true if expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromJwtToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}
