"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import InternalLinks from "@/components/InternalLinks";
import styles from "./CompareMatrixClient.module.css";

export default function CompareMatrixClient({ initialComparedTools = [] }) {
  const { tools, comparedTools, clearCompare, isMounted } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Use props if provided (dynamic SEO route), otherwise use global state
  const isDynamicRoute = initialComparedTools.length > 0;
  
  const comparedObjs = isDynamicRoute
    ? initialComparedTools
    : comparedTools.map((id) => tools.find((t) => t.id === id)).filter(Boolean);

  // Dynamic average rating
  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return parseFloat((total / t.reviews.length).toFixed(1));
  };

  // Hydration safety: do not show empty screen before client mounts (only for client route)
  if (!mounted && !isDynamicRoute && !isMounted) {
    return <div style={{ minHeight: "50vh" }}></div>;
  }

  if (comparedObjs.length < 2 && !isDynamicRoute) {
    return (
      <div className={styles["detail-glass-card"]} style={{ textAlign: "center", padding: "4rem" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
          Comparison Tray Empty
        </h3>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Please select at least two tools from our directory cards or headers to perform analysis.
        </p>
        <Link href="/category/all" className="cta-btn">
          Browse AI Directory
        </Link>
      </div>
    );
  }

  const specKeys = [
    { key: "category", label: "Core Category" },
    { key: "pricingDetails", label: "Pricing Structure" },
    { key: "platform", label: "Supported Platforms", isSpec: true },
    { key: "hosting", label: "Hosting / Deployment", isSpec: true },
    { key: "apiAccess", label: "API Availability", isSpec: true },
    { key: "trialLength", label: "Trial Parameters", isSpec: true },
    { key: "targetAudience", label: "Target Audience", isSpec: true },
  ];

  const getVerdict = (t) => {
    if (t.id === "cursor") return "<strong>Highly Recommended</strong> for modern engineers wanting modular, AI-first directory and folder refactoring.";
    if (t.id === "claude") return "<strong>Best Overall Productivity Tool</strong> for writing, logic parsing, and multi-doc reasoning.";
    if (t.id === "perplexity") return "<strong>Ultimate Web Searcher</strong>. Highly recommended for students requiring validated external sources.";
    if (t.id === "midjourney") return "<strong>Aesthetic Gold Standard</strong>. Ideal for final production cinematic visuals and artworks.";
    if (t.id === "stablediffusion") return "<strong>Highly Customizable</strong>. Recommended for experienced editors wanting 100% control locally.";
    return `A superb, highly capable <strong>${t.pricing}</strong> tool, scoring an impressive <strong>${getAverageRating(t)} ★</strong> AuraScore.`;
  };

  return (
    <div className={styles["compare-screen-container"]}>
      <div className={styles["section-headline-container"]}>
        <div>
          <h2 className={styles["section-title"]}>AuraAI Comparative Matrix</h2>
          <p className={styles["section-subtitle"]}>
            Side-by-side technical specs, monetized parameters, and editorial conclusions.
          </p>
        </div>
        {!isDynamicRoute && (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn-secondary" onClick={clearCompare}>
              Clear All
            </button>
            <Link href="/category/all" className="btn-secondary">
              Add More Tools
            </Link>
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <table className={styles["compare-matrix-table"]}>
          <thead>
            <tr>
              <th>Specifications</th>
              {comparedObjs.map((t) => (
                <th key={t.id} className={styles["compare-header-cell"]} style={{ width: `calc(75% / ${comparedObjs.length})` }}>
                  <div className={styles["compare-header-cell"]}>
                    <div className={styles["tool-logo-wrap"]} dangerouslySetInnerHTML={{ __html: t.logo }} />
                    <h3>{t.name}</h3>
                    <span className={`${styles["card-pricing-badge"]} ${styles[`pricing-${t.pricing.toLowerCase()}`]}`}>{t.pricing}</span>
                    <div className={styles["card-rating-row"]} style={{ justifyContent: "center", marginTop: "0.5rem" }}>
                      <span className={styles["rating-value"]} style={{ color: "var(--neon-gold)" }}>
                        ★ {getAverageRating(t)}
                      </span>
                      <span className={styles["rating-count"]}>
                        ({t.ratingCount + (t.reviews ? t.reviews.length : 0)} votes)
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specKeys.map((spec) => (
              <tr key={spec.key}>
                <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>{spec.label}</td>
                {comparedObjs.map((t) => {
                  let val = "";
                  if (spec.isSpec) {
                    try {
                      const specsObj = typeof t.specs === 'string' ? JSON.parse(t.specs) : (t.specs || {});
                      val = specsObj[spec.key];
                    } catch (e) {
                      val = "";
                    }
                  } else {
                    val = t[spec.key];
                  }
                  
                  if (spec.key === "category") {
                    val = (
                      <span style={{ textTransform: "capitalize", color: "var(--neon-cyan)", fontWeight: 600 }}>
                        {val}
                      </span>
                    );
                  }
                  return <td key={t.id}>{val || "Not Specified"}</td>;
                })}
              </tr>
            ))}

            {/* Core Features */}
            <tr>
              <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>Core Features</td>
              {comparedObjs.map((t) => {
                 let features = [];
                 try { features = typeof t.features === 'string' ? JSON.parse(t.features) : (t.features || []); } catch(e){}
                 return (
                  <td key={t.id}>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {features.map((feat, idx) => (
                        <li key={idx} style={{ fontSize: "0.85rem", marginBottom: "0.4rem" }}>
                          <span className={styles["feature-check-icon"]}>✓</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* Pros */}
            <tr>
              <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>Strengths / Pros</td>
              {comparedObjs.map((t) => {
                 let pros = [];
                 try { pros = typeof t.pros === 'string' ? JSON.parse(t.pros) : (t.pros || []); } catch(e){}
                 return (
                  <td key={t.id}>
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                      {pros.slice(0, 3).map((p, idx) => (
                        <li key={idx} style={{ fontSize: "0.85rem", marginBottom: "0.4rem", color: "#00FF87" }}>
                          ✓ {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                );
              })}
            </tr>

            {/* Verdict */}
            <tr>
              <td style={{ fontWeight: 600, color: "var(--text-muted)" }}>Platform Verdict</td>
              {comparedObjs.map((t) => (
                <td key={t.id}>
                  <p
                    style={{ fontSize: "0.85rem", lineHeight: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: getVerdict(t) }}
                  />
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td></td>
              {comparedObjs.map((t) => (
                <td key={t.id} style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <a
                      href={ensureAbsoluteUrl(t.website)}
                      target="_blank"
                      rel="noopener noreferrer nofollow sponsored"
                      className="cta-btn action-primary"
                      style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                    >
                      <span>Visit Site</span>
                      <span className="affiliate-badge" style={{ margin: 0 }}>Affiliate</span>
                    </a>
                    <Link
                      href={`/tool/${t.id}`}
                      className="btn-secondary"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                    >
                      Read {t.reviews?.length || 0 + t.ratingCount} Reviews
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dynamic Contextual SEO Internal Linking Grid */}
      {comparedObjs.length > 0 && (
        <InternalLinks comparedTools={comparedObjs} />
      )}
    </div>
  );
}
