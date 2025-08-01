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

const prompt = `Generate a quiz with the description of '${title}' with difficulty '${difficulty}' containing ${numQuestions} questions.
Each question should have:
- A question statement
- Exactly 4 options (in an array)
- One correct answer (which must be one of the options)

Return ONLY valid JSON formatted like this inside triple backticks:
\`\`\`json
{
  "title": <title>,
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
Do not include any extra text before or after the JSON block.

Rules to follow while generating the quiz:
-based off of the given description pick an apporopriate title for the quiz
-if the description is not clear or gibresh then the title should be "Random Quiz" and make a random genral knowledge quiz
-questions should be based off of the description
-questions should be of the given difficulty, for easy make it in such a way that someone with a basic understanding of the topic can answer it, for intermediate make it in such a way that someone with a good understanding of the topic can answer it, for hard make it in such a way that someone with an expert understanding of the topic can answer it
-questions should be unique and it can be of various types like find the incorrect or correct statemnet, odd one out, or other types of questions if applicable
-questions should be clear and concise and should not be ambiguous and should not have any spelling or grammatical errors 
-the answer should always be correct and should be only one of the options
-if there is a lengthy corect option then the other should also be of similar length
-try to minimize all of the above being the answer
-YOU NEED TO MAKE SURE ITS IN JSON FORMAT AND THE JSON IS VALID
-DO NOT INCLUDE ANY EXTRA TEXT BEFORE OR AFTER THE JSON BLOCK
`;


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
