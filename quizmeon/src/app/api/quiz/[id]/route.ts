import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { ObjectId } from "mongoose";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
    }

    await connectDB();

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
