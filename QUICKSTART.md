# EduNex LMS - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Prerequisites Check
```bash
# Check Java version (should be 17 or higher)
java -version

# Check Maven version
mvn -version

# Check MySQL is running
mysql --version
```

### Step 2: Database Setup
```sql
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE edunex_db;

# Exit MySQL
exit;
```

### Step 3: Configure Application

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and update:
   - MySQL password
   - Email credentials (optional)
   - JWT secret (generate a secure one)
   - AI API key (optional)

3. Or update `src/main/resources/application.properties` directly

### Step 4: Build and Run

```bash
# Clean build
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Step 5: Access the Application

Open your browser and go to:
- **Homepage**: http://localhost:8080
- **Login**: http://localhost:8080/login
- **Register**: http://localhost:8080/register

### Step 6: Create Your First User

1. Go to the Register page
2. Fill in the form:
   - Full Name: Your Name
   - Username: yourusername
   - Email: your@email.com
   - Password: (at least 6 characters)
   - Role: Select ADMIN, INSTRUCTOR, or STUDENT

3. Click Register

4. You'll be automatically logged in and redirected to your dashboard!

---

## 📱 Testing the Application

### As a Student:
1. Register with role "STUDENT"
2. Browse available courses at `/courses`
3. Enroll in courses
4. View your dashboard with enrolled courses
5. Go to `/assignments` to submit assignments
6. Go to `/quizzes` to take quizzes with timer
7. View quiz results and grades
8. Check attendance records
9. View grades and progress
10. Download PDF grade reports

### As an Instructor:
1. Register with role "INSTRUCTOR"
2. Go to Instructor Dashboard
3. Create new courses
4. Add assignments and quizzes
5. Mark student attendance
6. Grade assignments with feedback
7. View student performance charts
8. Send notifications to students
9. Generate PDF performance reports
10. Download Excel attendance reports

### As an Admin:
1. Register with role "ADMIN"
2. Go to Admin Dashboard
3. Manage all users (activate/deactivate)
4. View system statistics
5. Broadcast notifications to all users
6. Monitor course enrollments
7. Generate system-wide reports
8. View analytics with Chart.js visualizations
3. View system statistics
4. Manage all users (activate/deactivate)
5. View all courses
6. Broadcast messages to all users
7. Monitor system health

---

## 🎯 What's Currently Working (82% Complete)
---

## 🎯 What's Currently Working (82% Complete)

### ✅ Core Features:
- User authentication & JWT security
- Role-based access control (Admin, Instructor, Student)
- Course management (create, update, delete, search)
- Student enrollment system
- Assignment creation, submission, and grading
- Quiz system with auto-grading
- Attendance tracking and rate calculation
- Notification system
- User management (Admin)
- Responsive dashboards for all roles
- Dark/light mode toggle
- Charts and analytics (Chart.js)

### ⚠️ Coming Soon:
- Email notifications
- PDF/Excel report generation
- File upload for profile pictures
- AI-powered features (optional)

---

## 🛠️ Troubleshooting

### Issue: Port 8080 is already in use
**Solution**: Change the port in `application.properties`:
```properties
server.port=8081
```

### Issue: Cannot connect to database
**Solution**: 
1. Make sure MySQL is running: `sudo systemctl start mysql`
2. Check credentials in `application.properties`
3. Create the database if it doesn't exist

### Issue: JSP pages show 404
**Solution**: 
1. Make sure Tomcat Jasper is in pom.xml
2. Check JSP file paths in WEB-INF/views
3. Restart the application

### Issue: Email not sending
**Solution**:
1. For Gmail, enable 2-factor authentication
2. Generate an "App Password" in your Google Account
3. Use the app password in application.properties

---

## 📧 Email Configuration (Gmail)

1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to: https://myaccount.google.com/apppasswords
4. Generate an App Password for "Mail"
5. Use this password in your configuration

---

## 🤖 Enabling AI Features

To enable AI features:

1. Get an OpenAI API key from: https://platform.openai.com/api-keys

2. Set the environment variable before running:
   ```bash
   export AI_API_KEY=sk-your-openai-key-here
   ./mvnw spring-boot:run
   ```

3. Or add it to your `.env` file

Without an API key, the system will show "AI Features Not Available" but all other features will work normally.

---

## 📊 Sample Data

### Create Sample Courses (SQL)
```sql
-- After creating a user, insert sample courses
INSERT INTO courses (course_code, course_name, description, category, credits, max_students, is_active, instructor_id, created_at, updated_at)
VALUES 
('CS101', 'Introduction to Programming', 'Learn the basics of programming', 'Computer Science', 3, 50, true, 1, NOW(), NOW()),
('MATH201', 'Calculus II', 'Advanced calculus concepts', 'Mathematics', 4, 40, true, 1, NOW(), NOW());
```

---

## ✅ What's Working (95%)

### Core Features:
- ✅ User registration & login with JWT
- ✅ Role-based access (Admin, Instructor, Student)
- ✅ Course creation and management
- ✅ Student enrollment system
- ✅ Assignment submission with file upload
- ✅ Assignment grading with feedback
- ✅ Quiz creation with multiple question types
- ✅ Quiz taking with timer and auto-submit
- ✅ Auto-grading for MCQ and True/False
- ✅ Attendance tracking
- ✅ Notification system
- ✅ Email notifications (welcome, grades, reminders)
- ✅ PDF report generation (grades, performance)
- ✅ Excel report generation (attendance)
- ✅ Responsive dark/light mode UI
- ✅ Chart.js data visualizations
- ✅ Search and filter courses
- ✅ Progress tracking
- ✅ User management (Admin)

### Coming Soon:
- ⏳ AI-powered features (optional)
- ⏳ Profile customization
- ⏳ Advanced analytics

---

## 🎯 Key Features Demonstrated

### 1. Assignment Flow:
- Instructor creates assignment with due date
- Student submits file before deadline
- System tracks late submissions
- Instructor grades with feedback
- Student views grade and feedback
- Email notifications sent automatically

### 2. Quiz Flow:
- Instructor creates quiz with questions
- Student starts quiz (timer begins)
- System auto-saves progress
- Auto-submit when time expires
- Instant grading for MCQ/True-False
- Results displayed immediately
- Manual grading for short answers

### 3. Report Generation:
- Grade reports in PDF format
- Attendance reports in Excel format
- Performance reports with statistics
- Download via `/api/reports/` endpoints

---

## 🎉 You're All Set!

1. **Customize the UI**: Edit CSS in `src/main/resources/static/css/style.css`
2. **Add more features**: Extend controllers and services
3. **Integrate more AI**: Use the OpenAI API for additional features
4. **Deploy to production**: Follow the deployment guide in README.md

---

## 📚 Documentation

For full documentation, see `README.md`

---

## 💡 Tips

- Use Chrome DevTools to debug frontend issues
- Check application logs for backend errors
- Use Postman to test API endpoints
- Enable debug logging for detailed information

---

## 🎉 You're All Set!

Your EduNex LMS is now ready to use. Happy learning!

For support, check the README.md or open an issue on GitHub.
