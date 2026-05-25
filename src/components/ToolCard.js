"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function ToolCard({ tool }) {
  const { comparedTools, toggleCompare, isMounted } = useApp();

  const isCompared = comparedTools.includes(tool.id);

  // Dynamic average rating
  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return parseFloat((total / t.reviews.length).toFixed(1));
  };

  const avgRating = getAverageRating(tool);
  const totalReviewsCount = tool.ratingCount + (tool.reviews ? tool.reviews.length : 0);

  // Star ratings visualization
  const roundedRating = Math.round(avgRating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          fontSize: "0.8rem",
          color: i <= roundedRating ? "var(--neon-gold)" : "rgba(0,0,0,0.1)",
        }}
      >
        ★
      </span>
    );
  }

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  return (
    <div className={`card-glass ${tool.sponsored ? "sponsored" : ""} ${tool.isCrawledLive ? "crawled-live" : ""}`} data-id={tool.id}>
      {tool.sponsored && <span className="sponsored-tag">Sponsored Spotlight</span>}
      {tool.isCrawledLive && <span className="crawled-live-tag">Crawled Live 🌐</span>}

      <div>
        <div className="card-header">
          <div
            className="card-logo-wrap"
            dangerouslySetInnerHTML={{ __html: tool.logo }}
          />
          <div className="card-title-area">
            <Link href={`/tool/${tool.id}`}>
              <h3 style={{ cursor: "pointer" }}>{tool.name}</h3>
            </Link>
            <div className="card-rating-row">
              <span className="star-rating">{stars}</span>
              <span className="rating-value">{avgRating}</span>
              <span className="rating-count">({totalReviewsCount})</span>
            </div>
          </div>
        </div>

        <p className="card-desc">{tool.shortDescription}</p>

        <div className="card-tags">
          {(tool.tags || []).slice(0, 3).map((tag, idx) => {
            const tagName = typeof tag === 'string' ? tag : tag?.tag?.name || "";
            return (
              <span key={idx} className="card-tag">
                {tagName}
              </span>
            );
          })}
        </div>
      </div>

      <div className="card-bottom-wrapper">
        <div className="card-footer">
          <span className={`card-pricing-badge pricing-${tool.pricing.toLowerCase()}`}>
            {tool.pricing}
          </span>

          <div className="card-actions">
            {isMounted && (
              <label
                className={`compare-checkbox-container ${isCompared ? "checked" : ""}`}
                onClick={() => toggleCompare(tool.id)}
              >
                <span className="compare-circle"></span> Compare
              </label>
            )}
            <Link href={`/tool/${tool.id}`} className="card-btn">
              Reviews
            </Link>
          </div>
        </div>
        <a
          href={ensureAbsoluteUrl(tool.website)}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="card-btn action-primary"
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <span>Visit Site</span>
          <span className="affiliate-badge" style={{ margin: 0 }}>Affiliate</span>
        </a>
      </div>
    </div>
  );
}
