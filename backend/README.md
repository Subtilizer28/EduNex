# 🔧 EduNex Backend - Spring Boot API

This is the backend REST API for the EduNex Learning Management System, built with **Spring Boot 3.5.6** and **Java 17+**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🌟 Overview

The EduNex backend provides a comprehensive RESTful API for managing:
- User authentication and authorization (JWT)
- Course management
- Assignment submission and grading
- Attendance tracking
- Student enrollment
- Course materials
- Role-based access control (Admin, Instructor, Student)

---

## 🛠 Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17+ | Programming language |
| **Spring Boot** | 3.5.6 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | Data persistence |
| **Hibernate** | 6.6.29 | ORM framework |
| **MySQL** | 8.0+ | Database |
| **JWT** | 0.11.5 | JSON Web Tokens |
| **Lombok** | 1.18.34 | Code generation |
| **Maven** | 3.6+ | Build tool |
| **Validation API** | 3.0.2 | Input validation |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/edunex/edunex_lms/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── DataSeeder.java         # Database seeding
│   │   │   │   ├── SecurityConfig.java     # Security configuration
│   │   │   │   └── CorsConfig.java         # CORS settings
│   │   │   │
│   │   │   ├── controller/          # REST controllers
│   │   │   │   ├── AuthController.java     # Authentication endpoints
│   │   │   │   ├── CourseController.java   # Course management
│   │   │   │   ├── AssignmentController.java
│   │   │   │   ├── AttendanceController.java
│   │   │   │   ├── AdminController.java
│   │   │   │   └── MaterialController.java
│   │   │   │
│   │   │   ├── entity/              # JPA entities
│   │   │   │   ├── User.java              # User entity
│   │   │   │   ├── Course.java            # Course entity
│   │   │   │   ├── Enrollment.java        # Enrollment entity
│   │   │   │   ├── Assignment.java        # Assignment entity
│   │   │   │   ├── Attendance.java        # Attendance entity
│   │   │   │   └── CourseMaterial.java    # Course materials
│   │   │   │
│   │   │   ├── repository/          # Data access layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── CourseRepository.java
│   │   │   │   ├── EnrollmentRepository.java
│   │   │   │   ├── AssignmentRepository.java
│   │   │   │   ├── AttendanceRepository.java
│   │   │   │   └── MaterialRepository.java
│   │   │   │
│   │   │   ├── service/             # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── CourseService.java
│   │   │   │   ├── UserService.java
│   │   │   │   └── JwtService.java
│   │   │   │
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   └── AuthResponse.java
│   │   │   │
│   │   │   ├── exception/           # Exception handling
│   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │
│   │   │   └── EduNexApplication.java  # Main application class
│   │   │
│   │   └── resources/
│   │       ├── application.properties    # Configuration
│   │       └── application-prod.properties
│   │
│   └── test/                        # Unit and integration tests
│       └── java/com/edunex/edunex_lms/
│
├── target/                          # Build output
├── pom.xml                          # Maven dependencies
├── mvnw                             # Maven wrapper (Unix)
├── mvnw.cmd                         # Maven wrapper (Windows)
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Java Development Kit (JDK) 17 or higher
- Maven 3.6+ or use included Maven Wrapper
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

### Installation Steps

#### 1. Database Setup

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE edunex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'edunex'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON edunex_db.* TO 'edunex'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
EXIT;
```

#### 2. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Database credentials
spring.datasource.username=edunex
spring.datasource.password=your_secure_password

# JWT secret (generate a secure random string)
jwt.secret=your-256-bit-secret-key-here
jwt.expiration=86400000
```

#### 3. Build the Project

```bash
# Using Maven Wrapper (recommended)
./mvnw clean install

# Or using installed Maven
mvn clean install

# Skip tests if needed
./mvnw clean install -DskipTests
```

#### 4. Run the Application

```bash
# Using Maven Wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run

# With specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

The server will start on `http://localhost:8080`

#### 5. Verify Installation

```bash
# Check health
curl http://localhost:8080/actuator/health

# Should return: {"status":"UP"}
```

---

## ⚙️ Configuration

### application.properties

