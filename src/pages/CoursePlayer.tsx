
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import SlidePlayer from "@/components/course/SlidePlayer";
import AssessmentQuiz from "@/components/course/AssessmentQuiz";
import { toast } from "sonner";

// Mock data for course slides
const coursesSlides = {
  "1": [
    {
      id: "slide1",
      title: "Introduction to Data Privacy",
      content: "This course will cover the essential aspects of data privacy regulations including GDPR, CCPA, and industry best practices.",
      completed: false
    },
    {
      id: "slide2",
      title: "Key GDPR Requirements",
      content: "The General Data Protection Regulation (GDPR) is a comprehensive privacy law that protects EU citizens. Learn about its key requirements and how they affect your organization.",
      completed: false
    },
    {
      id: "slide3",
      title: "CCPA Compliance",
      content: "The California Consumer Privacy Act (CCPA) gives California residents specific rights regarding their personal information. This section explains what businesses need to do for compliance.",
      completed: false
    },
    {
      id: "slide4",
      title: "Data Subject Rights",
      content: "Under modern privacy laws, individuals have specific rights over their data. Learn how to handle data access, deletion, and portability requests.",
      completed: false
    },
    {
      id: "slide5",
      title: "Breach Notification Requirements",
      content: "In case of a data breach, there are specific notification requirements that organizations must follow. This section covers the timeframes and procedures for notification.",
      completed: false
    }
  ],
  "2": [
    {
      id: "slide1",
      title: "Why Information Security Matters",
      content: "Information security is critical for protecting your organization's data, reputation, and customer trust. This section explains the importance of security practices.",
      completed: false
    },
    {
      id: "slide2",
      title: "Password Best Practices",
      content: "Strong passwords are your first line of defense. Learn how to create and manage secure passwords to protect your accounts and sensitive information.",
      completed: false
    },
    {
      id: "slide3",
      title: "Recognizing Phishing Attempts",
      content: "Phishing is one of the most common attack vectors. This section teaches you how to identify and avoid falling victim to phishing attempts.",
      completed: false
    }
  ],
  "3": [
    {
      id: "slide1",
      title: "Understanding Harassment",
      content: "Workplace harassment can take many forms. This section defines what constitutes harassment and the impact it has on individuals and the workplace.",
      completed: false
    },
    {
      id: "slide2",
      title: "Types of Harassment",
      content: "Harassment can be verbal, physical, or visual. Learn about the different types of harassment that can occur in the workplace.",
      completed: false
    },
    {
      id: "slide3",
      title: "Preventing Harassment",
      content: "Prevention is key to maintaining a respectful workplace. This section covers strategies for preventing harassment before it occurs.",
      completed: false
    }
  ],
};

// Mock quiz data
const coursesQuizzes = {
  "1": [
    {
      id: "q1",
      question: "Which of the following is a key principle of GDPR?",
      options: [
        { id: "a", text: "Data should be collected without limitations" },
        { id: "b", text: "Purpose limitation - data collected for specified, explicit, legitimate purposes" },
        { id: "c", text: "Organizations can keep personal data indefinitely" },
        { id: "d", text: "Consent is not required for processing personal data" }
      ],
      correctOptionId: "b"
    },
    {
      id: "q2",
      question: "What is the maximum timeframe for reporting a data breach under GDPR?",
      options: [
        { id: "a", text: "72 hours" },
        { id: "b", text: "30 days" },
        { id: "c", text: "7 days" },
        { id: "d", text: "24 hours" }
      ],
      correctOptionId: "a"
    },
    {
      id: "q3",
      question: "Which of the following is NOT a data subject right under GDPR?",
      options: [
        { id: "a", text: "Right to access" },
        { id: "b", text: "Right to be forgotten" },
        { id: "c", text: "Right to data portability" },
        { id: "d", text: "Right to unlimited data storage" }
      ],
      correctOptionId: "d"
    },
    {
      id: "q4",
      question: "The California Consumer Privacy Act (CCPA) applies to businesses that:",
      options: [
        { id: "a", text: "Have at least one California customer" },
        { id: "b", text: "Have annual gross revenue exceeding $25 million" },
        { id: "c", text: "Are based in California only" },
        { id: "d", text: "Process any personal data" }
      ],
      correctOptionId: "b"
    },
    {
      id: "q5",
      question: "Which of the following is a best practice for handling personal data?",
      options: [
        { id: "a", text: "Collect as much data as possible for future use" },
        { id: "b", text: "Store data indefinitely for potential business needs" },
        { id: "c", text: "Minimize data collection to only what is necessary" },
        { id: "d", text: "Share data freely with third parties to maximize value" }
      ],
      correctOptionId: "c"
    }
  ],
  "2": [
    {
      id: "q1",
      question: "Which of the following is a secure password practice?",
      options: [
        { id: "a", text: "Using the same password across multiple accounts" },
        { id: "b", text: "Using a password manager to generate and store unique passwords" },
        { id: "c", text: "Writing down passwords on sticky notes" },
        { id: "d", text: "Using simple, easy-to-remember words" }
      ],
      correctOptionId: "b"
    },
    {
      id: "q2",
      question: "What is a common sign of a phishing email?",
      options: [
        { id: "a", text: "Coming from a known colleague's email address" },
        { id: "b", text: "Contains no links or attachments" },
        { id: "c", text: "Creates urgency or threatens negative consequences" },
        { id: "d", text: "Contains proper grammar and formatting" }
      ],
      correctOptionId: "c"
    },
    {
      id: "q3",
      question: "When working remotely, which of the following is a security best practice?",
      options: [
        { id: "a", text: "Using public WiFi without a VPN" },
        { id: "b", text: "Leaving your laptop unlocked when you step away" },
        { id: "c", text: "Using a secure VPN connection for company work" },
        { id: "d", text: "Sharing your work account credentials with family members" }
      ],
      correctOptionId: "c"
    }
  ],
  "3": [
    {
      id: "q1",
      question: "Which of the following behaviors could be considered workplace harassment?",
      options: [
        { id: "a", text: "Giving constructive feedback about work performance" },
        { id: "b", text: "Making unwelcome comments about a person's appearance" },
        { id: "c", text: "Declining a lunch invitation" },
        { id: "d", text: "Asking for clarification on a project requirement" }
      ],
      correctOptionId: "b"
    },
    {
      id: "q2",
      question: "What should you do if you witness harassment in the workplace?",
      options: [
        { id: "a", text: "Ignore it as it's not your business" },
        { id: "b", text: "Wait to see if it happens again before reporting" },
        { id: "c", text: "Report it to HR or through appropriate channels" },
        { id: "d", text: "Confront the harasser aggressively" }
      ],
      correctOptionId: "c"
    },
    {
      id: "q3",
      question: "Which of the following is an example of a bystander intervention technique?",
      options: [
        { id: "a", text: "Laughing along with inappropriate jokes" },
        { id: "b", text: "Direct intervention by saying, 'That's not appropriate'" },
        { id: "c", text: "Walking away from uncomfortable situations" },
        { id: "d", text: "Expecting someone else to address the situation" }
      ],
      correctOptionId: "b"
    }
  ]
};

