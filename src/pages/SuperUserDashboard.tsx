
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Building, BookOpen, Users } from "lucide-react";
import UsersList from "@/components/dashboard/UsersList";
import CourseCard from "@/components/dashboard/CourseCard";
import AddOrganizationForm from "@/components/forms/AddOrganizationForm";
import AddCourseForm from "@/components/forms/AddCourseForm";

// Mock data for demonstration
const mockOrganizations = [
  {
    id: "1",
    name: "Acme Corp",
    users: 156,
    courses: 5,
    lastActivity: "Today"
  },
  {
    id: "2",
    name: "TechStart Inc",
    users: 89,
    courses: 4,
    lastActivity: "Yesterday"
  },
  {
    id: "3",
    name: "Global Finance LLC",
    users: 243,
    courses: 7,
    lastActivity: "3 days ago"
  }
];

const mockCourses = [
  {
    id: "1",
    title: "Data Privacy Compliance",
    description: "Essential training for GDPR, CCPA and other privacy regulations",
    duration: "2 hours",
    enrolledCount: 425
  },
  {
    id: "2",
    title: "Information Security Basics",
    description: "Fundamentals of information security for all employees",
    duration: "1.5 hours",
    enrolledCount: 512
  },
  {
    id: "3",
    title: "Anti-Harassment Training",
    description: "Creating a respectful workplace environment",
    duration: "45 minutes",
    enrolledCount: 318
  },
  {
    id: "4",
    title: "Ethical Business Conduct",
    description: "Understanding ethical responsibilities in business decisions",
    duration: "1 hour",
    enrolledCount: 287
  }
];

const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@acme.com",
    department: "Marketing",
    coursesCompleted: 3,
    totalCourses: 3,
    lastActivity: "Today"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@techstart.com",
    department: "Engineering",
    coursesCompleted: 2,
    totalCourses: 4,
    lastActivity: "Yesterday"
  },
  {
    id: "3",
    name: "Robert Williams",
    email: "r.williams@globalfinance.com",
    department: "Finance",
    coursesCompleted: 5,
    totalCourses: 7,
    lastActivity: "3 days ago"
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa.b@acme.com",
    department: "Human Resources",
    coursesCompleted: 3,
    totalCourses: 3,
    lastActivity: "1 week ago"
  }
];

const SuperUserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [organizationDialogOpen, setOrganizationDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="superuser" />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super User Dashboard</h1>
              <p className="text-gray-600">Manage organizations, courses, and system-wide settings</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                className="bg-complybrand-700 hover:bg-complybrand-800"
                onClick={() => setOrganizationDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
              <Button 
                className="bg-complybrand-700 hover:bg-complybrand-800"
                onClick={() => setCourseDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Organizations
                </CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockOrganizations.length}</div>
                <p className="text-xs text-muted-foreground">
                  +1 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCourses.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockOrganizations.reduce((acc, org) => acc + org.users, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +43 from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockCourses.slice(0, 3).map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    duration={course.duration}
                    enrolledCount={course.enrolledCount}
                    userRole="superuser"
                  />
                ))}
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Organizations</CardTitle>
                  <CardDescription>
                    Organizations recently added to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {mockOrganizations.map((org) => (
                      <div key={org.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{org.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {org.users} users · {org.courses} courses
                          </p>
                        </div>
                        <div className="ml-auto font-medium">Last active: {org.lastActivity}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="organizations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Organizations</CardTitle>
                  <CardDescription>
                    Manage all organizations registered on CompliQuick
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {mockOrganizations.map((org) => (
                      <div key={org.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{org.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {org.users} users · {org.courses} courses
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Button variant="outline">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="courses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    duration={course.duration}
                    enrolledCount={course.enrolledCount}
                    userRole="superuser"
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <UsersList 
                users={mockUsers} 
                title="All Platform Users" 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddOrganizationForm 
        open={organizationDialogOpen}
        onOpenChange={setOrganizationDialogOpen}
      />

      <AddCourseForm
        open={courseDialogOpen}
        onOpenChange={setCourseDialogOpen}
      />
      
      <Footer />
    </div>
  );
};

export default SuperUserDashboard;
