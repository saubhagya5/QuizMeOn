"use client"; // Force this to be a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};
type QuizData = {
  title: string;
  difficulty: string;
}

const QUIZ_STORAGE_KEY = "quizData";
const USER_ANSWERS_KEY = "userAnswers";
const SCORE_STORAGE_KEY = "quizScore";

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizData, setQuizData] = useState<QuizData[]>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isFetched, setIsFetched] = useState(false);
  const router = useRouter();

  // Load quiz data and answers from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedQuiz = localStorage.getItem(QUIZ_STORAGE_KEY);
      const storedAnswers = localStorage.getItem(USER_ANSWERS_KEY)
  
      if (savedQuiz) {
        try {
          const parsedQuiz = JSON.parse(savedQuiz);
          setQuizData(parsedQuiz)
          console.log("Parsed quiz data:", parsedQuiz);
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
        

        if (storedAnswers) {
            try {
              const parsedAnswers = JSON.parse(storedAnswers);
              setUserAnswers(parsedAnswers);
            } catch (error) {
              console.error("Error parsing stored user answers:", error);
              localStorage.removeItem(USER_ANSWERS_KEY);
            }
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
      //setQuizData(parsedQuiz)
      //setQuiz(parsedQuiz.questions); // Ensure it's an array of questions
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  
      
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
    const storedAnswers = JSON.parse(localStorage.getItem(USER_ANSWERS_KEY) || "{}");
    let score = 0;
    quiz.forEach((q, index) => {
      console.log("Checking answer for question",storedAnswers, storedAnswers[index], q.correctAnswer);

      if (storedAnswers[index] === q.correctAnswer) {
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
    <div className="p-6 bg-[#F9DBBD] min-h-screen">
      <h1 className="text-3xl md:text-5xl text-[#450920] font-bold text-center">
        Quiz Me On
      </h1>
      <p className="text-lg md:text-xl font-semibold text-[#A53860] text-center mt-2">
        Quiz length: {quiz.length} | Difficulty: {quizData.difficulty}
      </p>
  
      <hr className="border-[#450920] border-x-2 border-y-2 my-4" />
  
      <h2 className="text-2xl md:text-3xl text-[#A53860] font-bold text-center mt-4">
        {quizData.title}
      </h2>
  
      <div className="flex flex-col items-center w-full p-4">
        {quiz.length > 0 ? (
          quiz.map((q, index) => (
            <div
              key={index}
              className="mt-6 p-5 border border-[#450920] shadow-2xl border-x-4 border-y-4 bg-[#FFA5AB] rounded-md w-full max-w-3xl"
            >
              <h2 className="font-semibold text-lg md:text-xl p-2 text-[#A53860]">
                {index + 1}. {q.question}
              </h2>
              <ul>
                {q.options.map((option, i) => (
                  <li key={i} className="mt-3">
                    <button
                      className={`w-full md:w-auto px-4 py-2 text-lg rounded-md block ${
                        userAnswers[index] === option
                          ? "bg-[#DA627D] border border-[#450920] text-white"
                          : "bg-[#A53860] text-white"
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
          <p className="text-center text-lg">Loading quiz...</p>
        )}
  
        {/* Buttons */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#A53860] text-lg text-white rounded-md w-full"
          >
            Submit Quiz
          </button>
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-[#A53860] text-lg text-white rounded-md w-full"
          >
            Reset Quiz
          </button>
        </div>
      </div>
    </div>
  );
  
  
}
