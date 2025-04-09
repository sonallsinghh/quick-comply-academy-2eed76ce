
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, BookOpen, Award, Play } from "lucide-react";

// Mock data
const coursesData = [
  {
    id: "1",
    title: "Data Privacy Compliance",
    description: "Essential training for GDPR, CCPA and other privacy regulations",
    longDescription: "This comprehensive course covers all aspects of data privacy regulations that your organization needs to comply with. Learn about GDPR, CCPA, and other important privacy frameworks that protect user data and ensure your business remains compliant.",
    duration: "2 hours",
    enrolledCount: 425,
    lastUpdated: "March 15, 2023",
    instructor: "Jennifer Wilson",
    topics: ["GDPR", "CCPA", "Data Protection", "Privacy Policies", "Consent Management"],
    slides: [
      { id: "s1", title: "Introduction to Data Privacy", duration: "10 min" },
      { id: "s2", title: "Key GDPR Requirements", duration: "25 min" },
      { id: "s3", title: "CCPA Compliance", duration: "20 min" },
      { id: "s4", title: "Data Subject Rights", duration: "15 min" },
      { id: "s5", title: "Breach Notification Requirements", duration: "15 min" },
      { id: "s6", title: "Privacy by Design", duration: "15 min" },
      { id: "s7", title: "Implementation Strategies", duration: "15 min" },
      { id: "s8", title: "Assessment and Certification", duration: "5 min" },
    ]
  },
  {
    id: "2",
    title: "Information Security Basics",
    description: "Fundamentals of information security for all employees",
    longDescription: "Learn the core principles of information security that every employee should know. This course covers password security, phishing awareness, safe browsing practices, and how to identify and report security incidents in your organization.",
    duration: "1.5 hours",
    enrolledCount: 512,
    lastUpdated: "April 2, 2023",
    instructor: "Michael Chen",
    topics: ["Password Security", "Phishing Prevention", "Device Security", "Incident Reporting"],
    slides: [
      { id: "s1", title: "Why Information Security Matters", duration: "10 min" },
      { id: "s2", title: "Password Best Practices", duration: "15 min" },
      { id: "s3", title: "Recognizing Phishing Attempts", duration: "20 min" },
      { id: "s4", title: "Secure Remote Work", duration: "15 min" },
      { id: "s5", title: "Mobile Device Security", duration: "15 min" },
      { id: "s6", title: "Incident Reporting Procedures", duration: "10 min" },
      { id: "s7", title: "Assessment and Certification", duration: "5 min" },
    ]
  },
  {
    id: "3",
    title: "Anti-Harassment Training",
    description: "Creating a respectful workplace environment",
    longDescription: "This important training helps employees understand what constitutes harassment in the workplace, how to prevent it, and what to do if they experience or witness harassment. The course promotes a culture of respect and inclusion.",
    duration: "45 minutes",
    enrolledCount: 318,
    lastUpdated: "February 10, 2023",
    instructor: "Sarah Johnson",
    topics: ["Workplace Harassment", "Reporting Procedures", "Bystander Intervention", "Inclusive Communication"],
    slides: [
      { id: "s1", title: "Understanding Harassment", duration: "8 min" },
      { id: "s2", title: "Types of Harassment", duration: "10 min" },
      { id: "s3", title: "Preventing Harassment", duration: "8 min" },
      { id: "s4", title: "Bystander Intervention", duration: "7 min" },
      { id: "s5", title: "Reporting Procedures", duration: "7 min" },
      { id: "s6", title: "Assessment and Certification", duration: "5 min" },
    ]
  }
];

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundCourse = coursesData.find((c) => c.id === courseId);
    setCourse(foundCourse);
  }, [courseId]);
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-4">The course you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const totalDuration = course.slides.reduce(
    (acc: number, slide: { duration: string }) => 
      acc + parseInt(slide.duration.split(" ")[0]), 
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="employee" />
      <main className="flex-grow pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/dashboard" className="text-complybrand-600 hover:underline mb-4 inline-block">
                ← Back to Dashboard
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                  <p className="text-gray-600 mt-1">{course.description}</p>
                </div>
                <Link to={`/course/${courseId}/play`}>
                  <Button className="bg-complybrand-700 hover:bg-complybrand-800">
                    <Play className="mr-2 h-4 w-4" />
                    Start Course
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border">
                  <Clock className="h-6 w-6 text-complybrand-600 mb-2" />
                  <span className="text-sm text-gray-500">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border">
                  <Users className="h-6 w-6 text-complybrand-600 mb-2" />
                  <span className="text-sm text-gray-500">Enrolled</span>
                  <span className="font-medium">{course.enrolledCount}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border">
                  <BookOpen className="h-6 w-6 text-complybrand-600 mb-2" />
                  <span className="text-sm text-gray-500">Topics</span>
                  <span className="font-medium">{course.topics.length}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border">
                  <Award className="h-6 w-6 text-complybrand-600 mb-2" />
                  <span className="text-sm text-gray-500">Certificate</span>
                  <span className="font-medium">Included</span>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{course.longDescription}</p>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">Key Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.topics.map((topic: string) => (
                          <Badge key={topic} variant="secondary">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">What You'll Learn</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Understand the key principles of {course.title.toLowerCase()}</li>
                        <li>Implement best practices for compliance</li>
                        <li>Identify potential risks and how to mitigate them</li>
                        <li>Apply knowledge in real-world workplace scenarios</li>
                      </ul>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium">Additional Information</h3>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-gray-500">Last Updated</span>
                          <span>{course.lastUpdated}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Instructor</span>
                          <span>{course.instructor}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      {course.slides.length} sections • {totalDuration} minutes total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.slides.map((slide: { id: string; title: string; duration: string }, index: number) => (
                        <div key={slide.id} className="p-4 border rounded-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-complybrand-100 text-complybrand-700 text-xs mr-3">
                                {index + 1}
                              </span>
                              <span className="font-medium">{slide.title}</span>
                            </div>
                            <span className="text-gray-500 text-sm">{slide.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="instructor">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-600">
                          {course.instructor.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{course.instructor}</h3>
                        <p className="text-gray-500">Compliance Training Specialist</p>
                        <p className="mt-2 text-gray-600">
                          {course.instructor} is an experienced trainer specializing in corporate compliance topics. 
                          With over 10 years of industry experience, they have helped hundreds of 
                          organizations improve their compliance programs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CourseDetails;
