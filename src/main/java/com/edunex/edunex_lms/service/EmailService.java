package com.edunex.edunex_lms.service;

import com.edunex.edunex_lms.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@edunex.com}")
    private String fromEmail;
    
    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to EduNex LMS!");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Welcome to EduNex Learning Management System!\n\n" +
                "Your account has been successfully created with the following details:\n" +
                "Username: %s\n" +
                "Role: %s\n\n" +
                "You can now log in and start exploring our platform.\n\n" +
                "Best regards,\n" +
                "EduNex Team",
                user.getFullName(), user.getUsername(), user.getRole()
            ));
            
            mailSender.send(message);
            log.info("Welcome email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }
    
    public void sendGradeNotification(User student, String courseName, Double grade) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(student.getEmail());
            message.setSubject("Grade Posted - " + courseName);
            message.setText(String.format(
                "Dear %s,\n\n" +
                "A new grade has been posted for your course: %s\n\n" +
                "Grade: %.2f\n\n" +
                "Login to view more details.\n\n" +
                "Best regards,\n" +
                "EduNex Team",
                student.getFullName(), courseName, grade
            ));
            
            mailSender.send(message);
            log.info("Grade notification sent to: {}", student.getEmail());
        } catch (Exception e) {
            log.error("Failed to send grade notification to: {}", student.getEmail(), e);
        }
    }
    
    public void sendAssignmentReminder(User student, String assignmentTitle, String dueDate) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(student.getEmail());
            message.setSubject("Assignment Due Soon - " + assignmentTitle);
            message.setText(String.format(
                "Dear %s,\n\n" +
                "This is a reminder that the following assignment is due soon:\n\n" +
                "Assignment: %s\n" +
                "Due Date: %s\n\n" +
                "Please submit your work before the deadline.\n\n" +
                "Best regards,\n" +
                "EduNex Team",
                student.getFullName(), assignmentTitle, dueDate
            ));
            
            mailSender.send(message);
            log.info("Assignment reminder sent to: {}", student.getEmail());
        } catch (Exception e) {
            log.error("Failed to send assignment reminder to: {}", student.getEmail(), e);
        }
    }
    
    public void sendQuizReminder(User student, String quizTitle, String startTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(student.getEmail());
            message.setSubject("Quiz Reminder - " + quizTitle);
            message.setText(String.format(
                "Dear %s,\n\n" +
                "Reminder: A quiz is scheduled:\n\n" +
                "Quiz: %s\n" +
                "Start Time: %s\n\n" +
                "Make sure you're prepared and available at the scheduled time.\n\n" +
                "Best regards,\n" +
                "EduNex Team",
                student.getFullName(), quizTitle, startTime
            ));
            
            mailSender.send(message);
            log.info("Quiz reminder sent to: {}", student.getEmail());
        } catch (Exception e) {
            log.error("Failed to send quiz reminder to: {}", student.getEmail(), e);
        }
    }
    
    public void sendAnnouncementEmail(User user, String title, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Announcement: " + title);
            message.setText(String.format(
                "Dear %s,\n\n" +
                "%s\n\n" +
                "Best regards,\n" +
                "EduNex Team",
                user.getFullName(), content
            ));
            
            mailSender.send(message);
            log.info("Announcement sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send announcement to: {}", user.getEmail(), e);
        }
    }
    
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Password Reset Request");
            message.setText(String.format(
                "Dear %s,\n\n" +
                "You have requested to reset your password.\n\n" +
                "Reset Token: %s\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "EduNex Team",
                user.getFullName(), resetToken
            ));
            
            mailSender.send(message);
            log.info("Password reset email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", user.getEmail(), e);
        }
    }
}
