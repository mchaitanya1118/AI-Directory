"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePrompt() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("Coding");
  const [customCategory, setCustomCategory] = useState("");
  
  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const categories = ["Coding", "Marketing", "Images", "Writing", "Productivity", "Custom"];

  // Authenticate session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/prompts/create");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const finalCategory = category === "Custom" ? customCategory.trim() : category;

    if (!title.trim() || !promptText.trim() || !finalCategory) {
      setErrorMsg("Please fill in all prompt details.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          promptText: promptText.trim(),
          category: finalCategory
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Prompt successfully shared in the library! Redirecting...");
        setTimeout(() => {
          router.push("/prompts");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to publish prompt.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while communicating with the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "650px", margin: "2rem auto 5rem auto", padding: "0 1rem" }}>
      
      {/* Back Link */}
      <Link href="/prompts" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>
        &larr; Back to Prompt Library
      </Link>

      <div className="detail-glass-card" style={{ padding: "2.5rem" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--neon-cyan)", letterSpacing: "1px" }}>
            💡 Prompt Architect
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: "800", color: "var(--text-bright)", marginTop: "0.5rem" }}>
            Share a Copyable Prompt
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
            Help others double their task completion speed by sharing optimized, context-rich LLM prompts.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: "rgba(255, 69, 58, 0.1)", border: "1px solid rgb(255, 69, 58)", color: "rgb(255, 69, 58)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
            ⚠ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: "rgba(52, 199, 89, 0.1)", border: "1px solid rgb(52, 199, 89)", color: "rgb(52, 199, 89)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Prompt Title */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem" }}>Prompt Headline / Title</label>
            <input
              type="text"
              placeholder="e.g. Master React Component Refactorer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px" }}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem" }}>Prompt Niche Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px", cursor: "pointer" }}
            >
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Custom Category Input if selected */}
          {category === "Custom" && (
            <div className="form-group" style={{ animation: "fadeSlideIn 0.2s ease" }}>
              <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.85rem" }}>Enter Custom Category Name</label>
              <input
                type="text"
                placeholder="e.g. Video Automation"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="form-input"
                style={{ width: "100%", height: "40px" }}
                required
              />
            </div>
          )}

          {/* Prompt Text */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block", fontSize: "0.9rem" }}>Prompt Instructions & Text</label>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "-0.25rem", marginBottom: "0.5rem" }}>
              *Clearly structure what system role to assign, the context bounds, and execution commands.*
            </p>
            <textarea
              placeholder="You are an expert React architect. Your goal is to optimize components by extracting inline CSS blocks into structured tailwind variables..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="form-input"
              style={{ width: "100%", minHeight: "180px", height: "auto", padding: "1rem", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.5" }}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="cta-btn action-primary"
            disabled={isSubmitting}
            style={{
              width: "100%",
              height: "44px",
              fontWeight: "800",
              fontSize: "0.95rem",
              marginTop: "0.5rem",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Saving Prompt..." : "Share Prompt &rarr;"}
          </button>

        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
