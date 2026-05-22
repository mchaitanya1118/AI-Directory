import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdPlacement from "@/components/AdPlacement";

export const metadata = {
  title: "AuraAI Blog | SEO Editorials & Tutorials",
  description: "Explore professional workflow automations, detailed comparisons of AI large language models, local setups, and high-impact software stacks.",
};

export default async function BlogIndex({ searchParams }) {
  const activeCategory = searchParams.category || "all";
  
  const categories = ["all", "coding", "productivity", "design"];

  // Fetch articles from the database
  let dbArticles = [];
  try {
    if (activeCategory === "all") {
      dbArticles = await prisma.blogPost.findMany({
        orderBy: { date: 'desc' }
      });
    } else {
      dbArticles = await prisma.blogPost.findMany({
        where: { category: activeCategory },
        orderBy: { date: 'desc' }
      });
    }
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }

  return (
    <div className="blog-index-container">
      {/* HEADER SECTION */}
      <div className="curated-deep-header" style={{ padding: "2.5rem 0 1.5rem 0" }}>
        <span className="hero-tagline" style={{ letterSpacing: "2px" }}>
          AuraAI Editorials & Tutorials
        </span>
        <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
          Unlocking Workflow <span>Velocity</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "600px", margin: "0.75rem auto 0", lineHeight: "1.5" }}>
          Explore professional workflow automations, detailed comparisons of AI large language models, local setups, and high-impact software stacks.
        </p>
      </div>

      {/* BILLBOARD AD PLACEMENT */}
      <div style={{ marginBottom: "2.5rem" }}>
        <AdPlacement type="below-hero" />
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="category-tabs" style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border-glass)" }}>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog${cat === "all" ? "" : `?category=${cat}`}`}
            className={`category-tab ${activeCategory === cat ? "active" : ""}`}
            style={{ textTransform: "capitalize", textDecoration: "none" }}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* ARTICLES GRID */}
      {dbArticles.length === 0 ? (
        <div className="detail-glass-card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
            No articles found in this category yet. Stay tuned for daily editorial updates!
          </p>
        </div>
      ) : (
        <div className="curated-lists-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))" }}>
          {dbArticles.map((art) => (
            <div key={art.id} className="curated-card" style={{ minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span className="curated-card-tag" style={{ margin: 0 }}>
                    {art.category}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {art.date}
                  </span>
                </div>
                
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700", lineHeight: "1.3", marginBottom: "0.5rem" }}>
                  {art.title}
                </h3>
                
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden", height: "54px", marginBottom: "1rem" }}>
                  {art.summary}
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500" }}>
                  ⏱ {art.readTime}
                </span>
                <Link href={`/blog/${art.id}`} className="read-more-link" style={{ fontSize: "0.85rem" }}>
                  Read Article &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
