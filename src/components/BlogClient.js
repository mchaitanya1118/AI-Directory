"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SchemaMarkup from "@/components/SchemaMarkup";

const AdPlacement = dynamic(() => import("@/components/AdPlacement"), { ssr: false });

export default function BlogClient({ article, relatedToolObjs }) {
  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  if (!article) {
    return (
      <div className="detail-glass-card" style={{ textAlign: "center", padding: "4rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
          Article Not Found
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          The requested tutorial or news article could not be located in our editorial database.
        </p>
        <Link href="/blog" className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }}>
          Back to Blog
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: article.title, path: `/blog/${article.id}` }
  ];

  // Parse stringified JSON arrays
  const bodyBlocks = (() => {
    try { return JSON.parse(article.body) || []; } catch(e) { return []; }
  })();
  const keywords = (() => {
    try { return JSON.parse(article.keywords) || []; } catch(e) { return []; }
  })();

  return (
    <div className="blog-reader-container">
      <SchemaMarkup type="breadcrumb" data={breadcrumbs} />

      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
        <span>&rsaquo;</span>
        <Link href="/blog" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Blog</Link>
        <span>&rsaquo;</span>
        <span style={{ color: "var(--neon-cyan)" }}>{article.category}</span>
      </div>

      <div className="detail-glass-card" style={{ marginBottom: "2rem", padding: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span className="curated-card-tag" style={{ margin: 0 }}>
            {article.category} Tutorial
          </span>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", gap: "1rem" }}>
            <span>⏱ {article.readTime}</span>
            <span>•</span>
            <span>Published: {article.date}</span>
          </div>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: "800", color: "var(--text-bright)", lineHeight: "1.2", marginBottom: "1rem" }}>
          {article.title}
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-main)", lineHeight: "1.6", margin: 0, fontStyle: "italic", borderLeft: "3px solid var(--neon-cyan)", paddingLeft: "1rem" }}>
          "{article.summary}"
        </p>
      </div>

      <div className="tool-detail-grid">
        <div className="tool-detail-main">
          <div className="detail-glass-card" style={{ padding: "2.5rem" }}>
            {bodyBlocks.map((block, idx) => {
              const showInlineAd = idx === 2;

              return (
                <div key={idx}>
                  {block.type === "heading" ? (
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "var(--text-bright)",
                        marginTop: "2rem",
                        marginBottom: "1rem"
                      }}
                    >
                      {block.text}
                    </h2>
                  ) : (
                    <p
                      style={{
                        fontSize: "1rem",
                        color: "var(--text-main)",
                        lineHeight: "1.7",
                        marginBottom: "1.25rem"
                      }}
                    >
                      {block.text}
                    </p>
                  )}

                  {showInlineAd && (
                    <div style={{ margin: "2rem 0" }}>
                      <AdPlacement type="in-content" />
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "2.5rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", alignSelf: "center", marginRight: "0.5rem" }}>Topics:</span>
              {keywords.map((kw, kidx) => (
                <span key={kidx} className="card-tag" style={{ fontSize: "0.8rem", padding: "0.25rem 0.60rem" }}>
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="tool-detail-sidebar" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {relatedToolObjs && relatedToolObjs.length > 0 && (
            <div className="detail-glass-card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
                Featured AI Platforms
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {relatedToolObjs.map((st) => {
                  const stars = [];
                  const rounded = Math.round(st.reviews && st.reviews.length > 0 ? st.reviews.reduce((s, r) => s + r.rating, 0) / st.reviews.length : st.rating);
                  for (let i = 1; i <= 5; i++) {
                    stars.push(
                      <span key={i} style={{ fontSize: "0.75rem", color: i <= rounded ? "var(--neon-gold)" : "rgba(0,0,0,0.1)" }}>
                        ★
                      </span>
                    );
                  }
                  return (
                    <div
                      key={st.id}
                      style={{
                        padding: "0.5rem 0",
                        borderBottom: "1px solid var(--border-glass)"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <div
                          style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-glass)",
                            borderRadius: "6px",
                            padding: "0.25rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px"
                          }}
                          dangerouslySetInnerHTML={{ __html: st.logo }}
                        />
                        <div style={{ minWidth: 0, flexGrow: 1 }}>
                          <Link href={`/tool/${st.id}`} style={{ textDecoration: "none" }}>
                            <span style={{ display: "block", fontWeight: "700", color: "var(--text-bright)", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {st.name}
                            </span>
                          </Link>
                          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                            <span>{stars}</span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>({st.pricing})</span>
                          </div>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.35", margin: "0.35rem 0 0.75rem 0", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {st.shortDescription}
                      </p>

                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link href={`/tool/${st.id}`} className="btn-secondary" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", flexGrow: 1, textAlign: "center" }}>
                          Reviews
                        </Link>
                         <a 
                          href={ensureAbsoluteUrl(st.website)} 
                          target="_blank" 
                          rel="noopener noreferrer nofollow sponsored" 
                          className="cta-btn action-primary" 
                          style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem", flexGrow: 1, textAlign: "center", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}
                        >
                          <span>Visit Site</span>
                          <span className="affiliate-badge" style={{ margin: 0, fontSize: "0.55rem", padding: "0.1rem 0.25rem" }}>Affiliate</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <AdPlacement type="sticky-sidebar" />
        </div>
      </div>
    </div>
  );
}
