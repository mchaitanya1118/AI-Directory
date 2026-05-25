"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import NewsletterBox from "@/components/NewsletterBox";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid } from "lucide-react";

export default function HomeClient({ initialTools }) {
  const { startComparison } = useApp();
  const [searchVal, setSearchVal] = useState("");
  const [homeCategory, setHomeCategory] = useState("all");
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const getAverageRating = (t) => {
    if (!t.reviews || t.reviews.length === 0) return t.rating || 0;
    const total = t.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return total / t.reviews.length;
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchVal.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const handlePillClick = (tag) => {
    router.push(`/category/all?search=${encodeURIComponent(tag)}`);
  };

  const safeTools = initialTools || [];
  const sponsoredTools = safeTools.filter((t) => t.sponsored);

  const sponsoredSlugs = new Set(sponsoredTools.map((t) => t.id));

  const highestRatedFiltered = safeTools
    .filter((t) => !sponsoredSlugs.has(t.id))
    .sort((a, b) => getAverageRating(b) - getAverageRating(a))
    .slice(0, 4);

  const catalogTools = safeTools.map((tool) => ({
    ...tool,
    isSponsored: sponsoredSlugs.has(tool.id),
  }));

  return (
    <div>
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '6rem 0 4rem 0', background: 'var(--bg-dark)' }}>
        {/* Decorative Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(108, 99, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 99, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }}></div>
        
        {/* Radial Blur Glows */}
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--neon-purple-glow) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0, opacity: 0.8 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, var(--neon-cyan-glow) 0%, transparent 60%)', filter: 'blur(50px)', zIndex: 0, opacity: 0.6 }}></div>

        <div className="app-container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* LEFT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ flex: '1 1 450px', maxWidth: '600px' }}
          >
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Discover the best <br/>
              <span style={{ background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>AI Tools</span> for your<br/>
              workflow!
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '90%' }}>
              Explore top AI tools to boost productivity, automate tasks, and achieve more in less time.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <Link href="/category/all" style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--gradient-main)', color: '#fff', 
                padding: '1rem 1.75rem', borderRadius: '12px', 
                fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(108, 99, 255, 0.3)',
                transition: 'transform 0.2s', cursor: 'pointer'
              }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                Explore Tools <ArrowRight size={20} />
              </Link>
              
              <Link href="/category/all" style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: '#ffffff', color: 'var(--text-main)', 
                padding: '1rem 1.75rem', borderRadius: '12px', 
                fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                border: '1px solid var(--border-glass)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s', cursor: 'pointer'
              }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.3)' }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-glass)' }}>
                Browse Categories <LayoutGrid size={20} />
              </Link>
            </div>
            
            <div className="hero-telemetry-grid">
              <div className="telemetry-card" style={{ padding: '1.25rem 1rem' }}>
                <div className="telemetry-number" style={{ fontSize: '1.5rem' }}>
                  <span>{safeTools.length}+</span>
                </div>
                <div className="telemetry-label" style={{ fontSize: '0.8rem' }}>Prime AI Engines</div>
              </div>
              <div className="telemetry-card" style={{ padding: '1.25rem 1rem' }}>
                <div className="telemetry-number" style={{ fontSize: '1.5rem' }}>
                  <span>100%</span>
                </div>
                <div className="telemetry-label" style={{ fontSize: '0.8rem' }}>Crawl Sync Secure</div>
              </div>
              <div className="telemetry-card" style={{ padding: '1.25rem 1rem' }}>
                <div className="telemetry-number" style={{ fontSize: '1.5rem' }}>
                  <span>4.8 ★</span>
                </div>
                <div className="telemetry-label" style={{ fontSize: '0.8rem' }}>Avg Quality Score</div>
              </div>
            </div>
          </motion.div>
          
          {/* RIGHT COLUMN */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}
          >
            <motion.div 
              animate={{ y: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ width: '100%', maxWidth: '750px', transform: 'translateX(5%)' }}
            >
              <Image
                src="/hero-mockup-3d.png"
                alt="3D Floating SaaS Dashboard"
                width={800}
                height={800}
                priority={true}
                loading="eager"
                style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 30px 60px rgba(108, 99, 255, 0.25))' }}
              />
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      <section className="sponsored-section">
        <div className="section-headline-container">
          <div>
            <h2 className="section-title">Sponsored Spotlight</h2>
            <p className="section-subtitle">Promoted premium services driving high-impact AI innovation.</p>
          </div>
        </div>
        <div className="sponsored-carousel">
          {sponsoredTools.map((t) => <ToolCard key={t.id} tool={t} />)}
        </div>
      </section>

      <section className="quick-compare-section">
        <div className="section-headline-container">
          <div>
            <h2 className="section-title">Quick Head-to-Head Comparisons</h2>
            <p className="section-subtitle">Instant technical specs analysis for industry-standard AI pairings.</p>
          </div>
          <Link href="/compare" className="read-more-link">Open Compare Screen &rarr;</Link>
        </div>
        <div className="quick-compare-grid">
          {[
            { idA: "cursor", idB: "github-copilot", desc: "Modular, AI-first codebase index vs inline copilot autocompletions." },
            { idA: "claude", idB: "chatgpt", desc: "Expert logic reasoning and text analysis vs standard LLM features." },
            { idA: "midjourney", idB: "stablediffusion", desc: "Premium aesthetic rendering engines vs customizable local models." }
          ].map((pair, idx) => {
            const toolA = safeTools.find(t => t.id === pair.idA);
            const toolB = safeTools.find(t => t.id === pair.idB);
            if (!toolA || !toolB) return null;

            return (
              <div 
                key={idx} 
                className="compare-shortcut-card"
                onClick={() => {
                  startComparison(pair.idA, pair.idB);
                  router.push("/compare");
                }}
              >
                <div>
                  <div className="compare-shortcut-header">
                    <div className="compare-partner-info">
                      <div className="compare-partner-logo" dangerouslySetInnerHTML={{ __html: toolA.logo }} />
                      <span className="compare-partner-name">{toolA.name}</span>
                    </div>
                    <div className="compare-shortcut-vs">VS</div>
                    <div className="compare-partner-info" style={{ flexDirection: 'row-reverse' }}>
                      <div className="compare-partner-logo" dangerouslySetInnerHTML={{ __html: toolB.logo }} />
                      <span className="compare-partner-name">{toolB.name}</span>
                    </div>
                  </div>
                  <p className="compare-shortcut-desc">{pair.desc}</p>
                </div>
                <div className="compare-shortcut-footer">
                  <span className="compare-shortcut-cta">Analyze Pairing &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="curated-landing-articles" style={{ marginTop: "5rem" }}>
        <div className="section-headline-container">
          <div>
            <h2 className="section-title">Curated Playlists & Guides</h2>
            <p className="section-subtitle">Expert editorials designed to answer specific structural requirements.</p>
          </div>
        </div>
        <div className="curated-lists-grid">
          <div className="curated-card">
            <div>
              <span className="curated-card-tag">Student Pack</span>
              <h3>Best AI Tools for Students</h3>
              <p>Accelerate your homework, parse academic papers, and learn languages efficiently with verified zero-cost tools.</p>
            </div>
            <Link href="/curated/students-best" className="read-more-link">Read Student Guide &rarr;</Link>
          </div>

          <div className="curated-card" style={{ borderColor: "rgba(0, 255, 135, 0.15)" }}>
            <div>
              <span className="curated-card-tag" style={{ color: "#00FF87" }}>Zero Cost</span>
              <h3>Top Free AI Tools (100% Free)</h3>
              <p>Explore robust open-source image suites and React scaffolding generators that don't charge hefty monthly fees.</p>
            </div>
            <Link href="/curated/top-free" className="read-more-link" style={{ color: "#00FF87" }}>View Free Tools &rarr;</Link>
          </div>

          <div className="curated-card">
            <div>
              <span className="curated-card-tag" style={{ color: "#00F2FE" }}>Developer Core</span>
              <h3>Best AI Coding Assistants</h3>
              <p>An in-depth review comparing local code editors, inline autocompletes, and multi-file codebase agents in 2026.</p>
            </div>
            <Link href="/curated/best-coding-assistants" className="read-more-link" style={{ color: "#00F2FE" }}>Analyze Editors &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="trending-section" style={{ marginTop: "5rem", marginBottom: "2rem" }}>
        <div className="section-headline-container">
          <div>
            <h2 className="section-title">Highest Rated Platforms</h2>
            <p className="section-subtitle">Top user-voted AI systems sorted by authentic verified reviews.</p>
          </div>
          <Link href="/category/all" className="read-more-link">See All Tools &rarr;</Link>
        </div>
        <div className="sponsored-carousel">
          {highestRatedFiltered.map((t) => <ToolCard key={t.id} tool={t} />)}
        </div>
      </section>

      <section className="complete-catalog-section" style={{ marginTop: "5rem" }}>
        <div className="section-headline-container">
          <div>
            <h2 className="section-title">Complete AI Tools Catalog</h2>
            <p className="section-subtitle">Browse through our entire active index of {safeTools.length} high-performance AI systems.</p>
          </div>
          <Link href="/category/all" className="read-more-link">Open Advanced Filters &rarr;</Link>
        </div>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <div className="category-dock-wrapper">
            {[
              { id: "all", name: "All Technologies" },
              { id: "coding", name: "AI Coding Tools" },
              { id: "image", name: "AI Image Generators" },
              { id: "video", name: "AI Video Tools" },
              { id: "productivity", name: "AI Productivity Tools" }
            ].map((cat) => {
              const isActive = homeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setHomeCategory(cat.id)}
                  className={`category-dock-btn ${isActive ? "active" : ""}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sponsored-carousel" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", display: "grid", gap: "1.5rem" }}>
          {catalogTools
            .filter((t) => homeCategory === "all" ? true : t.categoryId === homeCategory)
            .map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
        </div>
      </section>

      <section className="additional-editorials" style={{ marginTop: "5rem", marginBottom: "4rem" }}>
        <div className="section-headline-container">
          <div>
            <h2 className="section-title">Popular Alternatives & Verticals</h2>
            <p className="section-subtitle">Read detailed custom breakdowns for specific industries.</p>
          </div>
        </div>
        <div className="curated-lists-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))" }}>
          <div className="curated-card" style={{ minHeight: "180px" }}>
            <div>
              <span className="curated-card-tag">ChatGPT Alternatives</span>
              <h3>ChatGPT Alternatives for Coding & Fact Research</h3>
              <p>Claude and Perplexity are beating ChatGPT at code comprehension and cited web searches. Compare specs.</p>
            </div>
            <Link href="/curated/chatgpt-alternatives" className="read-more-link">Compare Alternatives &rarr;</Link>
          </div>

          <div className="curated-card" style={{ minHeight: "180px" }}>
            <div>
              <span className="curated-card-tag">Aesthetic Design</span>
              <h3>AI Tools for Architects & Blueprints</h3>
              <p>Discover how Stable Diffusion pose adapters and Midjourney V6 cinematic frames can speed up architectural concepts.</p>
            </div>
            <Link href="/curated/ai-architects" className="read-more-link">Read Blueprint Guide &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="newsletter-lead-capture" style={{ marginTop: "6rem", marginBottom: "4rem" }}>
        <NewsletterBox />
      </section>
    </div>
  );
}
