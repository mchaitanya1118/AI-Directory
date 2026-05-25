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
  const logoUrl = `https://ai.neqtra.com/logos/${tool.id}.svg`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://ai.neqtra.com/tool/${tool.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ai.neqtra.com/tool/${tool.id}`,
      siteName: "AuraAI",
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

  // Build JSON-LD schemas
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "operatingSystem": "All",
    "applicationCategory": `${tool.categoryId.charAt(0).toUpperCase()}${tool.categoryId.slice(1)}Application`,
    "offers": {
      "@type": "Offer",
      "price": tool.pricing === "Free" ? "0.00" : "0.00", // Standard fallback
      "priceCurrency": "USD",
      "description": tool.pricingDetails
    },
    "description": tool.shortDescription
  };

  if (tool.ratingCount > 0) {
    softwareSchema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": tool.rating,
      "ratingCount": tool.ratingCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  if (tool.reviews && tool.reviews.length > 0) {
    softwareSchema.review = tool.reviews.map((r) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": r.username
      },
      "datePublished": r.date,
      "reviewBody": r.comment,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": r.rating,
        "bestRating": "5",
        "worstRating": "1"
      }
    }));
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ai.neqtra.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${tool.categoryId.charAt(0).toUpperCase()}${tool.categoryId.slice(1)} Tools`,
        "item": `https://ai.neqtra.com/category/${tool.categoryId}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool.name,
        "item": `https://ai.neqtra.com/tool/${tool.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
