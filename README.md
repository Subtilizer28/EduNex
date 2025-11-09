# EduNex - Learning Management System

![EduNex Logo](https://img.shields.io/badge/EduNex-LMS-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green)
![Java](https://img.shields.io/badge/Java-21-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📚 Project Overview

**EduNex** is a modern, feature-rich Learning Management System (LMS) built with Java Spring Boot. It provides comprehensive educational management capabilities with a sleek dark-mode interface and role-based access control.

### Core Features

#### 🔐 Authentication & Authorization
- JWT-based authentication with secure token management
- Role-based access control (Admin, Instructor, Student)
- BCrypt password encryption
- Session management with localStorage

#### 👨‍💼 Admin Features
- **User Management**: Create, activate, deactivate, and delete users
- **Course Oversight**: View all courses and system-wide statistics
- **Instructor Assignment**: Assign instructors to courses
- **System Activity Logs**: Real-time tracking of system events (user registration, course creation, quiz/assignment activities)
- **Dashboard Analytics**: User statistics, course metrics, enrollment tracking
- **Recent Users**: View last 10 newly registered users

#### 👨‍🏫 Instructor Features
- **Course Management**: Create and manage courses with table view
- **Assignment Creation**: Create assignments with modals, set due dates and points
- **Quiz Management**: Create quizzes with dynamic question builder (multiple questions with multiple choice options)
- **Student Enrollment**: Enroll students in courses
- **Attendance Tracking**: Mark student attendance by date
- **Grading System**: Grade student assignments and quiz attempts
- **Dashboard Analytics**: Course statistics, student performance, pending grading count
- **Scrollable Modals**: All creation modals are scrollable with background lock

#### 🎓 Student Features
- **Course Enrollment**: View enrolled courses
- **Assignment Submission**: Submit assignments with file support
- **Timed Quizzes**: Take quizzes with automatic timer and submission
- **Grade Viewing**: Track grades and academic progress
- **Attendance Records**: View attendance history
- **Dashboard**: Personalized student dashboard with course overview

#### 🎨 UI/UX Features
- **Dark Mode Interface**: Modern dark theme with accent colors
- **Responsive Design**: Mobile-friendly layout
- **Scrollable Modals**: Long forms scroll within modals, background scroll disabled
- **Empty State Handling**: User-friendly messages when no data exists
- **Table Views**: Organized data display for courses, assignments, and quizzes
- **Real-time Updates**: Dynamic content loading with fetch API
- **Toast Notifications**: User feedback for actions

---

## 🛠️ Technologies Used

### Backend
- **Java 21**
- **Spring Boot 3.5.6**
  - Spring Web
  - Spring Security (JWT Authentication)
  - Spring Data JPA (Hibernate)
- **MySQL 8.0+** (Database)
- **Maven** (Build tool)
- **Lombok** (Boilerplate reduction)

### Frontend
- **JSP** (Java Server Pages)
- **HTML5 & CSS3** (Dark Mode Design)
- **Vanilla JavaScript** (ES6+)
- **Font Awesome 6.4.0** (Icons)
- **Chart.js** (Dashboard charts)

---

## 📋 Prerequisites

Before running the application, ensure you have:

- **Java 21 or higher** installed
- **MySQL 8.0+** installed and running
- **Maven 3.6+** installed
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Subtilizer28/EduNex.git
cd EduNex
```

### 2. Configure MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE edunex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'edunex'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON edunex_db.* TO 'edunex'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Application Properties

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/edunex_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=edunex
spring.datasource.password=your_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=YourSecretKeyForJWTTokenGenerationMustBeLongEnoughForHS512Algorithm
jwt.expiration=86400000

# Server Configuration
server.port=8080

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### 4. Build and Run

#### Using Maven:

```bash
# Build the project
mvn clean package -DskipTests

# Run the application
mvn spring-boot:run
```

#### Using IDE:
- Open the project in your IDE
- Run `EduNexApplication.java` main method

### 5. Access the Application

Open your browser and navigate to:
- **Homepage**: http://localhost:8080/
- **Login**: http://localhost:8080/login

**Note**: Create an admin account on first login through the registration form, then create other users from the admin panel.

---

## 👥 User Roles & Capabilities

### 🔴 Admin Role
**Full System Access**
- Create/manage all users (Admin, Instructor, Student)
- View system-wide statistics and analytics
- Access activity logs (recent system events)
- Assign instructors to courses
- Activate/deactivate user accounts
- Delete users
- View all courses across the system
- Monitor user registrations and enrollments

### 🟡 Instructor Role
**Course & Content Management**
- Create and manage own courses
- Create assignments with customizable points and due dates
- Create quizzes with dynamic question builder
- Enroll students in their courses
- Mark student attendance
- Grade assignments and quiz attempts
- View course analytics and pending grading count
- Access instructor dashboard with charts

### 🟢 Student Role
**Learning & Progress Tracking**
- View enrolled courses
- Submit assignments
- Take timed quizzes
- View grades and feedback
- Check attendance records
- Track academic progress
- Access personalized dashboard

---

## 📁 Project Structure

```
EduNex/
├── src/
│   ├── main/
│   │   ├── java/com/edunex/edunex_lms/
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java         # Spring Security & JWT config
│   │   │   │   └── WebMvcConfig.java           # MVC configuration
│   │   │   ├── controller/
│   │   │   │   ├── AdminController.java        # Admin endpoints
│   │   │   │   ├── AssignmentController.java   # Assignment CRUD
│   │   │   │   ├── AttendanceController.java   # Attendance marking
│   │   │   │   ├── AuthController.java         # Login/Register
│   │   │   │   ├── CourseController.java       # Course management
│   │   │   │   ├── EnrollmentController.java   # Enrollment handling
│   │   │   │   ├── QuizController.java         # Quiz & attempts
│   │   │   │   └── ViewController.java         # JSP page routing
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── LoginResponse.java
│   │   │   │   └── UserRegistrationDTO.java
│   │   │   ├── entity/
│   │   │   │   ├── ActivityLog.java            # System activity tracking
│   │   │   │   ├── Assignment.java
│   │   │   │   ├── Attendance.java
│   │   │   │   ├── Course.java
│   │   │   │   ├── Enrollment.java
│   │   │   │   ├── Question.java               # Quiz questions
│   │   │   │   ├── Quiz.java
│   │   │   │   ├── QuizAttempt.java           # Student quiz attempts
│   │   │   │   └── User.java
│   │   │   ├── repository/
│   │   │   │   ├── ActivityLogRepository.java
│   │   │   │   ├── AssignmentRepository.java
│   │   │   │   ├── AttendanceRepository.java
│   │   │   │   ├── CourseRepository.java
│   │   │   │   ├── EnrollmentRepository.java
│   │   │   │   ├── QuestionRepository.java
│   │   │   │   ├── QuizAttemptRepository.java
│   │   │   │   ├── QuizRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/
│   │   │   │   ├── AuthEntryPointJwt.java      # JWT error handling
│   │   │   │   ├── AuthTokenFilter.java        # JWT token filter
│   │   │   │   ├── JwtUtils.java               # JWT generation/validation
│   │   │   │   ├── UserDetailsImpl.java
│   │   │   │   └── UserDetailsServiceImpl.java
│   │   │   ├── service/
│   │   │   │   ├── ActivityLogService.java     # Activity logging
│   │   │   │   ├── AssignmentService.java
│   │   │   │   ├── CourseService.java
│   │   │   │   ├── EnrollmentService.java
│   │   │   │   ├── QuizService.java
│   │   │   │   └── UserService.java
│   │   │   └── EduNexApplication.java          # Main application
│   │   ├── resources/
│   │   │   ├── application.properties
│   │   │   ├── static/
│   │   │   │   ├── css/
│   │   │   │   │   └── style.css               # Global dark theme styles
│   │   │   │   └── js/
│   │   │   │       ├── admin-dashboard.js      # Admin dashboard logic
│   │   │   │       ├── assignments.js
│   │   │   │       ├── auth.js                 # Login/Register/Logout
│   │   │   │       ├── courses.js
│   │   │   │       ├── instructor.js           # Combined instructor JS
│   │   │   │       ├── main.js                 # API calls, utilities
│   │   │   │       ├── profile.js
│   │   │   │       ├── quizzes.js
│   │   │   │       ├── student-dashboard.js
│   │   │   │       └── theme.js
│   │   │   └── META-INF/
│   │   │       └── additional-spring-configuration-metadata.json
│   │   └── webapp/
│   │       └── WEB-INF/
│   │           └── views/
│   │               ├── admin/
│   │               │   ├── courses.jsp
│   │               │   ├── dashboard.jsp
│   │               │   └── users.jsp
│   │               ├── instructor/
│   │               │   ├── assignments.jsp     # Table view
│   │               │   ├── courses.jsp         # Table view
│   │               │   ├── dashboard.jsp       # Charts & stats
│   │               │   └── quizzes.jsp         # Table view
│   │               ├── student/
│   │               │   └── dashboard.jsp
│   │               ├── assignments.jsp
│   │               ├── courses.jsp
│   │               ├── index.jsp
│   │               ├── login.jsp
│   │               ├── profile.jsp
│   │               └── quizzes.jsp
│   └── test/
│       └── java/com/edunex/edunex_lms/
│           └── EduNexLmsApplicationTests.java
├── pom.xml
├── QUICKSTART.md
├── README.md
└── sample-data.sql
```

---

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/login              # User login (returns JWT token)
POST   /api/auth/register           # User registration (Admin only)
```

### Admin APIs
```
GET    /api/admin/users                    # Get all users
GET    /api/admin/users/role/{role}        # Get users by role
POST   /api/admin/users                    # Create new user
PUT    /api/admin/users/{id}/activate      # Activate user account
PUT    /api/admin/users/{id}/deactivate    # Deactivate user account
DELETE /api/admin/users/{id}               # Delete user
GET    /api/admin/stats                    # Get system statistics
GET    /api/admin/courses                  # Get all courses
GET    /api/admin/activities               # Get recent activity logs
POST   /api/admin/enrollments/instructor   # Assign instructor to course
```

### Course APIs
```
GET    /api/courses                        # Get all courses
GET    /api/courses/{id}                   # Get course by ID
GET    /api/courses/instructor/{id}        # Get courses by instructor
POST   /api/courses                        # Create course (Instructor/Admin)
PUT    /api/courses/{id}                   # Update course
DELETE /api/courses/{id}                   # Delete course
```

### Assignment APIs
```
GET    /api/assignments/{id}               # Get assignment by ID
GET    /api/assignments/course/{id}        # Get assignments by course
POST   /api/assignments                    # Create assignment (Instructor)
POST   /api/assignments/{id}/submit        # Submit assignment (Student)
POST   /api/assignments/{id}/grade         # Grade assignment (Instructor)
GET    /api/assignments/course/{id}/pending # Get pending assignments
```

### Quiz APIs
```
GET    /api/quizzes/{id}                   # Get quiz by ID
GET    /api/quizzes/course/{id}            # Get quizzes by course
POST   /api/quizzes                        # Create quiz (Instructor)
POST   /api/quizzes/{id}/questions         # Add questions to quiz
POST   /api/quizzes/{id}/start             # Start quiz attempt (Student)
POST   /api/quizzes/attempts/{id}/submit   # Submit quiz attempt
POST   /api/quizzes/attempts/{id}/grade    # Grade quiz attempt (Instructor)
GET    /api/quizzes/course/{id}/available  # Get available quizzes
GET    /api/quizzes/{id}/attempts          # Get quiz attempts
```

### Enrollment APIs
```
GET    /api/enrollments/student/{id}       # Get student enrollments
GET    /api/enrollments/course/{id}        # Get course enrollments
POST   /api/enrollments                    # Enroll student (Instructor)
```

### Attendance APIs
```
GET    /api/attendance/course/{id}         # Get attendance by course
POST   /api/attendance                     # Mark attendance (Instructor)
```

---

## 📊 Database Schema

The application uses JPA/Hibernate with auto-DDL enabled (`spring.jpa.hibernate.ddl-auto=update`). Tables are created/updated automatically.

### Core Tables:

#### users
- `id` (BIGINT, PK)
- `username` (VARCHAR, UNIQUE)
- `password` (VARCHAR, BCrypt hashed)
- `email` (VARCHAR, UNIQUE)
- `full_name` (VARCHAR)
- `role` (ENUM: ADMIN, INSTRUCTOR, STUDENT)
- `enabled` (BOOLEAN)
- `account_non_locked` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### courses
- `id` (BIGINT, PK)
- `course_name` (VARCHAR)
- `course_code` (VARCHAR, UNIQUE)
- `description` (TEXT)
- `credits` (INT)
- `max_students` (INT)
- `start_date` (DATE)
- `end_date` (DATE)
- `instructor_id` (BIGINT, FK → users)
- `created_at` (TIMESTAMP)

#### enrollments
- `id` (BIGINT, PK)
- `student_id` (BIGINT, FK → users)
- `course_id` (BIGINT, FK → courses)
- `enrollment_date` (TIMESTAMP)
- `status` (VARCHAR)

#### assignments
- `id` (BIGINT, PK)
- `title` (VARCHAR)
- `description` (TEXT)
- `course_id` (BIGINT, FK → courses)
- `due_date` (TIMESTAMP)
- `max_points` (INT)
- `created_at` (TIMESTAMP)

#### quizzes
- `id` (BIGINT, PK)
- `title` (VARCHAR)
- `description` (TEXT)
- `course_id` (BIGINT, FK → courses)
- `duration` (INT, minutes)
- `total_points` (INT)
- `created_at` (TIMESTAMP)

#### questions
- `id` (BIGINT, PK)
- `quiz_id` (BIGINT, FK → quizzes)
- `question_text` (TEXT)
- `option_a` (VARCHAR)
- `option_b` (VARCHAR)
- `option_c` (VARCHAR)
- `option_d` (VARCHAR)
- `correct_answer` (VARCHAR)
- `points` (INT)

#### quiz_attempts
- `id` (BIGINT, PK)
- `quiz_id` (BIGINT, FK → quizzes)
- `student_id` (BIGINT, FK → users)
- `start_time` (TIMESTAMP)
- `end_time` (TIMESTAMP)
- `score` (INT)
- `status` (VARCHAR: IN_PROGRESS, SUBMITTED, GRADED)

#### attendance
- `id` (BIGINT, PK)
- `student_id` (BIGINT, FK → users)
- `course_id` (BIGINT, FK → courses)
- `attendance_date` (DATE)
- `status` (VARCHAR: PRESENT, ABSENT, LATE)
- `marked_by` (BIGINT, FK → users)
- `marked_at` (TIMESTAMP)

#### activity_logs
- `id` (BIGINT, PK)
- `activity_type` (VARCHAR: USER_REGISTRATION, ASSIGNMENT_CREATED, QUIZ_CREATED, etc.)
- `description` (TEXT)
- `user_id` (BIGINT, FK → users)
- `entity_type` (VARCHAR)
- `entity_id` (BIGINT)
- `created_at` (TIMESTAMP)

---

## 🧪 Testing

Run tests using Maven:

```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# Skip tests during build
mvn clean package -DskipTests
```

---

## 🎨 UI/UX Design

### Dark Mode Theme
- **Background**: Pure dark (#0f0f0f)
- **Cards**: Dark gray (#1a1a1a)
- **Primary**: Blue (#4a90e2)
- **Accent**: Cyan (#00d4ff)
- **Text**: Light gray (#e0e0e0)

### Key UI Components

#### Modal System
- **Scrollable Content**: Modals have `max-height: calc(100vh - 6rem)` with `overflow-y: auto`
- **Background Lock**: `body` scroll disabled when modal open (`overflow: hidden`)
- **Click Outside**: Close modal by clicking overlay
- **Responsive**: Adapts to mobile screens

#### Empty States
- **Courses**: "No courses yet. Create your first course!"
- **Assignments**: "No assignments yet. Create your first assignment!"
- **Quizzes**: "No quizzes yet. Create your first quiz!"
- **Center Aligned**: Friendly messaging encouraging content creation

#### Table Views
All data displayed in responsive tables with:
- Sortable columns
- Action buttons (View, Edit, Grade)
- Status badges (Active, Completed, Upcoming)
- Pagination (when implemented)

#### Forms
- Inline validation
- Clear error messages
- Loading states during submission
- Success/error toast notifications

---

## 🔧 Configuration

### JWT Settings
```properties
# JWT Secret (must be long for HS512)
jwt.secret=YourVeryLongSecretKeyForJWTTokenGeneration

# Token expiration (milliseconds) - Default: 24 hours
jwt.expiration=86400000
```

### Database Settings
```properties
# Auto-create/update tables
spring.jpa.hibernate.ddl-auto=update

# Show SQL queries (development)
spring.jpa.show-sql=true

# Production: Use validate or none
# spring.jpa.hibernate.ddl-auto=validate
```

### File Upload
```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

---

## 📦 Deployment

### Local Deployment

```bash
# Build WAR file
mvn clean package

# Run with embedded Tomcat
java -jar target/edunex-lms-0.0.1-SNAPSHOT.war
```

### Production Deployment

1. **Build for production**:
```bash
mvn clean package -Pprod
```

2. **Set environment variables**:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-host:3306/edunex_db
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=secure_password
export JWT_SECRET=your_production_jwt_secret_must_be_very_long
```

3. **Deploy to Tomcat**:
- Copy `edunex-lms-0.0.1-SNAPSHOT.war` to Tomcat's `webapps/` directory
- Restart Tomcat

4. **Production checklist**:
- [ ] Change `spring.jpa.hibernate.ddl-auto` to `validate`
- [ ] Disable SQL logging (`spring.jpa.show-sql=false`)
- [ ] Use strong JWT secret (64+ characters)
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Configure logging to files

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Port 8080 Already in Use
```properties
# Change in application.properties
server.port=8081
```

#### 2. Database Connection Failed
```bash
# Check MySQL status
sudo systemctl status mysql

# Verify database exists
mysql -u root -p
mysql> SHOW DATABASES LIKE 'edunex_db';

# Check credentials match application.properties
```

#### 3. JWT Authentication Errors
- **401 Unauthorized**: Check SecurityConfig endpoint permissions
- **Token Expired**: Token expires after 24 hours by default
- **Invalid Token**: Clear browser localStorage and login again
```javascript
// Clear token in browser console
localStorage.clear();
```

#### 4. Modal Not Scrolling
- Modals now have `overflow-y: auto` for scrolling
- Background scroll disabled with `body { overflow: hidden }`
- Fixed with recent updates

#### 5. Build Failures
```bash
# Clean Maven cache
mvn clean

# Update dependencies
mvn dependency:resolve

# Force update
mvn clean install -U
```

#### 6. Empty Data Not Showing Messages
- Check browser console for JavaScript errors
- Verify API endpoints returning empty arrays (not errors)
- Empty states implemented for courses, assignments, quizzes

---

## 🚀 Future Enhancements

### Planned Features
- [ ] File upload for assignments
- [ ] Real-time notifications
- [ ] Discussion forums
- [ ] Video conferencing integration
- [ ] Mobile app (React Native)
- [ ] Gradebook export (PDF/Excel)
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Course materials library
- [ ] Advanced analytics dashboard

### In Progress
- [x] Activity logging system
- [x] Scrollable modals
- [x] Empty state handling
- [x] Table views for all entities

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Code Style
- Follow Java naming conventions
- Use Lombok for boilerplate reduction
- Write meaningful commit messages
- Add JavaDoc for public methods
- Test your changes

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For issues or questions:
- **GitHub Issues**: [Open an issue](https://github.com/Subtilizer28/EduNex/issues)
- **Documentation**: Check this README and QUICKSTART.md
- **Email**: support@edunex.com (if available)

---

## 🙏 Acknowledgments

- Spring Boot Team for the excellent framework
- Font Awesome for icons
- Chart.js for dashboard visualizations
- MySQL for reliable database management
- The open-source community

---

**Built with ❤️ using Spring Boot 3.5.6**

*Last Updated: November 2025*