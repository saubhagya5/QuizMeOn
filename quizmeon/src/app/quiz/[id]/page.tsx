"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuizData = {
  title: string;
  difficulty: string;
  questions: QuizQuestion[];
};

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${id}`);
        if (!response.ok) throw new Error("Quiz not found");

        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        setError("Failed to fetch quiz");
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!quiz) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-[#F9DBBD]">
      <h1 className="text-3xl md:text-5xl text-[#450920] font-bold text-center">
        {quiz.title}
      </h1>
      <p className="text-lg md:text-xl font-semibold text-[#A53860] text-center mt-2">
        Difficulty: {quiz.difficulty}
      </p>

      <div className="mt-6 flex flex-col items-center w-full">
        {quiz.questions.map((q, index) => (
          <div
            key={index}
            className="mt-6 p-5 border border-[#450920] shadow-2xl bg-[#FFA5AB] rounded-md w-full max-w-3xl"
          >
            <h2 className="font-semibold text-lg md:text-xl text-[#A53860]">
              {index + 1}. {q.question}
            </h2>
            <ul>
              {q.options.map((option, i) => (
                <li key={i} className="mt-3">
                  <button className="w-full md:w-auto px-4 py-2 bg-[#A53860] text-white rounded-md">
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
