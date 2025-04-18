import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import SlideControls from "./SlideControls";
import SlideNavigation from "./SlideNavigation";
import SlideContent from "./SlideContent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';

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
  explanations: Record<string, string>;
  isLoadingExplanations: boolean;
}

const SlidePlayer = ({
  slides,
  currentSlideIndex,
  onSlideChange,
  onComplete,
  explanations,
  isLoadingExplanations,
}: SlidePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [canAdvance, setCanAdvance] = useState(false);
  const progressTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  
  const currentSlide = slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === slides.length - 1;
  const isFirstSlide = currentSlideIndex === 0;
  const totalCompleted = slides.filter(slide => slide.completed).length;
  const overallProgress = (totalCompleted / slides.length) * 100;
  
  // Initialize audio element
  useEffect(() => {
    // Create an audio element for the narration
    audioRef.current = new Audio();
    audioRef.current.volume = volume / 100;
    
    // In a real implementation, this would be the URL to the audio file for the current slide
    // For now, we'll simulate it
    // audioRef.current.src = `https://example.com/audio/slide-${currentSlideIndex}.mp3`;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
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
    
    // In a real implementation, update the audio source for the new slide
    // if (audioRef.current) {
    //   audioRef.current.src = `https://example.com/audio/slide-${currentSlideIndex}.mp3`;
    //   audioRef.current.load();
    // }
  }, [currentSlideIndex]);
  
  // Update audio volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);
  
  // Simulate playback - in a real app, this would sync with actual audio/video
  useEffect(() => {
    if (isPlaying) {
      // Start audio playback in a real implementation
      // if (audioRef.current) audioRef.current.play();
      
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
            // if (audioRef.current) audioRef.current.pause();
            if (progressTimerRef.current) {
              window.clearInterval(progressTimerRef.current);
            }
            return 100;
          }
          
          return nextProgress;
        });
      }, 100) as unknown as number;
    } else {
      // Pause audio in a real implementation
      // if (audioRef.current) audioRef.current.pause();
      
      // Stop progress timer if not playing
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }
    
    // Clean up timer on unmount
    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, playbackRate, canAdvance]);
  
  // Update playback rate
  useEffect(() => {
    // In a real implementation, update audio playbackRate
    // if (audioRef.current) {
    //   audioRef.current.playbackRate = playbackRate;
    // }
  }, [playbackRate]);
  
  // Simulating playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleComplete = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId');

      console.log('Parameters check:', {
        courseId,
        tenantId,
        searchParams: Object.fromEntries(searchParams.entries())
      });

      if (!courseId || !tenantId) {
        throw new Error(`Missing required parameters. CourseId: ${courseId}, TenantId: ${tenantId}`);
      }

      // Get the material URL from localStorage
      const storedMaterialUrl = localStorage.getItem(`course_material_${courseId}`);
      let s3Url;

      if (!storedMaterialUrl) {
        console.log('Material URL not found in localStorage, fetching from API...');
        // If not in localStorage, fetch it
        const materialResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseId}/chatbot-material?tenantId=${tenantId}`
        );

        if (!materialResponse.ok) {
          const errorText = await materialResponse.text();
          console.error('Material URL fetch failed:', {
            status: materialResponse.status,
            statusText: materialResponse.statusText,
            errorText
          });
          throw new Error(`Failed to fetch course material URL: ${materialResponse.status} ${materialResponse.statusText}`);
        }

        const materialData = await materialResponse.json();
        s3Url = materialData.materialUrl;
        
        if (!s3Url) {
          throw new Error('Material URL is empty in the response');
        }

        // Store it for future use
        localStorage.setItem(`course_material_${courseId}`, s3Url);
        console.log('Stored material URL in localStorage:', s3Url);
      } else {
        console.log('Using material URL from localStorage:', storedMaterialUrl);
        s3Url = storedMaterialUrl;
      }

      // Generate MCQs using the AI service
      console.log('Sending request to AI service with URL:', s3Url);
      const mcqResponse = await fetch(`${import.meta.env.VITE_AI_SERVICE_URL}/generate_mcq`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          s3_url: s3Url,
          course_id: courseId,
          tenant_id: tenantId
        })
      });

      if (!mcqResponse.ok) {
        const errorText = await mcqResponse.text();
        console.error('MCQ generation failed:', {
          status: mcqResponse.status,
          statusText: mcqResponse.statusText,
          errorText,
          url: `${import.meta.env.VITE_AI_SERVICE_URL}/generate_mcq`
        });
        throw new Error('Failed to generate MCQs');
      }

      const mcqData = await mcqResponse.json();
      console.log('Generated MCQs:', mcqData);
      
      if (!mcqData.mcqs || !Array.isArray(mcqData.mcqs)) {
        throw new Error('Invalid MCQ data received');
      }

      // Store MCQ data in localStorage for the quiz page
      localStorage.setItem('currentQuiz', JSON.stringify(mcqData.mcqs));

      // Call the original onComplete handler
      await onComplete();

      // Navigate to the quiz page
      window.location.href = `/dashboard/course/${courseId}/quiz?tenantId=${tenantId}`;
    } catch (error) {
      console.error('Error preparing quiz:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to prepare quiz. Please try again.');
    }
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
      handleComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      onSlideChange(currentSlideIndex - 1);
    }
  };
  
  const handleSlideSelect = (index: number) => {
    // Allow navigating to completed slides or the next available
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
                    <p className="text-gray-700 dark:text-gray-300">{explanations[currentSlide.id] || currentSlide.content}</p>
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
            onComplete={handleComplete}
            showSubtitles={showSubtitles}
            toggleSubtitles={toggleSubtitles}
            canAdvance={canAdvance}
          />
        </Card>
      </div>
    </div>
  );
};

export default SlidePlayer;
