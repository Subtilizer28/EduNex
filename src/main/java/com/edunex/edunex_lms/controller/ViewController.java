package com.edunex.edunex_lms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class ViewController {
    
    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "admin/dashboard";
    }
    
    @GetMapping("/admin/users")
    public String adminUsers() {
        return "admin/users";
    }
    
    @GetMapping("/admin/courses")
    public String adminCourses() {
        return "admin/courses";
    }
    
    @GetMapping("/admin/reports")
    public String adminReports() {
        return "admin/reports";
    }
    
    @GetMapping("/instructor/dashboard")
    public String instructorDashboard() {
        return "instructor/dashboard";
    }
    
    @GetMapping("/student/dashboard")
    public String studentDashboard() {
        return "student/dashboard";
    }
    
    @GetMapping("/courses")
    public String courses() {
        return "courses";
    }
    
    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }
    
    @GetMapping("/assignments")
    public String assignments() {
        return "assignments";
    }
    
    @GetMapping("/quizzes")
    public String quizzes() {
        return "quizzes";
    }
}
