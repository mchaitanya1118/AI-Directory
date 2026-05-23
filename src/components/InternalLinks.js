"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function InternalLinks({ currentTool, comparedTools = [] }) {
  const { tools } = useApp();

  if (!tools || tools.length === 0) return null;

  // 1. Determine active context: tool category or comparison categories
  let activeCategory = "";
  let relevantToolIds = [];
  let titleText = "AuraAI Knowledge Clusters";
  let subtitleText = "Explore related comparative directories, developer-vetted alternatives, and topical growth hubs.";

  if (currentTool) {
    activeCategory = currentTool.categoryId || currentTool.category || "";
    relevantToolIds = [currentTool.id];
    titleText = `Topical Hubs for ${currentTool.name}`;
    subtitleText = `Vetted professional comparisons and high-traffic guides related to ${currentTool.name}.`;
  } else if (comparedTools && comparedTools.length > 0) {
    // If it's a comparison page, gather categories from both tools
    const categories = comparedTools.map(t => t.categoryId || t.category).filter(Boolean);
    activeCategory = categories[0] || "";
    relevantToolIds = comparedTools.map(t => t.id);
    const namesList = comparedTools.map(t => t.name).join(" & ");
    titleText = `Topical Hubs for ${namesList}`;
    subtitleText = `Expand your evaluation with comprehensive category matrices and dynamic programmatic SEO guides.`;
  }

  // 2. Programmatically compute pairwise comparison links
  // We want to generate comparison slugs like /compare/toolA-vs-toolB
  const comparisonLinks = [];
  if (currentTool && activeCategory) {
    // Find sibling tools in the same category
    const siblings = tools.filter(
      t => (t.categoryId === activeCategory || t.category === activeCategory) && t.id !== currentTool.id
    );

    siblings.forEach(sib => {
      // E.g. Claude vs ChatGPT
      comparisonLinks.push({
        title: `${currentTool.name} vs ${sib.name}`,
        slug: `${currentTool.id}-vs-${sib.id}`,
        desc: `Compare detailed technical limits, trial parameters, and editorial verdict side-by-side.`
      });
    });
  } else if (comparedTools && comparedTools.length >= 2) {
    const [toolA, toolB] = comparedTools;
    const cat = toolA.categoryId || toolA.category;
    // Find other tools in the same category to cross-link with
    const siblings = tools.filter(
      t => (t.categoryId === cat || t.category === cat) && !relevantToolIds.includes(t.id)
    );

    siblings.forEach(sib => {
      comparisonLinks.push({
        title: `${toolA.name} vs ${sib.name}`,
        slug: `${toolA.id}-vs-${sib.id}`,
        desc: `Technical review comparison matrix between ${toolA.name} and ${sib.name}.`
      });
      comparisonLinks.push({
        title: `${toolB.name} vs ${sib.name}`,
        slug: `${toolB.id}-vs-${sib.id}`,
        desc: `Technical review comparison matrix between ${toolB.name} and ${sib.name}.`
      });
    });
  }

  // Limit comparison suggestions to prevent visual clutter
  const finalComparisonLinks = comparisonLinks.slice(0, 4);

  // 3. Programmatically compute dynamic Programmatic SEO (PSEO) Links
  const pseoLinks = [];
  if (activeCategory) {
    const formattedCat = activeCategory.toLowerCase().trim();
    
    // Add "best-ai-tools-for-[category]"
    pseoLinks.push({
      title: `Best AI Tools for ${formattedCat.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`,
      slug: `best-ai-tools-for-${formattedCat}`,
      icon: "🏆"
    });

    // Add "free-ai-tools-for-[category]"
    pseoLinks.push({
      title: `Free AI Tools for ${formattedCat.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`,
      slug: `free-ai-tools-for-${formattedCat}`,
      icon: "🎁"
    });

    // For specific tools, add alternatives guides
    relevantToolIds.forEach(id => {
      const targetTool = tools.find(t => t.id === id);
      if (targetTool) {
        pseoLinks.push({
          title: `${targetTool.name} Alternatives for Developers`,
          slug: `${id}-alternatives-for-developers`,
          icon: "🔄"
        });
      }
    });
  }

  // Add highly popular global traffic hubs to maximize linking mesh
  const popularHubs = [
    { title: "Best AI Tools for Students", slug: "best-ai-tools-for-students", icon: "🎓" },
    { title: "Best AI Tools for Startups", slug: "best-ai-tools-for-startups", icon: "🚀" },
    { title: "Free AI Tools for Coding", slug: "free-ai-tools-for-coding", icon: "💻" },
    { title: "ChatGPT Alternatives for Developers", slug: "chatgpt-alternatives-for-developers", icon: "⚡" }
  ];

  // Merge lists and prevent duplicates
  const allPseo = [...pseoLinks, ...popularHubs];
  const uniquePseo = [];
  const seenSlugs = new Set();
  allPseo.forEach(item => {
    if (!seenSlugs.has(item.slug)) {
      seenSlugs.add(item.slug);
      uniquePseo.push(item);
    }
  });

  return (
    <div 
      className="detail-glass-card" 
      style={{ 
        marginTop: "2rem", 
        padding: "2.5rem",
        border: "1px solid var(--border-glass)",
        background: "rgba(255, 255, 255, 0.35)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px"
      }}
    >
      {/* Title Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "1.6rem", 
          fontWeight: "800", 
          color: "var(--text-bright)", 
          letterSpacing: "-0.5px",
          marginBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem"
        }}>
          <span style={{ 
            background: "linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🕸️ Internal Linking Engine
          </span>
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0, lineHeight: "1.5" }}>
          {subtitleText}
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "2.5rem" 
      }}>
        {/* Column 1: Pairwise Competitor Stacks */}
        {finalComparisonLinks.length > 0 && (
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
              <span style={{ color: "var(--neon-cyan)" }}>⇄</span> Head-to-Head Comparisons
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {finalComparisonLinks.map((link, idx) => (
                <Link 
                  key={idx}
                  href={`/compare/${link.slug}`} 
                  style={{ textDecoration: "none" }}
                >
                  <div 
                    className="rec-item-card"
                    style={{
                      background: "rgba(255, 255, 255, 0.4)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "14px",
                      padding: "1rem",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor = "var(--neon-cyan)";
                      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 113, 227, 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "var(--border-glass)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontWeight: "700", color: "var(--text-bright)", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                      {link.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
                      {link.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Column 2: Programmatic Growth Hubs */}
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
            <span style={{ color: "var(--neon-purple)" }}>🎯</span> Deep Topical AI Directories
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {uniquePseo.slice(0, 5).map((hub, idx) => (
              <Link 
                key={idx}
                href={`/best/${hub.slug}`} 
                style={{ textDecoration: "none" }}
              >
                <div 
                  className="rec-item-card"
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "14px",
                    padding: "0.85rem 1rem",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "var(--neon-purple)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(94, 92, 230, 0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border-glass)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{hub.icon}</span>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "700", color: "var(--text-bright)", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {hub.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                      Dynamic SEO Intent Hub &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
