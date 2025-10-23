-- EduNex LMS - Sample Data SQL Script
-- This script creates sample users, courses, and data for testing
-- Run this AFTER the application has created the tables

-- =============================================
-- IMPORTANT NOTES:
-- 1. Run the application first to auto-create tables
-- 2. Replace USER_IDs with actual IDs after users are created
-- 3. Passwords are BCrypt hashed (use the app to register or update manually)
-- =============================================

USE edunex_db;

-- =============================================
-- SAMPLE USERS
-- =============================================
-- Note: Use the registration page to create users, or manually hash passwords using BCrypt
-- For testing, you can use Spring Security's BCryptPasswordEncoder
-- Example: Password "password123" hashed -> $2a$10$...

-- Sample Admin
-- Username: admin / Password: admin123
INSERT INTO users (username, password, email, full_name, phone_number, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'admin@edunex.com', 'System Administrator', '+1234567890', 'ADMIN', true, true, NOW(), NOW());

-- Sample Instructors
-- Username: prof_smith / Password: password123
INSERT INTO users (username, password, email, full_name, phone_number, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('prof_smith', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'smith@edunex.com', 'Dr. John Smith', '+1234567891', 'INSTRUCTOR', true, true, NOW(), NOW());

INSERT INTO users (username, password, email, full_name, phone_number, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('prof_jane', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'jane@edunex.com', 'Prof. Jane Doe', '+1234567892', 'INSTRUCTOR', true, true, NOW(), NOW());

-- Sample Students
-- Username: student1 / Password: password123
INSERT INTO users (username, password, email, full_name, phone_number, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('student1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'student1@edunex.com', 'Alice Johnson', '+1234567893', 'STUDENT', true, true, NOW(), NOW());

INSERT INTO users (username, password, email, full_name, phone_number, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('student2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'student2@edunex.com', 'Bob Williams', '+1234567894', 'STUDENT', true, true, NOW(), NOW());

INSERT INTO users (username, password, email, full_name, phone_number, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('student3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'student3@edunex.com', 'Carol Davis', '+1234567895', 'STUDENT', true, true, NOW(), NOW());

-- =============================================
-- SAMPLE COURSES
-- =============================================
-- Replace instructor_id=2 with actual instructor ID from your database

INSERT INTO courses (course_code, course_name, description, category, thumbnail_url, credits, max_students, is_active, instructor_id, created_at, updated_at)
VALUES 
('CS101', 'Introduction to Programming', 'Learn the fundamentals of programming using Java. This course covers variables, data types, control structures, functions, and object-oriented programming basics.', 'Computer Science', NULL, 3, 50, true, 2, NOW(), NOW()),

('CS201', 'Data Structures and Algorithms', 'Advanced programming concepts including arrays, linked lists, stacks, queues, trees, graphs, and algorithm analysis.', 'Computer Science', NULL, 4, 40, true, 2, NOW(), NOW()),

('MATH101', 'Calculus I', 'Introduction to differential and integral calculus. Topics include limits, derivatives, integrals, and applications.', 'Mathematics', NULL, 4, 45, true, 3, NOW(), NOW()),

('MATH201', 'Linear Algebra', 'Study of vector spaces, matrices, determinants, eigenvalues, and linear transformations.', 'Mathematics', NULL, 3, 40, true, 3, NOW(), NOW()),

('ENG101', 'English Composition', 'Develop writing skills through various forms of composition including essays, research papers, and presentations.', 'English', NULL, 3, 35, true, 3, NOW(), NOW());

-- =============================================
-- SAMPLE ENROLLMENTS
-- =============================================
-- Enroll students in courses
-- student1 (id=4) enrolls in CS101, MATH101, ENG101
INSERT INTO enrollments (student_id, course_id, status, progress_percentage, enrolled_at)
VALUES 
(4, 1, 'ACTIVE', 65.0, NOW()),
(4, 3, 'ACTIVE', 70.0, NOW()),
(4, 5, 'ACTIVE', 80.0, NOW());

-- student2 (id=5) enrolls in CS101, CS201
INSERT INTO enrollments (student_id, course_id, status, progress_percentage, enrolled_at)
VALUES 
(5, 1, 'ACTIVE', 55.0, NOW()),
(5, 2, 'ACTIVE', 45.0, NOW());

-- student3 (id=6) enrolls in MATH101, MATH201, CS101
INSERT INTO enrollments (student_id, course_id, status, progress_percentage, enrolled_at)
VALUES 
(6, 3, 'ACTIVE', 75.0, NOW()),
(6, 4, 'ACTIVE', 60.0, NOW()),
(6, 1, 'ACTIVE', 70.0, NOW());

-- =============================================
-- SAMPLE ASSIGNMENTS
-- =============================================
-- Assignments for CS101
INSERT INTO assignments (course_id, title, description, due_date, max_marks, status, created_at, updated_at)
VALUES 
(1, 'Hello World Program', 'Write a simple Hello World program in Java and explain the code structure.', DATE_ADD(NOW(), INTERVAL 7 DAY), 10, 'PENDING', NOW(), NOW()),
(1, 'Variables and Data Types', 'Create a program demonstrating all primitive data types in Java.', DATE_ADD(NOW(), INTERVAL 14 DAY), 20, 'PENDING', NOW(), NOW()),
(1, 'Control Structures Lab', 'Implement various control structures: if-else, switch, loops.', DATE_ADD(NOW(), INTERVAL 21 DAY), 30, 'PENDING', NOW(), NOW());

-- Assignments for MATH101
INSERT INTO assignments (course_id, title, description, due_date, max_marks, status, created_at, updated_at)
VALUES 
(3, 'Limits Problem Set', 'Solve 20 problems on limits and continuity.', DATE_ADD(NOW(), INTERVAL 10 DAY), 25, 'PENDING', NOW(), NOW()),
(3, 'Derivatives Assignment', 'Calculate derivatives of various functions.', DATE_ADD(NOW(), INTERVAL 17 DAY), 30, 'PENDING', NOW(), NOW());

-- =============================================
-- SAMPLE QUIZZES
-- =============================================
-- Quiz for CS101
INSERT INTO quizzes (course_id, title, description, duration_minutes, total_marks, passing_marks, max_attempts, is_active, start_time, end_time, created_at, updated_at)
VALUES 
(1, 'Java Basics Quiz', 'Test your knowledge of Java fundamentals', 30, 20, 12, 2, true, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(1, 'OOP Concepts Quiz', 'Quiz on Object-Oriented Programming concepts', 45, 30, 18, 2, true, DATE_ADD(NOW(), INTERVAL 15 DAY), DATE_ADD(NOW(), INTERVAL 45 DAY), NOW(), NOW());

-- Quiz for MATH101
INSERT INTO quizzes (course_id, title, description, duration_minutes, total_marks, passing_marks, max_attempts, is_active, start_time, end_time, created_at, updated_at)
VALUES 
(3, 'Calculus Fundamentals', 'Quiz on basic calculus concepts', 40, 25, 15, 2, true, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), NOW(), NOW());

-- =============================================
-- SAMPLE QUESTIONS
-- =============================================
-- Questions for Java Basics Quiz (quiz_id = 1)
INSERT INTO questions (quiz_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, marks, question_order)
VALUES 
(1, 'What is the correct syntax to output "Hello World" in Java?', 'MCQ', 
 'echo("Hello World");', 'System.out.println("Hello World");', 
 'Console.WriteLine("Hello World");', 'print("Hello World");', 
 'B', 2, 1),

(1, 'Which keyword is used to create a class in Java?', 'MCQ', 
 'class', 'Class', 'object', 'Object', 
 'A', 2, 2),

(1, 'Is Java case-sensitive?', 'TRUE_FALSE', 
 'True', 'False', NULL, NULL, 
 'True', 2, 3),

(1, 'What is the size of int data type in Java?', 'MCQ', 
 '8 bits', '16 bits', '32 bits', '64 bits', 
 'C', 2, 4),

(1, 'Which method is the entry point for any Java program?', 'SHORT_ANSWER', 
 NULL, NULL, NULL, NULL, 
 'main', 2, 5);

-- Questions for OOP Quiz (quiz_id = 2)
INSERT INTO questions (quiz_id, question_text, question_type, option_a, option_b, option_c, option_d, correct_answer, marks, question_order)
VALUES 
(2, 'What is encapsulation in OOP?', 'MCQ', 
 'Hiding implementation details', 'Creating multiple classes', 
 'Using loops', 'None of the above', 
 'A', 3, 1),

(2, 'Which keyword is used to inherit a class?', 'MCQ', 
 'inherits', 'extends', 'implements', 'inherit', 
 'B', 3, 2);

-- =============================================
-- SAMPLE ATTENDANCE
-- =============================================
-- Attendance for CS101
INSERT INTO attendance (student_id, course_id, attendance_date, status, remarks, marked_at, marked_by)
VALUES 
-- Week 1
(4, 1, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'PRESENT', NULL, NOW(), 2),
(5, 1, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'PRESENT', NULL, NOW(), 2),
(6, 1, DATE_SUB(CURDATE(), INTERVAL 14 DAY), 'ABSENT', 'Sick', NOW(), 2),

-- Week 2
(4, 1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'PRESENT', NULL, NOW(), 2),
(5, 1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'LATE', 'Traffic', NOW(), 2),
(6, 1, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'PRESENT', NULL, NOW(), 2),

-- Week 3 (Current)
(4, 1, CURDATE(), 'PRESENT', NULL, NOW(), 2),
(5, 1, CURDATE(), 'PRESENT', NULL, NOW(), 2),
(6, 1, CURDATE(), 'PRESENT', NULL, NOW(), 2);

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================
-- Notifications for students
INSERT INTO notifications (user_id, title, message, type, is_read, link_url, created_at)
VALUES 
(4, 'New Assignment Posted', 'A new assignment "Hello World Program" has been posted in CS101', 'ASSIGNMENT', false, '/student/assignments', NOW()),
(4, 'Quiz Available', 'Java Basics Quiz is now available. Due in 7 days.', 'QUIZ', false, '/student/quizzes', NOW()),
(5, 'Grade Posted', 'Your grade for Programming Assignment 1 has been posted.', 'GRADE', false, '/student/grades', NOW()),
(6, 'Attendance Marked', 'Your attendance has been marked as Present for today.', 'ATTENDANCE', true, '/student/attendance', NOW());

-- Notifications for instructor
INSERT INTO notifications (user_id, title, message, type, is_read, link_url, created_at)
VALUES 
(2, 'New Student Enrolled', 'A new student has enrolled in CS101', 'COURSE_UPDATE', false, '/instructor/courses/1', NOW()),
(2, 'Assignment Submission', '5 students have submitted Programming Assignment 1', 'ASSIGNMENT', false, '/instructor/assignments', NOW());

-- =============================================
-- SAMPLE COURSE MATERIALS
-- =============================================
INSERT INTO course_materials (course_id, title, description, material_type, file_url, file_name, file_size, uploaded_at, uploaded_by)
VALUES 
(1, 'Introduction to Java', 'Lecture slides covering Java basics', 'PDF', '/uploads/java-intro.pdf', 'java-intro.pdf', 2048000, NOW(), 2),
(1, 'Java Installation Guide', 'Step-by-step guide to install JDK', 'PDF', '/uploads/java-install.pdf', 'java-install.pdf', 1024000, NOW(), 2),
(1, 'Sample Code Files', 'Example Java programs', 'DOCUMENT', '/uploads/samples.zip', 'samples.zip', 512000, NOW(), 2),
(3, 'Calculus Lecture 1', 'Introduction to Limits', 'PDF', '/uploads/calc-lecture1.pdf', 'calc-lecture1.pdf', 3072000, NOW(), 3);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify data was inserted correctly

-- Count users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- List all courses with instructor names
SELECT c.course_code, c.course_name, u.full_name as instructor 
FROM courses c 
JOIN users u ON c.instructor_id = u.id;

-- Count enrollments per course
SELECT c.course_name, COUNT(e.id) as enrolled_students 
FROM courses c 
LEFT JOIN enrollments e ON c.id = e.course_id 
GROUP BY c.id;

-- List assignments with course names
SELECT c.course_name, a.title, a.due_date 
FROM assignments a 
JOIN courses c ON a.course_id = c.id;

-- Count attendance records
SELECT COUNT(*) as total_attendance_records FROM attendance;

-- =============================================
-- NOTES
-- =============================================
-- 1. All passwords in this script are "password123" (hashed with BCrypt)
-- 2. You can use the registration page to create users with different passwords
-- 3. Replace USER IDs if they don't match your database
-- 4. This is sample data for testing - modify as needed
-- 5. File URLs in course_materials are examples - update with actual file paths
-- =============================================
