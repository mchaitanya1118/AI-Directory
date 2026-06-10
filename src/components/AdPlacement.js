"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function AdPlacement({ type = "in-content" }) {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // If it's the top-banner (above the fold), defer rendering until the browser is idle
    if (type === "top-banner") {
      let idleId;
      const deferMount = () => {
        if (window.requestIdleCallback) {
          idleId = window.requestIdleCallback(() => {
            setTimeout(() => setShouldRender(true), 1500);
          });
        } else {
          setTimeout(() => setShouldRender(true), 2000);
        }
      };

      if (document.readyState === "complete") {
        deferMount();
      } else {
        window.addEventListener("load", deferMount, { once: true });
      }

      return () => {
        if (idleId && window.cancelIdleCallback) {
          window.cancelIdleCallback(idleId);
        }
      };
    }

    // For all other ads (below the fold), use IntersectionObserver to load only when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small delay/idle callback to prevent blocking primary content rendering
            if (window.requestIdleCallback) {
              window.requestIdleCallback(() => setShouldRender(true));
            } else {
              setTimeout(() => setShouldRender(true), 100);
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" } // trigger loading 200px before appearing in viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [type]);

  // Configs based on ad type
  const configs = {
    "top-banner": {
      title: "Cursor AI Editor",
      desc: " — Build software faster than ever. Standard-setting multi-file edits.",
      badge: "Sponsored Placement",
      cta: "Get Started For Free",
      link: "https://cursor.com/?via=aitoolsdir",
      isLayoutBanner: true,
      className: "adsense-placement",
      id: "top-ad-banner",
      style: {}
    },
    "bottom-banner": {
      title: "Scale Your Dev Team with HeyGen",
      desc: " — Generate natural AI spokesperson videos in 40+ languages instantly.",
      badge: "AdSense Advertisement",
      cta: "Read HeyGen Reviews",
      link: "/tool/heygen",
      isLayoutBanner: true,
      className: "adsense-placement",
      id: "bottom-ad-banner",
      style: { marginTop: "4rem" }
    },
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

  // Placeholder styling to prevent Layout Shift (CLS)
  const getPlaceholderStyle = () => {
    if (type === "top-banner") {
      return { minHeight: "74px", margin: "1.5rem 0", borderRadius: "12px", border: "1px dashed var(--border-glass)", background: "rgba(255,255,255,0.01)" };
    }
    if (type === "bottom-banner") {
      return { minHeight: "74px", marginTop: "4rem", borderRadius: "12px", border: "1px dashed var(--border-glass)", background: "rgba(255,255,255,0.01)" };
    }
    if (type === "below-hero") {
      return { minHeight: "100px", width: "100%", borderRadius: "16px", background: "rgba(255,255,255,0.01)" };
    }
    if (type === "sticky-sidebar") {
      return { minHeight: "220px", width: "100%", borderRadius: "16px", background: "rgba(255,255,255,0.01)" };
    }
    return { minHeight: "150px", width: "100%", margin: "2rem 0", borderRadius: "16px", background: "rgba(255,255,255,0.01)" };
  };

  if (!shouldRender) {
    return (
      <div 
        ref={containerRef} 
        style={getPlaceholderStyle()} 
        className={ad.isLayoutBanner ? "adsense-placement" : "detail-glass-card"}
      />
    );
  }

  // Render layout-level banner
  if (ad.isLayoutBanner) {
    const isExternal = ad.link.startsWith("http");
    return (
      <div
        ref={containerRef}
        className={ad.className}
        id={ad.id}
        style={ad.style}
      >
        <span className="ad-label">{ad.badge}</span>
        <div className="ad-content">
          <div>
            <span className="ad-title">{ad.title}</span>
            <span className="ad-desc">{ad.desc}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isExternal ? (
              <a
                href={ad.link}
                target="_blank"
                rel="nofollow sponsored"
                className="ad-badge-button"
              >
                {ad.cta}
              </a>
            ) : (
              <Link href={ad.link} className="ad-badge-button">
                {ad.cta}
              </Link>
            )}
            {type === "top-banner" && <span className="affiliate-badge">Affiliate</span>}
          </div>
        </div>
      </div>
    );
  }

  // Render standard in-content/sidebar ads
  return (
    <div
      ref={containerRef}
      className="detail-glass-card"
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderRadius: "16px",
        ...ad.style
      }}
    >
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
        <span style={{ color: "var(--badge-sponsored-bg)" }}>{ad.badge}</span>
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

      <div style={{ marginTop: type === "below-hero" ? 0 : "0.5rem", flexShrink: 0 }}>
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
