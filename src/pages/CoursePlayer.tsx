
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { coursesSlides, Slide } from "@/data/courseSlides";
import SlidePlayer from "@/components/course/SlidePlayer";
import CourseHeader from "@/components/course/CourseHeader";
import CourseNotFound from "@/components/course/CourseNotFound";
import { useQuery } from "@tanstack/react-query";

// Mock API function - replace with actual API call
const fetchPersonalizedExplanations = async (courseId: string, organizationId: string = "default") => {
  // In a real app, this would be an API call to get personalized explanations
  // GET /api/courses/:courseId/explanations?organizationId=:organizationId
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

interface EnhancedSlide extends Slide {
  explanation?: string;
}

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [slides, setSlides] = useState<EnhancedSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);
  
  // Mock organization ID - in a real app, this would come from user context/auth
  const organizationId = "webknot";
  
  // Fetch course slides
  useEffect(() => {
    // In a real app, this would be an API call to get course content
    // GET /api/courses/:courseId/slides
    if (courseId && coursesSlides[courseId]) {
      setSlides([...coursesSlides[courseId]]);
    }
  }, [courseId]);
  
  // Fetch personalized explanations
  const { data: explanations, isLoading: isLoadingExplanations } = useQuery({
    queryKey: ['explanations', courseId, organizationId],
    queryFn: () => courseId ? fetchPersonalizedExplanations(courseId, organizationId) : Promise.resolve({}),
    enabled: !!courseId && slides.length > 0,
  });
  
  // Merge explanations with slides once both are loaded
  useEffect(() => {
    if (explanations && slides.length > 0) {
      const enhancedSlides = slides.map((slide, index) => ({
        ...slide,
        explanation: explanations[`slide-${index + 1}`] || slide.content
      }));
      setSlides(enhancedSlides);
    }
  }, [explanations, slides.length]);
  
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
    const updatedSlides = slides.map(slide => ({ ...slide, completed: true }));
    setSlides(updatedSlides);
    setCourseCompleted(true);
    
    toast.success("Course content completed! Now take the assessment quiz.", {
      duration: 5000,
    });
    
    // Update progress in backend
    // PUT /api/courses/:courseId/progress
    // { status: "completed", slides: slides.length }
    
    // Navigate to the quiz page
    navigate(`/course/${courseId}/quiz`);
  };
  
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CourseHeader 
        courseId={courseId || ""} 
        onReturnToDashboard={handleReturnToDashboard} 
      />
      
      <main className="flex-grow pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <SlidePlayer
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSlideChange={handleSlideChange}
            onComplete={handleCourseComplete}
            isLoadingExplanations={isLoadingExplanations}
          />
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