const CoursePlayer = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [slides, setSlides] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [certificate, setCertificate] = useState<boolean>(false);
  
  useEffect(() => {
    // In a real app, this would be an API call to get course content
    if (courseId && coursesSlides[courseId as keyof typeof coursesSlides]) {
      setSlides(coursesSlides[courseId as keyof typeof coursesSlides]);
      setQuizQuestions(coursesQuizzes[courseId as keyof typeof coursesQuizzes]);
    }
  }, [courseId]);
  
  if (!slides.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-4">The course you're looking for doesn't exist or has been removed.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSlideChange = (index: number) => {
    // Mark previous slides as completed
    const updatedSlides = [...slides];
    for (let i = 0; i <= Math.min(currentSlideIndex, index); i++) {
      updatedSlides[i].completed = true;
    }
    
    setSlides(updatedSlides);
    setCurrentSlideIndex(index);
  };
  
  const handleCourseComplete = () => {
    // Mark all slides as completed
    const updatedSlides = slides.map(slide => ({ ...slide, completed: true }));
    setSlides(updatedSlides);
    setCourseCompleted(true);
    setShowQuiz(true);
    
    toast.success("Course content completed! Now take the assessment quiz.", {
      duration: 5000,
    });
  };
  
  const handleQuizComplete = (passed: boolean, score: number) => {
    setQuizCompleted(true);
    setCertificate(passed);
    
    if (passed) {
      toast.success(`Congratulations! You passed with a score of ${score}%`, {
        duration: 5000,
      });
    } else {
      toast.error(`You scored ${score}%. 70% is required to pass. Try again.`, {
        duration: 5000,
      });
    }
  };
  
  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/course/${courseId}`} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-semibold truncate">
              {courseId === "1" ? "Data Privacy Compliance" : 
               courseId === "2" ? "Information Security Basics" :
               "Anti-Harassment Training"}
            </h1>
          </div>
          <Button variant="outline" onClick={handleReturnToDashboard}>
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </div>
      
      <main className="flex-grow pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {!showQuiz ? (
            <SlidePlayer
              slides={slides}
              currentSlideIndex={currentSlideIndex}
              onSlideChange={handleSlideChange}
              onComplete={handleCourseComplete}
            />
          ) : !quizCompleted ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Assessment Quiz</h2>
              <p className="text-center mb-8 text-gray-600">
                Complete the quiz with a score of at least 70% to receive your certificate.
              </p>
              <AssessmentQuiz
                questions={quizQuestions} 
                passingScore={70}
                onComplete={handleQuizComplete}
              />
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              {certificate ? (
                <div className="border-8 border-complybrand-200 p-8 bg-white shadow-lg">
                  <h2 className="text-3xl font-bold text-complybrand-800 mb-6">Certificate of Completion</h2>
                  <p className="text-xl mb-8">This certifies that</p>
                  <p className="text-2xl font-bold mb-8">Alex Johnson</p>
                  <p className="text-xl mb-8">has successfully completed the course</p>
                  <p className="text-2xl font-bold text-complybrand-700 mb-8">
                    {courseId === "1" ? "Data Privacy Compliance" : 
                     courseId === "2" ? "Information Security Basics" :
                     "Anti-Harassment Training"}
                  </p>
                  <p className="text-lg mb-4">Issue Date: April 9, 2025</p>
                  <div className="mt-12 border-t border-gray-200 pt-4">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Signature.png" 
                      alt="Signature" 
                      className="h-12 mx-auto mb-2" 
                    />
                    <p className="font-medium">Jennifer Wilson</p>
                    <p className="text-sm text-gray-500">Course Instructor</p>
                  </div>
                  
                  <div className="mt-8">
                    <Button
                      onClick={handleReturnToDashboard}
                      className="bg-complybrand-700 hover:bg-complybrand-800"
                    >
                      Return to Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-white shadow-lg border rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    You didn't pass the assessment
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Don't worry! You can review the course content and try the quiz again.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => {
                        setShowQuiz(false);
                        setCurrentSlideIndex(0);
                        setQuizCompleted(false);
                      }}
                      variant="outline"
                    >
                      Review Course
                    </Button>
                    <Button
                      onClick={() => {
                        setQuizCompleted(false);
                      }}
                      className="bg-complybrand-700 hover:bg-complybrand-800"
                    >
                      Try Quiz Again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
