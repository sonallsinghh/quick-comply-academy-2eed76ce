import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideContentProps {
  title: string;
  content: string;
  currentIndex: number;
  totalSlides: number;
  progress: number;
  isPlaying: boolean;
  onSlideChange?: (newIndex: number) => void;
}

const SlideContent: React.FC<SlideContentProps> = ({
  title,
  content,
  currentIndex,
  totalSlides,
  progress,
  isPlaying,
  onSlideChange,
}) => {
  const [currentSlide, setCurrentSlide] = useState(currentIndex + 1);

  useEffect(() => {
    setCurrentSlide(currentIndex + 1);
  }, [currentIndex]);

  return (
    <>
      <div className="mb-4">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-serif uppercase tracking-wider dark:text-dark-text transition-colors duration-300"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-gray-500 dark:text-dark-secondaryText font-light"
        >
          Slide {currentSlide} of {totalSlides}
        </motion.p>
      </div>

      <div className="relative min-h-[500px] bg-white dark:bg-dark-midnight rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="relative">
              <img
                src={`/slides/slide-${currentSlide}.png`}
                alt={`Slide ${currentSlide}`}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Video progress indicator */}
        <div className="absolute bottom-0 left-0 w-full">
          <Progress
            value={progress}
            className="rounded-none h-1 transition-all duration-300 bg-gray-200 dark:bg-dark-charcoal"
          />
        </div>
      </div>
    </>
  );
};

export default SlideContent;
