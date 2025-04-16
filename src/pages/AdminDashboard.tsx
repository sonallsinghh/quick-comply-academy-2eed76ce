import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Users, BookOpen, BarChart, Settings, Loader2 } from "lucide-react";
import UsersList from "@/components/dashboard/UsersList";
import CourseCard from "@/components/dashboard/CourseCard";
import TenantUsersList from "@/components/dashboard/TenantUsersList";
import AddTenantDetailsForm from "@/components/forms/AddTenantDetailsForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import PPTViewer from '@/components/dashboard/PPTViewer';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tenantDetailsDialogOpen, setTenantDetailsDialogOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [tenantId, setTenantId] = useState(() => {
    const storedTenantId = localStorage.getItem('tenantId');
    if (!storedTenantId) {
      console.error('No tenant ID found in localStorage');
      return '';
    }
    return storedTenantId;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPPTViewer, setShowPPTViewer] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!tenantId) return;
      
      try {
        setIsLoadingUsers(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tenant-admin/tenants/${tenantId}/users`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [tenantId]);

  useEffect(() => {
    const fetchTenantCourses = async () => {
      if (!tenantId) {
        setError('No tenant ID available. Please log in again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching courses for tenant:', tenantId);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tenant-admin/tenants/${tenantId}/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          });
          throw new Error(errorData?.message || 'Failed to fetch tenant courses');
        }

        const data = await response.json();
        console.log('Received courses data:', data);
        
        // The response is already in the correct format, no need to map
        setCourses(data);
      } catch (error) {
        console.error('Error fetching tenant courses:', error);
        setError(error instanceof Error ? error.message : 'Failed to load courses. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAvailableCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch available courses');
        }

        const data = await response.json();
        setAvailableCourses(data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
      }
    };

    fetchTenantCourses();
    fetchAvailableCourses();
  }, [tenantId]);

  const handleAddCourse = async () => {
    try {
      // Get the first selected course (since we can only assign one at a time)
      const courseId = selectedCourses[0];
      
      if (!courseId) {
        toast.error('Please select a course to add');
        return;
      }

      const tenantId = localStorage.getItem('tenantId');
      if (!tenantId) {
        toast.error('No tenant ID found. Please log in again.');
        return;
      }

      // Log the request details
      console.log('Attempting to assign course:', {
        courseId,
        tenantId,
        url: `${import.meta.env.VITE_BACKEND_URL}/api/courses/assign`
      });

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          courseId,
          tenantId
        }),
      });

      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response data:', errorData);
        throw new Error(errorData?.message || `Failed to assign course. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Course assigned successfully:', data);
      
      // Close the dialog
      setIsAddCourseDialogOpen(false);
      
      // Refresh the courses list
      const coursesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tenant-admin/tenants/${tenantId}/courses`);
      if (coursesResponse.ok) {
        const updatedCourses = await coursesResponse.json();
        setCourses(updatedCourses);
      }

      // Refresh available courses
      const availableResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses`);
      if (availableResponse.ok) {
        const allCourses = await availableResponse.json();
        setAvailableCourses(allCourses);
      }
      
      toast.success('Course assigned successfully');
    } catch (error) {
      console.error('Detailed error assigning course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign course');
    }
  };

  const handleCourseSelect = async (course) => {
    try {
      setIsProcessing(true);
      toast.info('Processing slides...');

      // Process slides and get explanations
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/courses/${course.id}/process-slides`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenantId: localStorage.getItem('tenantId')
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process slides');
      }

      const data = await response.json();
      setExplanations(data.explanations);
      setSelectedCourse(course);
      setShowPPTViewer(true);
      toast.success('Slides processed successfully');
    } catch (error) {
      console.error('Error processing slides:', error);
      toast.error('Failed to process slides');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClosePPTViewer = () => {
    setShowPPTViewer(false);
    setSelectedCourse(null);
    setExplanations([]);
  };

  const completedCount = users.filter(
    (user: any) => user.enrollments?.length > 0 && 
    user.enrollments.every((enrollment: any) => enrollment.completed)
  ).length;

  const inProgressCount = users.filter(
    (user: any) => user.enrollments?.length > 0 && 
    user.enrollments.some((enrollment: any) => !enrollment.completed)
  ).length;

  const notStartedCount = users.filter(
    (user: any) => !user.enrollments || user.enrollments.length === 0
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar userRole="admin" />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Organization Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your organization's compliance training</p>
            </div>
            <div className="flex space-x-3 animate-fade-in">
              <Button 
                className="bg-complybrand-700 hover:bg-complybrand-800 hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  setSelectedTenantId(tenantId);
                  setTenantDetailsDialogOpen(true);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Organization Settings
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-fade-in">{users.length}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-fade-in">{courses.length}</div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold animate-fade-in">
                  {users.length > 0 ? Math.round((completedCount / users.length) * 100) : 0}%
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Training Status
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">{completedCount}</span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>In Progress:</span>
                  <span className="font-medium text-yellow-600">{inProgressCount}</span>
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>Not Started:</span>
                  <span className="font-medium text-red-600">{notStartedCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-muted/50 backdrop-blur-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-complybrand-600 data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-complybrand-600 data-[state=active]:text-white">Users</TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-complybrand-600 data-[state=active]:text-white">Courses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 animate-fade-in">
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle>User Completion Status</CardTitle>
                  <CardDescription>
                    Track employee progress across all compliance courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-complybrand-600" />
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found in your organization.
                    </div>
                  ) : (
                  <UsersList 
                      users={users.slice(0, 3)} 
                    title="Recent User Activity" 
                  />
                  )}
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("users")} 
                      className="hover:bg-complybrand-600 hover:text-white transition-colors"
                    >
                      View All Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8 animate-fade-in">
                <h3 className="text-lg font-medium mb-4">Active Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      enrolledCount={course.enrolledCount}
                      userRole="admin"
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users" className="animate-fade-in">
              <TenantUsersList tenantId={tenantId} />
            </TabsContent>
            
            <TabsContent value="courses" className="animate-fade-in">
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle>Courses</CardTitle>
                  <CardDescription>
                    View all compliance courses available to your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading courses...</div>
                  ) : error ? (
                    <div className="text-center text-red-500 py-4">{error}</div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-4">No courses available for your organization.</div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                      {courses.map((course) => (
                        <Card 
                        key={course.id}
                          className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50 cursor-pointer"
                          onClick={() => handleCourseSelect(course)}
                        >
                          <CardHeader>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>Duration: {course.duration} minutes</p>
                            <p>Tags: {course.tags}</p>
                            <p>Learning Objectives: {course.learningObjectives}</p>
                            <p>Target Audience: {course.targetAudience}</p>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* PPT Viewer Modal */}
              {showPPTViewer && selectedCourse && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <PPTViewer 
                    materialUrl={selectedCourse.materialUrl}
                    explanations={explanations}
                    onClose={handleClosePPTViewer}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddTenantDetailsForm
        open={tenantDetailsDialogOpen}
        onOpenChange={setTenantDetailsDialogOpen}
        tenantId={selectedTenantId || ""}
      />

      <Button onClick={() => setIsAddCourseDialogOpen(true)}>Add Course</Button>

      <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>Select courses to add to your organization.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {availableCourses.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No new courses available to add.
              </div>
            ) : (
              availableCourses.map((course: any) => (
                <div key={course.id} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={course.id}
                    checked={selectedCourses.includes(course.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCourses([...selectedCourses, course.id]);
                      } else {
                        setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor={course.id} className="text-lg font-medium">{course.title}</Label>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{course.duration} minutes</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">{course.tags}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={handleAddCourse}
              disabled={selectedCourses.length === 0}
              className="bg-complybrand-600 hover:bg-complybrand-700"
            >
              Add Selected Courses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
