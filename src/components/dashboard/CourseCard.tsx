import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Book, Users, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  enrolledCount?: number;
  progress?: number;
  userRole: "superuser" | "admin" | "employee";
  materialUrl?: string;
}

const CourseCard = ({ 
  id, 
  title, 
  description, 
  duration, 
  enrolledCount, 
  progress = 0,
  userRole,
  materialUrl 
}: CourseCardProps) => {
  const navigate = useNavigate();

  const handleStartCourse = async () => {
    try {
      const tenantId = localStorage.getItem('tenantId');
      if (!tenantId) {
        toast.error('No tenant ID found. Please log in again.');
        return;
      }

      console.log('Starting course with:', { courseId: id, tenantId });

      // First, try to get existing explanations
      const storedExplanations = localStorage.getItem(`course-${id}-explanations`);
      if (storedExplanations) {
        console.log('Found existing explanations in localStorage');
        navigate(`/course/${id}/play`, { state: { materialUrl } });
        return;
      }

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 10000); // 10 second timeout
      });

      // Call the process-slides endpoint with timeout
      console.log('Calling process-slides endpoint...');
      const responsePromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${id}/process-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ tenantId }),
      });

      // Race between the fetch and timeout
      const response = await Promise.race([responsePromise, timeoutPromise]);
      
      if (!response || !('ok' in response)) {
        throw new Error('Request timed out or failed');
      }

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
          courseId: id,
          tenantId
        });
        
        // If we have explanations in the error response, try to use them
        if (errorData?.explanations) {
          console.log('Found explanations in error response, proceeding...');
          localStorage.setItem(`course-${id}-explanations`, JSON.stringify(errorData.explanations));
          navigate(`/course/${id}/play`, { state: { materialUrl } });
          return;
        }
        
        throw new Error(errorData?.message || 'Failed to process slides');
      }

      const data = await response.json();
      console.log('Process slides response:', data);
      
      // Store the explanations in localStorage for use in the course player
      if (data.explanations) {
        localStorage.setItem(`course-${id}-explanations`, JSON.stringify(data.explanations));
      }
      
      // Navigate to the course player
      navigate(`/course/${id}/play`, { state: { materialUrl } });
    } catch (error) {
      console.error('Error starting course:', error);
      // If we have the material URL, we can still proceed to the course player
      if (materialUrl) {
        console.log('Proceeding to course player despite error...');
        // Create mock explanations if none exist
        if (!localStorage.getItem(`course-${id}-explanations`)) {
          const mockExplanations = [
            {
              slideNumber: 1,
              content: "Loading content...",
              explanation: "Please wait while the content is being processed."
            }
          ];
          localStorage.setItem(`course-${id}-explanations`, JSON.stringify(mockExplanations));
        }
        navigate(`/course/${id}/play`, { state: { materialUrl } });
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to start course. Please try again.');
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-card/50 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>{duration}</span>
            </div>
            {enrolledCount !== undefined && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-gray-500" />
                <span>{enrolledCount} enrolled</span>
              </div>
            )}
          </div>
          
          {userRole === "employee" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {userRole === "employee" && (
          <Button 
            className="w-full bg-complybrand-700 hover:bg-complybrand-800 text-white"
            onClick={handleStartCourse}
          >
            {progress === 0 ? "Start Course" : progress === 100 ? "Review Course" : "Continue Course"}
          </Button>
        )}
        {userRole === "admin" && (
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        )}
        {userRole === "superuser" && (
          <Button variant="outline" className="w-full">
            Manage Course
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
