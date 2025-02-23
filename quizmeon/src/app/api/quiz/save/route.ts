import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

export async function POST(req: Request) {
  try {
    const { title, difficulty, questions } = await req.json();

    if (!title || !difficulty || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 });
    }

    await connectDB();

    const newQuiz = await Quiz.create({ title, difficulty, questions });

    return NextResponse.json({ quizId: newQuiz._id }, { status: 201 });
  } catch (error) {
    console.error("Error saving quiz:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
