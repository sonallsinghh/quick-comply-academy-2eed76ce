
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SuperUserDashboard from "./pages/SuperUserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import CoursePlayer from "./pages/CoursePlayer";
import CourseDetails from "./pages/CourseDetails";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import { useState } from "react";
import { ThemeProvider } from "next-themes";

// Mock authentication for demonstration purposes
// In a real app, we'd use proper authentication like Auth0, Clerk, or Supabase
export type UserRole = "superuser" | "admin" | "employee" | null;

const queryClient = new QueryClient();

const App = () => {
  // Mock auth state - in a real app, this would use proper auth context
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index setUserRole={setUserRole} />} />
              <Route path="/superuser/dashboard" element={<SuperUserDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
              <Route path="/course/:courseId/play" element={<CoursePlayer />} />
              <Route path="/course/:courseId/quiz" element={<QuizPage />} />
              <Route path="/course/:courseId/result" element={<ResultPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
