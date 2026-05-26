"use client";

import React, { useState } from "react";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import { LayoutDashboard, Wrench, ShieldAlert, Link as LinkIcon, Mail, Users, MessageSquare, Database, PenTool, Trash2, Edit3, ArrowRight, Bookmark, Globe } from "lucide-react";

export default function AdminClient({
  initialTools = [],
  initialUsers = [],
  initialReviews = [],
  totalBookmarks = 0,
  initialSubscribers = []
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [tools, setTools] = useState(initialTools);
  const [users, setUsers] = useState(initialUsers);
  const [reviews, setReviews] = useState(initialReviews);
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  // Newsletter blast states
  const [blastSubject, setBlastSubject] = useState("");
  const [blastContent, setBlastContent] = useState("");
  const [isSendingBlast, setIsSendingBlast] = useState(false);
  const [blastSuccess, setBlastSuccess] = useState(false);

  // Filter and search state for Tools
  const [toolSearch, setToolSearch] = useState("");
  const [toolCategory, setToolCategory] = useState("all");

  // Central Command Inline editing states
  const [inlineData, setInlineData] = useState({});
  const [savingStates, setSavingStates] = useState({});

  // Loading and Alert states
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected tool for Edit/Delete
  const [selectedTool, setSelectedTool] = useState(null);

  // Form states for Add/Edit Tool
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    website: "",
    pricing: "Free",
    pricingDetails: "",
    shortDescription: "",
    description: "",
    logo: "",
    sponsored: false,
    features: "",
    pros: "",
    cons: "",
    tags: ""
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 5000);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      categoryId: "coding",
      website: "",
      pricing: "Free",
      pricingDetails: "Free basic tier",
      shortDescription: "",
      description: "",
      logo: "",
      sponsored: false,
      features: "AI Assistance, Speed Optimization",
      pros: "Intuitive UI, Fast execution",
      cons: "Requires connection",
      tags: "Popular, Free, Utility"
    });
    setShowCreateModal(true);
  };

  const openEditModal = (tool) => {
    setSelectedTool(tool);
    setFormData({
      name: tool.name || "",
      categoryId: tool.categoryId || tool.category || "",
      website: tool.website || "",
      pricing: tool.pricing || "Free",
      pricingDetails: tool.pricingDetails || "",
      shortDescription: tool.shortDescription || "",
      description: tool.description || "",
      logo: tool.logo || "",
      sponsored: !!tool.sponsored,
      features: Array.isArray(tool.features) ? tool.features.join(", ") : "",
      pros: Array.isArray(tool.pros) ? tool.pros.join(", ") : "",
      cons: Array.isArray(tool.cons) ? tool.cons.join(", ") : "",
      tags: Array.isArray(tool.tags) ? tool.tags.join(", ") : ""
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (tool) => {
    setSelectedTool(tool);
    setShowDeleteModal(true);
  };

  // API Call: Create Tool
  const handleCreateTool = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      const featuresArray = formData.features.split(",").map(t => t.trim()).filter(Boolean);
      const prosArray = formData.pros.split(",").map(t => t.trim()).filter(Boolean);
      const consArray = formData.cons.split(",").map(t => t.trim()).filter(Boolean);

      const response = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: formData.categoryId,
          tags: tagsArray,
          features: featuresArray,
          pros: prosArray,
          cons: consArray
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        // Refetch/append tools
        const newTool = {
          ...resData.tool,
          category: resData.tool.categoryId,
          tags: tagsArray,
          features: featuresArray,
          pros: prosArray,
          cons: consArray,
          reviews: []
        };
        setTools((prev) => [newTool, ...prev]);
        setShowCreateModal(false);
        showAlert("success", "Tool registered successfully in directory!");
      } else {
        showAlert("error", resData.error || "Failed to register tool");
      }
    } catch (err) {
      showAlert("error", "Network failure registering tool");
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Edit Tool
  const handleEditTool = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const tagsArray = formData.tags.split(",").map(t => t.trim()).filter(Boolean);
      const featuresArray = formData.features.split(",").map(t => t.trim()).filter(Boolean);
      const prosArray = formData.pros.split(",").map(t => t.trim()).filter(Boolean);
      const consArray = formData.cons.split(",").map(t => t.trim()).filter(Boolean);

      const response = await fetch(`/api/tools/${selectedTool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          features: featuresArray,
          pros: prosArray,
          cons: consArray
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setTools((prev) =>
          prev.map((t) =>
            t.id === selectedTool.id
              ? {
                  ...t,
                  ...resData.tool,
                  category: resData.tool.categoryId,
                  tags: tagsArray,
                  features: featuresArray,
                  pros: prosArray,
                  cons: consArray
                }
              : t
          )
        );
        setShowEditModal(false);
        showAlert("success", "Tool parameters successfully updated!");
      } else {
        showAlert("error", resData.error || "Failed to update tool details");
      }
    } catch (err) {
      showAlert("error", "Network failure updating tool details");
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Delete Tool
  const handleDeleteTool = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${selectedTool.id}`, {
        method: "DELETE"
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setTools((prev) => prev.filter((t) => t.id !== selectedTool.id));
        setShowDeleteModal(false);
        showAlert("success", "Tool completely removed from database.");
      } else {
        showAlert("error", resData.error || "Failed to remove tool");
      }
    } catch (err) {
      showAlert("error", "Network failure deleting tool");
    } finally {
      setIsLoading(false);
    }
  };

  // API Call: Quick Toggle Sponsor Spot
  const toggleSponsor = async (tool) => {
    try {
      const newStatus = !tool.sponsored;
      const response = await fetch(`/api/tools/${tool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsored: newStatus })
      });

      if (response.ok) {
        setTools((prev) =>
          prev.map((t) => (t.id === tool.id ? { ...t, sponsored: newStatus } : t))
        );
        showAlert("success", `${tool.name} spotlight ${newStatus ? "enabled" : "disabled"}!`);
      } else {
        showAlert("error", "Failed to update spotlight status");
      }
    } catch (err) {
      showAlert("error", "Network error toggling sponsor status");
    }
  };

  // API Call: Moderation Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you absolutely sure you want to delete this review?")) return;
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
      });

    } catch (err) {
      showAlert("error", "Network failure moderating reviews");
    }
  };

  const handleApproveTool = async (toolId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setTools((prev) =>
          prev.map((t) => (t.id === toolId ? { ...t, approved: true } : t))
        );
        showAlert("success", "Tool approved successfully!");
      } else {
        showAlert("error", resData.error || "Failed to approve tool");
      }
    } catch (err) {
      showAlert("error", "Network failure approving tool");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectTool = async (toolId) => {
    if (!confirm("Are you sure you want to reject and delete this tool submission?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "DELETE"
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setTools((prev) => prev.filter((t) => t.id !== toolId));
        showAlert("success", "Tool submission rejected and deleted.");
      } else {
        showAlert("error", resData.error || "Failed to reject tool");
      }
    } catch (err) {
      showAlert("error", "Network failure rejecting tool");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
        showAlert("success", `User role successfully updated to ${newRole}`);
      } else {
        showAlert("error", resData.error || "Failed to update user role");
      }
    } catch (err) {
      showAlert("error", "Network failure updating user role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Are you sure you want to permanently delete user @${username}? This action cannot be undone.`)) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE"
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showAlert("success", `User @${username} was completely deleted.`);
      } else {
        showAlert("error", resData.error || "Failed to delete user");
      }
    } catch (err) {
      showAlert("error", "Network failure deleting user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendBlast = (e) => {
    e.preventDefault();
    if (!blastSubject || !blastContent) {
      showAlert("error", "Subject and content cannot be blank!");
      return;
    }
    setIsSendingBlast(true);
    setBlastSuccess(false);

    // Simulate standard SMTP dispatch
    setTimeout(() => {
      setIsSendingBlast(false);
      setBlastSuccess(true);
      setBlastSubject("");
      setBlastContent("");
      showAlert("success", `Newsletter successfully dispatched to ${subscribers.length} subscribers!`);
      setTimeout(() => setBlastSuccess(false), 5000);
    }, 2500);
  };

  const handleInlineChange = (toolId, field, value) => {
    setInlineData((prev) => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        [field]: value
      }
    }));
  };

  const handleSaveInline = async (tool) => {
    const updatedName = inlineData[tool.id]?.name !== undefined ? inlineData[tool.id].name : tool.name;
    const updatedWebsite = inlineData[tool.id]?.website !== undefined ? inlineData[tool.id].website : tool.website;

    // Basic Validation
    if (!updatedName.trim()) {
      showAlert("error", "Tool Name cannot be empty.");
      return;
    }
    if (!updatedWebsite.trim()) {
      showAlert("error", "Website redirect link cannot be empty.");
      return;
    }

    setSavingStates((prev) => ({ ...prev, [tool.id]: "saving" }));

    try {
      const response = await fetch(`/api/tools/${tool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedName,
          website: updatedWebsite
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        // Update local tools list
        setTools((prev) =>
          prev.map((t) =>
            t.id === tool.id
              ? {
                  ...t,
                  name: updatedName,
                  website: updatedWebsite
                }
              : t
          )
        );

        setSavingStates((prev) => ({ ...prev, [tool.id]: "saved" }));
        showAlert("success", `In-place details for "${updatedName}" saved!`);

        // Reset the saved status back to idle after 3 seconds
        setTimeout(() => {
          setSavingStates((prev) => ({ ...prev, [tool.id]: "idle" }));
        }, 3000);
      } else {
        setSavingStates((prev) => ({ ...prev, [tool.id]: "error" }));
        showAlert("error", resData.error || "Failed to save details inline.");
      }
    } catch (err) {
      setSavingStates((prev) => ({ ...prev, [tool.id]: "error" }));
      showAlert("error", "Network connection issue while saving.");
    }
  };

  const approvedTools = tools.filter(t => t.approved);
  const pendingTools = tools.filter(t => !t.approved);

  // Categories extraction
  const categoriesList = Array.from(new Set(approvedTools.map((t) => t.categoryId || t.category))).filter(Boolean);

  // Filter tools based on search & category selection
  const filteredTools = approvedTools.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(toolSearch.toLowerCase());
    const cat = t.categoryId || t.category || "";
    const matchesCategory = toolCategory === "all" || cat.toLowerCase() === toolCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="curated-deep-page">
      {/* Alert Notification Toast */}
      {alert.message && (
        <div
          className={`card-glass`}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            padding: "1rem 2rem",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            border: alert.type === "success" ? "1px solid var(--neon-cyan)" : "1px solid #ff4d4d",
            background: "rgba(10, 10, 15, 0.95)"
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>{alert.type === "success" ? "✓" : "⚠"}</span>
          <span style={{ color: "var(--text-bright)", fontWeight: "600", fontSize: "0.9rem" }}>{alert.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <div
        className="curated-deep-header"
        style={{
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}
      >
        <div>
          <span className="hero-tagline" style={{ letterSpacing: "2px", color: "var(--neon-cyan)" }}>
            ADMIN CENTRAL COMMAND
          </span>
          <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "0.5rem" }}>
            AuraAI Director Portal
          </h1>
          <p className="curated-deep-intro" style={{ margin: 0 }}>
            CRUD panel for tool inventories, visual rosters, and comment moderation metrics.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/" className="btn-secondary" style={{ padding: "0.5rem 1rem", textDecoration: "none", fontSize: "0.85rem" }}>
            Site Index &rarr;
          </Link>
          <SignOutButton />
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--border-glass)",
          marginTop: "3rem",
          gap: "1.5rem",
          paddingBottom: "0.5rem",
          overflowX: "auto"
        }}
      >
        {[
          { id: "overview", label: "Overview Metrics", icon: <LayoutDashboard size={18} /> },
          { id: "tools", label: `Tools Inventory (${approvedTools.length})`, icon: <Wrench size={18} /> },
          { id: "moderation", label: `Moderation Queue (${pendingTools.length})`, icon: <ShieldAlert size={18} /> },
          { id: "central-command", label: "Central Link Command", icon: <LinkIcon size={18} /> },
          { id: "subscribers", label: `Newsletter Leads (${subscribers.length})`, icon: <Mail size={18} /> },
          { id: "users", label: `User Roster (${users.length})`, icon: <Users size={18} /> },
          { id: "reviews", label: `Reviews Moderation (${reviews.length})`, icon: <MessageSquare size={18} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: activeTab === tab.id ? "var(--text-bright)" : "var(--text-muted)",
              fontWeight: activeTab === tab.id ? "700" : "500",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              background: activeTab === tab.id ? "rgba(255, 255, 255, 0.03)" : "transparent",
              transition: "all 0.2s"
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div style={{ marginTop: "2.5rem" }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            {/* Quick Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ background: "rgba(0, 113, 227, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "0.5rem" }}><Database size={24} color="var(--neon-cyan)" /></div>
                <h3 style={{ fontSize: "2.5rem", color: "var(--neon-cyan)", margin: 0, fontFamily: "var(--font-display)", lineHeight: 1 }}>{tools.length}</h3>
                <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "600" }}>Total Tools</p>
              </div>
              <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ background: "rgba(255, 159, 10, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "0.5rem" }}><Users size={24} color="var(--neon-gold)" /></div>
                <h3 style={{ fontSize: "2.5rem", color: "var(--neon-gold)", margin: 0, fontFamily: "var(--font-display)", lineHeight: 1 }}>{users.length}</h3>
                <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "600" }}>Registered Users</p>
              </div>
              <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ background: "rgba(168, 85, 247, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "0.5rem" }}><MessageSquare size={24} color="#a855f7" /></div>
                <h3 style={{ fontSize: "2.5rem", color: "#a855f7", margin: 0, fontFamily: "var(--font-display)", lineHeight: 1 }}>{reviews.length}</h3>
                <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "600" }}>Platform Reviews</p>
              </div>
              <div className="detail-glass-card" style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "1rem", borderRadius: "50%", marginBottom: "0.5rem" }}><Bookmark size={24} color="#10b981" /></div>
                <h3 style={{ fontSize: "2.5rem", color: "#10b981", margin: 0, fontFamily: "var(--font-display)", lineHeight: 1 }}>{totalBookmarks}</h3>
                <p style={{ color: "var(--text-muted)", margin: 0, textTransform: "uppercase", fontSize: "0.8rem", letterSpacing: "1px", fontWeight: "600" }}>Saved Bookmarks</p>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
              <div className="detail-glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", fontSize: "1.25rem", margin: 0 }}>Data Ingestion Crawler</h3>
                    <span style={{ fontSize: "1.25rem" }}>🌐</span>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                    Run the automated web scraper using browser simulators to search new registries, cross-reference pricing tiers, and crawl description indexes.
                  </p>
                </div>
                <Link href="/admin/scraper" className="cta-btn action-primary" style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                  Launch Scraper Panel &rarr;
                </Link>
              </div>

              <div className="detail-glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", fontSize: "1.25rem", margin: 0 }}>Editorial Blog Publisher</h3>
                    <span style={{ fontSize: "1.25rem" }}>✍️</span>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                    Build authoritative SEO-optimized blog posts, attach links of related tools directory elements, and publish structural markdown updates.
                  </p>
                </div>
                <Link href="/admin/blog" className="btn-secondary" style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
                  Launch Blog Editor &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TOOLS TAB */}
        {activeTab === "tools" && (
          <div>
            {/* Header controls */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2rem"
              }}
            >
              <div style={{ display: "flex", gap: "1rem", flexGrow: 1, maxWidth: "500px" }}>
                <input
                  type="text"
                  placeholder="Search tool inventories..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="search-input"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-bright)",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    width: "100%",
                    fontSize: "0.9rem"
                  }}
                />
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  style={{
                    background: "rgba(10, 10, 15, 0.95)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-bright)",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    textTransform: "capitalize"
                  }}
                >
                  <option value="all">All Categories</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={openCreateModal} className="cta-btn action-primary" style={{ padding: "0.6rem 1.25rem", borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer" }}>
                + Add Tool
              </button>
            </div>

            {/* Tools table list */}
            <div className="detail-glass-card" style={{ padding: 0, overflowX: "auto", overflowY: "auto", maxHeight: "600px", border: "1px solid var(--border-glass)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.01)" }}>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Tool Details</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Pricing Tier</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Sponsor Spotlight</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                        No tools found matching current search specs.
                      </td>
                    </tr>
                  ) : (
                    filteredTools.map((tool) => (
                      <tr key={tool.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="table-row-hover">
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div
                              style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              dangerouslySetInnerHTML={{ __html: tool.logo }}
                            />
                            <div>
                              <strong style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{tool.name}</strong>
                              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.15rem" }}>
                                <span style={{ textTransform: "capitalize", color: "var(--neon-cyan)" }}>{tool.categoryId || tool.category}</span>
                                <span>•</span>
                                <a href={tool.website} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                                  {tool.website.replace("https://", "").replace("http://", "").split("/")[0]}
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              background: tool.pricing?.toLowerCase() === "free" ? "rgba(16, 185, 129, 0.1)" : "rgba(168, 85, 247, 0.1)",
                              color: tool.pricing?.toLowerCase() === "free" ? "#10b981" : "#a855f7",
                              border: tool.pricing?.toLowerCase() === "free" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(168, 85, 247, 0.2)"
                            }}
                          >
                            {tool.pricing}
                          </span>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{tool.pricingDetails}</span>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <button
                              onClick={() => toggleSponsor(tool)}
                              style={{
                                background: tool.sponsored ? "rgba(255, 167, 81, 0.15)" : "rgba(255,255,255,0.03)",
                                border: tool.sponsored ? "1px solid rgba(255, 167, 81, 0.4)" : "1px solid var(--border-glass)",
                                color: tool.sponsored ? "var(--neon-gold)" : "var(--text-muted)",
                                padding: "0.3rem 0.75rem",
                                borderRadius: "6px",
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.25rem"
                              }}
                            >
                              <span>★</span>
                              {tool.sponsored ? "Sponsored Spotlight" : "Standard Listing"}
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                            <button
                              onClick={() => openEditModal(tool)}
                              className="btn-secondary"
                              style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", borderRadius: "6px", cursor: "pointer" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(tool)}
                              style={{
                                background: "rgba(255, 77, 77, 0.1)",
                                border: "1px solid rgba(255, 77, 77, 0.2)",
                                color: "#ff4d4d",
                                padding: "0.35rem 0.75rem",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                cursor: "pointer"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CENTRAL LINK COMMAND TAB */}
        {activeTab === "central-command" && (
          <div>
            {/* Header controls (same synced filters as Tools list) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "2rem"
              }}
            >
              <div style={{ display: "flex", gap: "1rem", flexGrow: 1, maxWidth: "500px" }}>
                <input
                  type="text"
                  placeholder="Quick search link registry..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="search-input"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-bright)",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    width: "100%",
                    fontSize: "0.9rem"
                  }}
                />
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  style={{
                    background: "rgba(10, 10, 15, 0.95)",
                    border: "1px solid var(--border-glass)",
                    color: "var(--text-bright)",
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    textTransform: "capitalize"
                  }}
                >
                  <option value="all">All Categories</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Showing <strong style={{ color: "var(--neon-cyan)" }}>{filteredTools.length}</strong> of {tools.length} entries
              </div>
            </div>

            {/* High density spreadsheet-like inline editor */}
            <div className="detail-glass-card" style={{ padding: 0, overflowX: "auto", border: "1px solid var(--border-glass)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.01)" }}>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", width: "35%" }}>AI Tool (Editable Name)</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", width: "40%" }}>Visit Site Redirect URL (Editable)</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)", width: "12%", textAlign: "center" }}>Status State</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", width: "13%", textAlign: "center" }}>Quick Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTools.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                        No tools matching query found.
                      </td>
                    </tr>
                  ) : (
                    filteredTools.map((tool) => {
                      const currentName = inlineData[tool.id]?.name !== undefined ? inlineData[tool.id].name : tool.name;
                      const currentWebsite = inlineData[tool.id]?.website !== undefined ? inlineData[tool.id].website : tool.website;
                      const saveStatus = savingStates[tool.id] || "idle";

                      return (
                        <tr key={tool.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }} className="table-row-hover">
                          {/* Tool Name Input */}
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <div
                                style={{ width: "28px", height: "28px", flexShrink: 0, background: "rgba(255,255,255,0.03)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                dangerouslySetInnerHTML={{ __html: tool.logo }}
                              />
                              <input
                                type="text"
                                value={currentName}
                                onChange={(e) => handleInlineChange(tool.id, "name", e.target.value)}
                                style={{
                                  background: "rgba(255, 255, 255, 0.02)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  borderRadius: "6px",
                                  color: "var(--text-bright)",
                                  padding: "0.4rem 0.6rem",
                                  width: "100%",
                                  fontSize: "0.85rem",
                                  fontWeight: "600",
                                  transition: "all 0.2s"
                                }}
                                className="inline-edit-input"
                                placeholder="Tool name"
                              />
                            </div>
                          </td>

                          {/* Website Input */}
                          <td style={{ padding: "0.75rem 1.5rem" }}>
                            <input
                              type="text"
                              value={currentWebsite}
                              onChange={(e) => handleInlineChange(tool.id, "website", e.target.value)}
                              style={{
                                background: "rgba(255, 255, 255, 0.02)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "6px",
                                color: "var(--text-main)",
                                padding: "0.4rem 0.6rem",
                                width: "100%",
                                fontSize: "0.85rem",
                                fontFamily: "monospace",
                                transition: "all 0.2s"
                              }}
                              className="inline-edit-input"
                              placeholder="https://site-redirect-link.com"
                            />
                          </td>

                          {/* Save Status / Badge */}
                          <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                            {saveStatus === "idle" && (
                              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)" }}></span>
                                Synced
                              </span>
                            )}
                            {saveStatus === "saving" && (
                              <span style={{ color: "var(--neon-gold)", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                <span style={{
                                  display: "inline-block",
                                  width: "8px",
                                  height: "8px",
                                  border: "2px solid var(--neon-gold)",
                                  borderTop: "2px solid transparent",
                                  borderRadius: "50%",
                                  animation: "spin 0.8s linear infinite"
                                }}></span>
                                Saving...
                              </span>
                            )}
                            {saveStatus === "saved" && (
                              <span style={{ color: "#10b981", fontSize: "0.85rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                ✓ Saved
                              </span>
                            )}
                            {saveStatus === "error" && (
                              <span style={{ color: "#ff4d4d", fontSize: "0.85rem", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                ⚠ Error
                              </span>
                            )}
                          </td>

                          {/* Inline Action Buttons */}
                          <td style={{ padding: "0.75rem 1.5rem", textAlign: "center" }}>
                            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                              <button
                                onClick={() => {
                                  if (currentWebsite) {
                                    window.open(currentWebsite, "_blank");
                                  } else {
                                    showAlert("error", "No outbound link specified!");
                                  }
                                }}
                                title="Test Redirect URL Outbound"
                                style={{
                                  background: "rgba(255, 255, 255, 0.03)",
                                  border: "1px solid var(--border-glass)",
                                  color: "var(--text-muted)",
                                  padding: "0.35rem 0.6rem",
                                  fontSize: "0.75rem",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontWeight: "600",
                                  transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "var(--neon-cyan)";
                                  e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "var(--text-muted)";
                                  e.currentTarget.style.borderColor = "var(--border-glass)";
                                }}
                              >
                                Test ↗
                              </button>
                              <button
                                onClick={() => handleSaveInline(tool)}
                                disabled={saveStatus === "saving"}
                                style={{
                                  background: saveStatus === "saved" ? "rgba(16, 185, 129, 0.15)" : "rgba(0, 242, 254, 0.15)",
                                  border: saveStatus === "saved" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(0, 242, 254, 0.4)",
                                  color: saveStatus === "saved" ? "#10b981" : "var(--neon-cyan)",
                                  padding: "0.35rem 0.75rem",
                                  fontSize: "0.75rem",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  fontWeight: "700",
                                  transition: "all 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                  if (saveStatus !== "saved") {
                                    e.currentTarget.style.background = "rgba(0, 242, 254, 0.25)";
                                    e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.6)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (saveStatus !== "saved") {
                                    e.currentTarget.style.background = "rgba(0, 242, 254, 0.15)";
                                    e.currentTarget.style.borderColor = "rgba(0, 242, 254, 0.4)";
                                  }
                                }}
                              >
                                {saveStatus === "saving" ? "Saving" : "Save"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Custom animations styles injected directly for local support */}
            <style jsx global>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .inline-edit-input:focus {
                outline: none;
                border-color: rgba(0, 242, 254, 0.6) !important;
                background: rgba(255, 255, 255, 0.05) !important;
                box-shadow: 0 0 10px rgba(0, 242, 254, 0.15);
              }
            `}</style>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div>
            <div className="detail-glass-card" style={{ padding: 0, overflowX: "auto", border: "1px solid var(--border-glass)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.01)" }}>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Username</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Email Address</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Security Role</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", opacity: 0.5 }}>
                          <Users size={48} />
                          <p style={{ margin: 0 }}>No registered accounts in system roster.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "1.25rem 1.5rem", color: "var(--text-bright)", fontWeight: "600" }}>{user.username}</td>
                        <td style={{ padding: "1.25rem 1.5rem", color: "var(--text-muted)" }}>{user.email}</td>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <select
                            value={user.role}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            style={{
                              background: user.role === "ADMIN" ? "rgba(0, 242, 254, 0.1)" : "rgba(255,255,255,0.03)",
                              color: user.role === "ADMIN" ? "var(--neon-cyan)" : "var(--text-muted)",
                              border: user.role === "ADMIN" ? "1px solid rgba(0, 242, 254, 0.2)" : "1px solid var(--border-glass)",
                              padding: "0.4rem 0.6rem",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: "700",
                              cursor: "pointer",
                              outline: "none"
                            }}
                          >
                            <option value="USER" style={{ background: "#111" }}>USER</option>
                            <option value="ADMIN" style={{ background: "#111" }}>ADMIN</option>
                          </select>
                        </td>
                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                           <button
                             onClick={() => handleDeleteUser(user.id, user.username)}
                             style={{
                               background: "rgba(255, 77, 77, 0.1)",
                               border: "1px solid rgba(255, 77, 77, 0.2)",
                               color: "#ff4d4d",
                               padding: "0.4rem 0.75rem",
                               fontSize: "0.8rem",
                               borderRadius: "6px",
                               cursor: "pointer",
                               fontWeight: "600"
                             }}
                             title={`Delete @${user.username}`}
                           >
                             Delete User
                           </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODERATION QUEUE TAB */}
        {activeTab === "moderation" && (
          <div>
            <div className="detail-glass-card" style={{ padding: 0, overflowX: "auto", border: "1px solid var(--border-glass)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.01)" }}>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Submitted Tool Details</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Pricing Plan</th>
                    <th style={{ padding: "1rem", color: "var(--text-muted)" }}>Description Snippet</th>
                    <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", textAlign: "center" }}>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTools.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>
                        🎉 Queue is completely clean! No pending tool submissions to moderate.
                      </td>
                    </tr>
                  ) : (
                    pendingTools.map((tool) => (
                      <tr key={tool.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "1.25rem 1.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div
                              style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              dangerouslySetInnerHTML={{ __html: tool.logo }}
                            />
                            <div>
                              <strong style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{tool.name}</strong>
                              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.15rem" }}>
                                <span style={{ textTransform: "capitalize", color: "var(--neon-cyan)" }}>{tool.categoryId || tool.category}</span>
                                <span>•</span>
                                <a href={tool.website} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                                  {tool.website}
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.6rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem",
                              fontWeight: "700",
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              border: "1px solid rgba(16, 185, 129, 0.2)"
                            }}
                          >
                            {tool.pricing}
                          </span>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{tool.pricingDetails}</span>
                        </td>
                        <td style={{ padding: "1rem", color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tool.shortDescription}
                        </td>
                        <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                            <button
                              onClick={() => handleApproveTool(tool.id)}
                              style={{
                                background: "rgba(16, 185, 129, 0.15)",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                color: "#10b981",
                                padding: "0.4rem 1rem",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "700"
                              }}
                            >
                              Approve ✓
                            </button>
                            <button
                              onClick={() => handleRejectTool(tool.id)}
                              style={{
                                background: "rgba(255, 77, 77, 0.15)",
                                border: "1px solid rgba(255, 77, 77, 0.4)",
                                color: "#ff4d4d",
                                padding: "0.4rem 1rem",
                                fontSize: "0.8rem",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "700"
                              }}
                            >
                              Reject ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBSCRIBERS TAB */}
        {activeTab === "subscribers" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "start" }}>
            {/* Roster list */}
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", fontSize: "1.25rem", marginBottom: "1rem" }}>
                Captured Subscribers
              </h3>
              <div className="detail-glass-card" style={{ padding: 0, overflowX: "auto", border: "1px solid var(--border-glass)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.01)" }}>
                      <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Email Address</th>
                      <th style={{ padding: "1rem 1.5rem", color: "var(--text-muted)" }}>Date Captured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan="2" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                          No newsletter subscribers captured yet.
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "1rem 1.5rem", color: "var(--text-bright)", fontWeight: "600" }}>{sub.email}</td>
                          <td style={{ padding: "1rem 1.5rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                            {new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated Blast Campaign Card */}
            <div className="detail-glass-card" style={{ padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", fontSize: "1.25rem", margin: 0 }}>
                  AuraAI Newsletter Dispatcher
                </h3>
                <span style={{ fontSize: "1.5rem" }}>📣</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: "1.5", marginBottom: "1.5rem" }}>
                Draft updates, feature highlights, or promotional takeovers to blast to all registered directory readers instantly.
              </p>

              <form onSubmit={handleSendBlast} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Subject Line *</label>
                  <input
                    type="text"
                    required
                    value={blastSubject}
                    onChange={(e) => setBlastSubject(e.target.value)}
                    placeholder="e.g., Weekly Roundup: Top 10 Developer AI Tools of May"
                    style={{ width: "100%", padding: "0.6rem 0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff", fontSize: "0.85rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Newsletter Content (Supports HTML) *</label>
                  <textarea
                    required
                    rows="6"
                    value={blastContent}
                    onChange={(e) => setBlastContent(e.target.value)}
                    placeholder="Write your email body or marketing copy..."
                    style={{ width: "100%", padding: "0.6rem 0.8rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff", resize: "vertical", fontSize: "0.85rem", fontFamily: "sans-serif" }}
                  />
                </div>

                <div style={{ marginTop: "1rem" }}>
                  <button
                    type="submit"
                    disabled={isSendingBlast || subscribers.length === 0}
                    className="cta-btn action-primary"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {isSendingBlast ? (
                      <>
                        <span style={{
                          display: "inline-block",
                          width: "14px",
                          height: "14px",
                          border: "2px solid #fff",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite"
                        }}></span>
                        Dispersing email logs...
                      </>
                    ) : blastSuccess ? (
                      "✓ Campaign Dispatched!"
                    ) : (
                      `Send Campaign to ${subscribers.length} Subscribers`
                    )}
                  </button>
                  {subscribers.length === 0 && (
                    <p style={{ color: "#ff4d4d", fontSize: "0.75rem", textAlign: "center", marginTop: "0.5rem", marginBottom: 0 }}>
                      Campaign creation disabled until there is at least one active newsletter subscriber.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {reviews.length === 0 ? (
                <div className="detail-glass-card" style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                  No reviews submitted yet by platform community.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="detail-glass-card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "1.5rem",
                      padding: "1.5rem 2rem"
                    }}
                  >
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "1rem", color: "var(--neon-gold)" }}>{"★".repeat(rev.rating)}</span>
                        <strong style={{ color: "var(--text-bright)", fontSize: "0.95rem" }}>{rev.username}</strong>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>reviewed</span>
                        <Link href={`/tool/${rev.toolId}`} style={{ color: "var(--neon-cyan)", fontWeight: "600", textDecoration: "none" }}>
                          {rev.tool?.name || rev.toolId}
                        </Link>
                      </div>
                      <p style={{ color: "var(--text-main)", margin: 0, fontSize: "0.95rem", lineHeight: "1.5" }}>"{rev.comment}"</p>
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.75rem" }}>Date Posted: {rev.date}</span>
                    </div>
                    <div>
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        style={{
                          background: "rgba(255, 77, 77, 0.1)",
                          border: "1px solid rgba(255, 77, 77, 0.2)",
                          color: "#ff4d4d",
                          padding: "0.4rem 1rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD / CREATE NEW TOOL MODAL */}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(5, 5, 8, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem"
          }}
        >
          <div
            className="detail-glass-card"
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem",
              border: "1px solid var(--border-glass)"
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Add New Tool Entry
            </h3>
            <form onSubmit={handleCreateTool} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Tool Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Category ID *</label>
                  <input
                    type="text"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleFormChange}
                    placeholder="e.g., coding, creation, design"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Website Outbound URL *</label>
                  <input
                    type="text"
                    name="website"
                    required
                    value={formData.website}
                    onChange={handleFormChange}
                    placeholder="https://example.com"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Pricing Tier *</label>
                  <select
                    name="pricing"
                    value={formData.pricing}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(10, 10, 15, 0.95)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Pricing Specs *</label>
                  <input
                    type="text"
                    name="pricingDetails"
                    required
                    value={formData.pricingDetails}
                    onChange={handleFormChange}
                    placeholder="e.g., Free trial, Paid starts at $15/mo"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Short Sub-headline *</label>
                  <input
                    type="text"
                    name="shortDescription"
                    required
                    value={formData.shortDescription}
                    onChange={handleFormChange}
                    placeholder="One line tagline description..."
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Comprehensive Description *</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Logo SVG Tag (Optional - defaults to stylized SVG)</label>
                <textarea
                  name="logo"
                  rows="2"
                  value={formData.logo}
                  onChange={handleFormChange}
                  placeholder="<svg ...>...</svg>"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff", fontFamily: "monospace", fontSize: "0.75rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Search Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Pros (comma separated)</label>
                  <input
                    type="text"
                    name="pros"
                    value={formData.pros}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Cons (comma separated)</label>
                  <input
                    type="text"
                    name="cons"
                    value={formData.cons}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="sponsored-check"
                  name="sponsored"
                  checked={formData.sponsored}
                  onChange={handleFormChange}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="sponsored-check" style={{ color: "var(--text-bright)", fontSize: "0.85rem", cursor: "pointer" }}>
                  Feature as <strong>Sponsored Spotlight</strong> on homepage directories
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cta-btn action-primary"
                  style={{ padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600" }}
                >
                  {isLoading ? "Saving..." : "Submit AI Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT EXISTING TOOL MODAL */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(5, 5, 8, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem"
          }}
        >
          <div
            className="detail-glass-card"
            style={{
              width: "100%",
              maxWidth: "650px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "2.5rem",
              border: "1px solid var(--border-glass)"
            }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text-bright)", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
              Edit Tool Parameters
            </h3>
            <form onSubmit={handleEditTool} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Tool Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Category ID *</label>
                  <input
                    type="text"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Website Outbound URL *</label>
                  <input
                    type="text"
                    name="website"
                    required
                    value={formData.website}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Pricing Tier *</label>
                  <select
                    name="pricing"
                    value={formData.pricing}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(10, 10, 15, 0.95)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Pricing Specs *</label>
                  <input
                    type="text"
                    name="pricingDetails"
                    required
                    value={formData.pricingDetails}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Short Sub-headline *</label>
                  <input
                    type="text"
                    name="shortDescription"
                    required
                    value={formData.shortDescription}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Comprehensive Description *</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Logo SVG Tag (Optional)</label>
                <textarea
                  name="logo"
                  rows="2"
                  value={formData.logo}
                  onChange={handleFormChange}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff", fontFamily: "monospace", fontSize: "0.75rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Features (comma separated)</label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Search Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Pros (comma separated)</label>
                  <input
                    type="text"
                    name="pros"
                    value={formData.pros}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Cons (comma separated)</label>
                  <input
                    type="text"
                    name="cons"
                    value={formData.cons}
                    onChange={handleFormChange}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)", borderRadius: "6px", color: "#fff" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="edit-sponsored-check"
                  name="sponsored"
                  checked={formData.sponsored}
                  onChange={handleFormChange}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="edit-sponsored-check" style={{ color: "var(--text-bright)", fontSize: "0.85rem", cursor: "pointer" }}>
                  Feature as <strong>Sponsored Spotlight</strong> on homepage directories
                </label>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                  style={{ padding: "0.5rem 1.25rem", borderRadius: "6px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cta-btn action-primary"
                  style={{ padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600" }}
                >
                  {isLoading ? "Saving Changes..." : "Update Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(5, 5, 8, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: "1rem"
          }}
        >
          <div
            className="detail-glass-card"
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "2rem",
              border: "1px solid rgba(255, 77, 77, 0.3)"
            }}
          >
            <h3 style={{ color: "#ff4d4d", fontSize: "1.25rem", marginBottom: "0.75rem", fontFamily: "var(--font-display)" }}>
              Remove Directory Entry?
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.5", margin: "0 0 1.5rem 0" }}>
              Are you absolutely sure you want to delete <strong>{selectedTool?.name}</strong>? This action is permanent and will cleanly delete all reviews and bookmarks associated with it.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
                style={{ padding: "0.4rem 1rem", borderRadius: "6px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTool}
                disabled={isLoading}
                style={{
                  background: "#ff4d4d",
                  border: "none",
                  color: "#fff",
                  padding: "0.4rem 1.25rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                {isLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