```properties
# Application Name
spring.application.name=EduNex

# Server Configuration
server.port=8080
server.servlet.context-path=/

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/edunex_db?createDatabaseIfNotExist=true
spring.datasource.username=edunex
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update        # Use 'create-drop' for fresh database
spring.jpa.show-sql=false                   # Set to 'true' for SQL logging
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

# File Upload Configuration
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

# JWT Configuration
jwt.secret=your-secret-key-at-least-256-bits
jwt.expiration=86400000                     # 24 hours in milliseconds

# Logging Configuration
logging.level.root=INFO
logging.level.com.edunex=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# Actuator Configuration
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=when-authorized
```

### Environment Variables

You can also use environment variables:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/edunex_db
export SPRING_DATASOURCE_USERNAME=edunex
export SPRING_DATASOURCE_PASSWORD=your_password
export JWT_SECRET=your-secret-key
```

---

## 🗄️ Database Schema

### Entity Relationships

```
User (1) ──< Enrollment >── (∞) Course (∞) ──> (1) Instructor
  │                              │
  │                              │
  └──< Assignment >──────────────┘
  │
  └──< Attendance >───────────────┘
```

### Main Tables

#### users
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password` (encrypted)
- `full_name`
- `usn` (University Seat Number for students)
- `role` (ADMIN, INSTRUCTOR, STUDENT)
- `enabled`
- `created_at`, `updated_at`

#### courses
- `id` (PK)
- `course_code` (unique)
- `course_name`
- `description`
- `category`
- `credits`
- `max_students`
- `instructor_id` (FK → users)
- `is_active`
- `created_at`, `updated_at`

#### enrollments
- `id` (PK)
- `student_id` (FK → users)
- `course_id` (FK → courses)
- `status` (ACTIVE, COMPLETED, DROPPED)
- `progress_percentage`
- `final_grade`
- `enrolled_at`

#### assignments
- `id` (PK)
- `course_id` (FK → courses)
- `student_id` (FK → users, nullable)
- `title`
- `description`
- `due_date`
- `max_marks`
- `marks_obtained`
- `submission_url`
- `submitted_at`
- `feedback`
- `status` (PENDING, SUBMITTED, GRADED, LATE_SUBMISSION)
- `created_at`, `updated_at`

#### attendance
- `id` (PK)
- `student_id` (FK → users)
- `course_id` (FK → courses)
- `attendance_date`
- `status` (PRESENT, ABSENT, LATE)
- `created_at`

#### course_materials
- `id` (PK)
- `course_id` (FK → courses)
- `title`
- `description`
- `material_type` (PDF, VIDEO, LINK, DOCUMENT)
- `file_url`
- `uploaded_at`

---

## 📡 API Endpoints

### Base URL: `http://localhost:8080/api`

### Authentication (Public)

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register new user | `{username, email, password, fullName, role}` |
| POST | `/auth/login` | Login user | `{username, password}` |
| GET | `/auth/profile` | Get current user | - |

### Courses

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/courses` | Get all active courses | Yes |
| GET | `/courses/{id}` | Get course by ID | Yes |
| GET | `/courses/instructor/{instructorId}` | Get instructor's courses | Yes (Instructor) |
| POST | `/courses` | Create new course | Yes (Admin/Instructor) |
| PUT | `/courses/{id}` | Update course | Yes (Admin/Instructor) |
| DELETE | `/courses/{id}` | Delete course | Yes (Admin) |
| POST | `/courses/{courseId}/enroll` | Enroll in course | Yes (Student) |

### Assignments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/assignments/course/{courseId}` | Get course assignments | Yes |
| GET | `/assignments/student/{studentId}` | Get student assignments | Yes (Student) |
| GET | `/assignments/{id}` | Get assignment by ID | Yes |
| POST | `/assignments` | Create assignment | Yes (Instructor) |
| PUT | `/assignments/{id}` | Update assignment | Yes (Instructor) |
| DELETE | `/assignments/{id}` | Delete assignment | Yes (Instructor) |
| POST | `/assignments/{id}/submit` | Submit assignment | Yes (Student) |
| PUT | `/assignments/{id}/grade` | Grade assignment | Yes (Instructor) |

