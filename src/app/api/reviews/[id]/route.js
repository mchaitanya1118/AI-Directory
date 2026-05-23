import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// DELETE /api/reviews/[id] - Delete a review (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    await prisma.review.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("API DELETE /api/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete review", details: error.message },
      { status: 500 }
    );
  }
}
