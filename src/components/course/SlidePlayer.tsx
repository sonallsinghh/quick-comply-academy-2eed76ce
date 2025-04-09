
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  FastForward,
  Rewind
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Slide {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface SlidePlayerProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onComplete: () => void;
}

const SlidePlayer = ({
  slides,
  currentSlideIndex,
  onSlideChange,
  onComplete
}: SlidePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  
  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;
  const totalCompleted = slides.filter(slide => slide.completed).length;
  const overallProgress = (totalCompleted / slides.length) * 100;
  
  // Simulating playback - in a real app this would control actual video/audio
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      onSlideChange(currentSlideIndex + 1);
      setProgress(0);
    } else {
      // Last slide - mark course as complete
      onComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
      setProgress(0);
    }
  };
  
  const handleSlideSelect = (index: number) => {
    // Only allow navigating to completed slides or the next available
    const maxAllowedIndex = slides.findIndex(slide => !slide.completed);
    if (index <= maxAllowedIndex || index <= currentSlideIndex) {
      onSlideChange(index);
      setProgress(0);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Sidebar with slide navigation */}
      <div className="lg:w-1/4">
        <Card className="p-4">
          <h3 className="font-medium text-lg mb-4">Course Content</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} />
          </div>
          
          <ScrollArea className="h-[500px]">
            <div className="space-y-1 pr-4">
              {slides.map((slide, index) => {
                // Determine if this slide is accessible
                const isCompleted = slide.completed;
                const isCurrent = index === currentSlideIndex;
                const isAccessible = index <= slides.findIndex(s => !s.completed) || isCompleted;
                
                return (
                  <button
                    key={slide.id}
                    onClick={() => handleSlideSelect(index)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center ${
                      isCurrent 
                        ? "bg-complybrand-700 text-white" 
                        : isAccessible 
                          ? "hover:bg-gray-100" 
                          : "opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!isAccessible}
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-10 text-xs mr-2">
                      {index + 1}
                    </span>
                    <div className="flex-1 truncate">{slide.title}</div>
                    {isCompleted && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </Card>
      </div>
      
      {/* Main content area */}
      <div className="lg:w-3/4">
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">{currentSlide.title}</h2>
            <p className="text-gray-500">Slide {currentSlideIndex + 1} of {slides.length}</p>
          </div>
          
          {/* Slide content - in a real app this could be a video or interactive content */}
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6 relative">
            <div className="text-center p-8">
              <p className="text-lg">{currentSlide.content}</p>
            </div>
            
            {/* Video progress indicator */}
            <div className="absolute bottom-0 left-0 w-full">
              <Progress value={progress} className="rounded-none h-1" />
            </div>
          </div>
          
          {/* Media controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentSlideIndex === 0}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={togglePlayback}>
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNext}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => changePlaybackRate(0.5)}>
                  0.5x
                </Button>
                <Button variant="ghost" size="sm" onClick={() => changePlaybackRate(1)} className={playbackRate === 1 ? "bg-gray-100" : ""}>
                  1x
                </Button>
                <Button variant="ghost" size="sm" onClick={() => changePlaybackRate(1.5)}>
                  1.5x
                </Button>
                <Button variant="ghost" size="sm" onClick={() => changePlaybackRate(2)}>
                  2x
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 w-32">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  className="w-24"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrev} disabled={currentSlideIndex === 0}>
                Previous Slide
              </Button>
              <Button 
                onClick={handleNext} 
                className="bg-complybrand-700 hover:bg-complybrand-800"
              >
                {isLastSlide ? "Complete Course" : "Next Slide"}
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Help section */}
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-medium mb-4">Need Help?</h3>
          <div>
            <p className="text-gray-600 mb-4">
              Having trouble understanding this content? Use our AI assistant to get clarity.
            </p>
            <div className="flex">
              <input
                type="text"
                placeholder="Ask a question about this slide..."
                className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-complybrand-500"
              />
              <Button className="rounded-l-none bg-complybrand-700">
                Ask
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SlidePlayer;
