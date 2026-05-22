import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { toolId } = await req.json();

    if (!toolId) {
      return NextResponse.json({ message: "Tool ID is required" }, { status: 400 });
    }

    const userId = session.user.id;

    // Check if bookmark exists
    const existingBookmark = await prisma.bookmark.findFirst({
      where: { userId, toolId },
    });

    if (existingBookmark) {
      // Toggle off
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      return NextResponse.json({ message: "Bookmark removed", bookmarked: false }, { status: 200 });
    } else {
      // Toggle on
      await prisma.bookmark.create({
        data: { userId, toolId },
      });
      return NextResponse.json({ message: "Bookmark added", bookmarked: true }, { status: 201 });
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
