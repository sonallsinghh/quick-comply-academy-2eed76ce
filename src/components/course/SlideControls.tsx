
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  onComplete
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={isFirstSlide}>
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => changePlaybackRate(1)} 
            className={playbackRate === 1 ? "bg-gray-100" : ""}
          >
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
        <Button variant="outline" onClick={handlePrev} disabled={isFirstSlide}>
          Previous Slide
        </Button>
        <Button 
          onClick={isLastSlide ? onComplete : handleNext} 
          className="bg-complybrand-700 hover:bg-complybrand-800"
        >
          {isLastSlide ? "Complete Course" : "Next Slide"}
        </Button>
      </div>
    </div>
  );
};

export default SlideControls;
