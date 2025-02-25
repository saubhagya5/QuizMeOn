import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { title, difficulty, numQuestions } = await req.json();
    
    if (!title || !difficulty || !numQuestions || numQuestions <= 0) {
      return NextResponse.json(
        { error: "Title, difficulty, and a valid number of questions are required" },
        { status: 400 }
      );
    }

    const prompt = `Generate a quiz titled '${title}' with difficulty '${difficulty}' containing ${numQuestions} questions.
    Each question should have:
    - A question statement
    - Exactly 4 options
    - One correct answer
    Return the quiz in valid JSON format with this structure:
    {
      "title": "${title}",
      "difficulty": "${difficulty}",
      "questions": [
        {
          "question": "Sample Question?",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": "Option 1"
        }
      ]
    } Ensure that you return somehting that is only in JSON format without any other text or characters.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(prompt);

    const textResponse = await response.response.text(); 

    console.log("textResponse:", textResponse); 

    if (!textResponse) {
      return NextResponse.json(
        { error: "Invalid response from Gemini API" },
        { status: 500 }
      );
    }

    let quizData;
    try {
      quizData = JSON.parse(textResponse); 
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Invalid JSON response:", textResponse);
      return NextResponse.json(
        { error: "Invalid JSON response from Gemini API" },
        { status: 500 }
      );
    }

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}