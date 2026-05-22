import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolCard from "@/components/ToolCard";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  const tool = await prisma.tool.findUnique({ where: { id } });

  if (!tool) {
    return { title: "Find AI Alternatives | AuraAI" };
  }

  return {
    title: `Top ${tool.name} Alternatives (Free & Paid) in 2026 | AuraAI`,
    description: `Discover the best alternatives to ${tool.name}. Compare features, pricing, and reviews of top competitors in the ${tool.categoryId} space.`,
    alternates: {
      canonical: `https://auraai.com/alternatives/${id}`
    }
  };
}

export default async function AlternativesPage({ params }) {
  const { id } = await params;

  const targetTool = await prisma.tool.findUnique({
    where: { id },
  });

  if (!targetTool) {
    notFound();
  }

  // Fetch alternatives in the same category, excluding the target tool itself
  // Ordered by highest rating count to surface the most popular alternatives
  const alternatives = await prisma.tool.findMany({
    where: {
      categoryId: targetTool.categoryId,
      id: { not: targetTool.id }
    },
    include: {
      reviews: true,
      tags: { include: { tag: true } }
    },
    orderBy: {
      ratingCount: 'desc'
    },
    take: 5
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Best Alternatives to ${targetTool.name}`,
    "itemListElement": alternatives.map((alt, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": alt.name,
        "url": `https://auraai.com/tool/${alt.id}`,
        "applicationCategory": "UtilityApplication"
      }
    }))
  };

  return (
    <div className="curated-deep-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="curated-deep-header">
        <span className="hero-tagline" style={{ letterSpacing: "2px" }}>
          Software Alternatives
        </span>
        <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
          Top {alternatives.length} {targetTool.name} Alternatives
        </h1>
        <p className="curated-deep-intro">
          Looking to switch from <strong>{targetTool.name}</strong>? We've analyzed the leading tools in the <span style={{color: "var(--neon-cyan)", textTransform: "capitalize"}}>{targetTool.categoryId}</span> category. Compare these top-rated alternatives based on real user reviews, features, and pricing structures.
        </p>
      </div>

      <div style={{ marginTop: "3rem", display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {alternatives.length > 0 ? (
          alternatives.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))
        ) : (
          <div className="detail-glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem" }}>
            <h3 style={{ color: "var(--text-bright)", marginBottom: "1rem" }}>No direct alternatives found.</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
              {targetTool.name} might be the only tool currently tracked in this exact niche.
            </p>
            <Link href="/category/all" className="cta-btn">Explore All Tools</Link>
          </div>
        )}
      </div>
      
      <div className="curated-verdict-box" style={{ marginTop: "4rem" }}>
        <h4 className="verdict-header">Why Switch from {targetTool.name}?</h4>
        <p style={{ fontSize: "0.95rem", color: "var(--text-main)", lineHeight: "1.6" }}>
          While {targetTool.name} is a powerful platform, changing business requirements, team scaling, or budget constraints often necessitate exploring alternatives. 
          The platforms listed above represent the industry standard in the {targetTool.categoryId} market for 2026.
        </p>
      </div>
    </div>
  );
}
