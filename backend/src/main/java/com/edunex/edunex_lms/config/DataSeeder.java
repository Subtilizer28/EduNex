package com.edunex.edunex_lms.config;

import com.edunex.edunex_lms.entity.*;
import com.edunex.edunex_lms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }
        
        log.info("Seeding database with initial data for EduNex LMS...");
        
        // Create Admin
        User admin = createUser("admin", "admin@edunex.com", "Admin User", User.Role.ADMIN, null);
        
        // Create Instructors with realistic profiles
        User instructor1 = createUser("john.doe", "john.doe@edunex.com", "Dr. John Doe", User.Role.INSTRUCTOR, null);
        User instructor2 = createUser("jane.smith", "jane.smith@edunex.com", "Prof. Jane Smith", User.Role.INSTRUCTOR, null);
        User instructor3 = createUser("mike.wilson", "mike.wilson@edunex.com", "Dr. Mike Wilson", User.Role.INSTRUCTOR, null);
        User instructor4 = createUser("sarah.johnson", "sarah.johnson@edunex.com", "Dr. Sarah Johnson", User.Role.INSTRUCTOR, null);
        
        // Create Students with USN format (NNM23CS001-030)
        List<User> students = new ArrayList<>();
        String[] studentNames = {
            "Alice Johnson", "Bob Brown", "Charlie Davis", "Diana Evans", "Emma Wilson",
            "Frank Moore", "Grace Taylor", "Henry Anderson", "Ivy Roberts", "Jack Thompson",
            "Kate Martinez", "Liam Garcia", "Mia Rodriguez", "Noah Lopez", "Olivia Hernandez",
            "Peter White", "Quinn Thomas", "Rachel Green", "Sam Harris", "Tina Clark",
            "Uma Patel", "Victor Lee", "Wendy Kim", "Xavier Cruz", "Yara Singh",
            "Zack Miller", "Anna Scott", "Ben Turner", "Cara Phillips", "Dan Campbell"
        };
        
        for (int i = 0; i < 30; i++) {
            String usn = String.format("NNM23CS%03d", i + 1);
            String email = studentNames[i].toLowerCase().replace(" ", ".") + "@student.edu";
            students.add(createStudent(usn, email, studentNames[i]));
        }
        
        // Create diverse course catalog
        Course javaCourse = createCourse("CS101", "Introduction to Programming", 
            "Learn programming fundamentals using Java. Topics include variables, control structures, OOP, and basic algorithms.", 
            "Programming", 4, instructor1);
        
        Course dsaCourse = createCourse("CS201", "Data Structures and Algorithms",
            "Master essential data structures (arrays, linked lists, trees, graphs) and algorithmic problem-solving techniques.",
            "Computer Science", 4, instructor1);
        
        Course webCourse = createCourse("WEB301", "Full Stack Web Development",
            "Build modern web applications with Spring Boot backend and React frontend. Includes REST APIs and database integration.",
            "Web Development", 4, instructor2);
        
        Course dbCourse = createCourse("DB401", "Database Management Systems",
            "Learn database design, SQL, transactions, and query optimization. Hands-on experience with MySQL and PostgreSQL.",
            "Database", 3, instructor2);
        
        Course aiCourse = createCourse("AI501", "Artificial Intelligence Fundamentals",
            "Introduction to AI concepts including machine learning, neural networks, and natural language processing.",
            "AI/ML", 4, instructor3);
        
        Course securityCourse = createCourse("SEC301", "Cybersecurity Essentials",
            "Learn security principles, cryptography, network security, and secure coding practices.",
            "Security", 3, instructor3);
        
        Course mobileCourse = createCourse("MOB401", "Mobile App Development",
            "Build native Android and iOS applications. Learn mobile UI/UX design and platform-specific APIs.",
            "Mobile Development", 3, instructor4);
        
        Course cloudCourse = createCourse("CLD501", "Cloud Computing",
            "Master cloud platforms (AWS, Azure, GCP), containerization with Docker, and Kubernetes orchestration.",
            "Cloud Computing", 4, instructor4);
        
        // Enroll students in courses (realistic distribution)
        enrollStudentsInCourse(students.subList(0, 25), javaCourse);    // 25 students - intro course
        enrollStudentsInCourse(students.subList(5, 20), dsaCourse);     // 15 students
        enrollStudentsInCourse(students.subList(0, 18), webCourse);     // 18 students
        enrollStudentsInCourse(students.subList(8, 22), dbCourse);      // 14 students
        enrollStudentsInCourse(students.subList(10, 20), aiCourse);     // 10 students
        enrollStudentsInCourse(students.subList(15, 28), securityCourse); // 13 students
        enrollStudentsInCourse(students.subList(3, 15), mobileCourse);  // 12 students
        enrollStudentsInCourse(students.subList(12, 24), cloudCourse);  // 12 students
        
        // Create assignments for each course
        createAssignmentsForCourse(javaCourse, "Variables and Data Types", "Control Structures", "OOP Concepts");
        createAssignmentsForCourse(dsaCourse, "Linked Lists Implementation", "Binary Trees", "Graph Algorithms");
        createAssignmentsForCourse(webCourse, "REST API Development", "React Components", "Full Stack Integration");
        createAssignmentsForCourse(dbCourse, "Database Design", "SQL Queries", "Transaction Management");
        createAssignmentsForCourse(aiCourse, "Linear Regression", "Neural Networks", "NLP Project");
        
        // Create attendance records for active courses
        createAttendanceRecords(students.subList(0, 25), javaCourse);
        createAttendanceRecords(students.subList(5, 20), dsaCourse);
        createAttendanceRecords(students.subList(0, 18), webCourse);
        
        // Grade some assignments
        gradeSubmittedAssignments();
        
        log.info("╔════════════════════════════════════════════════════════════╗");
        log.info("║         EduNex LMS - Database Seeding Completed!          ║");
        log.info("╚════════════════════════════════════════════════════════════╝");
        log.info("📚 Courses created: 8");
        log.info("👥 Total users created: {}", students.size() + 5);
        log.info("   - Admin: 1");
        log.info("   - Instructors: 4");
        log.info("   - Students: {}", students.size());
        log.info("───────────────────────────────────────────────────────────");
        log.info("🔐 Default credentials:");
        log.info("   Admin     → Username: admin      | Password: password123");
        log.info("   Instructor → Username: john.doe   | Password: password123");
        log.info("   Student   → Username: NNM23CS001 (USN) | Password: password123");
        log.info("═══════════════════════════════════════════════════════════");
    }
    
    private User createUser(String username, String email, String fullName, User.Role role, String usn) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(role);
        user.setEnabled(true);
        user.setUsn(usn);
        return userRepository.save(user);
    }
    
    private User createStudent(String usn, String email, String fullName) {
        return createUser(usn, email, fullName, User.Role.STUDENT, usn);
    }
    
    private Course createCourse(String code, String name, String description, 
                                String category, int credits, User instructor) {
        Course course = new Course();
        course.setCourseCode(code);
        course.setCourseName(name);
        course.setDescription(description);
        course.setCategory(category);
        course.setCredits(credits);
        course.setMaxStudents(50);
        course.setInstructor(instructor);
        course.setIsActive(true);
        return courseRepository.save(course);
    }
    
    private void enrollStudentsInCourse(List<User> students, Course course) {
        for (User student : students) {
            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setCourse(course);
            enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
            enrollment.setProgressPercentage(Math.random() * 100);
            enrollment.setFinalGrade(70.0 + Math.random() * 30);
            enrollmentRepository.save(enrollment);
        }
    }
    
    private void createAssignmentsForCourse(Course course, String... titles) {
        for (int i = 0; i < titles.length; i++) {
            Assignment assignment = new Assignment();
            assignment.setCourse(course);
            assignment.setTitle(titles[i]);
            assignment.setDescription("Complete the assignment on " + titles[i] + ". Submit your solution before the deadline.");
            assignment.setDueDate(LocalDateTime.now().plusDays(7 * (i + 1)));
            assignment.setMaxMarks(100);
            assignment.setStatus(Assignment.SubmissionStatus.PENDING);
            assignmentRepository.save(assignment);
        }
    }
    
    private void gradeSubmittedAssignments() {
        // Simulate some graded assignments
        List<Assignment> assignments = assignmentRepository.findAll();
        List<User> students = userRepository.findByRole(User.Role.STUDENT);
        
        for (int i = 0; i < Math.min(5, assignments.size()); i++) {
            Assignment assignment = assignments.get(i);
            for (int j = 0; j < Math.min(3, students.size()); j++) {
                User student = students.get(j);
                Assignment submission = new Assignment();
                submission.setCourse(assignment.getCourse());
                submission.setTitle(assignment.getTitle());
                submission.setDescription(assignment.getDescription());
                submission.setDueDate(assignment.getDueDate());
                submission.setMaxMarks(assignment.getMaxMarks());
                submission.setStudent(student);
                submission.setSubmissionUrl("https://example.com/submissions/file" + i + "_" + j + ".pdf");
                submission.setSubmittedAt(LocalDateTime.now().minusDays(2));
                submission.setMarksObtained((int)(70 + Math.random() * 30)); // 70-100
                submission.setFeedback("Good work! " + (submission.getMarksObtained() >= 85 ? "Excellent understanding." : "Keep practicing."));
                submission.setStatus(Assignment.SubmissionStatus.GRADED);
                assignmentRepository.save(submission);
            }
        }
    }
    
    private void createAttendanceRecords(List<User> students, Course course) {
        LocalDate today = LocalDate.now();
        // Create attendance for last 15 days
        for (int day = 0; day < 15; day++) {
            LocalDate date = today.minusDays(day);
            for (User student : students) {
                Attendance attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setCourse(course);
                attendance.setAttendanceDate(date);
                // 85% attendance rate
                attendance.setStatus(Math.random() > 0.15 ? 
                    Attendance.AttendanceStatus.PRESENT : Attendance.AttendanceStatus.ABSENT);
                attendanceRepository.save(attendance);
            }
        }
    }
}
