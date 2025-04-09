
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import SlidePlayer from "@/components/course/SlidePlayer";
import { toast } from "sonner";

// Mock data for course slides
const coursesSlides = {
  "1": [
    {
      id: "slide1",
      title: "Introduction to Data Privacy",
      content: "This course will cover the essential aspects of data privacy regulations including GDPR, CCPA, and industry best practices.",
      completed: false
    },
    {
      id: "slide2",
      title: "Key GDPR Requirements",
      content: "The General Data Protection Regulation (GDPR) is a comprehensive privacy law that protects EU citizens. Learn about its key requirements and how they affect your organization.",
      completed: false
    },
    {
      id: "slide3",
      title: "CCPA Compliance",
      content: "The California Consumer Privacy Act (CCPA) gives California residents specific rights regarding their personal information. This section explains what businesses need to do for compliance.",
      completed: false
    },
    {
      id: "slide4",
      title: "Data Subject Rights",
      content: "Under modern privacy laws, individuals have specific rights over their data. Learn how to handle data access, deletion, and portability requests.",
      completed: false
    },
    {
      id: "slide5",
      title: "Breach Notification Requirements",
      content: "In case of a data breach, there are specific notification requirements that organizations must follow. This section covers the timeframes and procedures for notification.",
      completed: false
    }
  ],
  "2": [
    {
      id: "slide1",
      title: "Why Information Security Matters",
      content: "Information security is critical for protecting your organization's data, reputation, and customer trust. This section explains the importance of security practices.",
      completed: false
    },
    {
      id: "slide2",
      title: "Password Best Practices",
      content: "Strong passwords are your first line of defense. Learn how to create and manage secure passwords to protect your accounts and sensitive information.",
      completed: false
    },
    {
      id: "slide3",
      title: "Recognizing Phishing Attempts",
      content: "Phishing is one of the most common attack vectors. This section teaches you how to identify and avoid falling victim to phishing attempts.",
      completed: false
    }
  ],
  "3": [
    {
      id: "slide1",
      title: "Understanding Harassment",
      content: "Workplace harassment can take many forms. This section defines what constitutes harassment and the impact it has on individuals and the workplace.",
      completed: false
    },
    {
      id: "slide2",
      title: "Types of Harassment",
      content: "Harassment can be verbal, physical, or visual. Learn about the different types of harassment that can occur in the workplace.",
      completed: false
    },
    {
      id: "slide3",
      title: "Preventing Harassment",
      content: "Prevention is key to maintaining a respectful workplace. This section covers strategies for preventing harassment before it occurs.",
      completed: false
    }
  ],
};

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call to get course content
    if (courseId && coursesSlides[courseId as keyof typeof coursesSlides]) {
      setSlides(coursesSlides[courseId as keyof typeof coursesSlides]);
    }
  }, [courseId]);
  
  if (!slides.length) {
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
      </div>
    );
  }

  const handleSlideChange = (index: number) => {
    // Mark previous slides as completed
    const updatedSlides = [...slides];
    for (let i = 0; i <= Math.min(currentSlideIndex, index); i++) {
      updatedSlides[i].completed = true;
    }
    
    setSlides(updatedSlides);
    setCurrentSlideIndex(index);
  };
  
  const handleCourseComplete = () => {
    // Mark all slides as completed
    const updatedSlides = slides.map(slide => ({ ...slide, completed: true }));
    setSlides(updatedSlides);
    setCourseCompleted(true);
    
    toast.success("Course content completed! Now take the assessment quiz.", {
      duration: 5000,
    });
    
    // Navigate to the quiz page
    navigate(`/course/${courseId}/quiz`);
  };
  
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/course/${courseId}`} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-semibold truncate">
              {courseId === "1" ? "Data Privacy Compliance" : 
               courseId === "2" ? "Information Security Basics" :
               "Anti-Harassment Training"}
            </h1>
          </div>
          <Button variant="outline" onClick={handleReturnToDashboard}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>
      
      <main className="flex-grow pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SlidePlayer
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={handleSlideChange}
            onComplete={handleCourseComplete}
          />
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
