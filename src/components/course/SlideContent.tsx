
import { Progress } from "@/components/ui/progress";

interface SlideContentProps {
  title: string;
  content: string;
  currentIndex: number;
  totalSlides: number;
  progress: number;
}

const SlideContent: React.FC<SlideContentProps> = ({ 
  title, 
  content, 
  currentIndex, 
  totalSlides,
  progress 
}) => {
  return (
    <>
      <div className="mb-4 animate-fade-in">
        <h2 className="text-2xl font-bold dark:text-white transition-colors duration-300">{title}</h2>
        <p className="text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: "0.1s" }}>Slide {currentIndex + 1} of {totalSlides}</p>
      </div>
      
      {/* Slide content - in a real app this could be a video or interactive content */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="text-center p-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="text-lg dark:text-gray-200 transition-colors duration-300">{content}</p>
        </div>
        
        {/* Video progress indicator */}
        <div className="absolute bottom-0 left-0 w-full">
          <Progress value={progress} className="rounded-none h-1 transition-all duration-300" />
        </div>
      </div>
    </>
  );
};

export default SlideContent;
