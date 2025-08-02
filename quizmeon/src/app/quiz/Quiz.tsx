"use client";

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
};

const USER_ANSWERS_KEY = "userAnswers";
const SCORE_STORAGE_KEY = "quizScore";

type QuizProps = {
  quizData: QuizData;
  quizQuestions: QuizQuestion[];
};

export default function Quiz({ quizData, quizQuestions }: QuizProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAnswers = localStorage.getItem(USER_ANSWERS_KEY);
      if (storedAnswers) {
        try {
          setUserAnswers(JSON.parse(storedAnswers));
        } catch (error) {
          console.error("Error parsing stored user answers:", error);
          localStorage.removeItem(USER_ANSWERS_KEY);
        }
      }
    }
  }, []);

  const handleAnswerSelect = (questionIndex: number, selectedOption: string) => {
    const updatedAnswers = { ...userAnswers, [questionIndex]: selectedOption };
    setUserAnswers(updatedAnswers);
    localStorage.setItem(USER_ANSWERS_KEY, JSON.stringify(updatedAnswers));
  };

  const handleSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score += 1;
      }
    });

    localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
    router.push("/score");
  };

  const resetQuiz = () => {
    localStorage.removeItem(USER_ANSWERS_KEY);
    localStorage.removeItem(SCORE_STORAGE_KEY);
    setUserAnswers({});
  };

  return (
    <div className="p-6 bg-[#F9DBBD] min-h-screen">
      <h1 className="text-3xl md:text-5xl text-[#450920] font-bold text-center">
        Quiz Me On
      </h1>
      <p className="text-lg md:text-xl font-semibold text-[#A53860] text-center mt-2">
        Quiz length: {quizQuestions.length} | Difficulty: {quizData.difficulty}
      </p>

      <hr className="border-[#450920] border-x-2 border-y-2 my-4" />

      <h2 className="text-2xl md:text-3xl text-[#A53860] font-bold text-center mt-4">
        {quizData.title}
      </h2>

      <div className="flex flex-col items-center w-full p-4">
        {quizQuestions.length > 0 ? (
          quizQuestions.map((q, index) => (
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
