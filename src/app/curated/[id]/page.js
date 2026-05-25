"use client";

import React, { use } from "react";
import { useApp } from "@/context/AppContext";
import { CURATED_PAGES } from "@/data/data";
import Link from "next/link";

export default function CuratedPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { tools } = useApp();

  const pageObj = CURATED_PAGES[id];

  if (!pageObj) {
    return (
      <div className="detail-glass-card" style={{ textAlign: "center", padding: "4rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
          Guide Not Found
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          The requested editorial ranking guide could not be located.
        </p>
        <Link href="/" className="cta-btn">
          Return Home
        </Link>
      </div>
    );
  }

  // Dynamic average rating
  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return parseFloat((total / t.reviews.length).toFixed(1));
  };

  const linkedTools = pageObj.listIds
    .map((toolId) => tools.find((t) => t.id === toolId))
    .filter(Boolean);

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  return (
    <div className="curated-deep-page">
      <div className="curated-deep-header">
        <span className="hero-tagline" style={{ letterSpacing: "2px" }}>
          Curated Editorial Review
        </span>
        <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
          {pageObj.title}
        </h1>
        <p className="curated-deep-intro">"{pageObj.introduction}"</p>
      </div>

      <div className="curated-items-stack">
        {linkedTools.map((t, idx) => {
          const avg = getAverageRating(t);
          return (
            <div key={t.id} className="curated-item-row">
              <div className="rank-badge">#{idx + 1}</div>
              <div className="detail-glass-card" style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "8px",
                        padding: "0.35rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      dangerouslySetInnerHTML={{ __html: t.logo }}
                    />
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.5rem",
                          color: "var(--text-bright)",
                          fontWeight: "700",
                        }}
                      >
                        {t.name}
                      </h3>
                      <div className="card-rating-row">
                        <span className="rating-value" style={{ color: "var(--neon-gold)" }}>
                          ★ {avg}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          |
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            textTransform: "uppercase",
                          }}
                        >
                          {t.pricing}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href={`/tool/${t.id}`}
                      className="btn-secondary"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                    >
                      Detailed Reviews
                    </Link>
                    <a
                      href={ensureAbsoluteUrl(t.website)}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="cta-btn action-primary"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                    >
                      <span>Visit Website</span>
                      <span className="affiliate-badge" style={{ margin: 0, fontSize: "0.55rem", padding: "0.1rem 0.25rem" }}>Affiliate</span>
                    </a>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-main)",
                    marginBottom: "1rem",
                    lineHeight: "1.5",
                  }}
                >
                  {t.description}
                </p>

                <div
                  style={{
                    background: "rgba(255,255,255,0.01)",
                    borderRadius: "8px",
                    padding: "1rem",
                    border: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      color: "var(--neon-cyan)",
                      letterSpacing: "0.5px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Key Feature Spotlight
                  </h4>
                  <ul style={{ listStyle: "none" }}>
                    {t.features.slice(0, 3).map((feat, fidx) => (
                      <li
                        key={fidx}
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.25rem",
                        }}
                      >
                        • {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="curated-verdict-box">
        <h4 className="verdict-header">Our Editorial Conclusion</h4>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-main)",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: pageObj.verdict }}
        />
      </div>
    </div>
  );
}
