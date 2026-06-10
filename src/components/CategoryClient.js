"use client";

import React, { useState, useEffect } from "react";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./CategoryClient.module.css";

export default function CategoryClient({ category, initialTools }) {
  const router = useRouter();

  const [tools, setTools] = useState(initialTools);
  const [crawlingStatus, setCrawlingStatus] = useState("idle");
  const [crawledToolName, setCrawledToolName] = useState("");

  // Sync tools state if initialTools changes from props
  useEffect(() => {
    setTools(initialTools);
  }, [initialTools]);

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [pricingFilter, setPricingFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Read URL search parameter on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const qParams = new URLSearchParams(window.location.search);
      const searchParam = qParams.get("search");
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, []);

  // Background Scraper Effect
  useEffect(() => {
    if (category === "all") {
      setCrawlingStatus("idle");
      setCrawledToolName("");
      return;
    }

    // Set status to scanning
    setCrawlingStatus("scanning");

    let isSubscribed = true;

    fetch(`/api/scrape/public?category=${category}`)
      .then((res) => {
        if (!res.ok) throw new Error("Web search failed");
        return res.json();
      })
      .then((data) => {
        if (!isSubscribed) return;
        if (data.success && data.newlyCrawled && data.newlyCrawled.length > 0) {
          const newTool = data.newlyCrawled[0];
          const markedTool = { ...newTool, isCrawledLive: true };

          setTools((prev) => {
            if (prev.some((t) => t.id === markedTool.id)) return prev;
            return [markedTool, ...prev];
          });

          setCrawledToolName(markedTool.name);
          setCrawlingStatus("discovered");

          // Keep display banner for 6 seconds
          setTimeout(() => {
            if (isSubscribed) {
              setCrawlingStatus("idle");
            }
          }, 6000);
        } else {
          setCrawlingStatus("idle");
        }
      })
      .catch((err) => {
        console.warn("Web search notice:", err.message);
        if (isSubscribed) {
          setCrawlingStatus("idle");
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [category, initialTools]);

  // Helpers
  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return total / t.reviews.length;
  };

  const getFilteredTools = () => {
    return tools
      .filter((t) => {
        // Category filtering (handled by server but kept here if 'all')
        if (category !== "all" && t.categoryId !== category) return false;

        // Search query filtering
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = t.name.toLowerCase().includes(query);
          const matchesDesc = t.shortDescription.toLowerCase().includes(query);
          const tagsArray = (() => { try { return JSON.parse(t.tags) || []; } catch(e) { return []; } })();
          const matchesTags = tagsArray.some((tag) => tag.toLowerCase().includes(query));
          const matchesCat = t.categoryId.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesTags && !matchesCat) return false;
        }

        // Pricing filter
        if (pricingFilter !== "all" && t.pricing.toLowerCase() !== pricingFilter.toLowerCase()) return false;

        // Rating filter
        if (ratingFilter !== "all") {
          const avgRating = getAverageRating(t);
          if (ratingFilter === "4.5" && avgRating < 4.5) return false;
          if (ratingFilter === "4.0" && avgRating < 4.0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return getAverageRating(b) - getAverageRating(a);
        } else {
          // Popularity (Total votes + length of custom reviews)
          const votesA = a.ratingCount + (a.reviews ? a.reviews.length : 0);
          const votesB = b.ratingCount + (b.reviews ? b.reviews.length : 0);
          return votesB - votesA;
        }
      });
  };

  const filtered = getFilteredTools();

  const categories = [
    { id: "all", name: "All Technologies" },
    { id: "coding", name: "AI Coding Tools" },
    { id: "image", name: "AI Image Generators" },
    { id: "video", name: "AI Video Tools" },
    { id: "productivity", name: "AI Productivity Tools" },
  ];

  const handleResetAll = () => {
    setSearchQuery("");
    setPricingFilter("all");
    setRatingFilter("all");
    setSortBy("popularity");
    // Clear URL query params
    if (typeof window !== "undefined") {
      router.push(`/category/${category}`);
    }
  };

  return (
    <div className={styles["category-explorer-container"]}>
      <div className="section-headline-container">
        <div>
          <h2 className="section-title" style={{ textTransform: "capitalize" }}>
            {category === "all" ? "Explore AI Directory" : `${category} Tools`}
          </h2>
          <p className="section-subtitle">
            Real-time dynamic filters spanning monetization channels and technical specifications.
          </p>
        </div>
        <div className={styles["results-count"]}>Showing {filtered.length} platforms</div>
      </div>

      {crawlingStatus !== "idle" && (
        <div className={`${styles["scraper-pill"]} ${styles[crawlingStatus]}`}>
          {crawlingStatus === "scanning" && (
            <>
              <div className={styles["scraper-spinner"]} />
              <span>Searching web registries for newly launched <strong style={{ textTransform: 'capitalize' }}>{category}</strong> platforms...</span>
            </>
          )}
          {crawlingStatus === "discovered" && (
            <>
              <span className="telemetry-badge-pulse" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#00F2FE', marginRight: '4px', animation: 'telemetry-pulse 1.5s infinite' }}></span>
              <span><strong>Live Scan Success:</strong> Found and added <strong>{crawledToolName}</strong> to database!</span>
            </>
          )}
        </div>
      )}

      <div className={styles["category-tabs"]}>
        {categories.map((cat) => {
          const isActive = cat.id === category;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`${styles["category-tab"]} ${isActive ? styles["active"] : ""}`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      <div className="search-wrapper" style={{ maxWidth: "100%", marginBottom: "1.5rem" }}>
        <input
          type="text"
          className="search-input"
          placeholder="Refine search by keyword, tag, or spec..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="search-icon-svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>

      <div className={styles["filter-control-panel"]}>
        <div className={styles["filters-left"]}>
          <select
            value={pricingFilter}
            onChange={(e) => setPricingFilter(e.target.value)}
            className={styles["select-filter"]}
          >
            <option value="all">All Pricing Models</option>
            <option value="free">Free Only</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className={styles["select-filter"]}
          >
            <option value="all">All Verified Ratings</option>
            <option value="4.5">Rating &gt;= 4.5</option>
            <option value="4.0">Rating &gt;= 4.0</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles["select-filter"]}
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="rating">Sort by Top Rated</option>
          </select>
        </div>

        <button className="btn-secondary" onClick={handleResetAll} style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
          Clear Filters
        </button>
      </div>

      {searchQuery && (
        <div className={styles["active-filters-badges"]}>
          <div className={styles["filter-badge"]}>
            Search: "{searchQuery}"
            <span className={styles["remove-btn"]} onClick={() => setSearchQuery("")}>
              &times;
            </span>
          </div>
        </div>
      )}

      <div className={styles["sponsored-carousel"]} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {filtered.length === 0 ? (
          <div className="detail-glass-card" style={{ textAlign: "center", padding: "4rem", width: "100%" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
              No AI tools found
            </h3>
            <p style={{ color: "var(--text-muted)" }}>
              Try adjusting your keywords, pricing tiers, or category selectors.
            </p>
            <button className="cta-btn" onClick={handleResetAll} style={{ marginTop: "1.5rem" }}>
              Reset All Filters
            </button>
          </div>
        ) : (
          filtered.map((t) => <ToolCard key={t.id} tool={t} />)
        )}
      </div>
    </div>
  );
}
