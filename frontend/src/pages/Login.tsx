/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Login form submitted:', data);
    
    // Basic validation
    if (!data.username || !data.password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await authAPI.login(data.username, data.password);
      const { token, id, username, email, fullName, role } = response.data;

      const user = {
        id,
        usn: username,
        name: fullName,
        email,
        role: role.replace('ROLE_', '') as 'ADMIN' | 'INSTRUCTOR' | 'STUDENT',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      login(user, token);
      
      toast.success('Welcome back, ' + fullName + '!', {
        description: 'Redirecting to your dashboard...',
      });

      // Redirect based on role
      const routes = {
        ADMIN: '/admin/dashboard',
        INSTRUCTOR: '/instructor/dashboard',
        STUDENT: '/student/dashboard',
      };
      
      setTimeout(() => {
        navigate(routes[user.role], { replace: true });
      }, 500);
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = (error as any).response?.data?.message || (error as any).response?.data?.error || 'Invalid username or password';
      toast.error('Login Failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to EduNex LMS</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                {...register('username')}
                className={errors.username ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-normal">
                Remember me
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
              onClick={() => console.log('Login button clicked')}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-2 rounded-lg bg-muted p-4 text-xs">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Admin: admin / password123</p>
            <p>Instructor: instructor / password123</p>
            <p>Student: student / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
