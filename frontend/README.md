# ⚛️ EduNex Frontend - React Application

This is the frontend client application for the EduNex Learning Management System, built with **React 18**, **TypeScript**, and **Vite**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Features](#features)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [UI Components](#ui-components)
- [Build & Deployment](#build--deployment)

---

## 🌟 Overview

The EduNex frontend provides a modern, responsive user interface for:
- Role-based dashboards (Admin, Instructor, Student)
- Course browsing and enrollment
- Assignment submission and grading
- Attendance tracking and visualization
- User authentication and profile management
- Real-time data updates

---

## 🛠 Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.5+ | Type-safe JavaScript |
| **Vite** | 5.4.2 | Build tool & dev server |
| **React Router** | 6.26.0 | Client-side routing |
| **Tailwind CSS** | 3.4.10 | Utility-first CSS |
| **shadcn/ui** | Latest | Reusable UI components |
| **Axios** | 1.7.4 | HTTP client for API calls |
| **Zustand** | 4.5.5 | Lightweight state management |
| **date-fns** | 3.6.0 | Date formatting and manipulation |
| **Lucide React** | 0.441.0 | Icon library |
| **Sonner** | 1.5.0 | Toast notifications |
| **Recharts** | 2.12.7 | Charts and data visualization |

---

## 📁 Project Structure

```
frontend/
├── public/                          # Static assets
│   └── robots.txt
│
├── src/
│   ├── components/                  # Reusable components
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   └── DashboardSidebar.tsx
│   │   │
│   │   ├── NavLink.tsx              # Custom navigation link
│   │   ├── ProtectedRoute.tsx       # Route protection
│   │   └── StatCard.tsx             # Statistics card
│   │
│   ├── pages/                       # Page components
│   │   ├── admin/                   # Admin pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminCourses.tsx
│   │   │
│   │   ├── instructor/              # Instructor pages
│   │   │   ├── InstructorDashboard.tsx
│   │   │   ├── InstructorCourses.tsx
│   │   │   ├── InstructorAssignments.tsx
│   │   │   └── InstructorAttendance.tsx
│   │   │
│   │   ├── student/                 # Student pages
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── StudentCourses.tsx
│   │   │   ├── StudentAssignments.tsx
│   │   │   ├── StudentGrades.tsx
│   │   │   └── StudentAttendance.tsx
│   │   │
│   │   ├── Index.tsx                # Landing page
│   │   ├── Login.tsx                # Login page
│   │   ├── NotFound.tsx             # 404 page
│   │   ├── ComingSoon.tsx           # Coming soon placeholder
│   │   └── Unauthorized.tsx         # 403 page
│   │
│   ├── store/                       # State management
│   │   ├── authStore.ts             # Authentication state
│   │   └── themeStore.ts            # Theme state
│   │
│   ├── lib/                         # Utilities
│   │   ├── api.ts                   # API client & endpoints
│   │   └── utils.ts                 # Helper functions
│   │
│   ├── types/                       # TypeScript types
│   │   └── index.ts                 # Type definitions
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts                # Vite types
│
├── components.json                  # shadcn/ui config
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- Backend API running on `http://localhost:8080`

### Installation

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install

# Using bun
bun install
```

3. **Configure API URL** (if different from default)

Edit `src/lib/api.ts`:

```typescript
const API_URL = 'http://localhost:8080/api';
```

4. **Start development server**

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

The application will open at `http://localhost:5173`

---

## 📜 Available Scripts

### Development

```bash
# Start development server with hot reload
npm run dev

# Start development server on specific port
npm run dev -- --port 3000

# Start with host exposed (accessible on network)
npm run dev -- --host
```

### Building

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check without building
npm run type-check
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors automatically
npm run lint:fix

# Format code with Prettier (if configured)
npm run format
```

---

## ✨ Features

### 🔐 Authentication
- JWT-based authentication
- Persistent login with localStorage
- Automatic token refresh
- Role-based access control

### 👨‍💼 Admin Features
- System statistics dashboard
- User management (CRUD operations)
- Course oversight
- Analytics and reports

### 👨‍🏫 Instructor Features
- Course creation and management
- Assignment creation and grading
- Attendance marking
- Student performance tracking
- Course material uploads

### 👨‍🎓 Student Features
- Course browsing and enrollment
- Assignment submission
- Grade viewing
- Attendance tracking
- Course material access

---

## 🗂 State Management

### Zustand Stores

#### Auth Store (`authStore.ts`)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}
```

**Usage:**
```typescript
import { useAuthStore } from '@/store/authStore';

function Component() {
  const { user, login, logout } = useAuthStore();
  // ...
}
```

#### Theme Store (`themeStore.ts`)

```typescript
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

---

## 🗺 Routing

### Route Structure

```typescript
/ (Index)                        # Landing page
/login                           # Login page
/unauthorized                    # 403 Unauthorized

/admin/*                         # Admin routes (protected)
  /admin/dashboard
  /admin/users
  /admin/courses

/instructor/*                    # Instructor routes (protected)
  /instructor/dashboard
  /instructor/courses
  /instructor/assignments
  /instructor/attendance

/student/*                       # Student routes (protected)
  /student/dashboard
  /student/courses
  /student/assignments
  /student/grades
  /student/attendance
```

### Protected Routes

```typescript
<Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
  <Route path="student/*" element={<StudentLayout />}>
    <Route path="dashboard" element={<StudentDashboard />} />
    {/* ... */}
  </Route>
</Route>
```

---

## 🔌 API Integration

### API Client Configuration

Located in `src/lib/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (adds JWT token)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints

```typescript
// Authentication
authAPI.login(credentials)
authAPI.register(userData)
authAPI.getProfile()

// Courses
courseAPI.getAllCourses()
courseAPI.getCourseById(id)
courseAPI.createCourse(courseData)
courseAPI.updateCourse(id, courseData)
courseAPI.deleteCourse(id)

// Assignments
assignmentAPI.getCourseAssignments(courseId)
assignmentAPI.getStudentAssignments(studentId)
assignmentAPI.submitAssignment(id, data)
assignmentAPI.gradeAssignment(id, data)

// Attendance
attendanceAPI.getCourseAttendance(courseId)
attendanceAPI.getStudentAttendance(studentId)
attendanceAPI.markAttendance(data)
```

---

## 🎨 UI Components

### shadcn/ui Components

All UI components are built with **shadcn/ui** and **Radix UI**, providing:
- Accessibility out of the box
- Full TypeScript support
- Customizable with Tailwind CSS
- Dark mode support

### Component Usage Examples

#### Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="md">
  Click me
</Button>
```

#### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

#### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    Dialog content
  </DialogContent>
</Dialog>
```

#### Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 🏗 Build & Deployment

### Production Build

```bash
# Build for production
npm run build

# Output will be in dist/ directory
```

### Preview Production Build

```bash
npm run preview
```

### Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com
```

Access in code:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

### Deploy to Static Hosting

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Custom Server (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/edunex/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🎨 Styling

### Tailwind CSS

Utility-first CSS framework for rapid UI development.

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <Button className="bg-blue-500 hover:bg-blue-600">Action</Button>
</div>
```

### Custom Styles

Global styles in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... */
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

**1. API Connection Failed**
```
Error: Network Error
```
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API_URL in `src/lib/api.ts`

**2. Build Errors**
```
Error: TypeScript errors
```
- Run `npm run type-check` to see all errors
- Ensure all dependencies are installed
- Check `tsconfig.json` configuration

**3. Hot Reload Not Working**
```
Changes not reflecting
```
- Restart dev server
- Clear browser cache
- Check file watcher limits: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Router Documentation](https://reactrouter.com/)

---

## 📝 License

This project is part of the EduNex Learning Management System.

---

<div align="center">

**[⬆ Back to Top](#️-edunex-frontend---react-application)**

Made with ❤️ by the EduNex Team

</div>
