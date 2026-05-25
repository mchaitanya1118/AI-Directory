import { prisma } from "@/lib/prisma";
import ToolDetailClient from "@/components/ToolDetailClient";
import { notFound } from "next/navigation";

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const tool = await prisma.tool.findUnique({
    where: { id }
  });

  if (!tool) {
    return {
      title: 'Tool Not Found - AuraAI',
    };
  }

  const title = `${tool.name} Reviews, Pricing & Alternatives 2026 | AuraAI`;
  const description = tool.shortDescription;
  const logoUrl = `https://auraai.directory/logos/${tool.id}.svg`;

  return {
    title,
    description,
    keywords: [tool.name, "AI tool", tool.category, "reviews", "pricing", "alternatives"],
    openGraph: {
      title,
      description,
      url: `https://auraai.directory/tool/${tool.id}`,
      type: "website",
      images: [
        {
          url: logoUrl,
          width: 800,
          height: 600,
          alt: `${tool.name} Logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logoUrl],
    },
  };
}

export default async function ToolDetailPage({ params }) {
  const { id } = await params;

  // Fetch tool with reviews and relational tags
  const tool = await prisma.tool.findUnique({
    where: { id },
    include: { 
      reviews: true,
      tags: true
    }
  });

  if (!tool) {
    notFound();
  }

  // Fetch similar tools (same category, exclude current)
  const similarTools = await prisma.tool.findMany({
    where: {
      categoryId: tool.categoryId,
      id: { not: tool.id }
    },
    take: 3,
    include: { reviews: true }
  });

  // Fetch "Better Alternatives" (same category, higher rating, exclude current)
  const betterAlternatives = await prisma.tool.findMany({
    where: {
      categoryId: tool.categoryId,
      id: { not: tool.id },
      rating: { gt: tool.rating }
    },
    orderBy: {
      rating: "desc"
    },
    take: 3,
    include: { reviews: true }
  });

  // Extract current tool's tag IDs
  const tagIds = tool.tags.map((tt) => tt.tagId);

  // Fetch "Users Also Liked" (tools sharing same tags, exclude current)
  const usersAlsoLiked = await prisma.tool.findMany({
    where: {
      id: { not: tool.id },
      tags: {
        some: {
          tagId: { in: tagIds }
        }
      }
    },
    take: 3,
    include: { reviews: true }
  });

  return (
    <ToolDetailClient 
      tool={tool} 
      similarTools={similarTools} 
      betterAlternatives={betterAlternatives}
      usersAlsoLiked={usersAlsoLiked}
    />
  );
}
