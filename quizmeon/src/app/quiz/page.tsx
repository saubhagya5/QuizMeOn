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
      console.log("Saved quiz in localStorage:", savedQuiz);
  
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
      console.log("Checking answer for question", storedAnswers[index], q.answer);

      if (storedAnswers[index] === q.answer) {
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
    <div className="p-6 bg-[#F9DBBD]">
      <h1 className="text-5xl  text-[#450920] font-bold text-center">Quiz Me On</h1>
      <p className="text-lg font-semibold text-[#A53860] text-center ">Quiz length: {quiz.length}  Difficulty: {quizData.difficulty} </p>
      <br />
      <hr className="border-[#450920] border-x-2 border-y-2 " />
      
      <br />
      
      <h2 className="text-3xl text-[#A53860] font-bold text-center"> {quizData.title}</h2>
      
      <div className="flex flex-col text-[#450920] items-center w-1/24 p-6 rounded-md">
      {quiz.length > 0 ? (
        quiz.map((q, index) => (
          <div key={index} className="mt-6 p-5 border border-[#450920] shadow-2xl border-x-4 border-y-4 bg-[#FFA5AB] rounded-md   w-[700px]">
           <h2 className="font-semibold text-xl p-2">{index+1}. {q.question}</h2>
            <ul className="">
              {q.options.map((option, i) => (
                <li key={i} className="mt-4 flex gap-3 ">
                  {/* <span>{i + 1}</span> */}
                  <button
                    className={`px-4 py-2  text-lg rounded-md ${
                      userAnswers[index] === option
                        ? "bg-[#DA627D] border border-[#450920] border-x-2 border-y-2 text-white"
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
        <p>Loading quiz... </p>
        )}
        <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#A53860] text-lg text-white rounded-md"
        >
          Submit Quiz
        </button>
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-[#A53860] text-lg text-white rounded-md"
        >
          Reset Quiz
        </button>
      </div>
    </div>
  </div>
      
  );
  
}
