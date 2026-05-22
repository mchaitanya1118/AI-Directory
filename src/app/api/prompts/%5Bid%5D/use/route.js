import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const prompt = await prisma.prompt.findUnique({
      where: { id }
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        useCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true, useCount: updatedPrompt.useCount });
  } catch (err) {
    console.error("API Prompts Use Error: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
