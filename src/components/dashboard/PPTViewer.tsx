import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PPTViewerProps {
  materialUrl: string;
  explanations: Array<{
    slide: number;
    explanation: string;
  }>;
  onClose: () => void;
}

const PPTViewer: React.FC<PPTViewerProps> = ({ materialUrl, explanations, onClose }) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const loadPPT = async () => {
      try {
        setIsLoading(true);
        // For now, we'll just show a placeholder image
        // In production, you'll need to implement actual PPT processing
        setSlides([materialUrl]);
        setTotalSlides(10); // This should come from the actual PPT
      } catch (error) {
        console.error('Error loading PPT:', error);
        toast.error('Failed to load presentation');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPPT();
  }, [materialUrl]);

  const handlePlayAudio = async () => {
    if (!explanations[currentSlide]) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: explanations[currentSlide].explanation
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      setIsPlaying(true);
      
      if (audioRef.current) {
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast.error('Failed to generate audio explanation');
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handlePrevious = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Loading Presentation</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-complybrand-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Presentation Viewer</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <img 
                src={slides[currentSlide]} 
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <Button 
                onClick={handlePrevious}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                Slide {currentSlide + 1} of {totalSlides}
              </span>
              <Button 
                onClick={handleNext}
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-4">
              <Button 
                onClick={isPlaying ? handlePauseAudio : handlePlayAudio}
                disabled={!explanations[currentSlide]}
                className="w-full"
              >
                {isPlaying ? 'Pause' : 'Play'} Explanation
              </Button>
              {audioUrl && (
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                />
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Explanation</h3>
              <p className="text-sm text-gray-600">
                {explanations[currentSlide]?.explanation || 'No explanation available for this slide'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PPTViewer; 