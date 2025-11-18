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
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN'],
  },
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Courses',
    url: '/admin/courses',
    icon: BookOpen,
    roles: ['ADMIN'],
  },
  {
    title: 'Dashboard',
    url: '/instructor/dashboard',
    icon: LayoutDashboard,
    roles: ['INSTRUCTOR'],
  },
  {
    title: 'My Courses',
    url: '/instructor/courses',
    icon: BookOpen,
    roles: ['INSTRUCTOR'],
  },
  {
    title: 'Assignments',
    url: '/instructor/assignments',
    icon: FileText,
    roles: ['INSTRUCTOR'],
  },
  {
    title: 'Quizzes',
    url: '/instructor/quizzes',
    icon: ClipboardList,
    roles: ['INSTRUCTOR'],
  },
  {
    title: 'Attendance',
    url: '/instructor/attendance',
    icon: Calendar,
    roles: ['INSTRUCTOR'],
  },
  {
    title: 'Dashboard',
    url: '/student/dashboard',
    icon: LayoutDashboard,
    roles: ['STUDENT'],
  },
  {
    title: 'My Courses',
    url: '/student/courses',
    icon: BookOpen,
    roles: ['STUDENT'],
  },
  {
    title: 'Assignments',
    url: '/student/assignments',
    icon: FileText,
    roles: ['STUDENT'],
  },
  {
    title: 'Quizzes',
    url: '/student/quizzes',
    icon: ClipboardList,
    roles: ['STUDENT'],
  },
  {
    title: 'Profile',
    url: '/student/profile',
    icon: Users,
    roles: ['STUDENT'],
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

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
};
