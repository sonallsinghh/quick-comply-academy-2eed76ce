
import { useState } from "react";
import { Card } from "@/components/ui/card";
import SlideControls from "./SlideControls";
import SlideNavigation from "./SlideNavigation";
import SlideContent from "./SlideContent";
import ChatHelp from "./ChatHelp";

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
  const isFirstSlide = currentSlideIndex === 0;
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
        <SlideNavigation 
          slides={slides}
          currentIndex={currentSlideIndex}
          overallProgress={overallProgress}
          onSlideSelect={handleSlideSelect}
        />
      </div>
      
      {/* Main content area */}
      <div className="lg:w-3/4">
        <Card className="p-6">
          <SlideContent
            title={currentSlide.title}
            content={currentSlide.content}
            currentIndex={currentSlideIndex}
            totalSlides={slides.length}
            progress={progress}
          />
          
          <SlideControls 
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            handlePrev={handlePrev}
            handleNext={handleNext}
            isFirstSlide={isFirstSlide}
            isLastSlide={isLastSlide}
            isMuted={isMuted}
            toggleMute={toggleMute}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            playbackRate={playbackRate}
            changePlaybackRate={changePlaybackRate}
            onComplete={onComplete}
          />
        </Card>
        
        {/* Chat Help section */}
        <div className="mt-6">
          <ChatHelp
            slideTitle={currentSlide.title}
            slideContent={currentSlide.content}
          />
        </div>
      </div>
    </div>
  );
};

export default SlidePlayer;
