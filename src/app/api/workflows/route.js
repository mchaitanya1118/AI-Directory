import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized. Please sign in to build custom workflows." }, { status: 401 });
    }

    const body = await req.json();
    const { title, summary, description, role, industry, budget, steps } = body;

    if (!title || !summary || !description || !role || !industry || !budget) {
      return NextResponse.json({ message: "Missing required workflow fields." }, { status: 400 });
    }

    // Auto-generate unique slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // Create workflow and join tools inside a database transaction
    const newWorkflow = await prisma.$transaction(async (tx) => {
      const wf = await tx.workflow.create({
        data: {
          title: title.trim(),
          slug: uniqueSlug,
          summary: summary.trim(),
          description: description.trim(),
          role: role.trim(),
          industry: industry.trim(),
          budget: budget.trim(),
          views: 0,
          upvotes: 0
        }
      });

      if (steps && Array.isArray(steps)) {
        for (const step of steps) {
          if (!step.toolId) continue;
          
          await tx.workflowTool.create({
            data: {
              workflowId: wf.id,
              toolId: step.toolId,
              stepNumber: parseInt(step.stepNumber) || 1,
              useCase: (step.useCase || "").trim()
            }
          });
        }
      }

      // Fetch complete newly created workflow with its tools relation to return
      return tx.workflow.findUnique({
        where: { id: wf.id },
        include: {
          tools: {
            include: {
              tool: true
            }
          }
        }
      });
    });

    return NextResponse.json({ message: "Workflow successfully published!", workflow: newWorkflow }, { status: 201 });
  } catch (error) {
    console.error("Failed to build workflow:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "A workflow with this title or slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
