"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function McpClient({ initialServers = [] }) {
  const [servers] = useState(initialServers);
  const [searchVal, setSearchVal] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  // Extract all unique tags
  const allTags = ["all", ...new Set(servers.flatMap((s) => JSON.parse(s.tags || "[]")))];

  const filteredServers = servers.filter((server) => {
    const tags = JSON.parse(server.tags || "[]");
    const matchesTag = selectedTag === "all" || tags.includes(selectedTag);
    const matchesSearch = server.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                          server.description.toLowerCase().includes(searchVal.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const handleCopyCommand = async (serverId, command) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedId(serverId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy command: ", err);
    }
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
            color: "var(--neon-purple)",
            background: "var(--neon-purple-glow)",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px"
          }}
        >
          Model Context Protocol
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
          MCP Server Directory
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Supercharge your AI development editors. Securely connect context integrations for databases, GitHub, web APIs, and sandboxed file systems.
        </p>
      </div>

      {/* Controls */}
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
        <div className="search-wrapper" style={{ margin: 0 }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search MCP servers by tags, capabilities, or name..."
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

        {/* Tags Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  background: isActive ? "var(--neon-purple)" : "var(--bg-card)",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  border: "1px solid var(--border-glass)",
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {filteredServers.length === 0 ? (
          <div className="detail-glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem" }}>
            <h3 style={{ color: "var(--text-bright)", marginBottom: "0.5rem" }}>No MCP Servers Found</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredServers.map((server) => {
            const tags = JSON.parse(server.tags || "[]");
            const clients = JSON.parse(server.supportedClients || "[]");
            const isCopied = copiedId === server.id;

            return (
              <div 
                key={server.id}
                className="mcp-card"
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
                    <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--neon-purple)" }}>
                      MCP Listing
                    </span>
                    <a 
                      href={server.githubUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ fontSize: "0.8rem", color: "var(--neon-cyan)", textDecoration: "none", fontWeight: "600" }}
                    >
                      GitHub Repo ↗
                    </a>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
                    {server.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.25rem", minHeight: "60px" }}>
                    {server.description}
                  </p>

                  {/* Installation Command Bar */}
                  <div 
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(0, 0, 0, 0.02)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "10px",
                      padding: "0.6rem 0.8rem",
                      marginBottom: "1.25rem"
                    }}
                  >
                    <code style={{ fontSize: "0.75rem", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "0.5rem" }}>
                      {server.installation}
                    </code>
                    <button
                      onClick={() => handleCopyCommand(server.id, server.installation)}
                      style={{
                        background: isCopied ? "#00FF87" : "transparent",
                        color: isCopied ? "#080710" : "var(--text-main)",
                        border: "none",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Clients */}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                    Clients: <strong style={{ color: "var(--text-bright)" }}>{clients.join(", ")}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1rem", marginTop: "auto" }}>
                  {tags.map((tag, i) => (
                    <span key={i} className="card-tag" style={{ fontSize: "0.65rem" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Styled JSX */}
      <style jsx global>{`
        .mcp-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .mcp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important;
          border-color: rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}
