"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizClient({ tools = [] }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState("");
  const [budget, setBudget] = useState("");
  const [goal, setGoal] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState([]);

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  // Progress percentage
  const progress = ((step - 1) / 3) * 100;

  // Step 1 Options
  const professionOptions = [
    { id: "developer", title: "Software Engineer", desc: "Build code, automate tasks, write scripts, structure databases.", icon: "💻" },
    { id: "designer", title: "Designer & Artist", desc: "Create high-fidelity cinematic images, vector assets, UI mockups.", icon: "🎨" },
    { id: "creator", title: "Content Creator", desc: "Produce video edits, generate text-to-video reels, manage voiceovers.", icon: "📹" },
    { id: "marketer", title: "Marketer & Writer", desc: "Compose blog posts, copywrite landing pages, draft customer emails.", icon: "📈" },
    { id: "student", title: "Student & Researcher", desc: "Synthesize source bibliographies, outline notes, research academic papers.", icon: "🎓" }
  ];

  // Step 2 Options
  const budgetOptions = [
    { id: "free", title: "100% Free Only", desc: "Exclusively search for open-source or permanently free tools.", icon: "🆓" },
    { id: "freemium", title: "Free Trial / Freemium", desc: "Include tools with highly capable free tiers or demo modes.", icon: "🔄" },
    { id: "all", title: "Professional / Paid", desc: "Include premium, industry-leading tools regardless of pricing structure.", icon: "💼" }
  ];

  // Dynamic Step 3 Options based on Step 1 selection
  const getGoalOptions = () => {
    switch (profession) {
      case "developer":
        return [
          { id: "dev_code", title: "AI-First Code Completion & Editing", desc: "Modular edits, terminal automation, inline chat within your editor.", icon: "⚡" },
          { id: "dev_logic", title: "Deep Logical Reasoning & Architecture", desc: "Outline system architecture, write algorithms, debug complex issues.", icon: "🧠" }
        ];
      case "designer":
        return [
          { id: "design_cinematic", title: "Cinematic, Photorealistic Artworks", desc: "Create top-tier art, realistic portraitures, and text-to-image mockups.", icon: "🌌" },
          { id: "design_layout", title: "Quick Graphic Layouts & Editing Assets", desc: "Edit vectors, template slides, and drag-and-drop marketing visuals.", icon: "📐" }
        ];
      case "creator":
        return [
          { id: "creator_video", title: "Text-to-Video Generation & Cinematic Reels", desc: "Transform textual descriptions into beautiful 4K movie clips.", icon: "🎬" },
          { id: "creator_audio", title: "Audio Transcriptions, Voice Cloning & Edits", desc: "Perfect voiceovers, clone voices, and edit audio by deleting transcribed text.", icon: "🎙️" }
        ];
      case "marketer":
        return [
          { id: "market_writing", title: "High-Volume Content Copywriting & Blogs", desc: "Compose search-optimized blogs, email sequences, and advertising hooks.", icon: "✍️" },
          { id: "market_research", title: "Deep Web Searching & Competitor Analysis", desc: "Search the live web with verified references, citation footprints, and stats.", icon: "🌐" }
        ];
      case "student":
        return [
          { id: "student_search", title: "Fact-Based Research & Synthesized Citations", desc: "Search scientific repositories, query books, build annotated bibliographies.", icon: "📚" },
          { id: "student_notes", title: "Modular Workspace & Note Summarizations", desc: "Summarize textbook chapters, arrange bullet points, build revision wikis.", icon: "📒" }
        ];
      default:
        return [];
    }
  };

  const handleProfessionSelect = (id) => {
    setProfession(id);
    setStep(2);
  };

  const handleBudgetSelect = (id) => {
    setBudget(id);
    setStep(3);
  };

  const handleGoalSelect = (id) => {
    setGoal(id);
    setIsCalculating(true);
    setStep(4);

    // Simulate high-tech loading state
    setTimeout(() => {
      calculateBestStack(id);
      setIsCalculating(false);
    }, 2000);
  };

  const calculateBestStack = (selectedGoal) => {
    // Scoring logic
    const scoredTools = tools.map((t) => {
      let score = 0;

      // Category matching
      if (profession === "developer") {
        if (t.categoryId === "coding") score += 30;
        if (t.categoryId === "productivity") score += 15;
      } else if (profession === "designer") {
        if (t.categoryId === "image") score += 30;
        if (t.categoryId === "video") score += 10;
      } else if (profession === "creator") {
        if (t.categoryId === "video") score += 30;
        if (t.categoryId === "productivity") score += 10;
      } else if (profession === "marketer") {
        if (t.categoryId === "productivity") score += 20;
        if (t.categoryId === "image") score += 10;
      } else if (profession === "student") {
        if (t.categoryId === "productivity") score += 30;
      }

      // Budget hard filtering & soft points
      const p = t.pricing.toLowerCase();
      if (budget === "free") {
        if (p === "free") score += 40;
        else score -= 1000; // Hard disqualifier
      } else if (budget === "freemium") {
        if (p === "free" || p === "freemium") score += 30;
        else score -= 1000; // Hard disqualifier
      } else if (budget === "all") {
        if (p === "paid") score += 20;
        if (p === "freemium") score += 20;
        if (p === "free") score += 10;
      }

      // Dynamic Goal Keyword Matching
      const nameLower = t.name.toLowerCase();
      const descLower = t.shortDescription.toLowerCase() + " " + t.description.toLowerCase();

      // Check specific top-tier tool recommendations based on precise use-cases
      if (selectedGoal === "dev_code") {
        if (nameLower.includes("cursor") || nameLower.includes("copilot")) score += 50;
        if (descLower.includes("code") || descLower.includes("ide") || descLower.includes("editor")) score += 25;
      }
      if (selectedGoal === "dev_logic") {
        if (nameLower.includes("claude") || nameLower.includes("chatgpt")) score += 50;
        if (descLower.includes("reasoning") || descLower.includes("complex") || descLower.includes("model")) score += 25;
      }
      if (selectedGoal === "design_cinematic") {
        if (nameLower.includes("midjourney") || nameLower.includes("diffusion")) score += 50;
        if (descLower.includes("art") || descLower.includes("cinematic") || descLower.includes("realistic") || descLower.includes("image")) score += 25;
      }
      if (selectedGoal === "design_layout") {
        if (nameLower.includes("canva")) score += 50;
        if (descLower.includes("canvas") || descLower.includes("layout") || descLower.includes("templates")) score += 25;
      }
      if (selectedGoal === "creator_video") {
        if (nameLower.includes("runway") || nameLower.includes("sora")) score += 50;
        if (descLower.includes("video") || descLower.includes("generation") || descLower.includes("clip")) score += 25;
      }
      if (selectedGoal === "creator_audio") {
        if (nameLower.includes("eleven") || nameLower.includes("descript")) score += 50;
        if (descLower.includes("audio") || descLower.includes("voice") || descLower.includes("sound") || descLower.includes("transcribe")) score += 25;
      }
      if (selectedGoal === "market_writing") {
        if (nameLower.includes("jasper") || nameLower.includes("chatgpt") || nameLower.includes("claude")) score += 35;
        if (descLower.includes("copy") || descLower.includes("write") || descLower.includes("blog") || descLower.includes("content")) score += 25;
      }
      if (selectedGoal === "market_research") {
        if (nameLower.includes("perplexity")) score += 50;
        if (descLower.includes("search") || descLower.includes("verified") || descLower.includes("sources") || descLower.includes("citations")) score += 25;
      }
      if (selectedGoal === "student_search") {
        if (nameLower.includes("perplexity")) score += 50;
        if (descLower.includes("academic") || descLower.includes("research") || descLower.includes("citations") || descLower.includes("source")) score += 25;
      }
      if (selectedGoal === "student_notes") {
        if (nameLower.includes("notion") || nameLower.includes("chatgpt")) score += 50;
        if (descLower.includes("note") || descLower.includes("workspace") || descLower.includes("wiki") || descLower.includes("organize")) score += 25;
      }

      // Add points based on ratings and popular reviews to reward outstanding software
      const avgRating = t.reviews && t.reviews.length > 0 
        ? t.reviews.reduce((sum, r) => sum + r.rating, 0) / t.reviews.length 
        : t.rating || 0;
      
      score += avgRating * 4;

      return {
        tool: t,
        score: score,
        matchPercentage: Math.min(Math.max(Math.round((score / 150) * 100), 65), 99)
      };
    });

    // Sort descending and slice top 3
    const filtered = scoredTools
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(filtered);
  };

  const handleReset = () => {
    setProfession("");
    setBudget("");
    setGoal("");
    setResults([]);
    setStep(1);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      
      {/* Quiz Navigation Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <span 
          style={{ 
            fontSize: "0.8rem", 
            fontWeight: "700", 
            textTransform: "uppercase", 
            letterSpacing: "1.5px", 
            color: "var(--neon-cyan)",
            background: "var(--neon-cyan-glow)",
            padding: "0.3rem 0.8rem",
            borderRadius: "20px"
          }}
        >
          AuraAI Smart Matching
        </span>
        <h1 
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "2.5rem", 
            fontWeight: "800", 
            color: "var(--text-bright)", 
            marginTop: "1rem",
            letterSpacing: "-1px"
          }}
        >
          {step === 4 ? "Your Personalized AI Stack" : "Find Your Perfect AI Workflow"}
        </h1>
        {step < 4 && (
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginTop: "0.5rem" }}>
            Answer 3 rapid questions to design your custom workspace setup with industry standard matches.
          </p>
        )}
      </div>

      {/* Progress Bar Container */}
      {step < 4 && (
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: "600" }}>
            <span>Question {step} of 3</span>
            <span>{Math.round(progress)}% Completed</span>
          </div>
          <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "10px", overflow: "hidden" }}>
            <div 
              style={{ 
                width: `${progress}%`, 
                height: "100%", 
                background: "linear-gradient(90deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)", 
                transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)" 
              }} 
            />
          </div>
        </div>
      )}

      {/* Question 1: Profession */}
      {step === 1 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.5rem", textAlign: "center" }}>
            Step 1: What is your primary focus or profession?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {professionOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleProfessionSelect(opt.id)}
                className="quiz-card-glass"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-glass)",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)"
                }}
              >
                <span style={{ fontSize: "2.25rem" }}>{opt.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)" }}>
                    {opt.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.15rem 0 0" }}>
                    {opt.desc}
                  </p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "1.2rem", color: "var(--text-muted)", transition: "all 0.2s" }} className="quiz-arrow">
                  &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question 2: Budget */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.5rem", textAlign: "center" }}>
            Step 2: What is your preferred budget limits?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {budgetOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleBudgetSelect(opt.id)}
                className="quiz-card-glass"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-glass)",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)"
                }}
              >
                <span style={{ fontSize: "2.25rem" }}>{opt.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)" }}>
                    {opt.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.15rem 0 0" }}>
                    {opt.desc}
                  </p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "1.2rem", color: "var(--text-muted)" }} className="quiz-arrow">
                  &rarr;
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setStep(1)} 
            style={{ 
              marginTop: "2rem", 
              background: "transparent", 
              border: "none", 
              color: "var(--text-muted)", 
              fontSize: "0.9rem", 
              fontWeight: "600", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            &larr; Back to Step 1
          </button>
        </div>
      )}

      {/* Question 3: Goal */}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "1.5rem", textAlign: "center" }}>
            Step 3: What is your primary objective or workflow goal?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {getGoalOptions().map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleGoalSelect(opt.id)}
                className="quiz-card-glass"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-glass)",
                  cursor: "pointer",
                  transition: "var(--transition-smooth)"
                }}
              >
                <span style={{ fontSize: "2.25rem" }}>{opt.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)" }}>
                    {opt.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.15rem 0 0" }}>
                    {opt.desc}
                  </p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "1.2rem", color: "var(--text-muted)" }} className="quiz-arrow">
                  &rarr;
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setStep(2)} 
            style={{ 
              marginTop: "2rem", 
              background: "transparent", 
              border: "none", 
              color: "var(--text-muted)", 
              fontSize: "0.9rem", 
              fontWeight: "600", 
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}
          >
            &larr; Back to Step 2
          </button>
        </div>
      )}

      {/* Step 4: Loading / Calculating Results */}
      {step === 4 && isCalculating && (
        <div className="detail-glass-card" style={{ textAlign: "center", padding: "5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <div className="pulse-loader" style={{
            width: "50px",
            height: "50px",
            border: "4px solid rgba(0, 113, 227, 0.1)",
            borderTopColor: "var(--neon-cyan)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: "700", color: "var(--text-bright)", marginBottom: "0.5rem" }}>
              Synthesizing Best Matches...
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "450px", margin: "0 auto", lineHeight: "1.5" }}>
              Our matching engine is analyzing your industry requirements, scoring specs, pricing profiles, and active user reviews.
            </p>
          </div>
        </div>
      )}

      {/* Step 4: Results Display */}
      {step === 4 && !isCalculating && (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div 
            style={{ 
              background: "rgba(0, 113, 227, 0.04)", 
              border: "1px solid rgba(0, 113, 227, 0.12)", 
              borderRadius: "16px", 
              padding: "1.5rem", 
              display: "flex", 
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem" 
            }}
          >
            <span style={{ fontSize: "2rem" }}>🏆</span>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: "700", color: "var(--text-bright)" }}>
                Analysis Concluded: 3 High-Fidelity Fits
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0.1rem 0 0" }}>
                Based on your budget structure and objective selection, these AI platforms optimize your stack perfectly.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {results.length === 0 ? (
              <div className="detail-glass-card" style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  No tools fully matched your specific constraint boundaries. Try broadening your budget limit.
                </p>
              </div>
            ) : (
              results.map((res, index) => {
                const t = res.tool;
                
                // Get review average
                const getAverage = (toolObj) => {
                  if (!toolObj.reviews || toolObj.reviews.length === 0) return toolObj.rating || 0;
                  const total = toolObj.reviews.reduce((sum, r) => sum + r.rating, 0);
                  return parseFloat((total / toolObj.reviews.length).toFixed(1));
                };

                return (
                  <div
                    key={t.id}
                    className="quiz-result-card"
                    style={{
                      display: "flex",
                      alignItems: "stretch",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-glass)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                      transition: "var(--transition-smooth)"
                    }}
                  >
                    {/* Position Label Column */}
                    <div
                      style={{
                        background: index === 0 
                          ? "linear-gradient(180deg, var(--neon-cyan) 0%, var(--neon-purple) 100%)" 
                          : "rgba(0,0,0,0.03)",
                        width: "60px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: index === 0 ? "#ffffff" : "var(--text-muted)",
                        fontWeight: "800",
                        fontSize: "1.5rem",
                        flexShrink: 0
                      }}
                    >
                      <span>#{index + 1}</span>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: "600", marginTop: "0.2rem", opacity: 0.8 }}>
                        Fit
                      </span>
                    </div>

                    {/* Main Content Area */}
                    <div style={{ flexGrow: 1, padding: "1.75rem", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1rem" }}>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                          <div
                            className="card-logo-wrap"
                            style={{ width: "50px", height: "50px", flexShrink: 0 }}
                            dangerouslySetInnerHTML={{ __html: t.logo }}
                          />
                          <div>
                            <span 
                              style={{ 
                                fontSize: "0.75rem", 
                                color: "var(--neon-cyan)", 
                                fontWeight: "700", 
                                textTransform: "uppercase", 
                                letterSpacing: "1px" 
                              }}
                            >
                              {t.categoryId} TOOL
                            </span>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: "700", color: "var(--text-bright)", marginTop: "0.15rem" }}>
                              {t.name}
                            </h2>
                          </div>
                        </div>

                        {/* Match Percent Badge */}
                        <div style={{ textAlign: "right" }}>
                          <span 
                            style={{ 
                              display: "inline-block",
                              background: index === 0 ? "rgba(0, 113, 227, 0.08)" : "rgba(0,0,0,0.04)",
                              color: index === 0 ? "var(--neon-cyan)" : "var(--text-main)",
                              border: index === 0 ? "1px solid rgba(0, 113, 227, 0.15)" : "1px solid var(--border-glass)",
                              padding: "0.4rem 0.8rem",
                              borderRadius: "10px",
                              fontWeight: "700",
                              fontSize: "0.85rem"
                            }}
                          >
                            {res.matchPercentage}% Match
                          </span>
                        </div>
                      </div>

                      <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.5", margin: 0 }}>
                        {t.shortDescription}
                      </p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)", paddingTop: "0.75rem", borderTop: "1px solid var(--border-glass)" }}>
                        <span>★ <strong style={{ color: "var(--text-bright)" }}>{getAverage(t)} AuraScore</strong> ({t.ratingCount + (t.reviews ? t.reviews.length : 0)} votes)</span>
                        <span>•</span>
                        <span>Pricing: <strong style={{ color: "var(--text-bright)" }}>{t.pricing}</strong></span>
                        <span>•</span>
                        <span>Tier: <span style={{ color: "var(--neon-cyan)", fontWeight: "600" }}>{t.pricingDetails}</span></span>
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                        <a
                          href={ensureAbsoluteUrl(t.website)}
                          target="_blank"
                          rel="noopener noreferrer nofollow sponsored"
                          className="cta-btn action-primary"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.6rem 1.25rem",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            textDecoration: "none"
                          }}
                        >
                          <span>Visit Website</span>
                          <span className="affiliate-badge" style={{ margin: 0 }}>Affiliate</span>
                        </a>
                        
                        <Link
                          href={`/tool/${t.id}`}
                          className="btn-secondary"
                          style={{
                            padding: "0.6rem 1.25rem",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            textDecoration: "none",
                            background: "transparent",
                            border: "1px solid var(--border-glass)",
                            color: "var(--text-bright)",
                            textAlign: "center"
                          }}
                        >
                          Read Verified Reviews
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button 
              onClick={handleReset} 
              className="btn-secondary"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer"
              }}
            >
              🔄 Take Quiz Again
            </button>
            <Link 
              href="/category/all" 
              className="cta-btn primary"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "20px",
                fontWeight: "600",
                fontSize: "0.9rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              Browse Full Directory &rarr;
            </Link>
          </div>

        </div>
      )}

      {/* Animation spinner css injection */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .quiz-card-glass {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .quiz-card-glass:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: var(--neon-cyan) !important;
          background: var(--bg-card-hover) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
        }
        .quiz-card-glass:hover .quiz-arrow {
          transform: translateX(4px);
          color: var(--neon-cyan) !important;
        }
        .quiz-result-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08) !important;
          border-color: rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>

    </div>
  );
}
