"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const SCORE_STORAGE_KEY = "quizScore";
const QUIZ_STORAGE_KEY = "quizData";
const USER_ANSWERS_KEY = "userAnswers";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizData {
  title: string;
  difficulty: string;
  questions: Question[];
}

export default function QuizResult() {
  const [quizTitle, setQuizTitle] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const router = useRouter();

  useEffect(() => {
    // Retrieve stored quiz data
    const storedTitleJSON = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (storedTitleJSON) {
      try {
        const storedData: QuizData = JSON.parse(storedTitleJSON);
        setQuizTitle(storedData.title || "Unknown Quiz");
        setQuestions(storedData.questions || []);
      } catch (error) {
        console.error("Error parsing quiz data:", error);
      }
    }

    // Retrieve stored score
    const storedScore = localStorage.getItem(SCORE_STORAGE_KEY);
    if (storedScore) {
      setScore(parseInt(storedScore, 10));
    }

    // Retrieve user's selected answers
    const storedAnswers = localStorage.getItem(USER_ANSWERS_KEY);
    if (storedAnswers) {
      try {
        setUserAnswers(JSON.parse(storedAnswers));
      } catch (error) {
        console.error("Error parsing user answers:", error);
      }
    }
  }, []);

  const handleRetry = () => {
    localStorage.removeItem(SCORE_STORAGE_KEY);
    localStorage.removeItem(USER_ANSWERS_KEY);
    router.push("/quiz");
  };
  const handleHome = () => {
    localStorage.removeItem(SCORE_STORAGE_KEY);
    localStorage.removeItem(USER_ANSWERS_KEY);
    router.push("/"); // Redirect back to home page
  };
  const handleShare = async () => {
    if (!quizTitle) {
      alert("No quiz found to share.");
      return;
    }

    try {
      const quizDataJSON = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (!quizDataJSON) {
        alert("Quiz data not found!");
        return;
      }

      const quizData: QuizData = JSON.parse(quizDataJSON);

      const response = await fetch("/api/quiz/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to save quiz");

      const shareUrl = `${window.location.origin}/quiz/${result.quizId}`;
      navigator.clipboard.writeText(
        `Take the ${quizTitle} quiz here: ${shareUrl}`
      );
      alert("Quiz saved & link copied to clipboard! Share it with your friends.");
    } catch (error) {
      console.error("Error sharing quiz:", error);
      alert("Failed to share quiz. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-[#F9DBBD]">
      <h1 className="text-5xl text-[#450920] font-bold text-center">Quiz Me On</h1>
      <br />
      <br />
      <br />
      <h2 className="text-2xl font-semibold text-[#A53860]">
        {quizTitle || "Quiz"}
      </h2>

      {score !== null ? (
        <p className="text-2xl mt-4 text-[#450920]">
          Your Score: <span className="font-bold text-[#DA627D]">{score}</span>
        </p>
      ) : (
        <p className="text-xl mt-4 text-[#450920]">
          No result found. Try taking a quiz!
        </p>
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
          className="px-5 py-2 text-lg bg-[#A53860] text-white rounded-md shadow-lg hover:bg-[#DA627D] transition-all"
        >
          Share the quiz
        </button>
        <button
          onClick={handleHome}
          className="px-5 py-2 text-lg bg-[#A53860] text-white rounded-md shadow-lg hover:bg-[#DA627D] transition-all"
        >
          Generate New Quiz
        </button>
      </div>

      {/* Questions & Answers Section */}
      <div className="mt-12 w-full max-w-2xl">
        <h3 className="text-3xl font-bold text-[#450920] mb-4 text-center">
          Review Your Answers
        </h3>

        {questions.length > 0 ? (
          questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div key={index} className="mt-6 p-5 border border-[#450920] shadow-2xl border-x-4 border-y-4 bg-[#FFA5AB] rounded-md w-full max-w-3xl">
                <p className="text-xl font-semibold text-[#A53860]">{question.question}</p>

                <div className="mt-2 flex flex-col gap-1">
  <div className="flex">
    <p className="text-lg font-medium text-gray-700">Your Answer:</p>
    <p className={`text-lg font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
      {userAnswer || "No answer selected"}
    </p>
  </div>
  <div className="flex">
    <p className="text-lg font-medium text-gray-700">Correct Answer:</p>
    <p className="text-lg font-bold text-green-600">{question.correctAnswer}</p>
  </div>
</div>

              </div>
            );
          })
        ) : (
          <p className="text-xl text-[#450920]">No questions available.</p>
        )}
      </div>
    </div>
  );
}
