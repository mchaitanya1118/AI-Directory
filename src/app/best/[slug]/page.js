import React from "react";
import { prisma } from "@/lib/prisma";
import ToolCard from "@/components/ToolCard";
import NewsletterBox from "@/components/NewsletterBox";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugStr = slug.toLowerCase();
  
  let title = "Top Curated AI Directory Tools | AuraAI";
  let description = "Discover curated lists of the absolute best AI tools, templates, and platforms. Audited user reviews, verified pricing plans, and quick comparisons.";

  let targetFilter = "";
  if (slugStr.startsWith("free-ai-tools-for-")) {
    targetFilter = slugStr.replace("free-ai-tools-for-", "").replace(/-/g, " ");
    title = `10+ Best Free AI Tools for ${targetFilter.replace(/(^\w|\s\w)/g, m => m.toUpperCase())} (2026) | AuraAI`;
    description = `Unlock premium 100% free AI tools for ${targetFilter}. Compare zero-cost software directories, read pros and cons, and optimize your workflows.`;
  } else if (slugStr.startsWith("best-ai-tools-for-")) {
    targetFilter = slugStr.replace("best-ai-tools-for-", "").replace(/-/g, " ");
    title = `Top 10 Best AI Tools for ${targetFilter.replace(/(^\w|\s\w)/g, m => m.toUpperCase())} in 2026 | AuraAI`;
    description = `Compare the highest-rated AI software and companion tools for ${targetFilter}. Read verified directory user reviews, pricing specs, and check comparisons.`;
  } else if (slugStr.endsWith("-alternatives-for-developers")) {
    targetFilter = slugStr.replace("-alternatives-for-developers", "").replace(/-/g, " ");
    title = `Best ${targetFilter.replace(/(^\w|\s\w)/g, m => m.toUpperCase())} Alternatives for Developers in 2026`;
    description = `Searching for alternatives to ${targetFilter}? Check out our developer-audited guide to find the absolute best competitor software and tools.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://auraai.com/best/${slug}`
    }
  };
}

