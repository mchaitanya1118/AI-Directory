"use client";

import React, { useState } from "react";

export default function NewsClient({ initialNews = [] }) {
  const [news] = useState(initialNews);
  const [searchVal, setSearchVal] = useState("");
  const [activeSource, setActiveSource] = useState("all");
  
  // Bookmarked articles state
  const [bookmarks, setBookmarks] = useState([]);
  
  // Selected article for detailed reading modal
  const [selectedArticle, setSelectedArticle] = useState(null);

  const sources = ["all", "OpenAI", "Anthropic", "Google", "Meta", "Open Source AI"];

  const filteredNews = news.filter((article) => {
    const matchesSource = activeSource === "all" || article.source === activeSource;
    const matchesSearch = article.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                          article.summary.toLowerCase().includes(searchVal.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const toggleBookmark = (articleId) => {
    setBookmarks((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span 
          style={{ 
            fontSize: "0.85rem", 
            fontWeight: "700", 
            textTransform: "uppercase", 
            letterSpacing: "1.5px", 
            color: "var(--neon-rose)",
            background: "var(--neon-rose-glow)",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px"
          }}
        >
          AI News Hub
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
          Frontier AI Industry Digests
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Read verified product updates, model launches, research papers, and open-source releases weekly.
        </p>
      </div>

      {/* Control panel */}
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
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "1rem", alignItems: "center" }}>
          <div className="search-wrapper" style={{ margin: 0 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search news by title, release tags, or summary..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
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

          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "right" }}>
            Bookmarked: <strong style={{ color: "var(--text-bright)" }}>{bookmarks.length}</strong> digests
          </div>
        </div>

        {/* Source Categories */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {sources.map((src) => {
            const isActive = activeSource === src;
            return (
              <button
                key={src}
                onClick={() => setActiveSource(src)}
                style={{
                  background: isActive ? "var(--neon-rose)" : "var(--bg-card)",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-glass)",
                  padding: "0.4rem 1.15rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {src}
              </button>
            );
          })}
        </div>
      </div>

      {/* News Articles Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
        {filteredNews.length === 0 ? (
          <div className="detail-glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem" }}>
            <h3 style={{ color: "var(--text-bright)", marginBottom: "0.5rem" }}>No Articles Found</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Select another source or adjust your search term.</p>
          </div>
        ) : (
          filteredNews.map((article) => {
            const isBookmarked = bookmarks.includes(article.id);
            return (
              <div 
                key={article.id}
                className="news-card"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-glass)",
                  borderRadius: "20px",
                  padding: "1.75rem",
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
                        fontSize: "0.7rem", 
                        fontWeight: "800", 
                        textTransform: "uppercase", 
                        letterSpacing: "0.5px",
                        color: article.source === "OpenAI" 
                          ? "var(--neon-cyan)" 
                          : article.source === "Anthropic" 
                          ? "var(--neon-purple)" 
                          : article.source === "Google" 
                          ? "var(--neon-rose)" 
                          : "var(--neon-gold)"
                      }}
                    >
                      {article.source}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {article.date}
                    </span>
                  </div>

                  <h3 
                    style={{ 
                      fontFamily: "var(--font-display)", 
                      fontSize: "1.25rem", 
                      fontWeight: "700", 
                      color: "var(--text-bright)",
                      lineHeight: "1.4",
                      marginBottom: "0.75rem"
                    }}
                  >
                    {article.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                    {article.summary}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-glass)", paddingTop: "1rem", marginTop: "auto" }}>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="card-btn action-primary"
                    style={{ height: "34px", padding: "0 1.25rem", border: "none" }}
                  >
                    Read Story
                  </button>

                  <button
                    onClick={() => toggleBookmark(article.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1.1rem",
                      color: isBookmarked ? "var(--neon-rose)" : "var(--text-muted)",
                      transition: "color 0.2s"
                    }}
                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
                  >
                    {isBookmarked ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Expanded Article Modal */}
      {selectedArticle && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(5px)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
          }}
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="detail-glass-card"
            style={{
              width: "100%",
              maxWidth: "700px",
              background: "var(--bg-card)",
              borderRadius: "20px",
              padding: "2.5rem",
              position: "relative",
              animation: "fadeSlideIn 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedArticle(null)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                color: "var(--text-muted)",
                cursor: "pointer"
              }}
            >
              &times;
            </button>

            <div style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--neon-rose)" }}>
                {selectedArticle.source} • Release Details
              </span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: "800", color: "var(--text-bright)", marginTop: "0.5rem", marginBottom: "0.25rem", letterSpacing: "-0.5px" }}>
                {selectedArticle.title}
              </h2>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Published: {selectedArticle.date}
              </div>
            </div>

            {/* Body */}
            <div 
              style={{
                fontSize: "0.95rem",
                color: "var(--text-main)",
                lineHeight: "1.6",
                maxHeight: "350px",
                overflowY: "auto",
                marginBottom: "2rem"
              }}
              dangerouslySetInnerHTML={{ __html: selectedArticle.body }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => toggleBookmark(selectedArticle.id)}
                className="card-btn"
                style={{ height: "38px", border: "1px solid var(--border-glass)", padding: "0 1.25rem" }}
              >
                {bookmarks.includes(selectedArticle.id) ? "♥ Saved in Feed" : "♡ Save Article"}
              </button>
              <button
                onClick={() => setSelectedArticle(null)}
                className="card-btn action-primary"
                style={{ height: "38px", padding: "0 1.5rem", border: "none" }}
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx global>{`
        .news-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important;
          border-color: rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}
