'use client';

import { useEffect, useState } from 'react';


export default function QuizResult() {
  const [quizTitle, setQuizTitle] = useState('');
  const [score, setScore] = useState<number | null>(null);
  useEffect(() => {
    const storedTitle = localStorage.getItem('quizTitle');
    const storedScore = localStorage.getItem('quizScore');
    
    if (storedTitle) setQuizTitle(storedTitle);
    if (storedScore) setScore(parseInt(storedScore));
  }, []);

  const handleShare = () => {
    const shareUrl = window.location.origin + '/quiz';
    navigator.clipboard.writeText(`Take the ${quizTitle} quiz here: ${shareUrl}`);
    alert('Quiz link copied to clipboard! Share it with your friends.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>
      <h2 className="text-2xl font-semibold mb-2">{quizTitle}</h2>
      {score !== null ? (
        <p className="text-lg mb-6">Your Score: <span className="font-bold">{score}</span></p>
      ) : (
        <p className="text-lg mb-6">No result found. Try taking a quiz!</p>
      )}
      <button 
        onClick={handleShare} 
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600">
        Share with Friends
      </button>
    </div>
  );
}
