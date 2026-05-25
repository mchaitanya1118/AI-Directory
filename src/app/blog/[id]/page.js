import { prisma } from "@/lib/prisma";
import BlogClient from "@/components/BlogClient";
import { notFound } from "next/navigation";

// Generate dynamic SEO metadata for the blog post
export async function generateMetadata({ params }) {
  const { id } = await params;
  const article = await prisma.blogPost.findUnique({
    where: { id }
  });

  if (!article) {
    return {
      title: 'Article Not Found - AuraAI',
    };
  }

  return {
    title: `${article.title} | AuraAI Blog`,
    description: article.summary,
    alternates: {
      canonical: `/blog/${article.id}`,
    },
  };
}

export default async function BlogReaderPage({ params }) {
  const { id } = await params;
  
  // Fetch blog from SQLite DB
  const article = await prisma.blogPost.findUnique({
    where: { id }
  });

  if (!article) {
    notFound();
  }

  // Related Tools
  let relatedToolObjs = [];
  try {
    const relatedToolIds = JSON.parse(article.relatedTools) || [];
    if (relatedToolIds.length > 0) {
      relatedToolObjs = await prisma.tool.findMany({
        where: { id: { in: relatedToolIds } },
        include: { reviews: true }
      });
    }
  } catch(e) {}

  return <BlogClient article={article} relatedToolObjs={relatedToolObjs} />;
}
