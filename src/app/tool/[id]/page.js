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

  return {
    title: `${tool.name} Review, Pricing & Alternatives 2026`,
    description: tool.description,
    alternates: { canonical: `https://ai.neqtra.com/tool/${id}` },
    openGraph: {
      title: `${tool.name} Review & Pricing | AuraAI`,
      description: tool.description,
      url: `https://ai.neqtra.com/tool/${id}`,
      images: [{ url: `/logos/${tool.id}.svg` || "/og-image.jpg", width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} Review & Pricing | AuraAI`,
      description: tool.description,
      images: [`/logos/${tool.id}.svg` || "/og-image.jpg"],
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

  // Build JSON-LD schemas
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "description": tool.description,
            "applicationCategory": "WebApplication",
            "operatingSystem": "Web",
            "url": tool.website,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": tool.rating,
              "reviewCount": tool.ratingCount,
              "bestRating": "5",
              "worstRating": "1",
            },
            "offers": {
              "@type": "Offer",
              "price": tool.pricing === "Free" ? "0" : "",
              "priceCurrency": "USD",
              "description": tool.pricing,
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ai.neqtra.com" },
                { "@type": "ListItem", "position": 2, "name": tool.categoryId, "item": `https://ai.neqtra.com/category/${tool.categoryId}` },
                { "@type": "ListItem", "position": 3, "name": tool.name, "item": `https://ai.neqtra.com/tool/${tool.id}` },
              ],
            },
          }),
        }}
      />
      <ToolDetailClient 
        tool={tool} 
        similarTools={similarTools} 
        betterAlternatives={betterAlternatives}
        usersAlsoLiked={usersAlsoLiked}
      />
    </>
  );
}
