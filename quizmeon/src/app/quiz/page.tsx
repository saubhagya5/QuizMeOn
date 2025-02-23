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
  const router = useRouter();

  // Load quiz data and answers from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuiz = localStorage.getItem(QUIZ_STORAGE_KEY);
      const savedAnswers = localStorage.getItem(USER_ANSWERS_KEY);

      if (savedQuiz) {
        try {
          setQuiz(JSON.parse(savedQuiz));
        } catch (error) {
          console.error("Error parsing stored quiz data:", error);
          localStorage.removeItem(QUIZ_STORAGE_KEY);
          fetchQuiz();
        }
      } else {
        fetchQuiz();
      }

      if (savedAnswers) {
        try {
          setUserAnswers(JSON.parse(savedAnswers));
        } catch (error) {
          console.error("Error parsing stored user answers:", error);
          localStorage.removeItem(USER_ANSWERS_KEY);
        }
      }
    }
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await fetch("/api/quiz");
      const data: QuizQuestion[] = await response.json();
      setQuiz(data);
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    }
  };

  const handleAnswerSelect = (questionIndex: number, selectedOption: string) => {
    const updatedAnswers = {
      ...userAnswers,
      [questionIndex]: selectedOption,
    };

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
      <h1 className="text-2xl font-bold">Quiz</h1>
      {quiz.length > 0 ? (
        quiz.map((q, index) => (
          <div key={index} className="mt-4 p-4 border rounded-md shadow-md">
            <h2 className="font-semibold">{q.question}</h2>
            <ul>
              {q.options.map((option, i) => (
                <li key={i} className="mt-2">
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
        <p>Loading quiz...</p>
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
