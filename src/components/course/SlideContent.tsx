
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
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">Slide {currentIndex + 1} of {totalSlides}</p>
      </div>
      
      {/* Slide content - in a real app this could be a video or interactive content */}
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6 relative">
        <div className="text-center p-8">
          <p className="text-lg">{content}</p>
        </div>
        
        {/* Video progress indicator */}
        <div className="absolute bottom-0 left-0 w-full">
          <Progress value={progress} className="rounded-none h-1" />
        </div>
      </div>
    </>
  );
};

export default SlideContent;
