"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminBlogCMS() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "coding",
    readTime: "5 min read",
    keywords: "",
    summary: "",
    body: "",
    relatedTools: ""
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        alert("Blog Post Published Successfully!");
        router.push("/blog"); // Redirect to public blog index
      } else {
        const data = await res.json();
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert("Failed to publish blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="curated-deep-page">
      <div className="curated-deep-header" style={{ textAlign: "left", paddingBottom: "2rem" }}>
        <Link href="/admin" style={{ color: "var(--neon-cyan)", textDecoration: "none", fontSize: "0.9rem", display: "inline-block", marginBottom: "1rem" }}>
          &larr; Back to Admin Dashboard
        </Link>
        <span className="hero-tagline" style={{ letterSpacing: "2px", color: "#a855f7" }}>
          CONTENT MANAGEMENT SYSTEM
        </span>
        <h1 className="hero-title" style={{ fontSize: "2.5rem", marginTop: "0.5rem" }}>
          New Editorial Post
        </h1>
        <p className="curated-deep-intro" style={{ margin: 0 }}>
          Author and publish high-intent SEO blog content directly to the database.
        </p>
      </div>

      <div className="detail-glass-card" style={{ padding: "2rem", marginTop: "2rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>Article Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-bright)" }}
                placeholder="e.g. 10 Best AI Coding Assistants in 2026"
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>URL Slug (Auto-generated)</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                style={{ padding: "0.75rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-glass)", color: "var(--text-muted)" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ padding: "0.75rem", borderRadius: "8px", background: "#1a1a2e", border: "1px solid var(--border-glass)", color: "white" }}
              >
                <option value="coding">Coding</option>
                <option value="productivity">Productivity</option>
                <option value="design">Design</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>Read Time</label>
              <input
                type="text"
                name="readTime"
                required
                value={formData.readTime}
                onChange={handleChange}
                style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-bright)" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>SEO Keywords (Comma separated)</label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-bright)" }}
                placeholder="ai coding, copilot alternative"
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>Short Summary (For Blog Index)</label>
            <textarea
              name="summary"
              required
              rows={2}
              value={formData.summary}
              onChange={handleChange}
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-bright)", resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>Article Markdown Body</label>
            <textarea
              name="body"
              required
              rows={12}
              value={formData.body}
              onChange={handleChange}
              style={{ padding: "1rem", borderRadius: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border-glass)", color: "white", fontFamily: "monospace", fontSize: "0.9rem", resize: "vertical", lineHeight: 1.6 }}
              placeholder="# Introduction\nWrite your markdown content here..."
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: 600 }}>Related Tool IDs (Comma separated)</label>
            <input
              type="text"
              name="relatedTools"
              value={formData.relatedTools}
              onChange={handleChange}
              style={{ padding: "0.75rem", borderRadius: "8px", background: "var(--bg-card)", border: "1px solid var(--border-glass)", color: "var(--text-bright)" }}
              placeholder="claude-3-5-sonnet, chatgpt"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cta-btn action-primary"
            style={{ padding: "1rem", fontSize: "1.1rem", borderRadius: "8px", marginTop: "1rem", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "Publishing to Database..." : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  );
}
