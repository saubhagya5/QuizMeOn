"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "next/navigation";
const QuizComponent = lazy(() => import("../Quiz"));

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
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${id}`);
        if (!response.ok) throw new Error("Quiz not found");

        const data = await response.json();
        setQuiz(data);
        setQuizQuestions(data.questions);
      } catch (error) {
        setError("Failed to fetch quiz"+error);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!quiz) return <p className="text-center">Loading...</p>;

  return (
      <Suspense fallback={<div className="text-center text-lg">Loading Quiz...</div>}>
        <QuizComponent quizData={quiz} quizQuestions={quizQuestions} />
      </Suspense>
    );

}
