"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AgentsClient({ initialAgents = [] }) {
  const [agents] = useState(initialAgents);
  const [searchVal, setSearchVal] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pricingFilter, setPricingFilter] = useState("all");
  
  // Selected Agent for detail modal
  const [selectedAgent, setSelectedAgent] = useState(null);

  const categories = ["all", "Customer Support", "Sales", "Research", "HR", "Finance"];
  const pricingModels = ["all", "Free", "Freemium", "Paid"];

  const filteredAgents = agents.filter((agent) => {
    const matchesCategory = categoryFilter === "all" || agent.category === categoryFilter;
    const matchesPricing = pricingFilter === "all" || agent.pricing === pricingFilter;
    const matchesSearch = agent.name.toLowerCase().includes(searchVal.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCategory && matchesPricing && matchesSearch;
  });

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
            color: "var(--neon-cyan)",
            background: "var(--neon-cyan-glow)",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px"
          }}
        >
          AI Agent Marketplace
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
          Autonomous Agents for Your Workflow
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Discover, deploy, and clone production-ready agents tailored to support operations, sales pipeline, and data analysis.
        </p>
      </div>

      {/* Filters Dock */}
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
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
          <div className="search-wrapper" style={{ margin: 0 }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search agents by capabilities or name..."
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

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input"
            style={{ width: "100%", height: "46px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "0 1rem", color: "var(--text-main)", fontWeight: "600" }}
          >
            <option value="all">All Categories</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Sales">Sales Outreach</option>
            <option value="Research">Research & Analysis</option>
            <option value="HR">HR & Recruiting</option>
            <option value="Finance">Finance & Accounting</option>
          </select>

          <select
            value={pricingFilter}
            onChange={(e) => setPricingFilter(e.target.value)}
            className="form-input"
            style={{ width: "100%", height: "46px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "0 1rem", color: "var(--text-main)", fontWeight: "600" }}
          >
            <option value="all">All Pricing</option>
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {filteredAgents.length === 0 ? (
          <div className="detail-glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem" }}>
            <h3 style={{ color: "var(--text-bright)", marginBottom: "0.5rem" }}>No Agents Found</h3>
            <p style={{ color: "var(--text-muted)", margin: 0 }}>Try clearing your filters or query to explore all listings.</p>
          </div>
        ) : (
          filteredAgents.map((agent) => {
            const capabilities = JSON.parse(agent.capabilities || "[]");
            const models = JSON.parse(agent.supportedModels || "[]");
            return (
              <div 
                key={agent.id}
                className="agent-card"
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div 
                      className="card-logo-wrap"
                      style={{ width: "42px", height: "42px", padding: "0.5rem" }}
                      dangerouslySetInnerHTML={{ __html: agent.logo }}
                    />
                    <span className={`card-pricing-badge pricing-${agent.pricing.toLowerCase()}`} style={{ fontSize: "0.7rem" }}>
                      {agent.pricing}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
                    {agent.name}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.25rem", minHeight: "60px" }}>
                    {agent.description}
                  </p>

                  {/* Capabilities tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
                    {capabilities.map((cap, i) => (
                      <span key={i} className="card-tag" style={{ fontSize: "0.7rem", background: "rgba(0,0,0,0.02)" }}>
                        {cap}
                      </span>
                    ))}
                  </div>

                  {/* Supported Models */}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                    Models: <strong style={{ color: "var(--text-bright)" }}>{models.join(", ")}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "1px solid var(--border-glass)", marginTop: "auto" }}>
                  <button
                    onClick={() => setSelectedAgent(agent)}
                    className="card-btn"
                    style={{ flex: 1, height: "38px", border: "1px solid var(--border-glass)" }}
                  >
                    Setup Guide
                  </button>
                  <button
                    onClick={() => alert(`Installing/Cloning Agent ${agent.name}... Check your local project config.`)}
                    className="card-btn action-primary"
                    style={{ flex: 1.2, height: "38px", border: "none" }}
                  >
                    Deploy Agent ⚡
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Setup Guide Modal */}
      {selectedAgent && (
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
          onClick={() => setSelectedAgent(null)}
        >
          <div 
            className="detail-glass-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "var(--bg-card)",
              borderRadius: "20px",
              padding: "2rem",
              position: "relative",
              animation: "fadeSlideIn 0.3s ease"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedAgent(null)}
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

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div 
                className="detail-logo-wrap"
                style={{ width: "50px", height: "50px", padding: "0.5rem" }}
                dangerouslySetInnerHTML={{ __html: selectedAgent.logo }}
              />
              <div>
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--neon-cyan)", fontWeight: "700" }}>
                  {selectedAgent.category} Setup Guide
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "800", color: "var(--text-bright)", margin: 0 }}>
                  {selectedAgent.name}
                </h2>
              </div>
            </div>

            <div 
              style={{
                background: "rgba(0,0,0,0.02)",
                border: "1px solid var(--border-glass)",
                borderRadius: "12px",
                padding: "1.5rem",
                fontSize: "0.9rem",
                color: "var(--text-main)",
                lineHeight: "1.6",
                maxHeight: "300px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                marginBottom: "1.5rem"
              }}
            >
              {selectedAgent.setupGuide}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              {selectedAgent.demoUrl && (
                <a 
                  href={selectedAgent.demoUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="card-btn"
                  style={{ flex: 1, height: "42px", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid var(--border-glass)" }}
                >
                  View Sandbox Demo ↗
                </a>
              )}
              <button
                onClick={() => {
                  alert(`Cloning agent repository configured for workspace...`);
                  setSelectedAgent(null);
                }}
                className="card-btn action-primary"
                style={{ flex: 1.5, height: "42px", border: "none" }}
              >
                Clone Repository & Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style jsx global>{`
        .agent-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.06) !important;
          border-color: rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}
