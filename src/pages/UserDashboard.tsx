import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, BookOpen } from "lucide-react";
import CourseCard from "@/components/dashboard/CourseCard";
import CourseProgress from "@/components/dashboard/CourseProgress";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  materialUrl: string;
}

const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@company.com",
  department: "Marketing",
  joined: "Jan 15, 2023"
};

const mockProgress = [
  {
    courseName: "Data Privacy Compliance",
    progress: 75,
    slidesCompleted: 6,
    totalSlides: 8,
    quizScore: null,
    certificateIssued: false
  },
  {
    courseName: "Information Security Basics",
    progress: 100,
    slidesCompleted: 12,
    totalSlides: 12,
    quizScore: 90,
    certificateIssued: true
  },
  {
    courseName: "Anti-Harassment Training",
    progress: 0,
    slidesCompleted: 0,
    totalSlides: 6,
    quizScore: null,
    certificateIssued: false
  }
];

const UserDashboard = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"all" | "inProgress" | "completed">("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tenantId = searchParams.get('tenantId');
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
      fetchTenantCourses(tenantId);
    } else {
      const storedTenantId = localStorage.getItem('tenantId');
      if (storedTenantId) {
        fetchTenantCourses(storedTenantId);
      } else {
        setError('No tenant ID found. Please log in again.');
        setIsLoading(false);
      }
    }
  }, [searchParams]);

  const fetchTenantCourses = async (tenantId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tenant-admin/tenants/${tenantId}/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenant courses');
      }

      const data = await response.json();
      setCourses(data.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        duration: course.duration,
        progress: 0, // We'll update this when we have progress data
        materialUrl: course.materialUrl
      })));
    } catch (error) {
      console.error('Error fetching tenant courses:', error);
      setError(error instanceof Error ? error.message : 'Failed to load courses. Please try again later.');
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredCourses = courses.filter(course => {
    if (activeTab === "all") return true;
    if (activeTab === "inProgress") return course.progress > 0 && course.progress < 100;
    if (activeTab === "completed") return course.progress === 100;
    return true;
  });

  const totalProgress = courses.reduce((acc, course) => acc + course.progress, 0);
  const overallProgress = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;
  const completedCourses = courses.filter(course => course.progress === 100).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/30">
      <Navbar userRole="employee" />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <Card className="animate-fade-in hover:shadow-md transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle>Welcome back!</CardTitle>
                  <CardDescription>Your training dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="font-medium text-lg">{mockUser.name}</h3>
                    <p className="text-gray-500 text-sm">{mockUser.department}</p>
                    <p className="text-gray-500 text-sm">{mockUser.email}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Overall Progress</span>
                        <span className="text-sm font-medium">{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-2 bg-gray-200 dark:bg-gray-700" />
                    </div>
                    
                    <div className="pt-2 border-t flex justify-between items-center hover:bg-muted/20 p-2 rounded-md transition-colors">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Total Courses</span>
                      </div>
                      <span className="font-medium">{courses.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center hover:bg-muted/20 p-2 rounded-md transition-colors">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="font-medium">{completedCourses}</span>
                    </div>
                    
                    <div className="flex justify-between items-center hover:bg-muted/20 p-2 rounded-md transition-colors">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Due Soon</span>
                      </div>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 space-y-4 animate-fade-in">
                <h3 className="font-medium text-lg">Course Progress</h3>
                {mockProgress.map((course, index) => (
                  <CourseProgress
                    key={index}
                    courseName={course.courseName}
                    progress={course.progress}
                    slidesCompleted={course.slidesCompleted}
                    totalSlides={course.totalSlides}
                    quizScore={course.quizScore}
                    certificateIssued={course.certificateIssued}
                  />
                ))}
              </div>
            </div>
            
            <div className="lg:w-3/4 animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold">Your Courses</h1>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <Button 
                    variant={activeTab === "all" ? "default" : "outline"} 
                    onClick={() => setActiveTab("all")}
                    className={`transition-all duration-200 ${activeTab === "all" ? "bg-complybrand-700 hover:bg-complybrand-800" : "hover:bg-muted/20"}`}
                  >
                    All
                  </Button>
                  <Button 
                    variant={activeTab === "inProgress" ? "default" : "outline"} 
                    onClick={() => setActiveTab("inProgress")}
                    className={`transition-all duration-200 ${activeTab === "inProgress" ? "bg-complybrand-700 hover:bg-complybrand-800" : "hover:bg-muted/20"}`}
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant={activeTab === "completed" ? "default" : "outline"} 
                    onClick={() => setActiveTab("completed")}
                    className={`transition-all duration-200 ${activeTab === "completed" ? "bg-complybrand-700 hover:bg-complybrand-800" : "hover:bg-muted/20"}`}
                  >
                    Completed
                  </Button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-complybrand-700"></div>
                </div>
              ) : error ? (
                <Card className="animate-fade-in overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <h3 className="text-xl font-medium text-destructive">Error Loading Courses</h3>
                    <p className="text-gray-500 text-center mt-2">{error}</p>
                  </CardContent>
                </Card>
              ) : filteredCourses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      id={course.id}
                      title={course.title}
                      description={course.description}
                      duration={course.duration}
                      progress={course.progress}
                      userRole="employee"
                      materialUrl={course.materialUrl}
                    />
                  ))}
                </div>
              ) : (
                <Card className="animate-fade-in overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium">No courses found</h3>
                    <p className="text-gray-500 text-center mt-2">
                      There are no courses in this category yet.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {activeTab === "completed" && completedCourses > 0 && (
                <div className="mt-8 animate-fade-in">
                  <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
                    <CardHeader>
                      <CardTitle>Your Certificates</CardTitle>
                      <CardDescription>
                        Access and download your earned certificates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses
                          .filter(course => course.progress === 100)
                          .map((course) => (
                            <div key={course.id} className="flex justify-between items-center p-4 border rounded-md hover:bg-muted/20 transition-all duration-200">
                              <div>
                                <h4 className="font-medium">{course.title}</h4>
                                <p className="text-sm text-gray-500">Completed on April 2, 2023</p>
                              </div>
                              <Button variant="outline" className="hover:bg-complybrand-600 hover:text-white transition-colors">
                                Download
                              </Button>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
