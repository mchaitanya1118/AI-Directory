import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import SignOutButton from "@/components/SignOutButton";

export const metadata = {
  title: "My Profile Dashboard | AuraAI",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null; // Middleware will catch this, but just in case
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      bookmarks: {
        include: {
          tool: {
            include: { reviews: true, tags: { include: { tag: true } } }
          }
        }
      },
      reviews: {
        include: { tool: true }
      }
    }
  });

  if (!user) {
    return <div>User not found in database.</div>;
  }

  return (
    <div className="curated-deep-page">
      <div className="curated-deep-header" style={{ textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span className="hero-tagline" style={{ letterSpacing: "2px" }}>
            {user.role === "ADMIN" ? "ADMINISTRATOR" : "USER DASHBOARD"}
          </span>
          <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
            Welcome, {user.username}
          </h1>
          <p className="curated-deep-intro" style={{ margin: 0 }}>
            Manage your saved tools, track your reviews, and customize your directory experience.
          </p>
        </div>
        <div>
          <SignOutButton />
        </div>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          My Bookmarked Tools ({user.bookmarks.length})
        </h2>
        
        {user.bookmarks.length > 0 ? (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {user.bookmarks.map((b) => (
              <ToolCard key={b.toolId} tool={b.tool} />
            ))}
          </div>
        ) : (
          <div className="detail-glass-card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              You haven't bookmarked any AI tools yet.
            </p>
            <Link href="/category/all" className="btn-secondary">
              Explore Directory
            </Link>
          </div>
        )}
      </div>

      <div style={{ marginTop: "4rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          My Published Reviews ({user.reviews.length})
        </h2>

        {user.reviews.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {user.reviews.map((r) => (
              <div key={r.id} className="detail-glass-card" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <Link href={`/tool/${r.toolId}`} style={{ color: "var(--neon-cyan)", textDecoration: "none", fontWeight: 600, fontSize: "1.1rem" }}>
                    {r.tool.name}
                  </Link>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.date}</span>
                </div>
                <div style={{ display: "flex", gap: "0.25rem", color: "var(--neon-gold)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
                  {"★".repeat(Math.round(r.rating))}
                  {"☆".repeat(5 - Math.round(r.rating))}
                </div>
                <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
                  "{r.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="detail-glass-card" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-muted)" }}>
              You haven't submitted any reviews yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