### Attendance

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/attendance/course/{courseId}` | Get course attendance | Yes |
| GET | `/attendance/student/{studentId}` | Get student attendance | Yes (Student) |
| GET | `/attendance/student/{studentId}/course/{courseId}` | Get student course attendance | Yes |
| POST | `/attendance` | Mark attendance | Yes (Instructor) |
| PUT | `/attendance/{id}` | Update attendance | Yes (Instructor) |

### Course Materials

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/materials/course/{courseId}` | Get course materials | Yes |
| POST | `/materials` | Upload material | Yes (Instructor) |
| DELETE | `/materials/{id}` | Delete material | Yes (Instructor) |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/stats` | Get system statistics | Yes (Admin) |
| GET | `/admin/users` | Get all users | Yes (Admin) |
| POST | `/admin/users` | Create user | Yes (Admin) |
| PUT | `/admin/users/{id}` | Update user | Yes (Admin) |
| DELETE | `/admin/users/{id}` | Delete user | Yes (Admin) |

### Request/Response Examples

#### POST /api/auth/login

**Request:**
```json
{
  "username": "NNM23CS001",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "NNM23CS001",
  "email": "alice@student.edu",
  "fullName": "Alice Johnson",
  "role": "STUDENT"
}
```

#### POST /api/courses

**Request:**
```json
{
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "description": "Learn programming fundamentals",
  "category": "Programming",
  "credits": 4,
  "maxStudents": 50
}
```

**Response:**
```json
{
  "id": 1,
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "description": "Learn programming fundamentals",
  "category": "Programming",
  "credits": 4,
  "maxStudents": 50,
  "instructor": {
    "id": 2,
    "fullName": "Dr. John Doe"
  },
  "isActive": true,
  "createdAt": "2025-11-19T00:00:00"
}
```

---

## 🔐 Security

### Authentication Flow

1. User sends credentials to `/api/auth/login`
2. Server validates credentials
3. Server generates JWT token
4. Client stores token and includes it in subsequent requests
5. Server validates token for protected endpoints

### JWT Token Structure

```
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "sub": "username",
  "role": "STUDENT",
  "iat": 1700000000,
  "exp": 1700086400
}
```

### Using JWT in Requests

```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
  http://localhost:8080/api/courses
```

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **ADMIN** | Full system access, user management |
| **INSTRUCTOR** | Manage own courses, assignments, attendance |
| **STUDENT** | View courses, submit assignments, view grades |

---

## 🧪 Testing

### Run All Tests

```bash
./mvnw test
```

### Run Specific Test Class

```bash
./mvnw test -Dtest=AuthControllerTest
```

### Run with Coverage

```bash
./mvnw clean test jacoco:report
```

Coverage report will be at: `target/site/jacoco/index.html`

---

## 🚀 Deployment

### Production Configuration

Create `application-prod.properties`:

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.root=WARN
logging.level.com.edunex=INFO
```

### Build for Production

```bash
./mvnw clean package -DskipTests
```

JAR file will be in `target/edunex-lms-0.0.1-SNAPSHOT.jar`

### Run Production Build

```bash
java -jar target/edunex-lms-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Docker Deployment (Optional)

```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
docker build -t edunex-backend .
docker run -p 8080:8080 edunex-backend
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```
Error: Access denied for user 'edunex'@'localhost'
```
- Verify MySQL is running: `sudo systemctl status mysql`
- Check credentials in `application.properties`
- Verify user permissions: `SHOW GRANTS FOR 'edunex'@'localhost';`

**2. Port Already in Use**
```
Error: Port 8080 is already in use
```
- Kill process: `kill -9 $(lsof -t -i:8080)`
- Or change port in `application.properties`: `server.port=8081`

**3. JWT Token Invalid**
```
Error: JWT signature does not match
```
- Ensure `jwt.secret` is consistent across restarts
- Check token expiration
- Verify Authorization header format: `Bearer <token>`

**4. Hibernate Schema Validation Failed**
```
Error: Table doesn't exist
```
- Change `spring.jpa.hibernate.ddl-auto` to `create-drop` for fresh start
- Or run database migrations manually

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/index.html)
- [Hibernate ORM Documentation](https://hibernate.org/orm/documentation/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/) - JWT debugger

---

## 📝 License

This project is part of the EduNex Learning Management System.

---

<div align="center">

**[⬆ Back to Top](#-edunex-backend---spring-boot-api)**

Made with ❤️ by the EduNex Team

</div>
