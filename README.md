# 🎓 EduNex - Modern Learning Management System

<div align="center">

![EduNex Banner](https://img.shields.io/badge/EduNex-Learning%20Management%20System-4CAF50?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-6DB33F?style=flat&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

A comprehensive, feature-rich Learning Management System built with modern technologies for educational institutions.

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#️-architecture) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

**EduNex** is a modern, full-stack Learning Management System designed to streamline educational workflows for administrators, instructors, and students. Built with cutting-edge technologies, it offers an intuitive interface, robust backend, and comprehensive features for managing courses, assignments, attendance, and more.

### Why EduNex?

- ✅ **Role-Based Access Control** - Separate dashboards for Admin, Instructor, and Student roles
- ✅ **Real-Time Updates** - Instant notifications and live data synchronization
- ✅ **Responsive Design** - Seamlessly works on desktop, tablet, and mobile devices
- ✅ **Secure Authentication** - JWT-based authentication with Spring Security
- ✅ **Modern UI/UX** - Built with React, TypeScript, and Tailwind CSS
- ✅ **Comprehensive Analytics** - Track student progress, attendance, and performance

---

## ✨ Features

### 👨‍💼 Admin Features
- 📊 **Dashboard Analytics** - View system-wide statistics and insights
- 👥 **User Management** - Create, update, and manage users (students, instructors)
- 📚 **Course Management** - Oversee all courses and their details
- 📈 **Reports & Analytics** - Generate comprehensive reports

### 👨‍🏫 Instructor Features
- 📖 **Course Management** - Create and manage courses
- 📝 **Assignment Management** - Create, grade, and provide feedback on assignments
- 📅 **Attendance Tracking** - Mark and manage student attendance
- 📊 **Student Analytics** - Monitor individual and class performance
- 📁 **Course Materials** - Upload and organize course resources

### 👨‍🎓 Student Features
- 📚 **Course Enrollment** - Browse and enroll in available courses
- 📝 **Assignment Submission** - Submit assignments and view feedback
- 📊 **Grades & Progress** - View grades, progress, and performance metrics
- 📅 **Attendance Records** - Check personal attendance history
- 📖 **Course Materials** - Access course materials and resources

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17+ | Core programming language |
| **Spring Boot** | 3.5.6 | Application framework |
| **Spring Security** | 6.x | Authentication & authorization |
| **Spring Data JPA** | 3.x | Database ORM |
| **MySQL** | 8.0+ | Relational database |
| **Hibernate** | 6.6.29 | JPA implementation |
| **JWT** | - | Token-based authentication |
| **Lombok** | - | Boilerplate code reduction |
| **Maven** | 3.x | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.5+ | Type-safe JavaScript |
| **Vite** | 5.4.2 | Build tool & dev server |
| **React Router** | 6.26.0 | Client-side routing |
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework |
| **shadcn/ui** | - | Reusable UI components |
| **Axios** | 1.7.4 | HTTP client |
| **date-fns** | 3.6.0 | Date manipulation |
| **Zustand** | 4.5.5 | State management |
| **Lucide React** | - | Icon library |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- ☕ **Java Development Kit (JDK)** 17 or higher
- 🗄️ **MySQL** 8.0 or higher
- 📦 **Node.js** 18+ and npm/bun
- 🔧 **Maven** 3.6+ (or use included Maven Wrapper)
- 🔧 **Git** for version control

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ashtonmths/EduNex.git
cd EduNex
```

### 2️⃣ Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE edunex_db;
CREATE USER 'edunex'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON edunex_db.* TO 'edunex'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3️⃣ Backend Setup

```bash
cd backend

# Update database credentials in src/main/resources/application.properties
# spring.datasource.username=edunex
# spring.datasource.password=your_password

# Build and run (using Maven Wrapper)
./mvnw clean install
./mvnw spring-boot:run

# Or using installed Maven
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The frontend will start on `http://localhost:5173`

### 5️⃣ Default Credentials

After the application starts, the database will be seeded with test data:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `password123` |
| **Instructor** | `john.doe` | `password123` |
| **Student** | `NNM23CS001` | `password123` |

> **Note:** All student usernames are their USN (University Seat Number). Example: NNM23CS001, NNM23CS002, etc.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Admin UI   │  │ Instructor UI│  │  Student UI  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │ REST API (JSON)
                         │ JWT Authentication
┌────────────────────────▼────────────────────────────────┐
│              Backend (Spring Boot)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │           REST Controllers                        │  │
│  └────────────┬────────────────────────┬─────────────┘  │
│  ┌────────────▼─────────┐  ┌───────────▼──────────┐   │
│  │   Service Layer      │  │  Security (JWT)      │   │
│  └────────────┬─────────┘  └──────────────────────┘   │
│  ┌────────────▼─────────────────────────────────────┐  │
│  │          JPA/Hibernate Repositories              │  │
│  └────────────┬─────────────────────────────────────┘  │
└───────────────┼──────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────┐
│              MySQL Database                          │
│  Tables: users, courses, enrollments, assignments,  │
│          attendance, course_materials                │
└──────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
EduNex/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/edunex/edunex_lms/
│   │   │   │   ├── config/            # Configuration classes
│   │   │   │   ├── controller/        # REST controllers
│   │   │   │   ├── entity/            # JPA entities
│   │   │   │   ├── repository/        # Data repositories
│   │   │   │   ├── service/           # Business logic
│   │   │   │   └── security/          # Security config
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                      # Unit tests
│   ├── pom.xml                        # Maven dependencies
│   └── README.md                      # Backend documentation
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   └── layout/               # Layout components
│   │   ├── pages/                    # Page components
│   │   │   ├── admin/                # Admin pages
│   │   │   ├── instructor/           # Instructor pages
│   │   │   └── student/              # Student pages
│   │   ├── store/                    # State management
│   │   ├── lib/                      # Utilities & API client
│   │   └── types/                    # TypeScript types
│   ├── package.json
│   └── README.md                     # Frontend documentation
│
├── README.md                   # This file
└── PROJECT_CONTEXT.md          # AI-friendly project overview
```

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/auth/profile     # Get current user profile
```

### Course Endpoints

```http
GET    /api/courses              # Get all courses
GET    /api/courses/{id}         # Get course by ID
POST   /api/courses              # Create course (Instructor/Admin)
PUT    /api/courses/{id}         # Update course
DELETE /api/courses/{id}         # Delete course
```

### Assignment Endpoints

```http
GET    /api/assignments/course/{courseId}    # Get assignments by course
POST   /api/assignments                      # Create assignment
PUT    /api/assignments/{id}                 # Update assignment
POST   /api/assignments/{id}/submit          # Submit assignment
PUT    /api/assignments/{id}/grade           # Grade assignment
```

### Attendance Endpoints

```http
GET    /api/attendance/course/{courseId}     # Get course attendance
POST   /api/attendance                       # Mark attendance
GET    /api/attendance/student/{studentId}   # Get student attendance
```

> 📖 **Full API Documentation**: See [backend/README.md](backend/README.md) for complete API reference

---

## 📸 Screenshots

<details>
<summary>Click to expand screenshots</summary>

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Instructor Course Management
![Instructor Courses](docs/screenshots/instructor-courses.png)

### Student Dashboard
![Student Dashboard](docs/screenshots/student-dashboard.png)

### Assignment Grading
![Assignment Grading](docs/screenshots/assignment-grading.png)

</details>

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Documentation
- 📖 [Backend Documentation](backend/README.md)
- 📖 [Frontend Documentation](frontend/README.md)

### Get Help
- 🐛 [Report Bug](https://github.com/ashtonmths/EduNex/issues)
- 💡 [Request Feature](https://github.com/ashtonmths/EduNex/issues)

### Community
- 💬 [Discussions](https://github.com/ashtonmths/EduNex/discussions)
- ⭐ Star this repo if you find it helpful!

---

<div align="center">

### 🌟 Star us on GitHub!

Made by the EduNex Team

[⬆ Back to Top](#-edunex---modern-learning-management-system)

</div>
