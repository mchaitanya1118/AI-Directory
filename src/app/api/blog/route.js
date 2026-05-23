import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized. Please sign in to write articles." }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, category, readTime, keywords, summary, body: contentBody, relatedTools } = body;

    if (!title || !contentBody) {
      return NextResponse.json({ message: "Title and body are required fields." }, { status: 400 });
    }

    // Auto-generate clean slug from title if not provided, and append a short unique hash for UGC safety
    const slugBase = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Add unique identifier to UGC blogs to prevent route crashes
    const finalSlug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;

    // Parse comma separated arrays
    const keywordsArray = keywords
      ? keywords.split(",").map(k => k.trim()).filter(Boolean)
      : [category || "general"];
    const relatedToolsArray = relatedTools
      ? (typeof relatedTools === "string" ? relatedTools.split(",").map(k => k.trim()).filter(Boolean) : relatedTools)
      : [];

    // Convert Markdown text to structural JSON blocks natively parsed by BlogClient
    const blocks = [];
    const lines = contentBody.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') continue;
      if (trimmed.startsWith('#')) {
        blocks.push({ type: "heading", text: trimmed.replace(/^#+\s*/, '') });
      } else {
        blocks.push({ type: "paragraph", text: trimmed });
      }
    }

    // Default logo for now
    const logo = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;

    const newPost = await prisma.blogPost.create({
      data: {
        id: finalSlug,
        title,
        summary: summary || title,
        category: category || "general",
        readTime: readTime || "5 min read",
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
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "A post with this slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
