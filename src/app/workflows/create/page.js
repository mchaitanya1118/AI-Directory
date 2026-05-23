"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function CreateWorkflowStack() {
  const { data: session, status } = useSession();
  const { tools } = useApp();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("Developer");
  const [industry, setIndustry] = useState("SaaS");
  const [budget, setBudget] = useState("Freemium");
  
  // Dynamic multi-step builder
  const [steps, setSteps] = useState([
    { toolId: "", useCase: "" },
    { toolId: "", useCase: "" }
  ]);

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const roles = ["Developer", "Creator", "Designer", "Marketer"];
  const industries = ["SaaS", "Marketing", "E-commerce", "Writing", "General"];
  const budgets = ["Free", "Freemium", "Premium"];

  // Handle auth
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/workflows/create");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div className="pulse-loader" style={{
          width: "40px",
          height: "40px",
          border: "4px solid rgba(0, 113, 227, 0.1)",
          borderTopColor: "var(--neon-cyan)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}></div>
      </div>
    );
  }

  if (!session) return null;

  // Add step helper
  const addStep = () => {
    setSteps([...steps, { toolId: "", useCase: "" }]);
  };

  // Remove step helper
  const removeStep = (index) => {
    if (steps.length <= 1) {
      alert("A custom stack must contain at least one step.");
      return;
    }
    const copy = [...steps];
    copy.splice(index, 1);
    setSteps(copy);
  };

  // Update step field helper
  const updateStep = (index, field, value) => {
    const copy = [...steps];
    copy[index][field] = value;
    setSteps(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validate that tools are selected
    const validSteps = steps.filter(s => s.toolId !== "");
    if (validSteps.length === 0) {
      setErrorMsg("Please select at least one valid AI tool to build a custom workflow step.");
      setIsSubmitting(false);
      return;
    }

    if (!title.trim() || !summary.trim() || !description.trim()) {
      setErrorMsg("Please fill in the workflow title, summary hook, and details.");
      setIsSubmitting(false);
      return;
    }

    // Format steps with standard stepNumber (1-indexed)
    const formattedSteps = validSteps.map((s, idx) => ({
      toolId: s.toolId,
      stepNumber: idx + 1,
      useCase: s.useCase || `Step ${idx + 1} integration tool.`
    }));

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          description: description.trim(),
          role,
          industry,
          budget,
          steps: formattedSteps
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Workflow Stack created and shared in the marketplace! Redirecting...");
        setTimeout(() => {
          router.push("/workflows");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to publish workflow.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while communicating with the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter approved tools list
  const approvedToolsList = tools.filter(t => t.approved !== false);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto 5rem auto", padding: "0 1rem" }}>
      
      {/* Back Link */}
      <Link href="/workflows" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>
        &larr; Back to Automations Marketplace
      </Link>

      <div className="detail-glass-card" style={{ padding: "3rem" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--neon-purple)", letterSpacing: "1px" }}>
            🛠️ Automation Architect
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: "800", color: "var(--text-bright)", marginTop: "0.5rem" }}>
            Build a Workflow Stack
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Link multiple directory tools into a cohesive step-by-step workflow for developers, creators, or designers.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(255, 69, 58, 0.1)", border: "1px solid rgb(255, 69, 58)", color: "rgb(255, 69, 58)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            ⚠ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: "rgba(52, 199, 89, 0.1)", border: "1px solid rgb(52, 199, 89)", color: "rgb(52, 199, 89)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          
          {/* Title */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Workflow Title</label>
            <input
              type="text"
              placeholder="e.g. Automated E-Commerce Visual Content Generation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px" }}
              required
            />
          </div>

          {/* Grid parameters */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            
            {/* Target Role */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.85rem" }}>Target Professional</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
                style={{ width: "100%", height: "40px", cursor: "pointer" }}
              >
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Industry */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.85rem" }}>Industry Niche</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="form-input"
                style={{ width: "100%", height: "40px", cursor: "pointer" }}
              >
                {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>

            {/* Budget */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.85rem" }}>Pricing Target</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-input"
                style={{ width: "100%", height: "40px", cursor: "pointer" }}
              >
                {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

          </div>

          {/* Summary */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>1-Sentence Summary Hook</label>
            <input
              type="text"
              placeholder="e.g. Generate premium product graphics and social headlines in under 10 seconds."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px" }}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Workflow Overview & Breakdown</label>
            <textarea
              placeholder="Detail what this workflow accomplishes, how long it takes, and the efficiency boost creators can expect."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              style={{ width: "100%", minHeight: "100px", padding: "1rem", fontSize: "0.9rem", lineHeight: "1.5" }}
              required
            />
          </div>

          {/* Multi-Step Stack Configurator */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
              <label style={{ fontWeight: "700", color: "var(--text-bright)", fontSize: "1.1rem" }}>🛠️ Step-by-Step Stack Connections</label>
              <button
                type="button"
                onClick={addStep}
                style={{
                  background: "rgba(0,113,227,0.08)",
                  border: "1px solid rgba(0,113,227,0.2)",
                  color: "var(--neon-cyan)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,113,227,0.12)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,113,227,0.08)"}
              >
                + Add Automation Step
              </button>
            </div>

            {/* Dynamic steps renderer */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    background: "rgba(255, 255, 255, 0.4)",
                    border: "1px solid var(--border-glass)",
                    borderRadius: "16px",
                    padding: "1.5rem",
                    position: "relative",
                    animation: "fadeSlideIn 0.3s ease"
                  }}
                >
                  {/* Circle Step indicator & Delete Option */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        background: "linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)",
                        color: "#080710",
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        fontWeight: "800"
                      }}
                    >
                      {idx + 1}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      style={{
                        background: "rgba(255,69,58,0.08)",
                        border: "1px solid rgba(255,69,58,0.15)",
                        color: "rgb(255,69,58)",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,69,58,0.12)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,69,58,0.08)"}
                    >
                      Delete Step
                    </button>
                  </div>

                  {/* Form input row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", alignItems: "start" }}>
                    
                    {/* Tool Select */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>Select AI Tool</label>
                      <select
                        value={step.toolId}
                        onChange={(e) => updateStep(idx, "toolId", e.target.value)}
                        className="form-input"
                        style={{ width: "100%", height: "38px", cursor: "pointer" }}
                        required
                      >
                        <option value="">-- Choose Tool --</option>
                        {approvedToolsList.map((t) => (
                          <option key={t.id} value={t.id}>{t.name} ({t.pricing})</option>
                        ))}
                      </select>
                    </div>

                    {/* Step Use Case */}
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>Role & Action Instructions for this Step</label>
                      <input
                        type="text"
                        placeholder="e.g. Deploy Stable Diffusion here to render initial cinematics."
                        value={step.useCase}
                        onChange={(e) => updateStep(idx, "useCase", e.target.value)}
                        className="form-input"
                        style={{ width: "100%", height: "38px" }}
                        required
                      />
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="cta-btn action-primary"
            disabled={isSubmitting}
            style={{
              width: "100%",
              height: "46px",
              fontWeight: "800",
              fontSize: "1rem",
              marginTop: "1.5rem",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Building automation stack..." : "Share Workflow Stack &rarr;"}
          </button>

        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
