import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ bookmarked: false }, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get("toolId");

    if (!toolId) {
      return NextResponse.json({ message: "Tool ID is required" }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: session.user.id,
        toolId: toolId,
      },
    });

    return NextResponse.json({ bookmarked: !!bookmark }, { status: 200 });
  } catch (error) {
    console.error("Check bookmark error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
