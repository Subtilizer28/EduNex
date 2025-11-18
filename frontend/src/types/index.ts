export type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: number;
  usn: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description?: string;
  category?: string;
  credits: number;
  maxStudents: number;
  instructor: User;
  enrollmentCount: number;
  createdAt: string;
}

export interface Assignment {
  id: number;
  title: string;
  description?: string;
  course: Course;
  totalMarks: number;
  dueDate: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Quiz {
  id: number;
  title: string;
  course: Course;
  duration: number;
  totalMarks: number;
  scheduledDate: string;
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface Enrollment {
  id: number;
  student: User;
  course: Course;
  enrolledAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
}

export interface Attendance {
  id: number;
  student: User;
  course: Course;
  date: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface DashboardStats {
  totalUsers?: number;
  totalCourses?: number;
  totalEnrollments?: number;
  activeStudents?: number;
  myCourses?: number;
  assignmentsToGrade?: number;
  quizzesCreated?: number;
  totalStudents?: number;
  upcomingAssignments?: number;
  upcomingQuizzes?: number;
  attendancePercentage?: number;
}
