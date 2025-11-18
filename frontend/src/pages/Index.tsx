import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';
import { GraduationCap, BookOpen, Users, Award, Moon, Sun } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">EduNex LMS</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button onClick={() => navigate('/login')}>Login</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight lg:text-6xl">
            Transform Your Learning Experience
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            EduNex LMS is a comprehensive learning management system designed for modern education.
            Manage courses, track progress, and engage with students seamlessly.
          </p>
          <Button size="lg" onClick={() => navigate('/login')} className="px-8">
            Get Started
          </Button>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-6 text-center transition-smooth hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Course Management</h3>
            <p className="text-muted-foreground">
              Create, organize, and deliver engaging courses with ease
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center transition-smooth hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Student Tracking</h3>
            <p className="text-muted-foreground">
              Monitor progress, attendance, and performance metrics
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center transition-smooth hover:shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Assessment Tools</h3>
            <p className="text-muted-foreground">
              Create assignments and quizzes with automated grading
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
