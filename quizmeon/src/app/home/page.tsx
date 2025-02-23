"use client";

import { useState,useTransition  } from "react";
import { useRouter } from "next/navigation";

const QUIZ_STORAGE_KEY = "quizData";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  let [isPending, startTransition] = useTransition();

  // Taylor Swift Dummy Quiz
  const dummyQuiz = {
    title: "Taylor Swift Ultimate Fan Quiz",
    difficulty: "Any",
    questions: [
      {
        question: "What is Taylor Swift's middle name?",
        options: ["Alison", "Marie", "Nicole", "Grace"],
        answer: "Alison"
      },
      {
        question: "Which year did Taylor Swift release her debut album?",
        options: ["2004", "2006", "2008", "2010"],
        answer: "2006"
      },
      {
        question: "What is the name of Taylor Swift's first album?",
        options: ["Fearless", "Speak Now", "Taylor Swift", "Red"],
        answer: "Taylor Swift"
      },
      {
        question: "Which of these songs is NOT on the 'Red' album?",
        options: [
          "All Too Well",
          "I Knew You Were Trouble",
          "Blank Space",
          "22"
        ],
        answer: "Blank Space"
      },
      {
        question: "What is Taylor Swift’s lucky number?",
        options: ["7", "13", "22", "5"],
        answer: "13"
      },
      {
        question: "Which album features the song 'Shake It Off'?",
        options: ["Red", "1989", "Lover", "Speak Now"],
        answer: "1989"
      },
      {
        question: "What city was Taylor Swift born in?",
        options: ["Los Angeles", "New York", "Nashville", "Reading"],
        answer: "Reading"
      },
      {
        question: "Which Taylor Swift album was inspired by folklore and storytelling?",
        options: ["Lover", "Evermore", "Folklore", "Reputation"],
        answer: "Folklore"
      },
      {
        question: "What song contains the lyrics 'We are never ever getting back together'?",
        options: ["The Man", "You Belong With Me", "22", "We Are Never Ever Getting Back Together"],
        answer: "We Are Never Ever Getting Back Together"
      },
      {
        question: "What year did Taylor Swift release 'Reputation'?",
        options: ["2015", "2016", "2017", "2018"],
        answer: "2017"
      },
      {
        question: "Which of these albums has a completely re-recorded 'Taylor’s Version' release?",
        options: ["Reputation", "1989", "Fearless", "Lover"],
        answer: "Fearless"
      },
      {
        question: "Which song did Taylor Swift write about Kanye West?",
        options: ["The Man", "Mean", "Innocent", "Bad Blood"],
        answer: "Innocent"
      },
      {
        question: "What instrument did Taylor Swift learn first?",
        options: ["Piano", "Banjo", "Guitar", "Violin"],
        answer: "Guitar"
      },
      {
        question: "Which of these movies did Taylor Swift act in?",
        options: ["Cats", "La La Land", "A Star Is Born", "The Notebook"],
        answer: "Cats"
      },
      {
        question: "Which Taylor Swift song is about a scarf?",
        options: ["Red", "All Too Well", "The Archer", "You Belong With Me"],
        answer: "All Too Well"
      },
      {
        question: "What is the name of Taylor Swift’s documentary on Netflix?",
        options: ["Miss Americana", "Folklore: The Long Pond Sessions", "Taylor Nation", "Swift Speak"],
        answer: "Miss Americana"
      },
      {
        question: "Which of these actors did Taylor Swift date?",
        options: ["Chris Evans", "Jake Gyllenhaal", "Robert Pattinson", "Timothée Chalamet"],
        answer: "Jake Gyllenhaal"
      },
      {
        question: "What is the last track on Taylor Swift's 'Lover' album?",
        options: ["Daylight", "Cornelia Street", "The Archer", "Cruel Summer"],
        answer: "Daylight"
      },
      {
        question: "Which Taylor Swift album was the first to win Album of the Year at the Grammys?",
        options: ["1989", "Fearless", "Red", "Speak Now"],
        answer: "Fearless"
      },
      {
        question: "What is the name of Taylor Swift’s cat?",
        options: ["Meredith", "Oliver", "Whiskers", "Luna"],
        answer: "Meredith"
      }
    ]
  };

  // Handle Submit
  const handleSubmit = async () => {
    console.log("Submitting quiz...");
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(dummyQuiz));
    router.push("/quiz");

    // setLoading(true); // Show loading state

    // try {
    //   const response = await fetch("/api/quiz", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ prompt, difficulty, numQuestions }),
    //   });

    //   if (!response.ok) throw new Error("Failed to fetch quiz");

    //   const quizData = await response.json();
    //   localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(quizData));

    //   startTransition(() => {
    //     router.push("/quiz"); // Navigate only after fetching is done
    //   });
    // } catch (error) {
    //   console.error("Error fetching quiz:", error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="flex  flex-col items-center justify-center min-h-screen bg-[#F9DBBD]">
      {/* <h1 className="text-5xl p-4  text-[#450920] font-bold text-center">Quiz Me On</h1> */}
      <div className="bg-[#FFA5AB] border-[#450920] shadow-2xl border-x-4 border-y-4 p-6 rounded-2xl max-w-lg w-full text-[#450920] ">
        <h1 className="text-4xl font-bold text-center mb-6">Generate Your Quiz</h1>
        
        <textarea
          className="w-full p-3 bg-[#F9DBBD] border border-[#450920]  rounded-md mb-4 text-[#450920] placeholder-[#450920] focus:ring-2  focus:ring-[#450920] focus:outline-none"
          placeholder="Enter quiz topic..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <select
          className="w-full p-3 bg-[#F9DBBD] border border-[#450920]  rounded-md mb-4 text-[#450920] focus:ring-2 focus:ring-[#450920] focus:outline-none"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Hard">Hard</option>
        </select>
        
        <select
          className="w-full p-3 bg-[#F9DBBD] border border-[#450920]  rounded-md mb-6 text-[#450920] focus:ring-2 focus:ring-[#450920] focus:outline-none"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num} Questions
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 bg-[#A53860] text-lg text-white font-bold rounded-md shadow-md hover:opacity-80 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
