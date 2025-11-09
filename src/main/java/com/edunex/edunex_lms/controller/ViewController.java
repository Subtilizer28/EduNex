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
    
    @GetMapping("/admin/attendance")
    public String adminAttendance() {
        return "admin/attendance";
    }
    
    @GetMapping("/instructor/dashboard")
    public String instructorDashboard() {
        return "instructor/dashboard";
    }
    
    @GetMapping("/instructor/courses")
    public String instructorCourses() {
        return "instructor/courses";
    }
    
    @GetMapping("/instructor/assignments")
    public String instructorAssignments() {
        return "instructor/assignments";
    }
    
    @GetMapping("/instructor/quizzes")
    public String instructorQuizzes() {
        return "instructor/quizzes";
    }
    
    @GetMapping("/instructor/attendance")
    public String instructorAttendance() {
        return "instructor/attendance";
    }
    
    @GetMapping("/student/dashboard")
    public String studentDashboard() {
        return "student/dashboard";
    }
    
    @GetMapping("/student/courses")
    public String courses() {
        return "student/courses";
    }
    
    @GetMapping("/student/profile")
    public String profile() {
        return "student/profile";
    }
    
    @GetMapping("/student/assignments")
    public String assignments() {
        return "student/assignments";
    }
    
    @GetMapping("/student/quizzes")
    public String quizzes() {
        return "student/quizzes";
    }
}
