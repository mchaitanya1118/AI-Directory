"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

// Plan specifications for B2B sponsorship
const PLANS = [
  {
    id: "free",
    name: "Standard Review",
    price: "0",
    period: "forever",
    badge: "Community",
    tagline: "Standard queue directory listing",
    color: "#86868b",
    bgGlow: "rgba(255, 255, 255, 0.01)",
    borderColor: "rgba(255, 255, 255, 0.15)",
    sponsored: false,
    features: [
      "Standard listing in category",
      "7 - 14 days manual review queue",
      "Basic specifications index",
      "Standard comparison listings",
      "No homepage spotlight carousel"
    ]
  },
  {
    id: "spotlight",
    name: "Featured Spotlight",
    price: "49",
    period: "one-time",
    badge: "Popular Booster",
    tagline: "Unlock high-intent user traffic",
    color: "#FFB800",
    bgGlow: "rgba(255, 184, 0, 0.06)",
    borderColor: "#FFB800",
    sponsored: true,
    features: [
      "Instant database index (under 2 hrs)",
      "Highlighted Golden border on all grids",
      "30-Days Home Page Spotlight Showcase",
      "Priority in search matching algorithms",
      "Permanent dofollow backlink signal"
    ]
  },
  {
    id: "takeover",
    name: "Category Takeover",
    price: "99",
    period: "per month",
    badge: "Maximum Visibility",
    tagline: "Lock 1st place in your niche",
    color: "#00F2FE",
    bgGlow: "rgba(0, 242, 254, 0.06)",
    borderColor: "#00F2FE",
    sponsored: true,
    features: [
      "Pinned in position #1 in category page",
      "Exclusive animated neon glassmorphic card",
      "Featured in 'Better Alternatives' boxes",
      "Premium custom affiliate link integration",
      "Direct conversion reports & analytics"
    ]
  }
];

