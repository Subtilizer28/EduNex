package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.Notification;
import com.edunex.edunex_lms.entity.User;
import com.edunex.edunex_lms.repository.NotificationRepository;
import com.edunex.edunex_lms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    private Notification.NotificationType resolveType(String rawType) {
        if (rawType == null) return Notification.NotificationType.ANNOUNCEMENT;
        String t = rawType.trim().toUpperCase();
        try {
            // Try exact match with defined enum first
            return Notification.NotificationType.valueOf(t);
        } catch (IllegalArgumentException ex) {
            // Graceful mapping from generic UI terms to our enum
            switch (t) {
                case "INFO":
                case "SUCCESS":
                    return Notification.NotificationType.ANNOUNCEMENT;
                case "WARNING":
                case "ERROR":
                    return Notification.NotificationType.SYSTEM;
                default:
                    return Notification.NotificationType.ANNOUNCEMENT;
            }
        }
    }

    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(resolveType(type));
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public void sendNotification(Long userId, String title, String message, String type) {
        createNotification(userId, title, message, type);
    }
    
    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .filter(n -> !n.getIsRead())
            .toList();
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(notifications);
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .filter(n -> !n.getIsRead())
            .toList();
    }
    
    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }
}
