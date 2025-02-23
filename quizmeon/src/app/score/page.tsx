"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SCORE_STORAGE_KEY = "quizScore";
const QUIZ_TITLE_KEY = "quizTitle";

export default function QuizResult() {
  const [quizTitle, setQuizTitle] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the stored quiz title and score
    const storedTitle = localStorage.getItem(QUIZ_TITLE_KEY);
    const storedScore = localStorage.getItem(SCORE_STORAGE_KEY);

    if (storedTitle) setQuizTitle(storedTitle);
    if (storedScore) setScore(parseInt(storedScore));
  }, []);

  const handleShare = () => {
    const shareUrl = window.location.origin + "/quiz";
    navigator.clipboard.writeText(`Take the ${quizTitle} quiz here: ${shareUrl}`);
    alert("Quiz link copied to clipboard! Share it with your friends.");
  };

  const handleRetry = () => {
    localStorage.removeItem(SCORE_STORAGE_KEY);
    localStorage.removeItem("userAnswers");
    router.push("/quiz"); // Redirect back to quiz page
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[#F9DBBD]">
      <h1 className="text-5xl font-bold text-[#450920] mb-6">Quiz Result</h1>

      <h2 className="text-3xl font-semibold text-[#A53860]">{quizTitle || "Quiz"}</h2>

      {score !== null ? (
        <p className="text-2xl mt-4 text-[#450920]">
          Your Score: <span className="font-bold text-[#DA627D]">{score}</span>
        </p>
      ) : (
        <p className="text-xl mt-4 text-[#450920]">No result found. Try taking a quiz!</p>
      )}

      <div className="mt-8 flex gap-6">
        <button
          onClick={handleRetry}
          className="px-5 py-2 text-lg bg-[#A53860] text-white rounded-md shadow-lg hover:bg-[#DA627D] transition-all"
        >
          Retake Quiz
        </button>

        <button
          onClick={handleShare}
          className="px-5 py-2 text-lg bg-[#450920] text-white rounded-md shadow-lg hover:bg-[#A53860] transition-all"
        >
          Share with Friends
        </button>
      </div>
    </div>
  );
}
