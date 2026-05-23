"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function WorkflowsClient({ initialWorkflows = [], allTools = [] }) {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [role, setRole] = useState("Developer");
  const [industry, setIndustry] = useState("SaaS");
  const [budget, setBudget] = useState("Freemium");
  const [compiledStack, setCompiledStack] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState([]);

  // Form options
  const roles = ["Developer", "Creator", "Designer", "Marketer"];
  const industries = ["SaaS", "Marketing", "E-commerce", "Writing", "General"];
  const budgets = ["Free", "Freemium", "Premium"];

  const handleUpvote = async (workflowId) => {
    if (upvotedIds.includes(workflowId)) return;

    setUpvotedIds((prev) => [...prev, workflowId]);

    // Update local state
    setWorkflows((prev) =>
      prev.map((w) => (w.id === workflowId ? { ...w, upvotes: w.upvotes + 1 } : w))
    );

    // Increment upvote in DB
    fetch(`/api/workflows/${workflowId}/upvote`, { method: "POST" }).catch(() => {});
  };

  const handleBuildStack = (e) => {
    e.preventDefault();
    setIsBuilding(true);
    setCompiledStack(null);

    setTimeout(() => {
      // 1. Check if we have an exact database workflow match
      const exactMatch = workflows.find(
        (w) =>
          w.role.toLowerCase() === role.toLowerCase() &&
          w.budget.toLowerCase() === budget.toLowerCase()
      );

      if (exactMatch) {
        setCompiledStack({
          isCurated: true,
          title: exactMatch.title,
          description: exactMatch.description,
          steps: exactMatch.tools.map((t) => ({
            stepNumber: t.stepNumber,
            useCase: t.useCase,
            tool: t.tool
          }))
        });
        setIsBuilding(false);
        return;
      }

      // 2. If no exact match, dynamically compile a 3-step custom stack from our directory!
      const matchingTools = allTools.filter((t) => {
        const p = t.pricing.toLowerCase();
        if (budget === "Free") return p === "free";
        if (budget === "Freemium") return p === "free" || p === "freemium";
        return true; // Premium includes everything
      });

      // Filter by role tags / categories
      let step1Tool = null; // Core engine
      let step2Tool = null; // Reasoning / LLM
      let step3Tool = null; // Organizer / Media

      if (role === "Developer") {
        step1Tool = matchingTools.find((t) => t.id === "cursor" || t.id === "copilot" || t.categoryId === "coding");
        step2Tool = matchingTools.find((t) => t.id === "claude" || t.id === "chatgpt" || t.id === "deepseek");
        step3Tool = matchingTools.find((t) => t.id === "notionai" || t.id === "perplexity" || t.categoryId === "productivity");
      } else if (role === "Designer") {
        step1Tool = matchingTools.find((t) => t.id === "midjourney" || t.id === "stablediffusion" || t.categoryId === "image");
        step2Tool = matchingTools.find((t) => t.id === "claude" || t.id === "chatgpt" || t.id === "gemini");
        step3Tool = matchingTools.find((t) => t.id === "adobe-firefly" || t.id === "leonardo" || t.id === "canva" || t.categoryId === "image");
      } else if (role === "Creator") {
        step1Tool = matchingTools.find((t) => t.id === "runway" || t.id === "sora" || t.categoryId === "video");
        step2Tool = matchingTools.find((t) => t.id === "elevenlabs" || t.id === "descript" || t.id === "suno");
        step3Tool = matchingTools.find((t) => t.id === "chatgpt" || t.id === "claude" || t.id === "heygen");
      } else {
        // Marketer
        step1Tool = matchingTools.find((t) => t.id === "chatgpt" || t.id === "claude" || t.id === "jasper");
        step2Tool = matchingTools.find((t) => t.id === "perplexity" || t.categoryId === "productivity");
        step3Tool = matchingTools.find((t) => t.id === "notionai" || t.id === "canva" || t.categoryId === "image");
      }

      // Fallback in case filter was too restrictive
      const unusedTools = matchingTools.filter(
        (t) => t.id !== step1Tool?.id && t.id !== step2Tool?.id && t.id !== step3Tool?.id
      );

      if (!step1Tool && unusedTools.length > 0) step1Tool = unusedTools[0];
      if (!step2Tool && unusedTools.length > 1) step2Tool = unusedTools[1];
      if (!step3Tool && unusedTools.length > 2) step3Tool = unusedTools[2];

      const steps = [];
      if (step1Tool) {
        steps.push({
          stepNumber: 1,
          useCase: `Primary Production Engine: Deploy this to manage your main workload, asset creation, or code scaffolding.`,
          tool: step1Tool
        });
      }
      if (step2Tool) {
        steps.push({
          stepNumber: 2,
          useCase: `Logic & Intelligence Core: Use this to troubleshoot bugs, write copy outlines, and refine complex details.`,
          tool: step2Tool
        });
      }
      if (step3Tool) {
        steps.push({
          stepNumber: 3,
          useCase: `Task Integration & Management: Leverage this to organize release dates, synthesize files, and manage your backlog.`,
          tool: step3Tool
        });
      }

      setCompiledStack({
        isCurated: false,
        title: `Dynamic Custom AI Stack for ${role}s (${industry})`,
        description: `We compiled this custom stack of ${steps.length} tools to optimize your ${industry} workflows on a ${budget} budget limit. This setup streamlines conceptual designs, structural writing, and final exports.`,
        steps: steps
      });

      setIsBuilding(false);
    }, 2000);
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
            color: "var(--neon-cyan)",
            background: "var(--neon-cyan-glow)",
            padding: "0.35rem 0.9rem",
            borderRadius: "20px"
          }}
        >
          Workflow Marketplace
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
          AI Stacks & Automation Marketplace
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Browse proven industry-standard AI configurations, or assemble a personalized custom stack in seconds.
        </p>
        <div style={{ marginTop: "1.25rem" }}>
          <Link href="/workflows/create" className="cta-btn action-primary" style={{ textDecoration: "none", fontSize: "0.85rem", padding: "0.5rem 1.25rem", borderRadius: "20px", fontWeight: "700", display: "inline-block" }}>
            🛠️ Build Workflow Stack
          </Link>
        </div>
      </div>

      {/* Grid: 2 Columns (Stack Builder Left, Marketplace Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left Column: Stack Builder */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="detail-glass-card" style={{ padding: "2rem" }}>
            <h2 
              style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "1.4rem", 
                fontWeight: "800", 
                color: "var(--text-bright)",
                marginBottom: "0.4rem",
                letterSpacing: "-0.5px"
              }}
            >
              Interactive Stack Builder
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Input your workflow bounds and let the matching engine compile your customized tech stack.
            </p>

            <form onSubmit={handleBuildStack} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              
              {/* Role Select */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Your Professional Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="form-input"
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Industry Select */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Target Industry Niche</label>
                <select 
                  value={industry} 
                  onChange={(e) => setIndustry(e.target.value)} 
                  className="form-input"
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>

              {/* Budget Limit Select */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Budget Parameters</label>
                <select 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)} 
                  className="form-input"
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="cta-btn action-primary"
                style={{ width: "100%", height: "42px", borderRadius: "8px", fontWeight: "700", marginTop: "0.5rem", cursor: "pointer", border: "none" }}
              >
                Compile Custom Stack ⚡
              </button>

            </form>
          </div>

          {/* Builder Output Block */}
          {isBuilding && (
            <div className="detail-glass-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
              <div className="pulse-loader" style={{
                width: "36px",
                height: "36px",
                border: "3px solid rgba(0, 113, 227, 0.1)",
                borderTopColor: "var(--neon-cyan)",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                animation: "spin 1s linear infinite"
              }}></div>
              <span style={{ color: "var(--text-bright)", fontWeight: "600", fontSize: "0.95rem" }}>Synthesizing Custom Stack...</span>
            </div>
          )}

          {compiledStack && (
            <div 
              className="detail-glass-card" 
              style={{ 
                padding: "2rem", 
                border: compiledStack.isCurated ? "1px solid rgba(0, 255, 135, 0.2)" : "1px solid var(--border-glass)",
                background: compiledStack.isCurated ? "rgba(0, 255, 135, 0.02)" : "var(--bg-card)",
                boxShadow: compiledStack.isCurated ? "0 10px 30px rgba(0, 255, 135, 0.05)" : "none",
                animation: "fadeSlideIn 0.3s ease" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span 
                  style={{ 
                    fontSize: "0.7rem", 
                    fontWeight: "800", 
                    textTransform: "uppercase", 
                    letterSpacing: "1px", 
                    color: compiledStack.isCurated ? "#00FF87" : "var(--neon-cyan)" 
                  }}
                >
                  {compiledStack.isCurated ? "🏆 100% Curated Stack Match" : "⚡ Dynamic Custom Assembly"}
                </span>
              </div>

              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: "800", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
                {compiledStack.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                {compiledStack.description}
              </p>

              {/* Step Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {compiledStack.steps.map((step) => (
                  <div 
                    key={step.stepNumber}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      background: "rgba(0,0,0,0.02)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "12px",
                      padding: "1rem"
                    }}
                  >
                    {/* Circle badge */}
                    <span 
                      style={{
                        background: compiledStack.isCurated 
                          ? "linear-gradient(135deg, #00FF87 0%, #00F2FE 100%)" 
                          : "linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)",
                        color: "#080710",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        flexShrink: 0
                      }}
                    >
                      {step.stepNumber}
                    </span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <Link href={`/tool/${step.tool.id}`} style={{ textDecoration: "none" }}>
                          <span style={{ fontWeight: "700", color: "var(--text-bright)", fontSize: "0.9rem" }}>
                            {step.tool.name}
                          </span>
                        </Link>
                        <span className={`card-pricing-badge pricing-${step.tool.pricing.toLowerCase()}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>
                          {step.tool.pricing}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-main)", fontSize: "0.8rem", lineHeight: "1.4", margin: 0 }}>
                        {step.useCase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Workflows Directory */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          <div style={{ borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-bright)", letterSpacing: "-0.5px", margin: 0 }}>
              Curated Production Stacks ({workflows.length})
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Proven developer/creator workflows</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {workflows.map((w) => {
              const isUpvoted = upvotedIds.includes(w.id);
              return (
                <div 
                  key={w.id}
                  className="workflow-card"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "20px",
                    padding: "1.75rem",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                    <div>
                      <span 
                        style={{ 
                          fontSize: "0.75rem", 
                          fontWeight: "800", 
                          textTransform: "uppercase", 
                          letterSpacing: "1px", 
                          color: "var(--neon-purple)" 
                        }}
                      >
                        {w.role} Workflow • {w.budget} Pricing
                      </span>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: "800", color: "var(--text-bright)", marginTop: "0.25rem", letterSpacing: "-0.3px" }}>
                        {w.title}
                      </h3>
                    </div>

                    {/* Upvote Button */}
                    <button
                      onClick={() => handleUpvote(w.id)}
                      style={{
                        background: isUpvoted ? "var(--neon-cyan-glow)" : "rgba(0,0,0,0.03)",
                        border: "1px solid",
                        borderColor: isUpvoted ? "var(--neon-cyan)" : "var(--border-glass)",
                        color: isUpvoted ? "var(--neon-cyan)" : "var(--text-main)",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "10px",
                        fontSize: "0.8rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        transition: "all 0.2s"
                      }}
                    >
                      <span>▲</span>
                      <span>{w.upvotes}</span>
                    </button>
                  </div>

                  <p style={{ color: "var(--text-main)", fontSize: "0.925rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                    {w.description}
                  </p>

                  {/* Steps Horizontal Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem" }}>
                    {w.tools.map((wt) => (
                      <div 
                        key={wt.tool.id} 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "0.75rem",
                          background: "rgba(0,0,0,0.02)",
                          border: "1px solid var(--border-glass)",
                          borderRadius: "12px",
                          padding: "0.6rem 0.8rem"
                        }}
                      >
                        <div 
                          className="card-logo-wrap"
                          style={{ width: "32px", height: "32px", padding: "0.15rem", flexShrink: 0 }}
                          dangerouslySetInnerHTML={{ __html: wt.tool.logo }}
                        />
                        <div style={{ overflow: "hidden" }}>
                          <span style={{ display: "block", fontSize: "0.7rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                            Step {wt.stepNumber}
                          </span>
                          <Link href={`/tool/${wt.tool.id}`} style={{ textDecoration: "none" }}>
                            <span style={{ display: "block", fontWeight: "700", color: "var(--text-bright)", fontSize: "0.85rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {wt.tool.name}
                            </span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Styled JSX for transitions and animations */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .workflow-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .workflow-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.05) !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>

    </div>
  );
}
