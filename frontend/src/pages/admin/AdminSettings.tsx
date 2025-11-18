/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { adminAPI } from '@/lib/api';
import {
  Settings as SettingsIcon,
  Building2,
  Mail,
  Shield,
  Database,
  Palette,
  Bell,
  Users,
  Lock,
  Save,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // System Settings
  const [systemName, setSystemName] = useState('EduNex LMS');
  const [systemEmail, setSystemEmail] = useState('admin@edunex.edu');
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Email Settings
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Security Settings
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [requireStrongPassword, setRequireStrongPassword] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Academic Settings
  const [defaultSemesterDuration, setDefaultSemesterDuration] = useState('16');
  const [maxCoursesPerStudent, setMaxCoursesPerStudent] = useState('8');
  const [attendanceThreshold, setAttendanceThreshold] = useState('75');

  const loadSettings = useCallback(async () => {
    try {
      const response = await adminAPI.getSettings();
      const settings = response.data;
      
      // Load general settings
      if (settings.general) {
        setSystemName(settings.general.systemName || 'EduNex LMS');
        setSystemEmail(settings.general.systemEmail || 'admin@edunex.edu');
        setAllowRegistration(settings.general.allowRegistration || false);
        setMaintenanceMode(settings.general.maintenanceMode || false);
      }
      
      // Load email settings
      if (settings.email) {
        setSmtpHost(settings.email.smtpHost || 'smtp.gmail.com');
        setSmtpPort(String(settings.email.smtpPort || 587));
        setEmailNotifications(settings.email.emailNotifications !== false);
      }
      
      // Load security settings
      if (settings.security) {
        setSessionTimeout(String(settings.security.sessionTimeout || 60));
        setPasswordMinLength(String(settings.security.passwordMinLength || 8));
        setRequireStrongPassword(settings.security.requireStrongPassword !== false);
        setTwoFactorAuth(settings.security.twoFactorAuth || false);
      }
      
      // Load academic settings
      if (settings.academic) {
        setDefaultSemesterDuration(String(settings.academic.defaultSemesterDuration || 16));
        setMaxCoursesPerStudent(String(settings.academic.maxCoursesPerStudent || 8));
        setAttendanceThreshold(String(settings.academic.attendanceThreshold || 75));
      }
    } catch (error: any) {
      toast.error('Failed to load settings', {
        description: error.response?.data?.message || 'Unable to fetch settings',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const settings = {
        general: {
          systemName,
          systemEmail,
          allowRegistration,
          maintenanceMode,
        },
        email: {
          smtpHost,
          smtpPort: parseInt(smtpPort),
          smtpUsername,
          emailNotifications,
        },
        security: {
          sessionTimeout: parseInt(sessionTimeout),
          passwordMinLength: parseInt(passwordMinLength),
          requireStrongPassword,
          twoFactorAuth,
        },
        academic: {
          defaultSemesterDuration: parseInt(defaultSemesterDuration),
          maxCoursesPerStudent: parseInt(maxCoursesPerStudent),
          attendanceThreshold: parseInt(attendanceThreshold),
        },
      };
      
      await adminAPI.updateSettings(settings);
      toast.success('Settings saved successfully', {
        description: 'All changes have been applied',
      });
    } catch (error: any) {
      toast.error('Failed to save settings', {
        description: error.response?.data?.message || 'Unable to save settings',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = () => {
    loadSettings();
    toast.info('Settings reset to server values', {
      description: 'All settings have been reloaded',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Manage your platform configuration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            <CardTitle>General Settings</CardTitle>
          </div>
          <CardDescription>Basic system configuration and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="system-name">System Name</Label>
              <Input
                id="system-name"
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="system-email">System Email</Label>
              <Input
                id="system-email"
                type="email"
                value={systemEmail}
                onChange={(e) => setSystemEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-description">System Description</Label>
            <Textarea
              id="system-description"
              placeholder="Enter a description for your LMS"
              rows={3}
              defaultValue="A comprehensive Learning Management System for educational institutions"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Self Registration</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to create accounts without admin approval
              </p>
            </div>
            <Switch checked={allowRegistration} onCheckedChange={setAllowRegistration} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable access to the system
              </p>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Email Configuration</CardTitle>
          </div>
          <CardDescription>SMTP settings for sending emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp-username">SMTP Username</Label>
            <Input
              id="smtp-username"
              value={smtpUsername}
              onChange={(e) => setSmtpUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp-password">SMTP Password</Label>
            <Input id="smtp-password" type="password" placeholder="••••••••" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send automated emails for important events
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security & Authentication</CardTitle>
          </div>
          <CardDescription>Configure security policies and authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-length">Minimum Password Length</Label>
              <Input
                id="password-length"
                type="number"
                value={passwordMinLength}
                onChange={(e) => setPasswordMinLength(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require Strong Passwords</Label>
              <p className="text-sm text-muted-foreground">
                Enforce uppercase, lowercase, numbers, and special characters
              </p>
            </div>
            <Switch
              checked={requireStrongPassword}
              onCheckedChange={setRequireStrongPassword}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Require 2FA for admin and instructor accounts
              </p>
            </div>
            <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
          </div>
        </CardContent>
      </Card>

      {/* Academic Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Academic Configuration</CardTitle>
          </div>
          <CardDescription>Configure academic policies and limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="semester-duration">Default Semester Duration (weeks)</Label>
              <Input
                id="semester-duration"
                type="number"
                value={defaultSemesterDuration}
                onChange={(e) => setDefaultSemesterDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-courses">Max Courses Per Student</Label>
              <Input
                id="max-courses"
                type="number"
                value={maxCoursesPerStudent}
                onChange={(e) => setMaxCoursesPerStudent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance-threshold">Attendance Threshold (%)</Label>
              <Input
                id="attendance-threshold"
                type="number"
                value={attendanceThreshold}
                onChange={(e) => setAttendanceThreshold(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grading-system">Grading System</Label>
            <Select defaultValue="percentage">
              <SelectTrigger id="grading-system">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (0-100)</SelectItem>
                <SelectItem value="gpa">GPA (0-4.0)</SelectItem>
                <SelectItem value="letter">Letter Grades (A-F)</SelectItem>
                <SelectItem value="points">Points Based</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Database & Storage</CardTitle>
          </div>
          <CardDescription>Database configuration and backup settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Database Status</Label>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">Connected to PostgreSQL</span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup database daily at 2:00 AM
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Database className="mr-2 h-4 w-4" />
              Backup Now
            </Button>
            <Button variant="outline" className="flex-1">
              <Database className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel of the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Default Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Default Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
