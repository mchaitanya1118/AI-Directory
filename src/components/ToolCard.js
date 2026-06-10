"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import styles from "./ToolCard.module.css";

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
            <div className={styles['card-rating-row']}>
              <span className={styles['star-rating']}>{stars}</span>
              <span className={styles['rating-value']}>{avgRating}</span>
              <span className={styles['rating-count']}>({totalReviewsCount})</span>
            </div>
          </div>
        </div>

        <p className={styles['card-desc']}>{tool.shortDescription}</p>

        <div className={styles['card-tags']}>
          {(tool.tags || []).slice(0, 3).map((tag, idx) => {
            const tagName = typeof tag === 'string' ? tag : tag?.tag?.name || "";
            return (
              <span key={idx} className={styles['card-tag']}>
                {tagName}
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles['card-bottom-wrapper']}>
        <div className={styles['card-footer']}>
          <span className={`${styles['card-pricing-badge']} ${styles[`pricing-${tool.pricing.toLowerCase()}`]}`}>
            {tool.pricing}
          </span>

          <div className={styles['card-actions']}>
            <label
              className={`${styles['compare-checkbox-container']} ${isMounted && isCompared ? styles.checked : ""}`}
              onClick={() => toggleCompare(tool.id)}
            >
              <span className={styles['compare-circle']}></span> Compare
            </label>
            <Link href={`/tool/${tool.id}`} className={styles['card-btn']}>
              Reviews
            </Link>
          </div>
        </div>
        <a
          href={ensureAbsoluteUrl(tool.website)}
          rel="nofollow sponsored noopener noreferrer"
          target="_blank"
          aria-label={`Visit ${tool.name} website (affiliate link)`}
          className={`${styles['card-btn']} ${styles['action-primary']}`}
          style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <span>Visit Site</span>
          <span className="affiliate-badge" style={{ margin: 0 }}>Affiliate</span>
        </a>
      </div>
    </div>
  );
}
