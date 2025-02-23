"use client"; // Force this to be a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const QUIZ_STORAGE_KEY = "quizData";
const USER_ANSWERS_KEY = "userAnswers";
const SCORE_STORAGE_KEY = "quizScore";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const router = useRouter();

  // Load quiz data and answers from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuiz = localStorage.getItem(QUIZ_STORAGE_KEY);
      console.log("Saved quiz in localStorage:", savedQuiz);
  
      if (savedQuiz) {
        try {
          const parsedQuiz = JSON.parse(savedQuiz);
  
          setQuiz(parsedQuiz.questions); // Ensure it's an array of questions
  
          
        } catch (error) {
          console.error("Error parsing stored quiz data:", error);
          localStorage.removeItem(QUIZ_STORAGE_KEY);
          fetchQuiz();
        }
      } else {
        console.log("No quiz found in storage. Fetching...");
        fetchQuiz();
      }
    }
  }, []);

  
  

  const fetchQuiz = async () => {
    try {
      console.log("Fetching quiz...");
      const response = await fetch("/api/quiz");
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data: QuizQuestion[] = await response.json();
      console.log("Fetched quiz data:", data);
  
      if (data.length === 0) {
        console.warn("Fetched quiz data is empty.");
        return;
      }
  
      setQuiz(parsedQuiz.questions); // Ensure it's an array of questions
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  
      // Confirm state update
      setTimeout(() => {
        console.log("Quiz after fetch:", quiz);
      }, 1000);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    }
  };
  
  

  const handleAnswerSelect = (questionIndex: number, selectedOption: string) => {
    const updatedAnswers = { ...userAnswers, [questionIndex]: selectedOption };
    setUserAnswers(updatedAnswers);
    localStorage.setItem(USER_ANSWERS_KEY, JSON.stringify(updatedAnswers));
  };

  const handleSubmit = () => {
    let score = 0;

    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
    router.push("/score");
  };

  const resetQuiz = () => {
    localStorage.removeItem(QUIZ_STORAGE_KEY);
    localStorage.removeItem(USER_ANSWERS_KEY);
    localStorage.removeItem(SCORE_STORAGE_KEY);
    setUserAnswers({});
    fetchQuiz();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center w-full">Quiz</h1>
      <p>Quiz length: {quiz.length}</p> {/* Debugging line */}
      {quiz.length > 0 ? (
        quiz.map((q, index) => (
          <div key={index} className="mt-6 p-5 border rounded-md shadow-md">
            <h2 className="font-semibold p-2">{q.question}</h2>
            <ul className="w-[200px]">
              {q.options.map((option, i) => (
                <li key={i} className="mt-4 flex gap-3 items-center">
                  <span>{i + 1}</span>
                  <button
                    className={`px-4 py-2 rounded-md ${
                      userAnswers[index] === option
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                    onClick={() => handleAnswerSelect(index, option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>Loading quiz... (Debug: {JSON.stringify(quiz)})</p>
      )}
  
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Submit Quiz
        </button>
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Reset Quiz
        </button>
      </div>
    </div>
  );
  
}
