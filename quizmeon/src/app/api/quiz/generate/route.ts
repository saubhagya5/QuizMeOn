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
- Exactly 4 options (in an array)
- One correct answer (which must be one of the options)

Return ONLY valid JSON formatted like this inside triple backticks:
\`\`\`json
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
}
\`\`\`
Do not include any extra text before or after the JSON block.`;


    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const response = await model.generateContent(prompt);

    const rawTextResponse = await response.response.text();
console.log("Raw textResponse:", rawTextResponse);

// Extract JSON content from triple backticks if present
const jsonMatch = rawTextResponse.match(/```json([\s\S]*?)```/);
const textResponse = jsonMatch ? jsonMatch[1].trim() : rawTextResponse.trim();

console.log("Extracted textResponse:", textResponse);

if (!textResponse) {
  return NextResponse.json({ error: "Invalid response from Gemini API" }, { status: 500 });
}

let quizData;
try {
  quizData = JSON.parse(textResponse);
} catch (parseError) {
  console.error("JSON Parse Error:", parseError);
  console.error("Invalid JSON response:", textResponse);
  return NextResponse.json({ error: "Invalid JSON response from Gemini API" }, { status: 500 });
}


    return NextResponse.json(quizData);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}