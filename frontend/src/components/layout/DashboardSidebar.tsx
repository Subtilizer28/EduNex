import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  Calendar,
  GraduationCap,
  Layers,
  BarChart3,
  Settings,
  FileBarChart,
  BookMarked,
  Award,
  HelpCircle,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  section: string;
}

const menuItems: MenuItem[] = [
  // Admin - Overview
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN'],
    section: 'Overview',
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
    roles: ['ADMIN'],
    section: 'Overview',
  },
  // Admin - Management
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
    section: 'Management',
  },
  {
    title: 'Courses',
    url: '/admin/courses',
    icon: BookOpen,
    roles: ['ADMIN'],
    section: 'Management',
  },
  {
    title: 'Bulk Operations',
    url: '/admin/bulk-operations',
    icon: Layers,
    roles: ['ADMIN'],
    section: 'Management',
  },
  // Admin - Reports & Settings
  {
    title: 'Reports',
    url: '/admin/reports',
    icon: FileBarChart,
    roles: ['ADMIN'],
    section: 'System',
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN'],
    section: 'System',
  },

  // Instructor - Overview
  {
    title: 'Dashboard',
    url: '/instructor/dashboard',
    icon: LayoutDashboard,
    roles: ['INSTRUCTOR'],
    section: 'Overview',
  },
  {
    title: 'Analytics',
    url: '/instructor/analytics',
    icon: BarChart3,
    roles: ['INSTRUCTOR'],
    section: 'Overview',
  },
  // Instructor - Academic
  {
    title: 'My Courses',
    url: '/instructor/courses',
    icon: BookOpen,
    roles: ['INSTRUCTOR'],
    section: 'Academic',
  },
  {
    title: 'Assignments',
    url: '/instructor/assignments',
    icon: FileText,
    roles: ['INSTRUCTOR'],
    section: 'Academic',
  },
  {
    title: 'Quizzes',
    url: '/instructor/quizzes',
    icon: ClipboardList,
    roles: ['INSTRUCTOR'],
    section: 'Academic',
  },
  {
    title: 'Attendance',
    url: '/instructor/attendance',
    icon: Calendar,
    roles: ['INSTRUCTOR'],
    section: 'Academic',
  },
  // Instructor - Resources
  {
    title: 'Course Materials',
    url: '/instructor/materials',
    icon: BookMarked,
    roles: ['INSTRUCTOR'],
    section: 'Resources',
  },

  // Student - Overview
  {
    title: 'Dashboard',
    url: '/student/dashboard',
    icon: LayoutDashboard,
    roles: ['STUDENT'],
    section: 'Overview',
  },
  // Student - Academic
  {
    title: 'My Courses',
    url: '/student/courses',
    icon: BookOpen,
    roles: ['STUDENT'],
    section: 'Academic',
  },
  {
    title: 'Assignments',
    url: '/student/assignments',
    icon: FileText,
    roles: ['STUDENT'],
    section: 'Academic',
  },
  {
    title: 'Quizzes',
    url: '/student/quizzes',
    icon: ClipboardList,
    roles: ['STUDENT'],
    section: 'Academic',
  },
  {
    title: 'Grades',
    url: '/student/grades',
    icon: Award,
    roles: ['STUDENT'],
    section: 'Academic',
  },
  {
    title: 'Attendance',
    url: '/student/attendance',
    icon: Calendar,
    roles: ['STUDENT'],
    section: 'Academic',
  },
];

interface DashboardSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const DashboardSidebar = ({ collapsed, onCollapse }: DashboardSidebarProps) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const { open } = useSidebar();

  const userMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  // Group items by section
  const sections = Array.from(new Set(userMenuItems.map((item) => item.section)));

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={open ? 'w-64' : 'w-14'} collapsible="icon">
      <SidebarContent>
        <div className="flex h-16 items-center justify-center border-b px-4">
          {open ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">EduNex LMS</span>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
          )}
        </div>

        {sections.map((section) => (
          <SidebarGroup key={section}>
            <SidebarGroupLabel>{section}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userMenuItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <NavLink
                          to={item.url}
                          className="flex items-center gap-3"
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                        >
                          <item.icon className="h-5 w-5" />
                          {open && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
