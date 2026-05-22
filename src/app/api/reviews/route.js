import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "You must be logged in to review" }, { status: 401 });
    }

    const body = await req.json();
    const { toolId, rating, comment } = body;

    if (!toolId || !rating || !comment) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const userId = session.user.id;
    const username = session.user.name;

    const newReview = await prisma.review.create({
      data: {
        userId,
        username,
        toolId,
        rating: parseFloat(rating),
        comment,
        date: new Date().toISOString().split("T")[0],
      },
    });

    return NextResponse.json({ message: "Review posted", review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
