import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const workflow = await prisma.workflow.findUnique({
      where: { id }
    });

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true, upvotes: updatedWorkflow.upvotes });
  } catch (err) {
    console.error("API Workflows Upvote Error: ", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
