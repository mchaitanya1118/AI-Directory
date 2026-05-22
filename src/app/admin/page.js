import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export const metadata = {
  title: "Admin CMS | AuraAI",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return null; // Caught by middleware
  }

  const [totalUsers, totalTools, totalReviews, totalBookmarks] = await Promise.all([
    prisma.user.count(),
    prisma.tool.count(),
    prisma.review.count(),
    prisma.bookmark.count(),
  ]);

  return (
    <div className="curated-deep-page">
      <div className="curated-deep-header" style={{ textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span className="hero-tagline" style={{ letterSpacing: "2px", color: "#ff4d4d" }}>
            CMS SYSTEM
          </span>
          <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
            Admin Dashboard
          </h1>
          <p className="curated-deep-intro" style={{ margin: 0 }}>
            Manage AuraAI database entries, users, and trigger programmatic scrape scripts.
          </p>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>

      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "3rem", color: "var(--neon-cyan)", margin: 0 }}>{totalTools}</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>Total Tools</p>
        </div>
        <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "3rem", color: "var(--neon-gold)", margin: 0 }}>{totalUsers}</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>Registered Users</p>
        </div>
        <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "3rem", color: "#a855f7", margin: 0 }}>{totalReviews}</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>User Reviews</p>
        </div>
        <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "3rem", color: "#10b981", margin: 0 }}>{totalBookmarks}</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "1px" }}>Saved Bookmarks</p>
        </div>
      </div>

      <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        <div className="detail-glass-card">
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1rem", fontSize: "1.25rem" }}>Data Ingestion Tools</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Manually trigger the Playwright scraper script to ingest new AI platforms into the database.
          </p>
          <Link href="/admin/scraper" className="cta-btn action-primary" style={{ display: "inline-block" }}>
            Launch Scraper UI &rarr;
          </Link>
        </div>

        <div className="detail-glass-card">
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1rem", fontSize: "1.25rem" }}>Content Management</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            Author, edit, and publish high-converting SEO blog posts.
          </p>
          <Link href="/admin/blog" className="btn-secondary" style={{ display: "inline-block" }}>
            Open Blog Editor &rarr;
          </Link>
        </div>

        <div className="detail-glass-card">
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1rem", fontSize: "1.25rem" }}>Quick Links</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <li>
              <Link href="/profile" style={{ color: "var(--neon-cyan)", textDecoration: "none" }}>&rarr; View Public Profile</Link>
            </li>
            <li>
              <Link href="/" style={{ color: "var(--neon-cyan)", textDecoration: "none" }}>&rarr; View Live Site</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
