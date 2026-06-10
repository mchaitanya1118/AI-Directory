"use client";

import React, { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import styles from "./ToolCard.module.css";

export default function ToolCard({ tool }) {
  const { comparedTools, toggleCompare, isMounted } = useApp();

  const isCompared = comparedTools.includes(tool.id);

  // Memoized average rating calculation
  const avgRating = useMemo(() => {
    if (!tool.reviews || tool.reviews.length === 0) return tool.rating || 0;
    const total = tool.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return parseFloat((total / tool.reviews.length).toFixed(1));
  }, [tool.rating, tool.reviews]);

  // Memoized total reviews count
  const totalReviewsCount = useMemo(() => {
    return tool.ratingCount + (tool.reviews ? tool.reviews.length : 0);
  }, [tool.ratingCount, tool.reviews]);

  // Memoized star rendering
  const stars = useMemo(() => {
    const roundedRating = Math.round(avgRating);
    const result = [];
    for (let i = 1; i <= 5; i++) {
      result.push(
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
    return result;
  }, [avgRating]);

  // Memoized absolute website URL formatter
  const absoluteWebsiteUrl = useMemo(() => {
    if (!tool.website) return "#";
    const trimmed = tool.website.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }, [tool.website]);

  return (
    <div className={`${styles['card-glass']} ${tool.sponsored ? styles.sponsored : ""} ${tool.isCrawledLive ? styles['crawled-live'] : ""}`} data-id={tool.id}>
      {tool.sponsored && <span className={styles['sponsored-tag']}>Sponsored Spotlight</span>}
      {tool.isCrawledLive && <span className={styles['crawled-live-tag']}>Crawled Live 🌐</span>}

      <div>
        <div className={styles['card-header']}>
          <div className={styles['card-logo-wrap']}>
            {tool.logo.startsWith('<svg') ? (
              <div dangerouslySetInnerHTML={{ __html: tool.logo }} />
            ) : (
              <Image
                src={tool.logo || "/placeholder.png"}
                alt={`${tool.name} logo`}
                width={48}
                height={48}
                loading="lazy"
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          <div className={styles['card-title-area']}>
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

        <p className={styles['card-desc']}>{tool.shortDescription}</p>

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

      <div className={styles['card-bottom-wrapper']}>
        <div className={styles['card-footer']}>
          <span className={`card-pricing-badge pricing-${tool.pricing.toLowerCase()}`}>
            {tool.pricing}
          </span>

          <div className={styles['card-actions']}>
            <label
              className={`compare-checkbox-container ${isMounted && isCompared ? "checked" : ""}`}
              onClick={() => toggleCompare(tool.id)}
            >
              <span className="compare-circle"></span> Compare
            </label>
            <Link href={`/tool/${tool.id}`} className="card-btn">
              Reviews
            </Link>
          </div>
        </div>
        <a
          href={absoluteWebsiteUrl}
          rel="nofollow sponsored noopener noreferrer"
          target="_blank"
          aria-label={`Visit ${tool.name} website (affiliate link)`}
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