export default function SubmitTool() {
  const { submitTool } = useApp();
  const router = useRouter();

  // Progress states: 1 (Form details), 2 (Plan choice), 3 (Payment checkout), 4 (Success checkout)
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("coding");
  const [pricing, setPricing] = useState("Free");
  const [url, setUrl] = useState("");
  const [shortPitch, setShortPitch] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");

  // Plan select
  const [selectedPlan, setSelectedPlan] = useState("spotlight");

  // Payment simulated states
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, error
  const [processingMsg, setProcessingMsg] = useState("");

  // Submitted tool reference
  const [createdTool, setCreatedTool] = useState(null);

  const handleNextStep = (e) => {
    if (e) e.preventDefault();
    if (step === 1) {
      if (!name.trim() || !url.trim() || !shortPitch.trim() || !description.trim()) {
        alert("Please complete all required product text fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedPlan === "free") {
        handleSubmit(false);
      } else {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 16 || cardExpiry.length < 5 || cardCvc.length < 3) {
      alert("Please check your simulated payment details.");
      return;
    }

    setPaymentStatus("processing");
    setProcessingMsg("Initializing secure Stripe gateway tunnel...");

    await new Promise((r) => setTimeout(r, 1200));
    setProcessingMsg("Verifying cardholder authenticity & standard locks...");

    await new Promise((r) => setTimeout(r, 1000));
    setProcessingMsg("Writing premium database credentials & launch tags...");

    await new Promise((r) => setTimeout(r, 800));
    
    handleSubmit(true);
  };

  const handleSubmit = async (isPaid) => {
    const activePlan = PLANS.find((p) => p.id === (isPaid ? selectedPlan : "free"));

    // Dynamic random gradient logic for custom SVG logo
    const gradients = ["gradient-cyan", "gradient-violet", "gradient-rose", "gradient-neon"];
    const randGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const logoSvg = `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="url(#${randGrad})" fill-opacity="0.2" stroke="url(#${randGrad})" stroke-width="2"/>
      <text x="50%" y="62%" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">${name.slice(0, 2).toUpperCase()}</text>
    </svg>`;

    const pricingDetails = isPaid
      ? `Premium Sponsored Placement (${activePlan.name})`
      : `${pricing} structure self-registered by creator.`;

    const tagList = ["New Listing", pricing, "Creator Submitted"];
    if (isPaid) {
      tagList.push("Sponsored");
      tagList.push(activePlan.id === "takeover" ? "Takeover" : "Featured");
    }

    const toolObj = {
      name: name.trim(),
      category: category,
      pricing: pricing,
      website: url.trim(),
      shortDescription: shortPitch.trim(),
      description: description.trim(),
      features: features.trim()
        ? features.split(",").map((f) => f.trim())
        : ["AI Generation Core", "Automated Workflows", "API Sync Connectors"],
      sponsored: activePlan.sponsored,
      logo: logoSvg,
      pricingDetails,
      tags: tagList,
      pros: ["Quick developer workspace configuration", "Premium modular dashboard widgets", "Extremely fast response latency"],
      cons: ["Recently added software index record", "Requires network connection for sync models"],
    };

    try {
      const result = await submitTool(toolObj);
      setCreatedTool(result);
      setPaymentStatus("success");
      setStep(4);
    } catch (err) {
      console.error("Database submission failure:", err);
      setPaymentStatus("error");
      setProcessingMsg("Internal SQLite write exception. Please try again.");
    }
  };

  const handleCardNumberChange = (e) => {
    // Format card number with spaces every 4 digits
    let val = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "");
    if (val.length > 16) val = val.substring(0, 16);
    const matches = val.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(" ") : val);
  };

  const handleExpiryChange = (e) => {
    // Format MM/YY
    let val = e.target.value.replace(/\//g, "").replace(/[^0-9]/g, "");
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length > 2) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  return (
    <div className="submission-form-container" style={{ maxWidth: "880px", margin: "0 auto", padding: "0 1rem 4rem" }}>
      {/* Header */}
      <div className="curated-deep-header" style={{ padding: "3rem 0 2rem", textAlign: "center" }}>
        <span className="hero-tagline" style={{ background: "rgba(0, 113, 227, 0.08)", color: "#0071e3", padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "600", letterSpacing: "0.5px" }}>
          Launch Your Product
        </span>
        <h1 className="hero-title" style={{ fontSize: "2.75rem", marginTop: "1rem", fontWeight: "800", letterSpacing: "-0.5px" }}>
          Promote Your AI Innovation
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", margin: "0.75rem auto 0", lineHeight: "1.5" }}>
          Submit to AuraAI. Capture qualified organic backlinks, boost SEO authority, and position your product in front of thousands of daily active AI searchers.
        </p>
      </div>

      {/* Steps Progress bar */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step >= 1 ? "var(--accent-blue)" : "rgba(255,255,255,0.08)",
            color: step >= 1 ? "#ffffff" : "var(--text-muted)",
            fontSize: "0.8rem",
            fontWeight: "bold",
            transition: "all 0.3s"
          }}>
            1
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: step >= 1 ? "var(--text-bright)" : "var(--text-muted)" }}>Specs</span>
        </div>
        <div style={{ width: "40px", height: "2px", background: step >= 2 ? "var(--accent-blue)" : "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step >= 2 ? "var(--accent-blue)" : "rgba(255,255,255,0.08)",
            color: step >= 2 ? "#ffffff" : "var(--text-muted)",
            fontSize: "0.8rem",
            fontWeight: "bold",
            transition: "all 0.3s"
          }}>
            2
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: step >= 2 ? "var(--text-bright)" : "var(--text-muted)" }}>Boost plan</span>
        </div>
        <div style={{ width: "40px", height: "2px", background: step >= 3 ? "var(--accent-blue)" : "rgba(255,255,255,0.08)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step >= 3 ? "var(--accent-blue)" : "rgba(255,255,255,0.08)",
            color: step >= 3 ? "#ffffff" : "var(--text-muted)",
            fontSize: "0.8rem",
            fontWeight: "bold",
            transition: "all 0.3s"
          }}>
            3
          </span>
          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: step >= 3 ? "var(--text-bright)" : "var(--text-muted)" }}>Stripe Checkout</span>
        </div>
      </div>

      {/* Main card panel */}
      <div className="detail-glass-card" style={{ padding: "2.5rem", borderRadius: "16px", background: "rgba(255,255,255,0.4)", backdropFilter: "blur(20px)", border: "1px solid var(--border-glass)", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.03)" }}>
        
        {/* Step 1: Specs submission */}
        {step === 1 && (
          <form onSubmit={handleNextStep}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem", color: "var(--text-bright)", letterSpacing: "-0.2px" }}>
              Step 1: AI Product Specifications
            </h3>
            
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" htmlFor="sub-name" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                Product Name <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <input
                type="text"
                id="sub-name"
                className="form-input"
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem" }}
                placeholder="e.g. BrainFlow AI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.25rem" }}>
              <div>
                <label className="form-label" htmlFor="sub-category" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                  Core Category <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <select
                  id="sub-category"
                  className="select-filter"
                  style={{ width: "100%", height: "44px", padding: "0 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem" }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="coding">AI Coding Tool ⚡</option>
                  <option value="image">AI Image & Design 🎨</option>
                  <option value="video">AI Video Generation 🎬</option>
                  <option value="productivity">AI Productivity Tool 🚀</option>
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="sub-pricing" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                  Pricing Model <span style={{ color: "var(--accent-red)" }}>*</span>
                </label>
                <select
                  id="sub-pricing"
                  className="select-filter"
                  style={{ width: "100%", height: "44px", padding: "0 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem" }}
                  value={pricing}
                  onChange={(e) => setPricing(e.target.value)}
                >
                  <option value="Free">Free / Open Source</option>
                  <option value="Freemium">Freemium Tier</option>
                  <option value="Paid">Paid Premium Only</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" htmlFor="sub-url" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                Official Website URL <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <input
                type="url"
                id="sub-url"
                className="form-input"
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem" }}
                placeholder="e.g. https://brainflow.ai"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" htmlFor="sub-short" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                Elevator Pitch (1 short sentence summary) <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <input
                type="text"
                id="sub-short"
                className="form-input"
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem" }}
                placeholder="e.g. Real-time context-aware terminal workspace intelligence for Go developers."
                value={shortPitch}
                onChange={(e) => setShortPitch(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" htmlFor="sub-desc" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                Product Description <span style={{ color: "var(--accent-red)" }}>*</span>
              </label>
              <textarea
                id="sub-desc"
                className="form-textarea"
                style={{ width: "100%", minHeight: "100px", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem", lineHeight: "1.4", fontFamily: "inherit" }}
                placeholder="Detail who this tool serves, how it operates, underlying integrations, primary benefits, and hosting specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label className="form-label" htmlFor="sub-features" style={{ fontSize: "0.85rem", fontWeight: "600", display: "block", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
                Key Features (Comma separated)
              </label>
              <input
                type="text"
                id="sub-features"
                className="form-input"
                style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)", fontSize: "0.9rem" }}
                placeholder="e.g. Multi-file intelligence, Offline model execution, API sync hook"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>

            <button type="submit" className="cta-btn action-primary" style={{ width: "100%", height: "48px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontWeight: "600", cursor: "pointer", border: "none" }}>
              Continue to Booster Setup &rarr;
            </button>
          </form>
        )}

        {/* Step 2: Plan Booster Selection */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text-bright)" }}>
              Step 2: Choose Your Exposure Plan
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
              Select a sponsor booster plan to immediately bypass the review queue and feature your AI product on our home page.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "2.5rem" }}>
              {PLANS.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    style={{
                      border: isSelected ? `2.5px solid ${plan.borderColor}` : "1.5px solid var(--border-glass)",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      cursor: "pointer",
                      background: plan.bgGlow,
                      transform: isSelected ? "scale(1.02)" : "scale(1)",
                      boxShadow: isSelected ? `0 8px 30px ${plan.bgGlow}` : "none",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* Badge */}
                    <span style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      fontSize: "0.65rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: plan.color,
                      border: `1px solid ${plan.color}55`,
                      padding: "2px 8px",
                      borderRadius: "8px"
                    }}>
                      {plan.badge}
                    </span>

                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {plan.name}
                      </h4>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.3", marginBottom: "1rem" }}>
                        {plan.tagline}
                      </p>

                      {/* Pricing tag */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "2px", marginBottom: "1.25rem" }}>
                        <span style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-bright)" }}>${plan.price}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/ {plan.period}</span>
                      </div>

                      {/* Feature checklists */}
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {plan.features.map((f, idx) => (
                          <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-main)", lineHeight: "1.3" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="3" style={{ flexShrink: 0, marginTop: "2px" }}>
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: "1.5rem" }}>
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "36px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        background: isSelected ? plan.color : "rgba(0,0,0,0.04)",
                        color: isSelected ? "#000000" : "var(--text-bright)",
                        transition: "all 0.2s"
                      }}>
                        {isSelected ? "Selected ✅" : "Select Plan"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                onClick={handlePrevStep}
                style={{
                  height: "48px",
                  padding: "0 1.5rem",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-glass)",
                  background: "transparent",
                  color: "var(--text-bright)",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="cta-btn action-primary"
                style={{
                  flex: 1,
                  height: "48px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none"
                }}
              >
                {selectedPlan === "free" ? "Submit Application for Queue ⌛" : "Go to Payment &rarr;"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Secure Checkout Simulation */}
        {step === 3 && (
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.25rem", color: "var(--text-bright)" }}>
              Step 3: Secure Stripe Checkout
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Simulated payment processing. Your card will not be charged.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem", marginBottom: "2rem" }}>
              
              {/* Payment details form */}
              {paymentStatus !== "processing" ? (
                <form onSubmit={handlePaymentSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-bright)", display: "block", marginBottom: "0.25rem" }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)" }}
                      placeholder="e.g. John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-bright)", display: "block", marginBottom: "0.25rem" }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)" }}
                      placeholder="1234 5678 1234 5678"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-bright)", display: "block", marginBottom: "0.25rem" }}>
                        Expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)" }}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-bright)", display: "block", marginBottom: "0.25rem" }}>
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        className="form-input"
                        style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid var(--border-glass)", background: "rgba(255,255,255,0.6)", color: "var(--text-bright)" }}
                        placeholder="•••"
                        maxLength="4"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ""))}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      style={{
                        height: "42px",
                        padding: "0 1.25rem",
                        borderRadius: "8px",
                        border: "1.5px solid var(--border-glass)",
                        background: "transparent",
                        color: "var(--text-bright)",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="cta-btn action-primary"
                      style={{
                        flex: 1,
                        height: "42px",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        border: "none"
                      }}
                    >
                      Authorize Payment
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "220px", gap: "1rem" }}>
                  <div className="spinner" style={{
                    width: "40px",
                    height: "40px",
                    border: "3px solid rgba(0, 113, 227, 0.15)",
                    borderTop: "3px solid var(--accent-blue)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }} />
                  <p style={{ fontSize: "0.9rem", color: "var(--text-bright)", fontWeight: "600", animation: "pulse 1.5s infinite" }}>
                    {processingMsg}
                  </p>
                  <style jsx global>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                    @keyframes pulse {
                      0% { opacity: 0.6; }
                      50% { opacity: 1; }
                      100% { opacity: 0.6; }
                    }
                  `}</style>
                </div>
              )}

              {/* Order summary card & security badges */}
              <div style={{ padding: "1.25rem", borderRadius: "10px", border: "1px solid var(--border-glass)", background: "rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.75rem" }}>
                    Purchase Summary
                  </h4>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    <span>Listing Review Submission</span>
                    <span>$0.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-bright)", fontWeight: "600", marginBottom: "0.5rem" }}>
                    <span>{PLANS.find(p => p.id === selectedPlan)?.name} Booster</span>
                    <span>${PLANS.find(p => p.id === selectedPlan)?.price}.00</span>
                  </div>
                  
                  <div style={{ height: "1px", background: "var(--border-glass)", margin: "0.75rem 0" }} />
                  
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", color: "var(--text-bright)", fontWeight: "700" }}>
                    <span>Total Charge</span>
                    <span>${PLANS.find(p => p.id === selectedPlan)?.price}.00</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span>SSL Encrypted Checkout Terminal</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>PCI DSS Regulatory Compliance</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Step 4: Success Checkout Screen */}
        {step === 4 && createdTool && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(40, 167, 69, 0.1)",
              color: "#28a745",
              marginBottom: "1.5rem"
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-bright)", marginBottom: "0.5rem", letterSpacing: "-0.5px" }}>
              Submission Successfully Indexed!
            </h3>
            
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: "1.5" }}>
              Congratulations! <strong>{createdTool.name}</strong> has been written to the live directory database. 
              {selectedPlan !== "free" ? (
                <> Your sponsored listing features are active, bypass queue applied instantly!</>
              ) : (
                <> Your submission has entered the manual verification queue.</>
              )}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => router.push(`/tool/${createdTool.id}`)}
                className="cta-btn action-primary"
                style={{
                  padding: "0 2rem",
                  height: "44px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  border: "none"
                }}
              >
                View Live Tool Detail ⚡
              </button>
              
              <button
                type="button"
                onClick={() => router.push(`/category/${createdTool.category}`)}
                style={{
                  padding: "0 2rem",
                  height: "44px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-glass)",
                  background: "transparent",
                  color: "var(--text-bright)",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Browse Category
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
