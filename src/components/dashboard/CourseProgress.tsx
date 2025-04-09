
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CourseProgressProps {
  courseName: string;
  progress: number;
  slidesCompleted: number;
  totalSlides: number;
  quizScore?: number | null;
  certificateIssued: boolean;
}

const CourseProgress = ({
  courseName,
  progress,
  slidesCompleted,
  totalSlides,
  quizScore,
  certificateIssued,
}: CourseProgressProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-complybrand-500";
  };

  const getStatusBadge = () => {
    if (certificateIssued) {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Certified
        </Badge>
      );
    }
    
    if (progress === 100) {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          Completed
        </Badge>
      );
    }
    
    if (progress > 0) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
          In Progress
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline">
        Not Started
      </Badge>
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="font-medium">{courseName}</h3>
        {getStatusBadge()}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Course Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress 
          value={progress} 
          className={`h-2 ${getProgressColor(progress)}`} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Slides Completed</p>
          <p className="font-medium">
            {slidesCompleted} / {totalSlides}
          </p>
        </div>
        
        <div>
          <p className="text-gray-500">Quiz Score</p>
          <p className="font-medium">
            {quizScore !== null && quizScore !== undefined 
              ? `${quizScore}%` 
              : 'Not taken'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
