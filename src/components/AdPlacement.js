"use client";

import React from "react";

export default function AdPlacement({ type = "in-content" }) {
  // Configs based on ad type
  const configs = {
    "below-hero": {
      title: "AdSense Leaderboard Spot",
      desc: "Promote your software solutions directly below the universal search bar. Achieve high impressions with premium CPC coding and productivity keywords.",
      badge: "High-RPM Billboard",
      cta: "Advertise Here",
      link: "/submit",
      style: {
        width: "100%",
        padding: "1.25rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
        background: "linear-gradient(90deg, rgba(255, 226, 89, 0.02) 0%, rgba(255, 167, 81, 0.05) 100%)",
        borderColor: "rgba(255, 167, 81, 0.25)",
        boxShadow: "0 4px 20px rgba(255, 167, 81, 0.05)",
      }
    },
    "in-content": {
      title: "Scale Local Creative Workflows with Runway",
      desc: "Animate static visual mockups into hollywood cinematic reels instantly using dynamic Motion Brushes.",
      badge: "Sponsored Placement",
      cta: "Get Free Credits",
      link: "https://runwayml.com/?ref=aura",
      style: {
        width: "100%",
        padding: "1.5rem",
        margin: "2rem 0",
        background: "rgba(255, 255, 255, 0.01)",
        borderColor: "var(--border-glass)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }
    },
    "sticky-sidebar": {
      title: "Cursor Pro Edition",
      desc: "Upgrade to the absolute coding gold standard. Infinite premium completions, multi-file Composer features, and local codebase search.",
      badge: "Developer Core",
      cta: "Download Cursor",
      link: "https://cursor.com/?via=aitoolsdir",
      style: {
        width: "100%",
        padding: "1.5rem",
        background: "linear-gradient(180deg, rgba(0, 242, 254, 0.02) 0%, rgba(79, 172, 254, 0.05) 100%)",
        borderColor: "rgba(0, 242, 254, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxShadow: "0 10px 30px rgba(0, 242, 254, 0.03)"
      }
    }
  };

  const ad = configs[type] || configs["in-content"];

  return (
    <div
      className="detail-glass-card"
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderRadius: "16px",
        ...ad.style
      }}
    >
      {/* Top Banner Indicator */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          marginBottom: "0.25rem",
          fontSize: "0.65rem",
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontWeight: "700",
          color: "var(--text-muted)"
        }}
      >
        <span>Google AdSense Slot</span>
        <span style={{ color: "var(--neon-gold)" }}>{ad.badge}</span>
      </div>

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: "800",
            fontSize: type === "below-hero" ? "1.2rem" : "1.1rem",
            color: "var(--text-bright)",
            margin: "0.15rem 0 0.35rem 0",
            lineHeight: "1.2"
          }}
        >
          {ad.title}
        </h4>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            lineHeight: "1.45",
            margin: 0
          }}
        >
          {ad.desc}
        </p>
      </div>

      <div style={{ marginTop: type === "below-hero" ? 0 : "0.5rem", shrink: 0 }}>
        <a
          href={ad.link}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="cta-btn action-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.5rem 1.25rem",
            fontSize: "0.8rem",
            fontWeight: "700",
            borderRadius: "6px",
            height: "36px",
            textDecoration: "none"
          }}
        >
          {ad.cta} &rarr;
        </a>
      </div>
    </div>
  );
}
