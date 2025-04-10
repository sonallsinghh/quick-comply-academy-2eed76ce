
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Subtitles,
  SubtitlesOff
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SlideControlsProps {
  isPlaying: boolean;
  togglePlayback: () => void;
  handlePrev: () => void;
  handleNext: () => void;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  handleVolumeChange: (value: number[]) => void;
  playbackRate: number;
  changePlaybackRate: (rate: number) => void;
  onComplete: () => void;
  showSubtitles: boolean;
  toggleSubtitles: () => void;
  canAdvance: boolean;
}

const SlideControls: React.FC<SlideControlsProps> = ({
  isPlaying,
  togglePlayback,
  handlePrev,
  handleNext,
  isFirstSlide,
  isLastSlide,
  isMuted,
  toggleMute,
  volume,
  handleVolumeChange,
  playbackRate,
  changePlaybackRate,
  onComplete,
  showSubtitles,
  toggleSubtitles,
  canAdvance
}) => {
  const handleNextClick = () => {
    if (!canAdvance) {
      toast.info("Please watch more of this slide before moving to the next one");
      return;
    }
    handleNext();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={isFirstSlide}
            className="border border-pink-100/50 dark:border-purple-900/30 hover:bg-pink-50 dark:hover:bg-purple-900/30">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={togglePlayback}
            className="border border-pink-100/50 dark:border-purple-900/30 hover:bg-pink-50 dark:hover:bg-purple-900/30"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleNextClick}
            disabled={!canAdvance}
            className="border border-pink-100/50 dark:border-purple-900/30 hover:bg-pink-50 dark:hover:bg-purple-900/30"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleSubtitles}
            className="border border-pink-100/50 dark:border-purple-900/30 hover:bg-pink-50 dark:hover:bg-purple-900/30 ml-2"
          >
            {showSubtitles ? (
              <Subtitles className="h-4 w-4" />
            ) : (
              <SubtitlesOff className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-1">
          <Button 
            variant={playbackRate === 0.5 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => changePlaybackRate(0.5)}
            className={playbackRate === 0.5 ? "bg-pink-100 dark:bg-purple-900/50" : ""}
          >
            0.5x
          </Button>
          <Button 
            variant={playbackRate === 1 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => changePlaybackRate(1)} 
            className={playbackRate === 1 ? "bg-pink-100 dark:bg-purple-900/50" : ""}
          >
            1x
          </Button>
          <Button 
            variant={playbackRate === 1.5 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => changePlaybackRate(1.5)} 
            className={playbackRate === 1.5 ? "bg-pink-100 dark:bg-purple-900/50" : ""}
          >
            1.5x
          </Button>
          <Button 
            variant={playbackRate === 2 ? "secondary" : "ghost"} 
            size="sm" 
            onClick={() => changePlaybackRate(2)} 
            className={playbackRate === 2 ? "bg-pink-100 dark:bg-purple-900/50" : ""}
          >
            2x
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 w-32">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMute}
          >
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
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={isFirstSlide}
          className="border-pink-200 dark:border-purple-900/30"
        >
          Previous Slide
        </Button>
        
        <motion.div
          whileHover={{ scale: canAdvance ? 1.05 : 1 }}
          whileTap={{ scale: canAdvance ? 0.95 : 1 }}
        >
          <Button 
            onClick={isLastSlide ? onComplete : handleNextClick}
            disabled={!canAdvance}
            className={`bg-gradient-to-r ${canAdvance ? 
              'from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' : 
              'from-gray-400 to-gray-500'} text-white shadow-md`}
          >
            {isLastSlide ? "Complete Course" : "Next Slide"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideControls;
