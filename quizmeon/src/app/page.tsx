"use client";

import { useState, useTransition  } from "react";
import { useRouter } from "next/navigation";

const QUIZ_STORAGE_KEY = "quizData";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
 const [, startTransition] = useTransition();

  

  const handleSubmit = async () => {
    setLoading(true); // Show loading state
  
    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: prompt, difficulty, numQuestions }), // Changed `prompt` to `title`
      });
  
      if (!response.ok) throw new Error("Failed to fetch quiz");
  
      const quizData = await response.json();
      
      if (!quizData.questions) throw new Error("Invalid quiz data received");
  
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizData));
  
      startTransition(() => {
        router.push("/quiz"); // Navigate after fetching is done
      });
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-[#F9DBBD]">
      <h1 className="text-3xl md:text-5xl text-[#450920] font-bold text-center ">
        Quiz Me On
      </h1><br /><br />
      <div className="bg-[#FFA5AB] border-[#450920] shadow-2xl border-x-4 border-y-4 p-6 sm:p-8 rounded-2xl max-w-lg w-full sm:w-[90%] text-[#450920]">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Generate Your Quiz
        </h1>
  
        <textarea
          className="w-full p-3 bg-[#F9DBBD] border border-[#450920] rounded-md mb-4 text-[#450920] placeholder-[#450920] focus:ring-2 focus:ring-[#450920] focus:outline-none"
          placeholder="Enter quiz topic..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
  
        <select
          className="w-full p-3 bg-[#F9DBBD] border border-[#450920] rounded-md mb-4 text-[#450920] focus:ring-2 focus:ring-[#450920] focus:outline-none"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Hard">Hard</option>
        </select>
  
        <select
          className="w-full p-3 bg-[#F9DBBD] border border-[#450920] rounded-md mb-6 text-[#450920] focus:ring-2 focus:ring-[#450920] focus:outline-none"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num} Questions
            </option>
          ))}
        </select>
  
        {loading ? (
          <button
            type="button"
            className="w-full px-6 py-3 text-lg font-bold rounded-md shadow-md transition bg-[#A53860] hover:opacity-80 focus:ring-2 focus:ring-[#450920] text-white flex justify-center items-center"
            disabled
          >
            <svg
              width="20"
              height="20"
              fill="currentColor"
              className="mr-2 animate-spin"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
            </svg>
            Loading...
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-6 py-3 text-lg font-bold rounded-md shadow-md transition bg-[#A53860] hover:opacity-80 text-white"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
  
}
