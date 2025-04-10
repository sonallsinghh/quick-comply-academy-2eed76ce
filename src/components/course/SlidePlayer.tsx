import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import SlideControls from "./SlideControls";
import SlideNavigation from "./SlideNavigation";
import SlideContent from "./SlideContent";
import ChatHelp from "./ChatHelp";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Slide {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  explanation?: string;
}

interface SlidePlayerProps {
  slides: Slide[];
  currentSlideIndex: number;
  onSlideChange: (index: number) => void;
  onComplete: () => void;
  isLoadingExplanations?: boolean;
}

const SlidePlayer = ({
  slides,
  currentSlideIndex,
  onSlideChange,
  onComplete,
  isLoadingExplanations = false
}: SlidePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [canAdvance, setCanAdvance] = useState(false);
  const progressTimerRef = useRef<number | null>(null);
  
  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;
  const isFirstSlide = currentSlideIndex === 0;
  const totalCompleted = slides.filter(slide => slide.completed).length;
  const overallProgress = (totalCompleted / slides.length) * 100;
  
  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
    setCanAdvance(false);
    
    // Clear any existing timer
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    
    // Reset play state
    setIsPlaying(false);
  }, [currentSlideIndex]);
  
  // Simulate playback - in a real app, this would control actual video/audio
  useEffect(() => {
    if (isPlaying) {
      // Start progress timer
      progressTimerRef.current = window.setInterval(() => {
        setProgress(prev => {
          const nextProgress = prev + (0.5 * playbackRate);
          
          // Allow advancing when progress reaches 80%
          if (nextProgress >= 80 && !canAdvance) {
            setCanAdvance(true);
          }
          
          // Auto-pause at end of slide
          if (nextProgress >= 100) {
            setIsPlaying(false);
            if (progressTimerRef.current) {
              window.clearInterval(progressTimerRef.current);
            }
            return 100;
          }
          
          return nextProgress;
        });
      }, 100) as unknown as number;
    } else if (progressTimerRef.current) {
      // Stop progress timer if not playing
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    
    // Clean up timer on unmount
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, playbackRate, canAdvance]);
  
  // Simulating playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNext = () => {
    if (!canAdvance && progress < 80) {
      toast.info("Please finish this slide before moving to the next one");
      return;
    }
    
    if (currentSlideIndex < slides.length - 1) {
      onSlideChange(currentSlideIndex + 1);
    } else {
      // Last slide - mark course as complete
      onComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  };
  
  const handleSlideSelect = (index: number) => {
    // Only allow navigating to completed slides or the next available
    const maxAllowedIndex = Math.max(
      slides.findIndex(slide => !slide.completed),
      currentSlideIndex
    );
    
    if (index <= maxAllowedIndex) {
      onSlideChange(index);
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
  
  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Sidebar with slide navigation and subtitles */}
      <div className="lg:w-1/4 space-y-4">
        <SlideNavigation 
          slides={slides}
          currentIndex={currentSlideIndex}
          overallProgress={overallProgress}
          onSlideSelect={handleSlideSelect}
        />
        
        {/* Subtitles/Explanations Panel */}
        <AnimatePresence mode="wait">
          {showSubtitles && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-pink-100/50 dark:border-purple-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10 border-2 border-purple-200 dark:border-purple-900">
                    <AvatarImage src="/placeholder.svg" alt="Presenter" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-white">
                      P
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Virtual Presenter</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Personalized Explanation</p>
                  </div>
                </div>
                
                {isLoadingExplanations ? (
                  <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300">{currentSlide?.explanation || currentSlide?.content}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Main content area */}
      <div className="lg:w-3/4">
        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-pink-100/50 dark:border-purple-900/30 shadow-lg">
          <SlideContent
            title={currentSlide.title}
            content={currentSlide.content}
            currentIndex={currentSlideIndex}
            totalSlides={slides.length}
            progress={progress}
            isPlaying={isPlaying}
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
            showSubtitles={showSubtitles}
            toggleSubtitles={toggleSubtitles}
            canAdvance={canAdvance}
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
