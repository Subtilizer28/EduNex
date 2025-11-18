import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { adminAPI } from '@/lib/api';
import { Users, GraduationCap, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BulkOperations() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Bulk Users State
  const [userPrefix, setUserPrefix] = useState('NNM23CS');
  const [userStartRange, setUserStartRange] = useState(1);
  const [userEndRange, setUserEndRange] = useState(50);
  const [userRole, setUserRole] = useState('STUDENT');
  const [userPassword, setUserPassword] = useState('password123');

  // Bulk Courses State
  const [coursesText, setCoursesText] = useState('');
  
  const handleBulkCreateUsers = async () => {
    if (!userPrefix.trim()) {
      toast.error('Prefix is required');
      return;
    }
    
    if (userStartRange > userEndRange) {
      toast.error('Start range cannot be greater than end range');
      return;
    }
    
    if (userEndRange - userStartRange > 100) {
      toast.error('Cannot create more than 100 users at once');
      return;
    }

    setIsLoading(true);
    try {
      const response = await adminAPI.bulkCreateUsers({
        prefix: userPrefix,
        startRange: userStartRange,
        endRange: userEndRange,
        role: userRole,
        password: userPassword,
      });

      const data = response.data;
      
      if (data.errors && data.errors.length > 0) {
        toast.warning(`Created ${data.created} users with ${data.errors.length} errors`, {
          description: data.errors.slice(0, 3).join(', '),
        });
      } else {
        toast.success(`Successfully created ${data.created} users`);
      }
      
      // Reset form
      setUserStartRange(userEndRange + 1);
      setUserEndRange(userEndRange + 50);
    } catch (error) {
      console.error('Error creating users:', error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error('Failed to create users', {
        description: err.response?.data?.error || 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkCreateCourses = async () => {
    if (!coursesText.trim()) {
      toast.error('Course data is required');
      return;
    }

    setIsLoading(true);
    try {
      // Parse CSV format: courseCode,courseName,description,category,credits,maxStudents,instructorId
      const lines = coursesText.trim().split('\n').filter(line => line.trim());
      const coursesData = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 3) {
          throw new Error('Invalid format. Each line must have at least: courseCode, courseName, instructorId');
        }
        
        return {
          courseCode: parts[0],
          courseName: parts[1],
          description: parts[2] || '',
          category: parts[3] || 'General',
          credits: parts[4] ? parseInt(parts[4]) : 3,
          maxStudents: parts[5] ? parseInt(parts[5]) : 50,
          instructorId: parseInt(parts[6] || parts[2]), // Fallback to third field if description is missing
        };
      });

      if (coursesData.length > 50) {
        toast.error('Cannot create more than 50 courses at once');
        return;
      }

      const response = await adminAPI.bulkCreateCourses(coursesData);
      const data = response.data;

      if (data.errors && data.errors.length > 0) {
        toast.warning(`Created ${data.created} courses with ${data.errors.length} errors`, {
          description: data.errors.slice(0, 3).join(', '),
        });
      } else {
        toast.success(`Successfully created ${data.created} courses`);
      }

      // Clear form
      setCoursesText('');
    } catch (error) {
      console.error('Error creating courses:', error);
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      toast.error('Failed to create courses', {
        description: err.response?.data?.error || err.message || 'An error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bulk Operations</h1>
        <p className="text-muted-foreground mt-2">
          Create multiple users or courses at once
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Bulk Users
          </TabsTrigger>
          <TabsTrigger value="courses" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Bulk Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bulk Create Users
              </CardTitle>
              <CardDescription>
                Create multiple users with sequential USN numbers (e.g., NNM23CS001 to NNM23CS050)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prefix">USN Prefix</Label>
                  <Input
                    id="prefix"
                    placeholder="NNM23CS"
                    value={userPrefix}
                    onChange={(e) => setUserPrefix(e.target.value.toUpperCase())}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: NNM23CS, NNM24EC, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={userRole} onValueChange={setUserRole}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STUDENT">Student</SelectItem>
                      <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startRange">Start Number</Label>
                  <Input
                    id="startRange"
                    type="number"
                    min={1}
                    value={userStartRange}
                    onChange={(e) => setUserStartRange(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endRange">End Number</Label>
                  <Input
                    id="endRange"
                    type="number"
                    min={1}
                    value={userEndRange}
                    onChange={(e) => setUserEndRange(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="password">Default Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    All users will be created with this password
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Preview</p>
                    <p className="text-sm text-muted-foreground">
                      Will create {userEndRange - userStartRange + 1} users: {userPrefix}
                      {String(userStartRange).padStart(3, '0')} to {userPrefix}
                      {String(userEndRange).padStart(3, '0')}
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleBulkCreateUsers} 
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Users...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Create {userEndRange - userStartRange + 1} Users
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Bulk Create Courses
              </CardTitle>
              <CardDescription>
                Create multiple courses using CSV format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coursesText">Course Data (CSV Format)</Label>
                <textarea
                  id="coursesText"
                  className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="CS101,Introduction to Programming,Learn programming basics,Computer Science,4,60,1&#10;CS102,Data Structures,Advanced data structures,Computer Science,4,50,1&#10;EC101,Digital Electronics,Basic electronics,Electronics,3,40,2"
                  value={coursesText}
                  onChange={(e) => setCoursesText(e.target.value)}
                />
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="font-medium">Format: courseCode,courseName,description,category,credits,maxStudents,instructorId</p>
                      <p>• courseCode, courseName, and instructorId are required</p>
                      <p>• category defaults to "General", credits to 3, maxStudents to 50</p>
                      <p>• One course per line, comma-separated</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleBulkCreateCourses} 
                disabled={isLoading || !coursesText.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Courses...
                  </>
                ) : (
                  <>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Create Courses
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
