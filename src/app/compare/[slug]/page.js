import React from "react";
import { prisma } from "@/lib/prisma";
import CompareMatrixClient from "@/components/CompareMatrixClient";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  // Parse slug like "cursor-vs-github-copilot"
  if (!slug.includes("-vs-")) {
    return { title: "Compare Tools | AuraAI" };
  }

  const [idA, idB] = slug.split("-vs-");
  
  const toolA = await prisma.tool.findUnique({ where: { id: idA } });
  const toolB = await prisma.tool.findUnique({ where: { id: idB } });

  if (!toolA || !toolB) {
    return { title: "Compare Tools | AuraAI" };
  }

  return {
    title: `${toolA.name} vs ${toolB.name}: Which is Better in 2026? | AuraAI`,
    description: `Comprehensive head-to-head comparison between ${toolA.name} and ${toolB.name}. Compare features, pricing, pros, and cons to see which AI tool wins.`,
    alternates: {
      canonical: `https://auraai.com/compare/${slug}`
    }
  };
}

export default async function DynamicComparePage({ params }) {
  const { slug } = await params;

  if (!slug.includes("-vs-")) {
    notFound();
  }

  const [idA, idB] = slug.split("-vs-");

  const [toolA, toolB] = await Promise.all([
    prisma.tool.findUnique({ where: { id: idA }, include: { reviews: true } }),
    prisma.tool.findUnique({ where: { id: idB }, include: { reviews: true } })
  ]);

  if (!toolA || !toolB) {
    return (
      <div className="detail-glass-card" style={{ textAlign: "center", padding: "4rem", marginTop: "4rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
          Comparison Not Found
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          One or both of the tools specified in the comparison could not be found in our database.
        </p>
        <Link href="/compare" className="cta-btn">
          Build Custom Comparison
        </Link>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemPage",
        "name": `${toolA.name} vs ${toolB.name} Comparison`,
        "description": `Detailed feature and pricing comparison between ${toolA.name} and ${toolB.name}.`,
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Is ${toolA.name} better than ${toolB.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${toolA.name} is rated ${toolA.rating || '4.2'}/5 stars, while ${toolB.name} is rated ${toolB.rating || '4.2'}/5 stars in our directory listings. Choice depends on your specific use cases.`
            }
          },
          {
            "@type": "Question",
            "name": `How does the pricing of ${toolA.name} compare to ${toolB.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${toolA.name} is categorized as ${toolA.pricing} with pricing specs: ${toolA.pricingDetails || 'standard structure'}. ${toolB.name} is categorized as ${toolB.pricing} with pricing specs: ${toolB.pricingDetails || 'standard structure'}.`
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div style={{ marginTop: "2rem" }}>
        {/* Pass the fully hydrated Prisma objects down as an array */}
        <CompareMatrixClient initialComparedTools={[toolA, toolB]} />
      </div>
    </>
  );
}
