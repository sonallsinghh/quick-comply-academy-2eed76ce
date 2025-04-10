
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SlideContentProps {
  title: string;
  content: string;
  currentIndex: number;
  totalSlides: number;
  progress: number;
  isPlaying: boolean;
}

const SlideContent: React.FC<SlideContentProps> = ({ 
  title, 
  content, 
  currentIndex, 
  totalSlides,
  progress,
  isPlaying
}) => {
  return (
    <>
      <div className="mb-4">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold dark:text-white transition-colors duration-300"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-gray-500 dark:text-gray-400"
        >
          Slide {currentIndex + 1} of {totalSlides}
        </motion.p>
      </div>
      
      {/* Slide content - simulated PPT slide */}
      <div className="aspect-video bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-purple-900/30 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 hover:shadow-md border border-pink-100/50 dark:border-purple-900/30">
        <motion.div 
          key={`slide-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center p-8 w-full h-full flex flex-col items-center justify-center"
        >
          <p className="text-xl font-medium dark:text-gray-200 transition-colors duration-300 mb-4">{title}</p>
          <p className="text-gray-700 dark:text-gray-300">{content}</p>
          
          {/* Presenter avatar - positioned at bottom right */}
          <div className="absolute bottom-4 right-4">
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-700 shadow-lg">
                    <AvatarImage src="/placeholder.svg" alt="Presenter" />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-600 text-white text-lg">
                      P
                    </AvatarFallback>
                  </Avatar>
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2
                    }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Video progress indicator */}
        <div className="absolute bottom-0 left-0 w-full">
          <Progress value={progress} className="rounded-none h-1 transition-all duration-300 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </>
  );
};

export default SlideContent;
