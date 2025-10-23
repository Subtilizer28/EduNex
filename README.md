# EduNex - Intelligent Learning Management System

![EduNex Logo](https://img.shields.io/badge/EduNex-LMS-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green)
![Java](https://img.shields.io/badge/Java-17+-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📚 Project Overview

**EduNex** is a modern, web-based Learning Management System (LMS) built using Java Spring Boot. It provides a comprehensive platform for managing online education with role-based access control, performance analytics, and optional AI-powered features.

### Key Features

- ✅ **Role-Based Access Control**: Admin, Instructor, and Student roles with dedicated dashboards
- ✅ **Course Management**: Create, organize, and manage courses with multimedia content
- ✅ **Assignments & Grading**: Upload assignments, submit work, and receive feedback
- ✅ **Quiz System**: Multiple question types (MCQ, True/False, Short Answer) with auto-grading
- ✅ **Attendance Tracking**: Manual attendance marking and comprehensive analytics
- ✅ **Performance Analytics**: Charts and reports for grades, attendance, and progress
- ✅ **Email Notifications**: Automated emails for grades, updates, and announcements
- ✅ **Responsive UI**: Industry-standard design that works on PC, tablet, and mobile
- ✅ **Dark/Light Mode**: User-friendly theme toggle
- ✅ **Export Reports**: Generate Excel and PDF reports
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Optional AI Features**: AI-powered quiz generation, recommendations, and analytics

---

## 🛠️ Technologies Used

### Backend
- **Java 17+**
- **Spring Boot 3.5.6**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **Spring Mail** (Email notifications)
- **MySQL** (Database)
- **Maven** (Build tool)

### Frontend
- **JSP** (Java Server Pages)
- **HTML5 & CSS3**
- **JavaScript (Vanilla)**
- **Chart.js** (Data visualization)

### Optional
- **OpenAI API** (AI features)

---

## 📋 Prerequisites

Before running the application, ensure you have:

- **Java 17 or higher** installed
- **MySQL** installed and running
- **Maven** installed
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
cd /path/to/your/projects
git clone <your-repo-url>
cd EduNex
```

### 2. Configure MySQL Database

Create a MySQL database:

```sql
CREATE DATABASE edunex_db;
```

### 3. Update Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/edunex_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Mail Configuration (for email notifications)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# JWT Secret (Generate a secure random string)
jwt.secret=YOUR_SECURE_JWT_SECRET_KEY_HERE

# AI Configuration (Optional - leave empty to disable AI features)
spring.ai.openai.api-key=${AI_API_KEY:}
```

### 4. Build and Run

#### Using Maven:

```bash
# Clean and build
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

#### Using IDE:
- Open the project in your IDE
- Run `EduNexApplication.java`

### 5. Access the Application

Open your browser and navigate to:
- **Homepage**: http://localhost:8080/
- **Login**: http://localhost:8080/login
- **Register**: http://localhost:8080/register

---

## 👥 User Roles & Access

### 1. **Admin**
- Manage all users (create, update, delete)
- View system-wide analytics
- Manage courses across all instructors
- Access all features

### 2. **Instructor**
- Create and manage courses
- Upload course materials
- Create assignments and quizzes
- Mark attendance
- Grade submissions
- View student performance

### 3. **Student**
- Enroll in courses
- View course materials
- Submit assignments
- Take quizzes
- View grades and progress
- Track attendance

---

## 📁 Project Structure

```
EduNex/
├── src/
│   ├── main/
│   │   ├── java/com/edunex/edunex_lms/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST & View controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── repository/          # Data repositories
│   │   │   ├── security/            # Security & JWT
│   │   │   ├── service/             # Business logic
│   │   │   └── EduNexApplication.java
│   │   ├── resources/
│   │   │   ├── application.properties
│   │   │   └── static/              # CSS, JS, Images
│   │   └── webapp/WEB-INF/views/    # JSP files
│   └── test/                        # Test classes
├── pom.xml
└── README.md
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin APIs
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

### Instructor APIs
- `GET /api/instructor/courses` - Get instructor courses
- `POST /api/instructor/courses` - Create course
- `POST /api/instructor/assignments` - Create assignment
- `POST /api/instructor/quizzes` - Create quiz
- `POST /api/instructor/attendance` - Mark attendance

### Student APIs
- `GET /api/student/courses` - Get enrolled courses
- `POST /api/student/enroll/{courseId}` - Enroll in course
- `GET /api/student/assignments` - Get assignments
- `POST /api/student/assignments/{id}/submit` - Submit assignment
- `GET /api/student/quizzes` - Get quizzes
- `POST /api/student/quizzes/{id}/attempt` - Attempt quiz

---

## 🤖 AI Features (Optional)

To enable AI features, set the `AI_API_KEY` environment variable:

### Linux/Mac:
```bash
export AI_API_KEY=your-openai-api-key
./mvnw spring-boot:run
```

### Windows:
```cmd
set AI_API_KEY=your-openai-api-key
mvnw spring-boot:run
```

### AI Capabilities:
- **AI Quiz Generation**: Automatically generate quiz questions from course materials
- **Learning Recommendations**: Personalized study suggestions for students
- **Performance Predictions**: AI-based analytics to predict student outcomes
- **Feedback Summaries**: AI-generated feedback on assignments

If `AI_API_KEY` is not set, the system will display "AI Features Not Available" on the frontend.

---

## 📧 Email Configuration

For email notifications to work, configure an SMTP server in `application.properties`:

### Gmail Example:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

**Note**: For Gmail, you need to generate an "App Password" from your Google Account settings.

---

## 🎨 Responsive Design

The frontend is fully responsive and works seamlessly across:
- **Desktop** (1920px and above)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (below 768px)

The UI includes:
- Mobile-friendly hamburger menu
- Collapsible sidebar on small screens
- Touch-optimized buttons and forms
- Adaptive layouts and font sizes

---

## 📊 Database Schema

The application uses JPA/Hibernate with auto-DDL enabled, so tables are created automatically:

### Main Entities:
- **User**: Stores user information (Admin, Instructor, Student)
- **Course**: Course details and metadata
- **Enrollment**: Student-course relationships
- **Assignment**: Assignment details and submissions
- **Quiz**: Quiz information
- **Question**: Quiz questions
- **QuizAttempt**: Student quiz attempts
- **Answer**: Student answers
- **Attendance**: Attendance records
- **CourseMaterial**: Uploaded files and resources
- **Notification**: System notifications

---

## 🧪 Testing

Run tests using Maven:

```bash
./mvnw test
```

---

## 📝 Default Users (After First Run)

You can manually create users via the registration page or by inserting into the database:

### Sample Admin User:
```sql
INSERT INTO users (username, password, email, full_name, role, enabled, account_non_locked, created_at, updated_at)
VALUES ('admin', '$2a$10$dummyBcryptPasswordHash', 'admin@edunex.com', 'System Admin', 'ADMIN', true, true, NOW(), NOW());
```

**Note**: Use BCrypt to hash the password.

---

## 🛡️ Security

- **JWT-based authentication** with secure token storage
- **BCrypt password encoding**
- **Role-based access control** using Spring Security
- **CORS configuration** for API security
- **XSS and CSRF protection**

---

## 📦 Deployment

### Production Deployment:

1. **Build WAR file**:
```bash
./mvnw clean package
```

2. **Deploy to Tomcat or similar server**:
- Copy the `.war` file from `target/` to your server's `webapps/` directory

3. **Set environment variables**:
```bash
export AI_API_KEY=your-key
export SPRING_DATASOURCE_URL=jdbc:mysql://production-host:3306/edunex_db
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
```

4. **Use production-ready settings**:
- Change `spring.jpa.hibernate.ddl-auto` to `validate` or `none`
- Enable HTTPS
- Configure production mail server
- Set strong JWT secret

---

## 🐛 Troubleshooting

### Common Issues:

1. **Port 8080 already in use**:
   - Change port in `application.properties`: `server.port=8081`

2. **Database connection error**:
   - Verify MySQL is running
   - Check credentials in `application.properties`

3. **JSP pages not rendering**:
   - Ensure Tomcat Jasper dependency is included
   - Check JSP file paths

4. **JWT authentication failing**:
   - Verify JWT secret is set correctly
   - Check token expiration time

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed with ❤️ for modern online education

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@edunex.com

---

## 🎯 Roadmap

- [ ] Video conferencing integration
- [ ] Mobile app (React Native)
- [ ] Advanced AI tutoring
- [ ] Gamification features
- [ ] Multi-language support
- [ ] Calendar integration
- [ ] Forum/Discussion boards
- [ ] Live chat support

---

**Happy Learning with EduNex! 🚀📚**
