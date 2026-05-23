"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function PromptsClient({ initialPrompts = [] }) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const categories = ["all", "coding", "marketing", "images", "writing"];

  // Filter prompts
  const filteredPrompts = prompts.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category.toLowerCase() === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedId(prompt.id);
      setToastMessage(`"${prompt.title}" copied to clipboard!`);
      
      // Clear copied feedback after a delay
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);

      setTimeout(() => {
        setToastMessage("");
      }, 3000);

      // Proactively increment useCount in database via API
      fetch(`/api/prompts/${prompt.id}/use`, { method: "POST" })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          if (data && data.useCount) {
            // Update client state with updated count
            setPrompts((prev) => 
              prev.map((item) => item.id === prompt.id ? { ...item, useCount: data.useCount } : item)
            );
          }
        })
        .catch(() => {});

    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span 
          style={{ 
            fontSize: "0.85rem", 
            fontWeight: "700", 
            textTransform: "uppercase", 
            letterSpacing: "1.5px", 
            color: "var(--neon-purple)",
            background: "var(--neon-purple-glow)",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px"
          }}
        >
          Curated Prompts Library
        </span>
        <h1 
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "2.75rem", 
            fontWeight: "800", 
            color: "var(--text-bright)", 
            marginTop: "1rem",
            letterSpacing: "-1px"
          }}
        >
          High-Yield AI Prompt Vault
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Unleash the full potential of ChatGPT, Claude, and Midjourney with engineering-grade copyable templates.
        </p>
        <div style={{ marginTop: "1.25rem" }}>
          <Link href="/prompts/create" className="cta-btn action-primary" style={{ textDecoration: "none", fontSize: "0.85rem", padding: "0.5rem 1.25rem", borderRadius: "20px", fontWeight: "700", display: "inline-block" }}>
            💡 Share a Prompt
          </Link>
        </div>
      </div>

      {/* Control Panel: Search & Categories */}
      <div 
        className="detail-glass-card" 
        style={{ 
          padding: "1.5rem", 
          marginBottom: "2.5rem",
          display: "flex", 
          flexDirection: "column", 
          gap: "1.25rem" 
        }}
      >
        {/* Search */}
        <div className="search-wrapper" style={{ margin: 0 }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search prompts by keyword, target model, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: "12px", paddingLeft: "3.25rem" }}
          />
          <svg
            className="search-icon-svg"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ left: "1.25rem" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        {/* Categories Dock */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: isActive ? "var(--neon-purple)" : "var(--bg-card)",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-glass)",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  boxShadow: isActive ? "0 4px 12px var(--neon-purple-glow)" : "none"
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--bg-card-hover)";
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--bg-card)";
                    e.currentTarget.style.borderColor = "var(--border-glass)";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompts Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {filteredPrompts.length === 0 ? (
          <div className="detail-glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem" }}>
            <h3 style={{ color: "var(--text-bright)", marginBottom: "0.5rem" }}>No Prompts Found</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>
              Try adjusting your query or selecting another category above.
            </p>
          </div>
        ) : (
          filteredPrompts.map((p) => {
            const isCopied = copiedId === p.id;
            return (
              <div 
                key={p.id}
                className="prompt-card"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "18px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span 
                      style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: "700", 
                        textTransform: "uppercase", 
                        letterSpacing: "0.5px", 
                        color: p.category === "Coding" 
                          ? "var(--neon-cyan)" 
                          : p.category === "Images" 
                          ? "var(--neon-purple)" 
                          : p.category === "Marketing" 
                          ? "var(--neon-gold)" 
                          : "var(--neon-rose)" 
                      }}
                    >
                      {p.category}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      👁 {p.views} views
                    </span>
                  </div>

                  <h3 
                    style={{ 
                      fontFamily: "var(--font-display)", 
                      fontSize: "1.2rem", 
                      fontWeight: "700", 
                      color: "var(--text-bright)",
                      lineHeight: "1.3",
                      marginBottom: "0.75rem"
                    }}
                  >
                    {p.title}
                  </h3>

                  <div 
                    style={{
                      background: "rgba(0, 0, 0, 0.02)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "10px",
                      padding: "1rem",
                      fontSize: "0.85rem",
                      color: "var(--text-main)",
                      fontFamily: p.category === "Coding" ? "SFMono-Regular, Consolas, Monaco, monospace" : "inherit",
                      lineHeight: "1.5",
                      maxHeight: "130px",
                      overflowY: "auto",
                      whiteSpace: "pre-wrap",
                      marginBottom: "1.25rem"
                    }}
                  >
                    {p.promptText}
                  </div>
                </div>

                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    borderTop: "1px solid var(--border-glass)", 
                    paddingTop: "1rem",
                    marginTop: "auto"
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Used <strong style={{ color: "var(--text-bright)" }}>{p.useCount}</strong> times
                  </span>

                  <button
                    onClick={() => handleCopy(p)}
                    style={{
                      background: isCopied ? "#00FF87" : "var(--neon-purple)",
                      color: isCopied ? "#080710" : "#ffffff",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    {isCopied ? "✓ Copied" : "📋 Copy Prompt"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div 
          style={{
            position: "fixed",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.85)",
            color: "#ffffff",
            padding: "0.8rem 1.6rem",
            borderRadius: "40px",
            fontSize: "0.85rem",
            fontWeight: "600",
            zIndex: 10000,
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            animation: "fadeSlideIn 0.3s ease"
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Styled JSX for card hover animation and keyframe */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .prompt-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .prompt-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06) !important;
          border-color: rgba(0,0,0,0.15) !important;
        }
      `}</style>

    </div>
  );
}
