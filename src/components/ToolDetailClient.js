"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdPlacement from "@/components/AdPlacement";
import SchemaMarkup from "@/components/SchemaMarkup";
import InternalLinks from "@/components/InternalLinks";

export default function ToolDetailClient({ tool, similarTools, betterAlternatives = [], usersAlsoLiked = [] }) {
  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const { comparedTools, toggleCompare, startComparison, addReview, isMounted } = useApp();
  const router = useRouter();
  const { data: session } = useSession();

  // Review states
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  
  // Accordion active index
  const [activeFaq, setActiveFaq] = useState(null);

  if (!tool) {
    return (
      <div className="detail-glass-card" style={{ textAlign: "center", padding: "4rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
          Tool Not Found
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          The requested AI tool could not be located in our directory.
        </p>
        <Link href="/" className="cta-btn" style={{ textDecoration: "none", display: "inline-block" }}>
          Return Home
        </Link>
      </div>
    );
  }

  // Parse JSON strings back to objects (since Prisma stores them as stringified JSON in SQLite)
  const parseJsonSafe = (str) => {
    try { return JSON.parse(str); } catch(e) { return []; }
  };
  
  const features = parseJsonSafe(tool.features);
  const pros = parseJsonSafe(tool.pros);
  const cons = parseJsonSafe(tool.cons);
  const useCases = parseJsonSafe(tool.useCases);
  const faqs = parseJsonSafe(tool.faqs);
  const comparisons = parseJsonSafe(tool.comparisons);
  let specs = {};
  try { specs = JSON.parse(tool.specs); } catch(e) { specs = {}; }

  // Dynamic average rating
  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return parseFloat((total / t.reviews.length).toFixed(1));
  };

  const avgRating = getAverageRating(tool);
  const totalReviewsCount = tool.ratingCount + (tool.reviews ? tool.reviews.length : 0);
  const isCompared = comparedTools.includes(tool.id);

  // Star ratings visualization
  const roundedRating = Math.round(avgRating);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{
          fontSize: "1rem",
          color: i <= roundedRating ? "var(--neon-gold)" : "rgba(0,0,0,0.1)",
        }}
      >
        ★
      </span>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be signed in to post a review.");
      router.push("/login");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a review comment.");
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          rating: userRating,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        alert("Thank you! Your review has been successfully added.");
        setComment("");
        setUserRating(5);
        router.refresh(); // Refresh page to see new review
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      alert("An error occurred submitting your review.");
    }
  };

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      if (session) {
        try {
          const res = await fetch(`/api/bookmarks/check?toolId=${tool.id}`);
          if (res.ok) {
            const data = await res.json();
            setIsBookmarked(data.bookmarked);
          }
        } catch(e) {}
      }
    };
    checkBookmark();
  }, [session, tool.id]);

  const handleBookmark = async () => {
    if (!session) {
      alert("You must be signed in to save bookmarks.");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolId: tool.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.bookmarked);
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tool-detail-container">
      <SchemaMarkup
        type="software"
        data={{
          id: tool.id,
          name: tool.name,
          shortDescription: tool.shortDescription,
          description: tool.description,
          pricing: tool.pricing,
          avgRating: avgRating,
          totalReviewsCount: totalReviewsCount,
          reviews: tool.reviews
        }}
      />
      
      {faqs && faqs.length > 0 && (
        <SchemaMarkup type="faq" data={faqs} />
      )}

      <SchemaMarkup
        type="breadcrumb"
        data={[
          { name: "Home", path: "/" },
          { name: tool.categoryId.toUpperCase(), path: `/category/${tool.categoryId}` },
          { name: tool.name, path: `/tool/${tool.id}` }
        ]}
      />

      <div 
        className="breadcrumb-nav" 
        style={{ 
          marginBottom: "1.5rem", 
          fontSize: "0.85rem", 
          color: "var(--text-muted)", 
          display: "flex", 
          gap: "0.5rem", 
          alignItems: "center" 
        }}
      >
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--text-bright)"} onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}>
          Home
        </Link>
        <span>/</span>
        <Link href={`/category/${tool.categoryId}`} style={{ color: "var(--text-muted)", textDecoration: "none", textTransform: "capitalize", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "var(--text-bright)"} onMouseLeave={(e) => e.target.style.color = "var(--text-muted)"}>
          {tool.categoryId}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--neon-cyan)" }}>{tool.name}</span>
      </div>

      <div className="detail-glass-card" style={{ marginBottom: "2rem" }}>
        <div className="detail-header-block">
          <div className="detail-brand-row">
            <div
              className="detail-logo-wrap"
              dangerouslySetInnerHTML={{ __html: tool.logo }}
            />
            <div className="detail-brand-info">
              <span className="curated-card-tag" style={{ margin: 0, fontSize: "0.8rem" }}>
                {tool.categoryId} AI TOOL
              </span>
              <h1 style={{ marginTop: "0.25rem" }}>{tool.name}</h1>
              <div className="detail-sub-meta">
                <span className="star-rating">{stars}</span>
                <span className="rating-value" style={{ fontWeight: 600, color: "var(--neon-gold)" }}>{avgRating}</span>
                <span className="rating-count" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>({totalReviewsCount} reviews)</span>
                <span style={{ color: "var(--border-glass)" }}>|</span>
                <span className={`card-pricing-badge pricing-${tool.pricing.toLowerCase()}`}>{tool.pricing}</span>
              </div>
            </div>
          </div>
          <div className="detail-visit-affiliate-box" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleBookmark}
                className="btn-secondary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "46px",
                  padding: "0 1rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  color: isBookmarked ? "var(--neon-cyan)" : "var(--text-bright)",
                  borderColor: isBookmarked ? "var(--neon-cyan)" : "var(--border-glass)",
                }}
              >
                {isBookmarked ? "★ Saved" : "☆ Save"}
              </button>
              <a
                href={ensureAbsoluteUrl(tool.website)}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="cta-btn action-primary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: "46px", padding: "0 1.5rem", borderRadius: "8px", fontWeight: "600", textDecoration: "none" }}
              >
                Visit Official Site &rarr;
              </a>
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Affiliate Direct Referral Link</span>
          </div>
        </div>
        <p style={{ fontSize: "1.1rem", color: "var(--text-bright)", lineHeight: "1.6", borderTop: "1px solid var(--border-glass)", paddingTop: "1.5rem" }}>
          {tool.shortDescription}
        </p>
        <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            <strong>Pricing Details:</strong> {tool.pricingDetails}
          </span>
          {isMounted && (
            <label
              className={`compare-checkbox-container ${isCompared ? "checked" : ""}`}
              onClick={() => toggleCompare(tool.id)}
              style={{ marginLeft: "auto", fontSize: "0.9rem", color: isCompared ? "var(--neon-cyan)" : "var(--text-muted)" }}
            >
              <span className="compare-circle"></span> {isCompared ? "In Comparison List" : "Add to Comparison List"}
            </label>
          )}
        </div>
      </div>

      <div className="tool-detail-grid">
        <div className="tool-detail-main">
          <div className="detail-glass-card">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1rem" }}>
              Product Overview & Capabilities
            </h3>
            <p style={{ color: "var(--text-main)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
              {tool.description}
            </p>

            <h4 style={{ fontSize: "0.95rem", fontWeight: "700", textTransform: "uppercase", color: "var(--neon-cyan)", letterSpacing: "0.5px", marginBottom: "0.75rem" }}>
              Core Features
            </h4>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.75rem", padding: 0, margin: 0 }}>
              {features.map((feat, idx) => (
                <li key={idx} style={{ fontSize: "0.9rem", color: "var(--text-main)", position: "relative", paddingLeft: "1.25rem" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--neon-cyan)" }}>✦</span> {feat}
                </li>
              ))}
            </ul>
          </div>

          <AdPlacement type="in-content" />

          {useCases && useCases.length > 0 && (
            <div className="detail-glass-card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.25rem" }}>
                Real-World Workflows & Use Cases
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {useCases.map((useCase, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "1.25rem",
                      borderRadius: "14px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-glass)",
                      alignItems: "flex-start"
                    }}
                  >
                    <span 
                      style={{
                        background: "linear-gradient(135deg, var(--neon-cyan) 0%, #4FACFE 100%)",
                        color: "#080710",
                        borderRadius: "50%",
                        width: "26px",
                        height: "26px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        flexShrink: 0
                      }}
                    >
                      {idx + 1}
                    </span>
                    <p style={{ margin: 0, color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      {useCase}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pros-cons-grid">
            <div className="pros-box">
              <h4>Strengths & Pros</h4>
              <ul className="pros-cons-list" style={{ padding: 0, margin: 0 }}>
                {pros.map((pro, idx) => (
                  <li key={idx}>{pro}</li>
                ))}
              </ul>
            </div>
            <div className="cons-box">
              <h4>Limitations & Cons</h4>
              <ul className="pros-cons-list" style={{ padding: 0, margin: 0 }}>
                {cons.map((con, idx) => (
                  <li key={idx}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          {faqs && faqs.length > 0 && (
            <div className="detail-glass-card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.25rem" }}>
                Frequently Asked Questions about {tool.name}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div
                      key={idx}
                      style={{
                        border: "1px solid var(--border-glass)",
                        borderRadius: "12px",
                        background: "var(--bg-card)",
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        style={{
                          width: "100%",
                          padding: "1.25rem",
                          background: "none",
                          border: "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                          textAlign: "left",
                          color: "var(--text-bright)",
                          fontWeight: "600",
                          fontSize: "1rem"
                        }}
                      >
                        <span>{faq.q}</span>
                        <span 
                          style={{
                            color: isOpen ? "var(--neon-cyan)" : "var(--text-muted)",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            fontSize: "1.2rem",
                            lineHeight: 1
                          }}
                        >
                          ▾
                        </span>
                      </button>
                      <div
                        style={{
                          maxHeight: isOpen ? "500px" : "0",
                          opacity: isOpen ? 1 : 0,
                          overflow: "hidden",
                          transition: "all 0.3s cubic-bezier(0, 1, 0, 1)",
                          padding: isOpen ? "1.25rem 1.5rem" : "0",
                          color: "var(--text-main)",
                          fontSize: "0.925rem",
                          lineHeight: "1.6",
                          borderTop: isOpen ? "1px solid var(--border-glass)" : "none"
                        }}
                      >
                        <p style={{ margin: 0, paddingTop: isOpen ? "0.75rem" : 0 }}>
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {comparisons && comparisons.length > 0 && (
            <div className="detail-glass-card">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1rem" }}>
                Direct Head-to-Head Comparisons
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: "1.5" }}>
                Compare specs, pricing models, user rating benchmarks, and editor recommendations side-by-side:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {comparisons.map((compTargetId) => {
                  return (
                    <button
                      key={compTargetId}
                      onClick={() => {
                        startComparison(tool.id, compTargetId);
                        router.push("/compare");
                      }}
                      className="btn-secondary"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.8rem 1.4rem",
                        borderRadius: "12px",
                        border: "1px solid var(--border-glass)",
                        background: "var(--bg-card)",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--neon-cyan)";
                        e.currentTarget.style.background = "var(--bg-card)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-glass)";
                        e.currentTarget.style.background = "var(--bg-card)";
                      }}
                    >
                      <span style={{ fontWeight: "700", color: "var(--text-bright)" }}>
                        {tool.name} <span style={{ color: "var(--neon-cyan)", fontWeight: "500" }}>vs</span> {compTargetId}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "var(--neon-cyan)" }}>&rarr;</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="detail-glass-card">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.5rem" }}>
              User Reviews ({tool.reviews ? tool.reviews.length : 0})
            </h3>

            <div className="reviews-section">
              {(!tool.reviews || tool.reviews.length === 0) ? (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  No user reviews submitted yet. Be the first to share your experience!
                </p>
              ) : (
                tool.reviews.map((rev) => {
                  const revStars = [];
                  for (let i = 1; i <= 5; i++) {
                    revStars.push(
                      <span
                        key={i}
                        style={{
                          fontSize: "0.8rem",
                          color: i <= rev.rating ? "var(--neon-gold)" : "rgba(0,0,0,0.1)",
                        }}
                      >
                        ★
                      </span>
                    );
                  }
                  return (
                    <div key={rev.id} className="review-item">
                      <div className="review-meta">
                        <span className="review-user">@{rev.username}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span className="star-rating">{revStars}</span>
                          <span className="review-date">{rev.date}</span>
                        </div>
                      </div>
                      <p className="review-comment" style={{ marginTop: "0.5rem" }}>{rev.comment}</p>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleReviewSubmit} className="add-review-form">
              <h4 className="form-title">Write a Review</h4>
              
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <div className="rating-select-stars">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <span
                      key={starValue}
                      className={`star-input ${(hoverRating || userRating) >= starValue ? "active" : ""}`}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(starValue)}
                      style={{ fontSize: "1.75rem", cursor: "pointer", transition: "color 0.15s" }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rev-username">
                  Username
                </label>
                <input
                  type="text"
                  id="rev-username"
                  className="form-input"
                  placeholder="e.g. dev_guru"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rev-comment">
                  Review Message
                </label>
                <textarea
                  id="rev-comment"
                  className="form-textarea"
                  placeholder="Describe your workflows, pricing thoughts, strengths, or issues with this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="cta-btn action-primary"
                style={{ width: "100%", height: "42px", borderRadius: "8px", marginTop: "0.5rem", cursor: "pointer", border: "none" }}
              >
                Submit Authenticated Review
              </button>
            </form>
          </div>
        </div>

        <div className="tool-detail-sidebar" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="detail-glass-card">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
              Technical Specifications
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600" }}>Supported Platforms</span>
                <span style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{specs?.platform || "Web / Desktop / API"}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600" }}>Deployment Hosting</span>
                <span style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{specs?.hosting || "Cloud-Based"}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600" }}>API Access Availability</span>
                <span style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{specs?.apiAccess || "Available"}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600" }}>Trial Length Parameters</span>
                <span style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{specs?.trialLength || "Free Tier / Demo"}</span>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "600" }}>Primary Target Audience</span>
                <span style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{specs?.targetAudience || "General Users"}</span>
              </div>
            </div>
          </div>

          <AdPlacement type="sticky-sidebar" />

          <div className="detail-glass-card">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
              Similar Alternatives
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {similarTools.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                  No alternative listings found in this category yet.
                </p>
              ) : (
                similarTools.map((st) => (
                  <div
                    key={st.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid var(--border-glass)"
                    }}
                  >
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
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <Link href={`/tool/${st.id}`} style={{ textDecoration: "none" }}>
                        <span style={{ display: "block", fontWeight: "600", color: "var(--text-bright)", fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {st.name}
                        </span>
                      </Link>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                        <span>★ {getAverageRating(st)}</span>
                        <span>•</span>
                        <span>{st.pricing}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {similarTools.length > 0 && (
                <div style={{ marginTop: "0.5rem", textAlign: "center" }}>
                  <Link 
                    href={`/alternatives/${tool.id}`}
                    style={{ fontSize: "0.85rem", color: "var(--neon-cyan)", textDecoration: "none", fontWeight: "600" }}
                  >
                    View Top {tool.name} Alternatives &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI RECOMMENDATION ENGINE (DEDICATED FULL-WIDTH SECTION) */}
      <div 
        className="detail-glass-card" 
        style={{ 
          marginTop: "1.5rem", 
          padding: "2rem",
          display: "flex", 
          flexDirection: "column", 
          gap: "2rem"
        }}
      >
        <div>
          <h2 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "1.6rem", 
            fontWeight: "800", 
            color: "var(--text-bright)", 
            letterSpacing: "-0.5px",
            marginBottom: "0.4rem"
          }}>
            AI Recommendations & Smart Matching
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
            Intelligent alternatives, high-match user selections, and direct comparison stacks.
          </p>
        </div>

        <div 
          className="recommendations-grid" 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "2rem" 
          }}
        >
          {/* Column 1: Better Alternatives */}
          <div>
            <h3 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "1.1rem", 
              fontWeight: "700", 
              color: "var(--text-bright)", 
              marginBottom: "1rem", 
              borderBottom: "1px solid var(--border-glass)", 
              paddingBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span style={{ color: "var(--neon-cyan)" }}>★</span> Top-Rated Alternatives
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {betterAlternatives.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", margin: "0.5rem 0" }}>
                  This tool holds the leading rating in this category.
                </p>
              ) : (
                betterAlternatives.map((alt) => (
                  <div 
                    key={alt.id}
                    className="rec-item-card"
                    style={{
                      background: "rgba(255, 255, 255, 0.4)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "14px",
                      padding: "1rem",
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      transition: "var(--transition-smooth)",
                      cursor: "pointer"
                    }}
                  >
                    <div 
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "8px",
                        padding: "0.25rem",
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                      dangerouslySetInnerHTML={{ __html: alt.logo }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <Link href={`/tool/${alt.id}`} style={{ textDecoration: "none" }}>
                        <span style={{ display: "block", fontWeight: "700", color: "var(--text-bright)", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {alt.name}
                        </span>
                      </Link>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        <span style={{ color: "var(--neon-gold)", fontWeight: "600" }}>★ {getAverageRating(alt)}</span>
                        <span>•</span>
                        <span>{alt.pricing}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Users Also Liked */}
          <div>
            <h3 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "1.1rem", 
              fontWeight: "700", 
              color: "var(--text-bright)", 
              marginBottom: "1rem", 
              borderBottom: "1px solid var(--border-glass)", 
              paddingBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span style={{ color: "var(--neon-purple)" }}>♥</span> Users Also Liked
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {usersAlsoLiked.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", margin: "0.5rem 0" }}>
                  Discovering matching collections based on tags...
                </p>
              ) : (
                usersAlsoLiked.map((liked) => (
                  <div 
                    key={liked.id}
                    className="rec-item-card"
                    style={{
                      background: "rgba(255, 255, 255, 0.4)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "14px",
                      padding: "1rem",
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                      transition: "var(--transition-smooth)",
                      cursor: "pointer"
                    }}
                  >
                    <div 
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-glass)",
                        borderRadius: "8px",
                        padding: "0.25rem",
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                      dangerouslySetInnerHTML={{ __html: liked.logo }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <Link href={`/tool/${liked.id}`} style={{ textDecoration: "none" }}>
                        <span style={{ display: "block", fontWeight: "700", color: "var(--text-bright)", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {liked.name}
                        </span>
                      </Link>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        <span style={{ color: "var(--neon-gold)", fontWeight: "600" }}>★ {getAverageRating(liked)}</span>
                        <span>•</span>
                        <span>{liked.pricing}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: Direct Head-to-Head Compare */}
          <div>
            <h3 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "1.1rem", 
              fontWeight: "700", 
              color: "var(--text-bright)", 
              marginBottom: "1rem", 
              borderBottom: "1px solid var(--border-glass)", 
              paddingBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span style={{ color: "var(--neon-cyan)" }}>⇄</span> Head-to-Head Stacks
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {similarTools.slice(0, 2).map((sim) => (
                <div 
                  key={sim.id}
                  className="rec-item-card"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "14px",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    transition: "var(--transition-smooth)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>VS</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-bright)" }}>{sim.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                    <Link 
                      href={`/compare/${tool.id}-vs-${sim.id}`}
                      style={{ 
                        flexGrow: 1,
                        background: "rgba(0, 113, 227, 0.08)",
                        color: "var(--neon-cyan)",
                        border: "1px solid rgba(0, 113, 227, 0.15)",
                        padding: "0.4rem 0.5rem",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textAlign: "center",
                        textDecoration: "none"
                      }}
                    >
                      Compare Matrix
                    </Link>
                    <Link 
                      href={`/tool/${sim.id}`}
                      style={{ 
                        flexGrow: 1,
                        background: "rgba(0, 0, 0, 0.03)",
                        color: "var(--text-main)",
                        border: "1px solid var(--border-glass)",
                        padding: "0.4rem 0.5rem",
                        borderRadius: "8px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textAlign: "center",
                        textDecoration: "none"
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Contextual SEO Internal Linking Grid */}
        <InternalLinks currentTool={tool} />

      </div>
    </div>
  );
}
