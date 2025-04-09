
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  courseId: string;
  onReturnToDashboard: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ courseId, onReturnToDashboard }) => {
  const getCourseName = (courseId: string) => {
    switch (courseId) {
      case "1":
        return "Data Privacy Compliance";
      case "2":
        return "Information Security Basics";
      case "3":
        return "Anti-Harassment Training";
      default:
        return "Course";
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to={`/course/${courseId}`} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold truncate">{getCourseName(courseId)}</h1>
        </div>
        <Button variant="outline" onClick={onReturnToDashboard}>
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>
    </div>
  );
};

export default CourseHeader;
