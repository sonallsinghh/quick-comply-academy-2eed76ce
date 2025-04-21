import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface MCQ {
  question: string;
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
}

const Quiz = () => {
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    // Load MCQs from localStorage
    const savedMcqs = localStorage.getItem('currentQuiz');
    if (savedMcqs) {
      const parsedMcqs = JSON.parse(savedMcqs);
      console.log('Loaded MCQs:', parsedMcqs);
      setMcqs(parsedMcqs);
    } else {
      toast.error('Quiz data not found');
      navigate(`/course/${courseId}`);
    }
  }, [courseId, navigate]);

  const handleAnswer = (value: string) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [currentQuestion]: value
      };
      console.log('Current answers:', newAnswers);
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Ensure we have all answers
      if (Object.keys(answers).length !== mcqs.length) {
        toast.error('Please answer all questions before submitting');
        return;
      }

      console.log('Submitting quiz with answers:', answers);
      console.log('Total MCQs:', mcqs.length);

      // Calculate results
      const results = mcqs.map((question, index) => {
        const result = {
          question: question.question,
          userAnswer: answers[index] || 'Not answered',
          correctAnswer: question.correctAnswer,
          isCorrect: answers[index] === question.correctAnswer
        };
        console.log(`Question ${index + 1} result:`, result);
        return result;
      });

      console.log('Final results:', results);

      // Store results in localStorage
      localStorage.setItem('quizResults', JSON.stringify(results));

      // Navigate to results page
      navigate('/quiz-results');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz. Please try again.');
    }
  };

  if (mcqs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Loading quiz...</h2>
            <p className="text-gray-500">Please wait while we prepare your questions.</p>
          </div>
        </Card>
      </div>
    );
  }

  const currentMcq = mcqs[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Assessment Quiz</h1>
          <p className="text-gray-500">Complete the quiz with a score of at least 70% to receive your certificate.</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Question {currentQuestion + 1}</h2>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} of {mcqs.length} questions
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-lg mb-4">{currentMcq.question}</p>
            
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {Object.entries(currentMcq.choices).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={`option-${key}`} />
                  <Label htmlFor={`option-${key}`} className="text-base">
                    {value}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          {currentQuestion < mcqs.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion]}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== mcqs.length}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Quiz
            </Button>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          <div className="flex gap-2">
            {mcqs.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  answers[index]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Quiz; 