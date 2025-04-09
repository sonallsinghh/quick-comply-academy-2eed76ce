
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { coursesSlides, Slide } from "@/data/courseSlides";
import SlidePlayer from "@/components/course/SlidePlayer";
import CourseHeader from "@/components/course/CourseHeader";
import CourseNotFound from "@/components/course/CourseNotFound";

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);
  
  useEffect(() => {
    // In a real app, this would be an API call to get course content
    if (courseId && coursesSlides[courseId]) {
      setSlides([...coursesSlides[courseId]]);
    }
  }, [courseId]);
  
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
          />
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
