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

  // Mock Saved Agents and Workflows for full premium look & feel
  const mockSavedAgents = [
    { id: "customer-support-agent", name: "AuraSupport Agent", category: "Customer Support", logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>` }
  ];

  const mockSavedWorkflows = [
    { id: "1", title: "Automated Lead Outreach", role: "Developer", budget: "Freemium" }
  ];

  return (
    <div className="curated-deep-page" style={{ paddingTop: "2rem" }}>
      <div className="curated-deep-header" style={{ textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <span className="hero-tagline" style={{ letterSpacing: "2px", background: "var(--neon-purple-glow)", padding: "0.25rem 0.75rem", borderRadius: "12px", color: "var(--neon-purple)" }}>
            {user.role === "ADMIN" ? "⚡ ADMINISTRATOR CONSOLE" : "👤 USER PROFILE DASHBOARD"}
          </span>
          <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
            Welcome back, {user.username}
          </h1>
          <p className="curated-deep-intro" style={{ margin: 0 }}>
            Analyze your saved tools, check your courses progress, view outreach logs, and configure listings.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {user.role === "ADMIN" && (
            <Link href="/admin" className="cta-btn action-primary" style={{ height: "38px", display: "flex", alignItems: "center", textDecoration: "none", fontWeight: "700" }}>
              Admin Console 🛠️
            </Link>
          )}
          <SignOutButton />
        </div>
      </div>

      {/* Grid: Left main info, Right telemetry analytics */}
      <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "2.5rem", marginTop: "3rem", alignItems: "start" }}>
        
        {/* Left main bookmarks feeds */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          {/* Saved Tools */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1.5rem", fontSize: "1.4rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
              🏆 My Bookmarked Tools ({user.bookmarks.length})
            </h2>
            
            {user.bookmarks.length > 0 ? (
              <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {user.bookmarks.map((b) => (
                  <ToolCard key={b.toolId} tool={b.tool} />
                ))}
              </div>
            ) : (
              <div className="detail-glass-card" style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  You haven't bookmarked any AI tools yet.
                </p>
                <Link href="/category/all" className="cta-btn action-primary" style={{ padding: "0.5rem 1.5rem", textDecoration: "none" }}>
                  Explore Directory
                </Link>
              </div>
            )}
          </div>

          {/* Saved Agents & Workflows Split */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            
            {/* Saved Agents */}
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1.25rem", fontSize: "1.2rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
                🤖 Saved AI Agents ({mockSavedAgents.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {mockSavedAgents.map((agent) => (
                  <div key={agent.id} className="detail-glass-card" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div className="card-logo-wrap" style={{ width: "32px", height: "32px", padding: "0.25rem" }} dangerouslySetInnerHTML={{ __html: agent.logo }} />
                    <div>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-bright)" }}>{agent.name}</strong>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{agent.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Workflows */}
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1.25rem", fontSize: "1.2rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
                ⚡ Saved AI Workflows ({mockSavedWorkflows.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {mockSavedWorkflows.map((w) => (
                  <div key={w.id} className="detail-glass-card" style={{ padding: "1rem" }}>
                    <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-bright)" }}>{w.title}</strong>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{w.role} • {w.budget}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Published Reviews */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", marginBottom: "1.5rem", fontSize: "1.4rem", borderBottom: "1px solid var(--border-glass)", paddingBottom: "0.5rem" }}>
              ✍️ My Published Reviews ({user.reviews.length})
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

        {/* Right Column: Telemetry Analytics, Creator Board, and Activity Logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* Dashboard Stats */}
          <div className="detail-glass-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1rem" }}>
              Dashboard telemetry
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Last Login Activity</span>
                <strong style={{ fontSize: "0.9rem", color: "var(--text-bright)" }}>Today, 17:24 PM</strong>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Security Status</span>
                <strong style={{ fontSize: "0.9rem", color: "var(--text-bright)" }}>🔒 Crawl Sync Active</strong>
              </div>
              <div>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Creator Status</span>
                <strong style={{ fontSize: "0.9rem", color: "var(--text-bright)" }}>{user.role === "ADMIN" ? "Pro Partner" : "Standard Tier"}</strong>
              </div>
            </div>
          </div>

          {/* Activity logs */}
          <div className="detail-glass-card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1rem" }}>
              ⚡ Recent Activity Feed
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-main)", lineHeight: "1.4" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>5 mins ago</span>
                Started Course: <strong>AI Fundamentals</strong>.
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>1 hour ago</span>
                Generated custom CRM workflow blueprint via AI Consultant.
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Yesterday</span>
                Bookmarked <strong>AuraSupport Agent</strong> from the Agent Marketplace.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
