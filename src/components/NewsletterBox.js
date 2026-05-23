"use client";

import React, { useState } from "react";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      setMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMsg("Securing connection...");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg(data.message || "Welcome to the future of AI! You're subscribed.");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error || "Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMsg("Network error. Please try again.");
    }
  };

  return (
    <div 
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(20px)",
        textAlign: "center"
      }}
      className="newsletter-box"
    >
      <div 
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, var(--neon-cyan-glow) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "-50px",
          right: "-50px",
          width: "120px",
          height: "120px",
          background: "radial-gradient(circle, var(--neon-purple-glow) 0%, transparent 70%)",
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <span 
          style={{ 
            display: "inline-block", 
            padding: "0.25rem 0.6rem", 
            borderRadius: "20px", 
            fontSize: "0.65rem", 
            fontWeight: "600", 
            background: "rgba(0, 113, 227, 0.1)", 
            color: "var(--neon-cyan)",
            border: "1px solid rgba(0, 113, 227, 0.2)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "0.75rem"
          }}
        >
          Weekly digest ⚡
        </span>
        <h3 
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "1.35rem", 
            color: "#ffffff", 
            marginBottom: "0.5rem",
            fontWeight: "700"
          }}
        >
          Stay Ahead of the AI Curve
        </h3>
        <p 
          style={{ 
            color: "var(--text-muted)", 
            fontSize: "0.8rem", 
            maxWidth: "400px", 
            margin: "0 auto 1.5rem auto",
            lineHeight: "1.4"
          }}
        >
          Join 24,000+ creators, builders, and developers who get the top 10 trending AI tools and templates delivered every week.
        </p>

        {status === "success" ? (
          <div 
            style={{ 
              padding: "1rem", 
              background: "rgba(16, 185, 129, 0.1)", 
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "8px", 
              color: "#10b981", 
              fontSize: "0.85rem",
              fontWeight: "500",
              animation: "fadeIn 0.3s ease"
            }}
          >
            ✓ {msg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem", maxWidth: "480px", margin: "0 auto" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                suppressHydrationWarning
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  padding: "0.55rem 1rem",
                  fontSize: "0.8rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "20px",
                  color: "#ffffff",
                  outline: "none",
                  transition: "var(--transition-smooth)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)"
                }}
                className="newsletter-input"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                background: "var(--gradient-main)",
                color: "#ffffff",
                fontSize: "0.75rem",
                fontWeight: "600",
                padding: "0.55rem 1.25rem",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                transition: "var(--transition-smooth)",
                boxShadow: "0 0 15px rgba(0, 113, 227, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              {status === "loading" ? (
                <>
                  <span className="spinner-mini" /> Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <div 
            style={{ 
              color: "#ff4d4d", 
              fontSize: "0.75rem", 
              marginTop: "0.5rem",
              fontWeight: "500"
            }}
          >
            ⚠ {msg}
          </div>
        )}
      </div>

      <style jsx>{`
        .spinner-mini {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .newsletter-input:focus {
          border-color: var(--neon-cyan) !important;
          box-shadow: 0 0 8px rgba(0, 113, 227, 0.2) !important;
        }
      `}</style>
    </div>
  );
}
