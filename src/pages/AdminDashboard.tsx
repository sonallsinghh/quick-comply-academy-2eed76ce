import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Users, BookOpen, BarChart } from "lucide-react";
import UsersList from "@/components/dashboard/UsersList";
import CourseCard from "@/components/dashboard/CourseCard";

// Mock data for demonstration
const mockCourses = [
  {
    id: "1",
    title: "Data Privacy Compliance",
    description: "Essential training for GDPR, CCPA and other privacy regulations",
    duration: "2 hours",
    enrolledCount: 78
  },
  {
    id: "2",
    title: "Information Security Basics",
    description: "Fundamentals of information security for all employees",
    duration: "1.5 hours",
    enrolledCount: 92
  },
  {
    id: "3",
    title: "Anti-Harassment Training",
    description: "Creating a respectful workplace environment",
    duration: "45 minutes",
    enrolledCount: 56
  }
];

const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Marketing",
    coursesCompleted: 3,
    totalCourses: 3,
    lastActivity: "Today"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    department: "Engineering",
    coursesCompleted: 2,
    totalCourses: 3,
    lastActivity: "Yesterday"
  },
  {
    id: "3",
    name: "Robert Williams",
    email: "r.williams@company.com",
    department: "Finance",
    coursesCompleted: 1,
    totalCourses: 3,
    lastActivity: "3 days ago"
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa.b@company.com",
    department: "Human Resources",
    coursesCompleted: 3,
    totalCourses: 3,
    lastActivity: "1 week ago"
  },
  {
    id: "5",
    name: "Michael Chen",
    email: "m.chen@company.com",
    department: "IT",
    coursesCompleted: 0,
    totalCourses: 3,
    lastActivity: "Never"
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const completedCount = mockUsers.filter(
    (user) => user.coursesCompleted === user.totalCourses
  ).length;

  const inProgressCount = mockUsers.filter(
    (user) => user.coursesCompleted > 0 && user.coursesCompleted < user.totalCourses
  ).length;

  const notStartedCount = mockUsers.filter(
    (user) => user.coursesCompleted === 0
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
            {/* Removed "Add Users" button */}
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
                <div className="text-2xl font-bold animate-fade-in">{mockUsers.length}</div>
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
                <div className="text-2xl font-bold animate-fade-in">{mockCourses.length}</div>
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
                  {Math.round((completedCount / mockUsers.length) * 100)}%
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
                  <UsersList 
                    users={mockUsers.slice(0, 3)} 
                    title="Recent User Activity" 
                  />
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={() => setActiveTab("users")} 
                      className="hover:bg-complybrand-600 hover:text-white transition-colors">
                      View All Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8 animate-fade-in">
                <h3 className="text-lg font-medium mb-4">Active Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockCourses.map((course) => (
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
              <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    Manage and monitor all users in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersList 
                    users={mockUsers} 
                    title="All Users" 
                  />
                </CardContent>
              </Card>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockCourses.map((course) => (
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
