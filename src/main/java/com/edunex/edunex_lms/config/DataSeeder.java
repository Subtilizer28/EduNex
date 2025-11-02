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

//@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }
        
        log.info("Seeding database with initial data...");
        
        // Create Admin
        User admin = createUser("admin", "admin@edunex.com", "Admin User", User.Role.ADMIN);
        
        // Create Instructors
        User instructor1 = createUser("john.doe", "john@edunex.com", "Dr. John Doe", User.Role.INSTRUCTOR);
        User instructor2 = createUser("jane.smith", "jane@edunex.com", "Prof. Jane Smith", User.Role.INSTRUCTOR);
        User instructor3 = createUser("mike.wilson", "mike@edunex.com", "Dr. Mike Wilson", User.Role.INSTRUCTOR);
        
        // Create Students
        List<User> students = new ArrayList<>();
        students.add(createUser("alice.johnson", "alice@student.edu", "Alice Johnson", User.Role.STUDENT));
        students.add(createUser("bob.brown", "bob@student.edu", "Bob Brown", User.Role.STUDENT));
        students.add(createUser("charlie.davis", "charlie@student.edu", "Charlie Davis", User.Role.STUDENT));
        students.add(createUser("diana.evans", "diana@student.edu", "Diana Evans", User.Role.STUDENT));
        students.add(createUser("emma.wilson", "emma@student.edu", "Emma Wilson", User.Role.STUDENT));
        students.add(createUser("frank.moore", "frank@student.edu", "Frank Moore", User.Role.STUDENT));
        students.add(createUser("grace.taylor", "grace@student.edu", "Grace Taylor", User.Role.STUDENT));
        students.add(createUser("henry.anderson", "henry@student.edu", "Henry Anderson", User.Role.STUDENT));
        
        // Create Courses
        Course course1 = createCourse("CS101", "Introduction to Programming", 
            "Learn the fundamentals of programming using Java", "Computer Science", 
            3, instructor1);
        
        Course course2 = createCourse("CS201", "Data Structures and Algorithms",
            "Master essential data structures and algorithmic techniques", "Computer Science",
            4, instructor1);
        
        Course course3 = createCourse("WEB301", "Web Development",
            "Build modern web applications with Spring Boot and React", "Web Development",
            3, instructor2);
        
        Course course4 = createCourse("DB401", "Database Management Systems",
            "Design and implement relational databases", "Database",
            4, instructor2);
        
        Course course5 = createCourse("AI501", "Artificial Intelligence",
            "Introduction to AI concepts and machine learning", "AI/ML",
            4, instructor3);
        
        // Enroll students in courses
        enrollStudentsInCourse(students.subList(0, 6), course1);
        enrollStudentsInCourse(students.subList(2, 8), course2);
        enrollStudentsInCourse(students.subList(0, 5), course3);
        enrollStudentsInCourse(students.subList(3, 8), course4);
        enrollStudentsInCourse(students.subList(1, 6), course5);
        
        // Create assignments
        createAssignments(course1);
        createAssignments(course2);
        createAssignments(course3);
        
        // Create quizzes
        createQuizzes(course1);
        createQuizzes(course2);
        
        // Create attendance records
        createAttendanceRecords(students, course1);
        createAttendanceRecords(students, course2);
        
        log.info("Database seeding completed successfully!");
        log.info("Admin credentials - Username: admin, Password: admin123");
        log.info("Instructor credentials - Username: john.doe, Password: password123");
        log.info("Student credentials - Username: alice.johnson, Password: password123");
    }
    
    private User createUser(String username, String email, String fullName, User.Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(role);
        user.setEnabled(true);
        return userRepository.save(user);
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
    
    private void createAssignments(Course course) {
        for (int i = 1; i <= 3; i++) {
            Assignment assignment = new Assignment();
            assignment.setCourse(course);
            assignment.setTitle("Assignment " + i + " - " + course.getCourseName());
            assignment.setDescription("Complete the exercises and submit your solution.");
            assignment.setDueDate(LocalDateTime.now().plusDays(7 * i));
            assignment.setMaxMarks(100);
            assignment.setStatus(Assignment.SubmissionStatus.PENDING);
            assignmentRepository.save(assignment);
        }
    }
    
    private void createQuizzes(Course course) {
        Quiz quiz = new Quiz();
        quiz.setCourse(course);
        quiz.setTitle("Midterm Quiz - " + course.getCourseName());
        quiz.setDescription("Test your knowledge of the first half of the course");
        quiz.setDurationMinutes(60);
        quiz.setTotalMarks(100);
        quiz.setPassingMarks(60);
        quiz.setMaxAttempts(2);
        quiz.setIsActive(true);
        quiz = quizRepository.save(quiz);
        
        // Create questions
        createQuestions(quiz);
    }
    
    private void createQuestions(Quiz quiz) {
        // MCQ Question
        Question q1 = new Question();
        q1.setQuiz(quiz);
        q1.setQuestionText("What is the output of System.out.println(5 + 3);?");
        q1.setQuestionType(Question.QuestionType.MCQ);
        q1.setMarks(10);
        q1.setCorrectAnswer("8");
        q1.setOptionA("5");
        q1.setOptionB("3");
        q1.setOptionC("8");
        q1.setOptionD("53");
        q1.setQuestionOrder(1);
        questionRepository.save(q1);
        
        // True/False Question
        Question q2 = new Question();
        q2.setQuiz(quiz);
        q2.setQuestionText("Java is a platform-independent language.");
        q2.setQuestionType(Question.QuestionType.TRUE_FALSE);
        q2.setMarks(5);
        q2.setCorrectAnswer("True");
        q2.setQuestionOrder(2);
        questionRepository.save(q2);
        
        // Short Answer
        Question q3 = new Question();
        q3.setQuiz(quiz);
        q3.setQuestionText("Explain what OOP stands for.");
        q3.setQuestionType(Question.QuestionType.SHORT_ANSWER);
        q3.setMarks(15);
        q3.setCorrectAnswer("Object-Oriented Programming");
        q3.setQuestionOrder(3);
        questionRepository.save(q3);
    }
    
    private void createAttendanceRecords(List<User> students, Course course) {
        LocalDate today = LocalDate.now();
        for (int day = 0; day < 10; day++) {
            LocalDate date = today.minusDays(day);
            for (User student : students.subList(0, Math.min(5, students.size()))) {
                Attendance attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setCourse(course);
                attendance.setAttendanceDate(date);
                attendance.setStatus(Math.random() > 0.2 ? 
                    Attendance.AttendanceStatus.PRESENT : Attendance.AttendanceStatus.ABSENT);
                attendanceRepository.save(attendance);
            }
        }
    }
}
