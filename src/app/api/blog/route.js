import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized. Admin only." }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, category, readTime, keywords, summary, body: contentBody, relatedTools } = body;

    if (!title || !slug || !contentBody) {
      return NextResponse.json({ message: "Title, slug, and body are required fields." }, { status: 400 });
    }

    // Parse comma separated arrays
    const keywordsArray = keywords.split(",").map(k => k.trim()).filter(Boolean);
    const relatedToolsArray = relatedTools.split(",").map(k => k.trim()).filter(Boolean);

    // Convert Markdown to Blocks Array for BlogClient
    const blocks = [];
    const lines = contentBody.split('\n');
    for (const line of lines) {
      if (line.trim() === '') continue;
      if (line.startsWith('#')) {
        blocks.push({ type: "heading", text: line.replace(/^#+\s*/, '') });
      } else {
        blocks.push({ type: "paragraph", text: line });
      }
    }

    // Default logo for now, could be passed dynamically later
    const logo = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;

    const newPost = await prisma.blogPost.create({
      data: {
        id: slug,
        title,
        summary,
        category,
        readTime,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        keywords: JSON.stringify(keywordsArray),
        logo,
        body: JSON.stringify(blocks),
        relatedTools: JSON.stringify(relatedToolsArray),
      },
    });

    return NextResponse.json({ message: "Blog post created", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Blog CMS error:", error);
    // Prisma unique constraint error code
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "A post with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
