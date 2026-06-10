"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ConsultantClient({ tools = [], agents = [], workflows = [] }) {
  // Conversational Assistant State
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Hello! I am your AuraAI Consultant. Describe your business or target task (e.g. 'I need AI tools for a real estate agency' or 'How do I automate social media scheduling?'), and I will recommend specific tools, workflows, prompts, and agents."
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Stack Builder Wizard State
  const [wizardIndustry, setWizardIndustry] = useState("SaaS");
  const [wizardSize, setWizardSize] = useState("1-10 members");
  const [wizardBudget, setWizardBudget] = useState("Freemium");
  const [generatedStack, setGeneratedStack] = useState(null);
  const [wizardLoading, setWizardLoading] = useState(false);

  // Conversational lookup logic
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let matchedTools = [];
      let matchedAgents = [];
      let matchedWorkflows = [];
      let explanation = "";

      const query = userText.toLowerCase();

      // Simple keywords router
      if (query.includes("code") || query.includes("developer") || query.includes("programming") || query.includes("git")) {
        matchedTools = tools.filter(t => t.categoryId === "coding" || t.id === "cursor" || t.id === "copilot").slice(0, 3);
        matchedAgents = agents.filter(a => a.id === "analyst-research-agent");
        matchedWorkflows = workflows.filter(w => w.role.toLowerCase() === "developer").slice(0, 2);
        explanation = "For developer tasks, a setup linking an AI-first editor with advanced code completions and codebase analysis offers maximum velocity. Here is your matching kit:";
      } else if (query.includes("real estate") || query.includes("property") || query.includes("agent") || query.includes("broker")) {
        matchedTools = tools.filter(t => t.categoryId === "image" || t.categoryId === "productivity").slice(0, 3);
        matchedAgents = agents.filter(a => a.id === "customer-support-agent" || a.id === "sales-outreach-agent");
        explanation = "Real estate workflows benefit heavily from automated buyer inquiry bots and outreach pipelines. Use these tools to draft listing sheets and answer customer questions instantly:";
      } else if (query.includes("marketing") || query.includes("sales") || query.includes("content") || query.includes("social") || query.includes("email")) {
        matchedTools = tools.filter(t => t.id === "jasper" || t.categoryId === "productivity" || t.id === "chatgpt").slice(0, 3);
        matchedAgents = agents.filter(a => a.id === "sales-outreach-agent");
        matchedWorkflows = workflows.filter(w => w.role.toLowerCase() === "marketer" || w.role.toLowerCase() === "creator").slice(0, 2);
        explanation = "To scale your marketing outreach, integrate automated outreach campaigns with copy templates and tracking spreadsheets. We matched these engines:";
      } else {
        // Fallback generic matches
        matchedTools = tools.slice(0, 3);
        matchedAgents = agents.slice(0, 1);
        matchedWorkflows = workflows.slice(0, 1);
        explanation = "Based on your inquiry, we compiled this custom toolkit containing a mix of core intelligence assistants and automated workflows to streamline operations:";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: explanation,
          recommendations: {
            tools: matchedTools,
            agents: matchedAgents,
            workflows: matchedWorkflows
          }
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  // Stack Builder Wizard Compiler
  const handleWizardSubmit = (e) => {
    e.preventDefault();
    setWizardLoading(true);
    setGeneratedStack(null);

    setTimeout(() => {
      let coreEngine = null;
      let automationTool = null;
      let agentListing = null;
      let n8nWorkflowLink = null;
      let roadmap = [];

      // Determine recommendations based on parameters
      if (wizardIndustry === "SaaS" || wizardIndustry === "E-Commerce") {
        coreEngine = tools.find(t => t.id === "claude" || t.id === "chatgpt");
        automationTool = tools.find(t => t.id === "notionai" || t.categoryId === "productivity");
        agentListing = agents.find(a => a.id === "sales-outreach-agent");
        n8nWorkflowLink = "https://n8n.io/workflows/1284-saas-lead-nurture-pipeline";
        roadmap = [
          "Phase 1: Setup webhook ingestion endpoints to capture new user signups.",
          "Phase 2: Deploy your OutreachPro sales agent to send personalized follow-up sequences.",
          "Phase 3: Automatically catalog conversion metrics into a NotionAI tracking spreadsheet."
        ];
      } else if (wizardIndustry === "Marketing" || wizardIndustry === "Writing") {
        coreEngine = tools.find(t => t.id === "jasper" || t.id === "chatgpt");
        automationTool = tools.find(t => t.categoryId === "image");
        agentListing = agents.find(a => a.id === "customer-support-agent");
        n8nWorkflowLink = "https://n8n.io/workflows/834-ai-content-generator";
        roadmap = [
          "Phase 1: Use Jasper or ChatGPT to generate weekly blog posts and newsletter copy outlines.",
          "Phase 2: Automatically hook up the webhook trigger to generate graphic assets via Stable Diffusion or Midjourney.",
          "Phase 3: Deploy the AuraSupport agent to answer incoming customer questions on the published articles."
        ];
      } else {
        // Real Estate / General
        coreEngine = tools.find(t => t.id === "chatgpt" || t.id === "perplexity");
        automationTool = tools.find(t => t.categoryId === "image" || t.categoryId === "productivity");
        agentListing = agents.find(a => a.id === "customer-support-agent");
        n8nWorkflowLink = "https://n8n.io/workflows/221-real-estate-crm-auto-sync";
        roadmap = [
          "Phase 1: Set up a landing page with a feedback form collecting lead property specs.",
          "Phase 2: Use the support agent to auto-reply to property inquiries over email/Zendesk.",
          "Phase 3: Generate visual design renders of property interiors using Stable Diffusion models."
        ];
      }

      setGeneratedStack({
        industry: wizardIndustry,
        size: wizardSize,
        budget: wizardBudget,
        coreEngine,
        automationTool,
        agentListing,
        n8nWorkflowLink,
        roadmap
      });
      setWizardLoading(false);
    }, 1800);
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
          AI Consultant Workspace
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
          AI Stack Builder & Virtual Consultant
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Interact with our virtual expert to match AI assets, or complete the wizard below to compile an operational workflow roadmap.
        </p>
      </div>

      {/* Grid Layout: Left Conversational AI Consultant, Right Stack Builder Wizard */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* Left Column: Conversational Consultant */}
        <div className="detail-glass-card" style={{ padding: "2rem", minHeight: "550px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: "700", color: "var(--text-bright)", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.75rem", marginBottom: "1.5rem" }}>
              💬 Chat with Aura Consultant
            </h2>

            {/* Chat Messages Log */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "400px", overflowY: "auto", paddingRight: "0.5rem", marginBottom: "1.5rem" }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div 
                    style={{
                      background: msg.sender === "user" ? "var(--neon-cyan)" : "rgba(0,0,0,0.02)",
                      color: msg.sender === "user" ? "#ffffff" : "var(--text-main)",
                      border: "1px solid",
                      borderColor: msg.sender === "user" ? "var(--neon-cyan)" : "var(--border-glass)",
                      borderRadius: "16px",
                      padding: "0.75rem 1.15rem",
                      maxWidth: "85%",
                      fontSize: "0.9rem",
                      lineHeight: "1.5"
                    }}
                  >
                    {msg.text}

                    {/* Recommendation items */}
                    {msg.recommendations && (
                      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {msg.recommendations.tools && msg.recommendations.tools.length > 0 && (
                          <div>
                            <strong style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--neon-cyan)", marginBottom: "0.25rem" }}>Tools:</strong>
                            {msg.recommendations.tools.map(t => (
                              <Link key={t.id} href={`/tool/${t.id}`} style={{ display: "block", fontSize: "0.8rem", color: "var(--neon-cyan)", textDecoration: "none", marginBottom: "0.15rem" }}>
                                🔗 {t.name} — {t.shortDescription}
                              </Link>
                            ))}
                          </div>
                        )}
                        {msg.recommendations.agents && msg.recommendations.agents.length > 0 && (
                          <div>
                            <strong style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--neon-purple)", marginBottom: "0.25rem" }}>Agents:</strong>
                            {msg.recommendations.agents.map(a => (
                              <span key={a.id} style={{ display: "block", fontSize: "0.8rem", color: "var(--text-main)", marginBottom: "0.15rem" }}>
                                🤖 {a.name} ({a.category})
                              </span>
                            ))}
                          </div>
                        )}
                        {msg.recommendations.workflows && msg.recommendations.workflows.length > 0 && (
                          <div>
                            <strong style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--neon-purple)", marginBottom: "0.25rem" }}>Workflows:</strong>
                            {msg.recommendations.workflows.map(w => (
                              <Link key={w.id} href="/workflows" style={{ display: "block", fontSize: "0.8rem", color: "var(--neon-cyan)", textDecoration: "none", marginBottom: "0.15rem" }}>
                                ⚡ {w.title} ({w.budget})
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              ))}
              {isTyping && (
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", paddingLeft: "0.5rem" }}>
                  Aura AI is typing...
                </div>
              )}
            </div>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleChatSubmit} style={{ display: "flex", gap: "0.75rem", borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Ask for custom recommendations (e.g. 'real estate agents')..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
              style={{ flex: 1, borderRadius: "10px", margin: 0, paddingLeft: "1.5rem" }}
            />
            <button
              type="submit"
              className="card-btn action-primary"
              disabled={!chatInput.trim() || isTyping}
              style={{ width: "90px", height: "42px", border: "none" }}
            >
              Send
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Stack Builder Wizard */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="detail-glass-card" style={{ padding: "2rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
              🛠️ Interactive Stack Builder
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Input business bounds to build a complete custom software stack and step-by-step roadmap.
            </p>

            <form onSubmit={handleWizardSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Industry */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Select Niche</label>
                <select
                  value={wizardIndustry}
                  onChange={(e) => setWizardIndustry(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  <option value="SaaS">SaaS / Tech</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Marketing">Marketing / Agency</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Writing">Content / Writing</option>
                </select>
              </div>

              {/* Team Size */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Team Size</label>
                <select
                  value={wizardSize}
                  onChange={(e) => setWizardSize(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  <option value="Individual">Solo / Creator</option>
                  <option value="1-10 members">1 - 10 members</option>
                  <option value="11-50 members">11 - 50 members</option>
                  <option value="Enterprise">50+ Enterprise</option>
                </select>
              </div>

              {/* Budget limit */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "700" }}>Monthly Budget Limit</label>
                <select
                  value={wizardBudget}
                  onChange={(e) => setWizardBudget(e.target.value)}
                  className="form-input"
                  style={{ width: "100%", height: "40px", cursor: "pointer" }}
                >
                  <option value="Free">100% Free / Open Source</option>
                  <option value="Freemium">Freemium Limit</option>
                  <option value="Paid">Premium Pro Access</option>
                </select>
              </div>

              <button
                type="submit"
                className="cta-btn action-primary"
                disabled={wizardLoading}
                style={{ width: "100%", height: "42px", borderRadius: "8px", fontWeight: "700", border: "none", marginTop: "0.5rem" }}
              >
                {wizardLoading ? "Compiling Stack..." : "Generate Stack & Roadmap ⚡"}
              </button>
            </form>
          </div>

          {/* Wizard Output Block */}
          {wizardLoading && (
            <div className="detail-glass-card" style={{ textAlign: "center", padding: "3rem" }}>
              <div className="pulse-loader" style={{
                width: "36px",
                height: "36px",
                border: "3px solid rgba(0, 113, 227, 0.1)",
                borderTopColor: "var(--neon-cyan)",
                borderRadius: "50%",
                margin: "0 auto 1rem",
                animation: "spin 1s linear infinite"
              }}></div>
              <span style={{ color: "var(--text-bright)", fontWeight: "600" }}>Synthesizing Software stack and n8n blueprint...</span>
            </div>
          )}

          {generatedStack && (
            <div className="detail-glass-card" style={{ padding: "2rem", border: "1px solid rgba(0, 255, 135, 0.2)", background: "rgba(0, 255, 135, 0.01)" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: "800", textTransform: "uppercase", color: "#00FF87", letterSpacing: "1px", display: "block", marginBottom: "0.5rem" }}>
                🏆 Generated AI Stack Output
              </span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: "800", color: "var(--text-bright)", marginBottom: "1rem" }}>
                AI Stack for {generatedStack.industry} ({generatedStack.size})
              </h3>

              {/* Grid of tools */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                {generatedStack.coreEngine && (
                  <div style={{ display: "flex", gap: "1rem", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "1rem" }}>
                    <div style={{ fontSize: "1.5rem" }}>⚡</div>
                    <div>
                      <strong style={{ color: "var(--text-bright)", fontSize: "0.9rem" }}>Core Engine: {generatedStack.coreEngine.name}</strong>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>{generatedStack.coreEngine.shortDescription}</p>
                    </div>
                  </div>
                )}
                {generatedStack.automationTool && (
                  <div style={{ display: "flex", gap: "1rem", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "1rem" }}>
                    <div style={{ fontSize: "1.5rem" }}>⚙️</div>
                    <div>
                      <strong style={{ color: "var(--text-bright)", fontSize: "0.9rem" }}>Automation: {generatedStack.automationTool.name}</strong>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>{generatedStack.automationTool.shortDescription}</p>
                    </div>
                  </div>
                )}
                {generatedStack.agentListing && (
                  <div style={{ display: "flex", gap: "1rem", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "1rem" }}>
                    <div style={{ fontSize: "1.5rem" }}>🤖</div>
                    <div>
                      <strong style={{ color: "var(--text-bright)", fontSize: "0.9rem" }}>Autonomous Agent: {generatedStack.agentListing.name}</strong>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>{generatedStack.agentListing.description}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* n8n blueprint */}
              <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem", marginBottom: "1.5rem" }}>
                <strong style={{ display: "block", fontSize: "0.8rem", textTransform: "uppercase", color: "var(--neon-purple)", marginBottom: "0.25rem" }}>n8n Workflow Blueprint:</strong>
                <a 
                  href={generatedStack.n8nWorkflowLink} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: "0.85rem", color: "var(--neon-cyan)", textDecoration: "none", fontWeight: "700" }}
                >
                  Download n8n Blueprint JSON 📥
                </a>
              </div>

              {/* Roadmap */}
              <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "1.25rem" }}>
                <strong style={{ display: "block", fontSize: "0.8rem", textTransform: "uppercase", color: "var(--neon-cyan)", marginBottom: "0.5rem" }}>Implementation Roadmap:</strong>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {generatedStack.roadmap.map((step, idx) => (
                    <div key={idx} style={{ fontSize: "0.8rem", color: "var(--text-main)", lineHeight: "1.4" }}>
                      {step}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
