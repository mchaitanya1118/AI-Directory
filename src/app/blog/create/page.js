"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function CreateBlogPost() {
  const { data: session, status } = useSession();
  const { tools } = useApp();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("coding");
  const [readTime, setReadTime] = useState("5 min read");
  const [keywords, setKeywords] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [selectedTools, setSelectedTools] = useState([]);
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Handle standard auth redirects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/blog/create");
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

  const toggleToolSelection = (toolId) => {
    setSelectedTools(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!title.trim() || !bodyText.trim()) {
      setErrorMsg("Title and article body are required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
          category,
          readTime,
          keywords,
          body: bodyText,
          relatedTools: selectedTools
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Article published successfully! Redirecting...");
        setTimeout(() => {
          router.push(`/blog/${data.post.id}`);
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to publish blog post.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while communicating with the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto 5rem auto", padding: "0 1rem" }}>
      
      {/* Back link */}
      <Link href="/blog" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>
        &larr; Back to Editorial Hub
      </Link>

      <div className="detail-glass-card" style={{ padding: "3rem" }}>
        
        {/* Title area */}
        <div style={{ marginBottom: "2.5rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "var(--neon-purple)", letterSpacing: "1px" }}>
            ✍️ UGC Publisher
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: "800", color: "var(--text-bright)", marginTop: "0.5rem" }}>
            Publish a New Tutorial
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.3rem" }}>
            Share automated workflows, software stack breakdowns, and developmental concepts with our active audience.
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
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Article Title</label>
            <input
              type="text"
              placeholder="e.g. How to Automate Node.js Refactoring using Cursor and Claude"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px" }}
              required
            />
          </div>

          {/* Grid for parameters */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Category */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Niche Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
                style={{ width: "100%", height: "42px", cursor: "pointer" }}
              >
                <option value="coding">Coding (AI Assistants & IDEs)</option>
                <option value="productivity">Productivity & LLMs</option>
                <option value="design">Design & Image Generation</option>
                <option value="general">General AI Tutorials</option>
              </select>
            </div>

            {/* Read Time */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Estimated Read Time</label>
              <input
                type="text"
                placeholder="e.g. 5 min read"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="form-input"
                style={{ width: "100%", height: "42px" }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Brief Hook / Executive Summary</label>
            <input
              type="text"
              placeholder="Provide a 1-sentence synopsis that grabs readers' attention."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px" }}
            />
          </div>

          {/* Keywords */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Keywords (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. cursor, automated, productivity, claude"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="form-input"
              style={{ width: "100%", height: "42px" }}
            />
          </div>

          {/* Article Body */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Article Content (Markdown supported)</label>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "-0.25rem", marginBottom: "0.5rem" }}>
              *Tip: Use '#' for headings and double-newlines for separate paragraphs.*
            </p>
            <textarea
              placeholder="# Introduction&#10;Write your paragraphs here...&#10;&#10;# Step 1: Getting Started&#10;Add more descriptive tutorials..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="form-input"
              style={{ width: "100%", minHeight: "250px", height: "auto", padding: "1rem", fontFamily: "monospace", fontSize: "0.9rem", lineHeight: "1.6" }}
              required
            />
          </div>

          {/* Related Tools Select */}
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: "700", marginBottom: "0.5rem", display: "block" }}>Tag Related AI Directory Tools</label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "0.75rem",
              background: "rgba(0,0,0,0.02)",
              border: "1px solid var(--border-glass)",
              borderRadius: "14px",
              padding: "1.25rem",
              maxHeight: "180px",
              overflowY: "auto"
            }}>
              {tools.map((t) => {
                const checked = selectedTools.includes(t.id);
                return (
                  <label
                    key={t.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontSize: "0.85rem",
                      color: checked ? "var(--text-bright)" : "var(--text-main)",
                      cursor: "pointer",
                      padding: "0.25rem",
                      borderRadius: "6px",
                      background: checked ? "rgba(0,113,227,0.06)" : "transparent"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleToolSelection(t.id)}
                      style={{ cursor: "pointer" }}
                    />
                    {t.name}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="cta-btn action-primary"
            disabled={isSubmitting}
            style={{
              width: "100%",
              height: "44px",
              fontWeight: "800",
              fontSize: "1rem",
              marginTop: "1rem",
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Publishing Tutorial..." : "Publish Article &rarr;"}
          </button>

        </form>
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
