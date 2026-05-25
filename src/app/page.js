import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
  description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://ai.neqtra.com/",
    title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
    description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
    images: [{ url: "https://ai.neqtra.com/og-image.jpg" }],
    siteName: "AuraAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
    description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
    images: ["https://ai.neqtra.com/og-image.jpg"],
  }
};

export default async function HomePage() {
  const tools = await prisma.tool.findMany({
    include: { 
      reviews: true,
      tags: { include: { tag: true } }
    }
  });

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://ai.neqtra.com/",
    "name": "AuraAI",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ai.neqtra.com/category/all?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AuraAI",
    "url": "https://ai.neqtra.com/",
    "logo": "https://ai.neqtra.com/og-image.jpg",
    "sameAs": [
      "https://twitter.com/auraai",
      "https://github.com/auraai"
    ]
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": tools.map((tool, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://ai.neqtra.com/tool/${tool.id}`,
      "name": tool.name,
      "description": tool.shortDescription
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Best AI Tools 2026",
            "url": "https://ai.neqtra.com",
            "itemListElement": tools.map((tool, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": tool.name,
              "url": `https://ai.neqtra.com/tool/${tool.id}`,
              "description": tool.shortDescription,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AuraAI",
            "url": "https://ai.neqtra.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ai.neqtra.com/category/all?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <HomeClient initialTools={tools} />
    </>
  );
}
