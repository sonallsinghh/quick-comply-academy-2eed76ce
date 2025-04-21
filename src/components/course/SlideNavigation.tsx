import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Slide {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface SlideNavigationProps {
  slides: Slide[];
  currentIndex: number;
  overallProgress: number;
  onSlideSelect: (index: number) => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  slides,
  currentIndex,
  overallProgress,
  onSlideSelect,
}) => {
  return (
    <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
      <h3 className="font-medium text-lg mb-4 dark:text-gray-200">
        Course Content
      </h3>
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Overall Progress
          </span>
          <span className="text-sm font-medium dark:text-gray-300">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <Progress value={overallProgress} />
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-1 pr-4">
          {slides.map((slide, index) => {
            // Determine if this slide is accessible
            const isCompleted = slide.completed;
            const isCurrent = index === currentIndex;
            const isAccessible =
              index <= slides.findIndex((s) => !s.completed) || isCompleted;

            return (
              <button
                key={slide.id}
                onClick={() => onSlideSelect(index)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm flex items-center ${
                  isCurrent
                    ? "bg-complybrand-700 text-white"
                    : isAccessible
                    ? "hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isAccessible}
              >
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full text-xs mr-2 ${
                    isCurrent
                      ? "bg-white bg-opacity-10"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 truncate dark:text-gray-300">
                  {slide.title}
                </div>
                {isCompleted && (
                  <div className="ml-2 w-2 h-2 rounded-full bg-green-500"></div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default SlideNavigation;
