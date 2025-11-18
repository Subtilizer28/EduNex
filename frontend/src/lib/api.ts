/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
  getCourseEnrollments: (courseId: number) => api.get(`/admin/enrollments/${courseId}`),
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
  getStudentEnrollments: (studentId: number) => api.get(`/enrollments/student/${studentId}`),
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
  createQuiz: (quizData: any) => api.post('/quizzes', quizData),
  getQuizById: (id: number) => api.get(`/quizzes/${id}`),
  submitQuiz: (quizId: number, answers: any) => api.post(`/quizzes/${quizId}/submit`, answers),
  getQuizResults: (quizId: number) => api.get(`/quizzes/${quizId}/results`),
};

// Attendance API
export const attendanceAPI = {
  markAttendance: (data: any) => api.post('/attendance/mark', data),
  getCourseAttendance: (courseId: number) => api.get(`/attendance/course/${courseId}`),
  getStudentAttendance: (studentId: number) => api.get(`/attendance/student/${studentId}`),
};

export default api;
