import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle2, XCircle } from 'lucide-react';
import Certificate from '@/components/course/Certificate';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

const QuizResults = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const storedResults = localStorage.getItem('quizResults');
    const storedCourseName = localStorage.getItem(`course_name_${courseId}`);
    
    console.log('Stored results:', storedResults);
    
    if (storedResults) {
      try {
        const parsedResults = JSON.parse(storedResults);
        console.log('Parsed results:', parsedResults);
        console.log('Number of questions:', parsedResults.length);
        
        setResults(parsedResults);
        setCourseName(storedCourseName || 'Course');
        
        // Calculate score
        const correctAnswers = parsedResults.filter((result: QuizResult) => result.isCorrect).length;
        const totalQuestions = parsedResults.length;
        const calculatedScore = (correctAnswers / totalQuestions) * 100;
        
        console.log('Score calculation:', {
          correctAnswers,
          totalQuestions,
          calculatedScore
        });
        
        setScore(calculatedScore);
      } catch (error) {
        console.error('Error parsing results:', error);
      }
    } else {
      console.log('No stored results found');
    }
    setLoading(false);
  }, [courseId]);

  const handleReturnToDashboard = () => {
    // Clear the results from localStorage when returning to dashboard
    localStorage.removeItem('quizResults');
    localStorage.removeItem('currentQuiz');
    navigate('/dashboard');
  };

  const handleTryAgain = () => {
    // Keep the currentQuiz but clear the results
    localStorage.removeItem('quizResults');
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-[90%] max-w-md">
          <CardHeader>
            <CardTitle className="text-center">No Results Found</CardTitle>
            <CardDescription className="text-center">
              We couldn't find any quiz results. Please try taking the quiz again.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleReturnToDashboard}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Score Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Quiz Results</CardTitle>
              <CardDescription className="text-center">
                {score >= 70 ? 'Congratulations! You passed the quiz.' : 'You can try again to improve your score.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{score.toFixed(0)}%</div>
                  <Progress value={score} className="h-2" />
                  <div className="mt-2 text-sm text-muted-foreground">
                    {score >= 70 ? (
                      <div className="flex items-center justify-center text-green-600">
                        <Award className="w-5 h-5 mr-2" />
                        Passed
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-red-600">
                        <XCircle className="w-5 h-5 mr-2" />
                        Not Passed
                      </div>
                    )}
                  </div>
                </div>

                {/* Results Summary */}
                <div className="text-center space-y-2">
                  <p>Total Questions: {results.length}</p>
                  <p>Correct Answers: {results.filter(r => r.isCorrect).length}</p>
                  <p>Incorrect Answers: {results.filter(r => !r.isCorrect).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Section */}
          {score >= 70 && (
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-center">Your Certificate</CardTitle>
                <CardDescription className="text-center">
                  Download your certificate of completion below
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Certificate
                  courseName={courseName}
                  completionDate={new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  score={score}
                />
              </CardContent>
            </Card>
          )}

          {/* Results Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={index} className={`p-4 ${result.isCorrect ? 'bg-green-50/50 dark:bg-green-900/20' : 'bg-red-50/50 dark:bg-red-900/20'}`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {result.isCorrect ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">Question {index + 1}: {result.question}</h3>
                        <div className="text-sm space-y-1">
                          <p className={`${result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            Your answer: {result.userAnswer}
                          </p>
                          {!result.isCorrect && (
                            <p className="text-green-600 dark:text-green-400">
                              Correct answer: {result.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              variant="default"
              onClick={handleReturnToDashboard}
              className="bg-primary hover:bg-primary/90"
            >
              Return to Dashboard
            </Button>
            {score < 70 && (
              <Button 
                variant="outline"
                onClick={handleTryAgain}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default QuizResults; 