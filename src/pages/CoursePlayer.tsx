import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SlideExplanation {
  slideNumber: number;
  content: string;
  explanation: string;
}

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const materialUrl = location.state?.materialUrl;
  
  const [currentSlide, setCurrentSlide] = useState(1);
  const [totalSlides, setTotalSlides] = useState(0);
  const [explanations, setExplanations] = useState<SlideExplanation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load explanations from localStorage
    const storedExplanations = localStorage.getItem(`course-${courseId}-explanations`);
    if (storedExplanations) {
      try {
        const parsedExplanations = JSON.parse(storedExplanations);
        setExplanations(parsedExplanations);
        setTotalSlides(parsedExplanations.length);
      } catch (error) {
        console.error('Error parsing explanations:', error);
        toast.error('Failed to load course content');
      }
    }
    setIsLoading(false);
  }, [courseId]);

  const handlePreviousSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const currentExplanation = explanations.find(exp => exp.slideNumber === currentSlide);

  if (!materialUrl) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar userRole="employee" />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-600">Course material not found. Please try starting the course again.</p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole="employee" />
      <main className="flex-grow pt-16 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="w-full aspect-[4/3] bg-white">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-complybrand-700"></div>
                </div>
              ) : error ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(materialUrl)}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="PPT Viewer"
                />
              )}
            </Card>
            
            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousSlide}
                disabled={currentSlide === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm">
                Slide {currentSlide} of {totalSlides}
              </span>
              <Button
                variant="outline"
                onClick={handleNextSlide}
                disabled={currentSlide === totalSlides}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Slide Content</h2>
              {currentExplanation ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Content</h3>
                    <p className="text-sm text-gray-600">{currentExplanation.content}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Explanation</h3>
                    <p className="text-sm text-gray-600">{currentExplanation.explanation}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No content available for this slide.</p>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