export default async function ProgrammaticSEOPage({ params }) {
  const { slug } = await params;
  const slugStr = slug.toLowerCase();

  // 1. Fetch all approved tools from SQLite Database
  const allTools = await prisma.tool.findMany({
    where: { approved: true },
    include: { reviews: true }
  });

  // 2. Determine target filtering keywords
  let targetFilter = "";
  let isFreeQuery = false;
  let pageHeading = "";
  let subHeading = "";

  if (slugStr.startsWith("free-ai-tools-for-")) {
    isFreeQuery = true;
    targetFilter = slugStr.replace("free-ai-tools-for-", "");
    const formattedName = targetFilter.replace(/-/g, " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    pageHeading = `Free AI Tools for ${formattedName}`;
    subHeading = `A developer-audited roster of completely zero-cost AI toolkits built specifically for ${formattedName.toLowerCase()} workflows.`;
  } else if (slugStr.startsWith("best-ai-tools-for-")) {
    targetFilter = slugStr.replace("best-ai-tools-for-", "");
    const formattedName = targetFilter.replace(/-/g, " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    pageHeading = `Best AI Tools for ${formattedName}`;
    subHeading = `Discover, review, and evaluate the top-tier AI software solutions trusted by ${formattedName.toLowerCase()} professionals.`;
  } else if (slugStr.endsWith("-alternatives-for-developers")) {
    targetFilter = slugStr.replace("-alternatives-for-developers", "");
    const formattedName = targetFilter.replace(/-/g, " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    pageHeading = `${formattedName} Alternatives for Developers`;
    subHeading = `High-efficiency companion tools, AI IDEs, and expert alternatives to ${formattedName} tailored for engineers.`;
  } else {
    // General fallback parsing
    targetFilter = slugStr.replace(/-/g, " ");
    const formattedName = targetFilter.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    pageHeading = `Top AI Tools for ${formattedName}`;
    subHeading = `Directory listings and verified specifications of AI tools matching: "${targetFilter}".`;
  }

  // 3. Programmatic Search Matcher
  const term = targetFilter.toLowerCase().replace(/-/g, " ");
  let filteredTools = allTools.filter(t => {
    // If querying free tools specifically, filter out paid tools
    if (isFreeQuery && t.pricing?.toLowerCase() !== "free") {
      return false;
    }

    const categoryText = t.categoryId.toLowerCase();
    const nameText = t.name.toLowerCase();
    const shortDescText = t.shortDescription.toLowerCase();
    const descText = t.description.toLowerCase();

    // Check tags matching
    let tagsText = "";
    try {
      const tagsArray = t.tags || [];
      tagsText = tagsArray.join(" ").toLowerCase();
    } catch (e) {}

    // Check features matching
    let featuresText = "";
    try {
      const parsedFeatures = JSON.parse(t.features || "[]");
      featuresText = parsedFeatures.join(" ").toLowerCase();
    } catch (e) {}

    return (
      categoryText.includes(term) ||
      nameText.includes(term) ||
      shortDescText.includes(term) ||
      descText.includes(term) ||
      tagsText.includes(term) ||
      featuresText.includes(term)
    );
  });

  // Safe fallback if zero tools match
  if (filteredTools.length === 0) {
    // Fetch a relevant category, e.g. coding tools, or standard premium listings
    filteredTools = allTools.slice(0, 6);
  }

  // Find top rated tool
  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return total / t.reviews.length;
  };
  const sortedByRating = [...filteredTools].sort((a, b) => getAverageRating(b) - getAverageRating(a));
  const topTool = sortedByRating[0];

  // Synthesize rich HTML Marketing Copy dynamically
  const introCopy = `Finding premium, reliable, and high-converting software can be a daunting task, especially when seeking AI-powered companion tools engineered specifically for ${targetFilter.replace(/-/g, " ")}. To simplify your search, AuraAI has audited and indexed the absolute top solutions in the market today. Based on verified rating matrices, developer integrations, pricing plans, and real-world efficiency, here is the official 2026 breakdown.`;

  // Dynamically compile JSON-LD Breadcrumbs and FAQ schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://auraai.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Best Lists",
        "item": `https://auraai.com/best/${slug}`
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Which is the single highest-rated tool for ${targetFilter.replace(/-/g, " ")}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${topTool.name} is currently the top-rated AI option in this category, scoring a robust ${getAverageRating(topTool).toFixed(1)}/5 stars across user feedback metrics. It stands out due to its ${topTool.shortDescription.toLowerCase()}.`
        }
      },
      {
        "@type": "Question",
        "name": "Are there completely free options available in this list?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": isFreeQuery 
            ? "Yes! Every single item in this curated checklist represents a 100% free tool with no mandatory subscription barriers, letting you optimize workflows for $0."
            : `Yes, multiple choices in this directory list feature completely free basic pricing tiers, including tools like ${filteredTools.filter(t => t.pricing?.toLowerCase() === "free").map(t => t.name).slice(0, 3).join(", ") || "our top recommended entries"}.`
        }
      },
      {
        "@type": "Question",
        "name": `What should I consider when selecting a companion AI tool?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "When choosing an AI tool, we strongly recommend reviewing developer API limits, trial constraints, hosting setups (Web-based vs Local), and team collaboration features. Test free tiers first to gauge real-world execution speed."
        }
      }
    ]
  };

  // Compile Internal link suggestions dynamically
  const internalLinkSuggestions = [
    { name: "Best AI Coding Tools", slug: "best-ai-tools-for-coding" },
    { name: "Free AI for Students", slug: "free-ai-tools-for-students" },
    { name: "Best Tools for Startups", slug: "best-ai-tools-for-startups" },
    { name: "Top Design Platforms", slug: "best-ai-tools-for-design" }
  ].filter(link => link.slug !== slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div style={{ paddingBottom: "5rem" }}>
        {/* Dynamic Translucent Gradient Header */}
        <div
          className="curated-deep-header"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(94, 92, 230, 0.08) 100%)",
            border: "1px solid var(--border-glass)",
            padding: "3.5rem 3rem",
            marginBottom: "3rem"
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <span
              className="hero-tagline"
              style={{
                letterSpacing: "2px",
                color: "var(--neon-cyan)",
                textTransform: "uppercase",
                fontWeight: "700",
                fontSize: "0.8rem"
              }}
            >
              Audited 2026 Directory List
            </span>
            <h1
              className="hero-title"
              style={{
                fontSize: "3rem",
                marginTop: "0.5rem",
                marginBottom: "1rem",
                fontWeight: "800",
                color: "var(--text-bright)",
                fontFamily: "var(--font-display)"
              }}
            >
              {pageHeading}
            </h1>
            <p
              className="curated-deep-intro"
              style={{
                margin: 0,
                color: "var(--text-main)",
                fontSize: "1.1rem",
                maxWidth: "800px",
                lineHeight: "1.6"
              }}
            >
              {subHeading}
            </p>
          </div>
        </div>

        {/* Dynamic Intros & Dynamic Specs Matrix */}
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              color: "var(--text-bright)",
              marginBottom: "1.5rem",
              fontWeight: "700"
            }}
          >
            Programmatic Overview
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "2.5rem",
              alignItems: "start"
            }}
          >
            <div>
              <p
                style={{
                  color: "var(--text-main)",
                  fontSize: "1.05rem",
                  lineHeight: "1.7",
                  margin: 0
                }}
              >
                {introCopy}
              </p>
            </div>

            {/* Quick Metrics Table Card */}
            <div
              className="detail-glass-card"
              style={{
                padding: "1.5rem",
                border: "1px solid var(--border-glass)"
              }}
            >
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-bright)",
                  fontSize: "0.95rem",
                  margin: "0 0 1rem 0",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}
              >
                Audited Specs Summary
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  fontSize: "0.85rem"
                }}
              >
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total AI Audited</span>
                  <strong style={{ color: "var(--text-bright)" }}>{filteredTools.length} tools</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Pricing Tier</span>
                  <strong style={{ color: "var(--text-bright)" }}>{isFreeQuery ? "100% Free Tiers" : "Mixed Plans"}</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "0.5rem" }}>
                  <span style={{ color: "var(--text-muted)" }}>Top-Rated Tool</span>
                  <strong style={{ color: "var(--neon-cyan)" }}>{topTool.name}</strong>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Latest Refresh</span>
                  <strong style={{ color: "var(--text-bright)" }}>May 2026</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div style={{ marginBottom: "5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              color: "var(--text-bright)",
              marginBottom: "1.75rem",
              fontWeight: "700"
            }}
          >
            Verified Software Directory
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "2rem"
            }}
          >
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>

        {/* Accordion FAQ Area */}
        <div style={{ marginBottom: "5rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              color: "var(--text-bright)",
              marginBottom: "1.5rem",
              fontWeight: "700"
            }}
          >
            Frequently Asked Questions
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}
          >
            {faqSchema.mainEntity.map((faq, idx) => (
              <details
                key={idx}
                className="detail-glass-card"
                style={{
                  padding: "1.25rem 2rem",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)",
                  border: "1px solid var(--border-glass)"
                }}
              >
                <summary
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
                    fontWeight: "600",
                    color: "var(--text-bright)",
                    listStyle: "none",
                    outline: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  {faq.name}
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>▼</span>
                </summary>
                <p
                  style={{
                    marginTop: "1rem",
                    color: "var(--text-main)",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    cursor: "default"
                  }}
                >
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Dynamic Topic Cluster Links */}
        <div
          className="detail-glass-card"
          style={{
            padding: "2rem",
            border: "1px solid var(--border-glass)",
            marginBottom: "5rem"
          }}
        >
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              color: "var(--text-bright)",
              margin: "0 0 1rem 0",
              fontWeight: "600"
            }}
          >
            Explore Related AI Clusters
          </h4>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              lineHeight: "1.5",
              marginBottom: "1.5rem"
            }}
          >
            Maximize organic crawl depth by jumping into related programmatic guides curated specifically for high-intent professional queries.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            {internalLinkSuggestions.map((suggested, idx) => (
              <Link
                key={idx}
                href={`/best/${suggested.slug}`}
                style={{
                  background: "rgba(0, 113, 227, 0.05)",
                  border: "1px solid rgba(0, 113, 227, 0.15)",
                  color: "var(--neon-cyan)",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "var(--transition-smooth)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 113, 227, 0.1)";
                  e.currentTarget.style.borderColor = "var(--neon-cyan)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(0, 113, 227, 0.05)";
                  e.currentTarget.style.borderColor = "rgba(0, 113, 227, 0.15)";
                }}
              >
                {suggested.name} &rarr;
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter capture box */}
        <NewsletterBox />
      </div>
    </>
  );
}
