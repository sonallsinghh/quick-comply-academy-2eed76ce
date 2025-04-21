import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Slide } from "@/data/courseSlides";
import SlidePlayer from "@/components/course/SlidePlayer";
import CourseHeader from "@/components/course/CourseHeader";
import CourseNotFound from "@/components/course/CourseNotFound";

interface EnhancedSlide extends Slide {
  explanation?: string;
}

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
      </main>
    </div>
  );
};

export default CoursePlayer;
