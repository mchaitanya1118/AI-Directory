import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized. Please sign in to submit prompts." }, { status: 401 });
    }

    const body = await req.json();
    const { title, promptText, category } = body;

    if (!title || !promptText || !category) {
      return NextResponse.json({ message: "Title, prompt text, and category are required." }, { status: 400 });
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        title: title.trim(),
        promptText: promptText.trim(),
        category: category.trim(),
        views: 0,
        useCount: 0
      }
    });

    return NextResponse.json({ message: "Prompt successfully shared!", prompt: newPrompt }, { status: 201 });
  } catch (error) {
    console.error("Failed to create prompt:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
