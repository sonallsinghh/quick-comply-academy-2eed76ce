import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Slide } from "@/data/courseSlides";
import SlidePlayer from "@/components/course/SlidePlayer";
import CourseNotFound from "@/components/course/CourseNotFound";
import { useQuery } from "@tanstack/react-query";
import ChatHelp from "@/components/course/ChatHelp";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// API endpoints for a real implementation
const API_ENDPOINTS = {
  // SSO Login
  SSO_LOGIN: "/api/auth/sso/login",
  SSO_CALLBACK: "/api/auth/sso/callback",
  
  // Admin/Superuser Login
  ADMIN_LOGIN: "/api/auth/login",
  
  // Course Content
  GET_COURSE_SLIDES: (courseId: string) => `/api/courses/${courseId}/slides`,
  GET_COURSE_EXPLANATIONS: (courseId: string, organizationId: string) => 
    `/api/courses/${courseId}/explanations?organizationId=${organizationId}`,
  GET_PRESENTER_AVATAR: (courseId: string) => `/api/courses/${courseId}/presenter`,
  GET_SLIDE_AUDIO: (courseId: string, slideId: string) => `/api/courses/${courseId}/slides/${slideId}/audio`,
  
  // Course Progress
  UPDATE_PROGRESS: (courseId: string) => `/api/courses/${courseId}/progress`,
  
  // S3 File Paths (these would be returned by the API, not called directly)
  S3_PPT_PATH: "s3://myaudiouploadbucket/Blue White Professional Modern Safety Training Presentation.pptx",
  S3_SLIDE_IMAGES_PATH: (courseId: string) => `s3://course-content/${courseId}/slides/`,
  S3_AUDIO_PATH: (courseId: string) => `s3://course-content/${courseId}/audio/`
};

// Mock API function - replace with actual API call
const fetchPersonalizedExplanations = async (courseId: string, organizationId: string = "default") => {
  // In a real app, this would be an API call to get personalized explanations
  console.log(`Fetching explanations for course ${courseId} and org ${organizationId}`);
  
  // Mock data - replace with actual API response
  return new Promise<Record<string, string>>((resolve) => {
    setTimeout(() => {
      resolve({
        "slide-1": "In Webknot organization, this concept is particularly relevant because...",
        "slide-2": "Considering Webknot's industry focus, these regulations apply in the following ways...",
        "slide-3": "For Webknot employees, the best practice is to handle this situation by..."
      });
    }, 1000);
  });
};

interface Slide {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface EnhancedSlide extends Slide {
  explanation?: string;
}

// Mock data for testing
const mockSlides: Slide[] = [
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
  }
];

const mockExplanations = {
  "slide1": "In this organization, data privacy is crucial because...",
  "slide2": "GDPR requirements are particularly important for our industry because...",
  "slide3": "CCPA compliance affects our business operations in the following ways..."
};

const CoursePlayer = () => {
  const { courseTenantId } = useParams<{ courseTenantId: string }>();
  const navigate = useNavigate();
  const [slides, setSlides] = useState<EnhancedSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course slides
  useEffect(() => {
    const fetchSlides = async () => {
      if (!courseTenantId) {
        setError("Course ID not found");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching slides for tenant course:", courseTenantId);

        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/courses/tenant-course/${courseTenantId}/slides`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Received slides data:", data);

        // Transform the response to match our Slide interface
        const transformedSlides = data.map((slide: any, index: number) => ({
          id: `slide-${index + 1}`,
          title: slide.title || `Slide ${index + 1}`,
          content: `/slides/slide-${index + 1}.png`, // Using local images
          completed: false,
          explanation: slide.explanation || "",
        }));

        console.log("Transformed slides:", transformedSlides);
        setSlides(transformedSlides);
      } catch (error) {
        console.error("Error fetching slides:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load course slides";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, [courseTenantId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <CourseHeader
          courseId={courseTenantId || ""}
          onReturnToDashboard={() => navigate("/dashboard")}
        />
        <main className="flex-grow pt-8 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-complybrand-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <CourseHeader
          courseId={courseTenantId || ""}
          onReturnToDashboard={() => navigate("/dashboard")}
        />
        <main className="flex-grow pt-8 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Course
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!slides.length) {
    return <CourseNotFound />;
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
    const updatedSlides = slides.map((slide) => ({
      ...slide,
      completed: true,
    }));
    setSlides(updatedSlides);
    setCourseCompleted(true);

    toast.success("Course content completed! Now take the assessment quiz.", {
      duration: 5000,
    });

    // Navigate to the quiz page
    navigate(`/course/${courseTenantId}/quiz`);
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  if (!courseId) {
    console.log('No courseId found, showing CourseNotFound');
    return <CourseNotFound onReturn={handleReturnToDashboard} />;
  }

  if (slides.length === 0) {
    console.log('No slides loaded, showing loading spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-complybrand-700"></div>
      </div>
    );
  }

  console.log('Rendering CoursePlayer with:', {
    currentSlideIndex,
    totalSlides: slides.length,
    currentSlide: slides[currentSlideIndex]
  });

  return (
    <div className="min-h-screen flex flex-col">
      <CourseHeader
        courseId={courseTenantId || ""}
        onReturnToDashboard={handleReturnToDashboard}
      />

      <main className="flex-grow pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SlidePlayer
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={handleSlideChange}
            onComplete={handleCourseComplete}
            isLoadingExplanations={false}
          />

        </div>
      </div>
      {tenantId && (
            <div className="lg:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <ChatHelp
                slideTitle={slides[currentSlideIndex]?.title || ""}
                slideContent={slides[currentSlideIndex]?.content || ""}
                tenantId={tenantId}
              />
            </div>
          )}

      {/* Return to Dashboard Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          onClick={handleReturnToDashboard}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CoursePlayer;
