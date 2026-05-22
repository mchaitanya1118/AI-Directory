import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search across name, shortDescription, and category
    // In a production Postgres environment, this would use Full Text Search (FTS)
    // For SQLite, we use simple 'contains' queries with case insensitivity
    const results = await prisma.tool.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { shortDescription: { contains: q } },
          { categoryId: { contains: q } },
        ],
      },
      include: {
        reviews: true,
      },
      take: 8, // Limit search results to 8 items
      orderBy: {
        ratingCount: "desc",
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
