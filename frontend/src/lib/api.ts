/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token before making request
      const authStore = useAuthStore.getState();
      if (!authStore.isTokenValid()) {
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      const authStore = useAuthStore.getState();
      authStore.logout();
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      if (window.location.pathname !== '/unauthorized') {
        window.location.href = '/unauthorized';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (userData: any) => api.post('/admin/users', userData),
  updateUser: (id: number, userData: any) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  toggleUserStatus: (id: number) => api.put(`/admin/users/${id}/status`),
  getCourses: () => api.get('/admin/courses'),
  createCourse: (courseData: any) => api.post('/admin/courses', courseData),
  deleteCourse: (id: number) => api.delete(`/admin/courses/${id}`),
  getCourseEnrollments: (courseId: number) => api.get(`/admin/enrollments/course/${courseId}`),
  getStats: () => api.get('/admin/stats'),
  getRecentActivities: () => api.get('/admin/activities/recent'),
  bulkCreateUsers: (data: { 
    prefix: string; 
    startRange: number; 
    endRange: number; 
    role?: string; 
    password?: string 
  }) => api.post('/admin/users/bulk', data),
  bulkCreateCourses: (coursesData: any[]) => api.post('/admin/courses/bulk', coursesData),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings: any) => api.put('/admin/settings', settings),
  getUserSummaryReport: () => api.get('/admin/reports/user-summary'),
  getCoursePerformanceReport: () => api.get('/admin/reports/course-performance'),
  getEnrollmentTrendsReport: () => api.get('/admin/reports/enrollment-trends'),
  getAssignmentAnalyticsReport: () => api.get('/admin/reports/assignment-analytics'),
};

// Course API
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id: number) => api.get(`/courses/${id}`),
  getInstructorCourses: (instructorId: number) => api.get(`/courses/instructor/${instructorId}`),
  updateCourse: (id: number, courseData: any) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id: number) => api.delete(`/courses/${id}`),
  createCourse: (courseData: any, instructorId: number) => 
    api.post(`/courses?instructorId=${instructorId}`, courseData),
};

// Enrollment API
export const enrollmentAPI = {
  bulkEnroll: (data: { courseId: number; prefix: string; startRange: number; endRange: number }) =>
    api.post('/enrollments/bulk-enroll', data),
  getCourseEnrollments: (courseId: number) => api.get(`/enrollments/course/${courseId}`),
  getStudentEnrollments: (studentId: number) => api.get(`/student/student/${studentId}`),
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
};

// Assignment API
export const assignmentAPI = {
  getInstructorAssignments: (instructorId: number) => api.get(`/assignments/instructor/${instructorId}`),
  getStudentAssignments: (studentId: number) => api.get(`/assignments/student/${studentId}`),
  createAssignment: (assignmentData: any) => api.post('/assignments', assignmentData),
  updateAssignment: (id: number, assignmentData: any) => api.put(`/assignments/${id}`, assignmentData),
  deleteAssignment: (id: number) => api.delete(`/assignments/${id}`),
  getSubmissions: (assignmentId: number) => api.get(`/assignments/${assignmentId}/submissions`),
  submitAssignment: (assignmentId: number, formData: FormData) =>
    api.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  gradeSubmission: (submissionId: number, data: { marks: number; feedback?: string }) =>
    api.put(`/assignments/submissions/${submissionId}/grade`, data),
};

// Quiz API
export const quizAPI = {
  getInstructorQuizzes: (instructorId: number) => api.get(`/quizzes/instructor/${instructorId}`),
  getStudentQuizzes: (studentId: number) => api.get(`/quizzes/student/${studentId}`),
  createQuiz: (quizData: any, courseId: number) => api.post(`/quizzes?courseId=${courseId}`, quizData),
  updateQuiz: (id: number, quizData: any) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id: number) => api.delete(`/quizzes/${id}`),
  getQuizById: (id: number) => api.get(`/quizzes/${id}`),
  getQuizQuestions: (quizId: number) => api.get(`/quizzes/${quizId}/questions`),
  addQuestion: (quizId: number, questionData: any) => api.post(`/quizzes/${quizId}/questions`, questionData),
  startQuizAttempt: (quizId: number, studentId: number) => api.post(`/quizzes/${quizId}/start?studentId=${studentId}`),
  submitQuizAttempt: (attemptId: number, answers: any) => api.post(`/quizzes/attempts/${attemptId}/submit`, answers),
  getQuizResults: (quizId: number) => api.get(`/quizzes/${quizId}/results`),
  getMyAttempts: (quizId: number) => api.get(`/quizzes/${quizId}/my-attempts`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data: any) => api.post('/attendance/mark', data),
  markMultipleAttendance: (data: any) => api.post('/attendance/mark-multiple', data),
  getCourseAttendance: (courseId: number) => api.get(`/attendance/course/${courseId}`),
  getStudentAttendance: (studentId: number) => api.get(`/attendance/student/${studentId}`),
  getStudentCourseAttendance: (studentId: number, courseId: number) => 
    api.get(`/attendance/student/${studentId}/course/${courseId}`),
  getAttendanceRate: (studentId: number, courseId: number) => 
    api.get(`/attendance/student/${studentId}/course/${courseId}/rate`),
  getMyAttendance: () => api.get('/attendance/my-attendance'),
  getAttendanceByDate: (courseId: number, date: string) => 
    api.get(`/attendance/course/${courseId}/date/${date}`),
};

// Course Materials API
export const courseMaterialAPI = {
  createMaterial: (materialData: any, courseId: number) => 
    api.post(`/materials?courseId=${courseId}`, materialData),
  getMaterialsByCourse: (courseId: number) => api.get(`/materials/course/${courseId}`),
  getMaterialsByInstructor: (instructorId: number) => api.get(`/materials/instructor/${instructorId}`),
  getMaterialById: (id: number) => api.get(`/materials/${id}`),
  updateMaterial: (id: number, materialData: any) => api.put(`/materials/${id}`, materialData),
  deleteMaterial: (id: number) => api.delete(`/materials/${id}`),
};

export default api;
