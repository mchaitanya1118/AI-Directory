"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from "./HomeClient.module.css";

const NewsletterBox = dynamic(() => import("@/components/NewsletterBox"), { ssr: true });

export default function HomeClient({ initialTools }) {
  const { startComparison } = useApp();
  const [searchVal, setSearchVal] = useState("");
  const [homeCategory, setHomeCategory] = useState("all");
  const [isMounted, setIsMounted] = React.useState(false);
  const [renderBelowFold, setRenderBelowFold] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setIsMounted(true);
    
    // Defer below-the-fold rendering to free up the main thread during initial hydration
    let idleId = null;
    if (window.requestIdleCallback) {
      idleId = window.requestIdleCallback(() => setRenderBelowFold(true));
    } else {
      idleId = setTimeout(() => setRenderBelowFold(true), 200);
    }
    
    return () => {
      if (window.requestIdleCallback && idleId) {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      } else if (idleId) {
        clearTimeout(idleId);
      }
    };
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
      <section className={styles['hero-section']}>
        <div className={styles['hero-container']}>
          {/* LEFT COLUMN */}
          <div className={styles['hero-content-left']}>
            <h2 className={styles['hero-title']}>
              Discover the best<br />
              <span>AI Tools</span> for your<br />
              workflow!
            </h2>
            <p className={styles['hero-subtitle']}>
              Compare pricing models, explore verified user reviews, and filter
              through industry-standard AI productivity, coding, image, and video generators.
            </p>
            <div className={styles['hero-cta-buttons']}>
              <Link href="/category/all" className="cta-btn primary">Start the Search</Link>
              <Link href="/quiz" className="cta-btn secondary" style={{ background: '#ebebeb', color: '#000' }}>AI Finder Quiz ⚡</Link>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles['hero-content-right']}>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <Image
                src="/hero-image.png"
                alt="AuraAI Hero"
                width={1200}
                height={600}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
                fetchPriority="high"
                style={{ width: '100%', height: '270px', borderRadius: '12px', objectFit: 'cover' }}
              />
            </div>
            <div className={styles['hero-telemetry-grid']} style={{ gap: '0.75rem' }}>
              <div className={styles['telemetry-card']} style={{ padding: '0.75rem', borderRadius: '8px' }}>
                <div className={styles['telemetry-number']}>
                  <span>{safeTools.length}+</span>
                </div>
                <div className={styles['telemetry-label']} style={{ fontSize: '0.65rem' }}>Prime AI Engines</div>
              </div>
              <div className={styles['telemetry-card']} style={{ padding: '0.75rem', borderRadius: '8px' }}>
                <div className={styles['telemetry-number']}>
                  <span>100%</span>
                </div>
                <div className={styles['telemetry-label']} style={{ fontSize: '0.65rem' }}>Crawl Sync Secure</div>
              </div>
              <div className={styles['telemetry-card']} style={{ padding: '0.75rem', borderRadius: '8px' }}>
                <div className={styles['telemetry-number']}>
                  <span>4.8 ★</span>
                </div>
                <div className={styles['telemetry-label']} style={{ fontSize: '0.65rem' }}>Avg Quality Score</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "2rem auto 0 auto", width: "100%", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          <div className="search-wrapper" style={{ margin: 0, flex: "1 1 400px" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search 50+ AI tools (e.g., 'Cursor', 'Photoshop', 'Claude')..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
            <svg
              className="search-icon-svg"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>

          <div className={styles['quick-pills']} style={{ margin: 0, flexShrink: 0 }}>
            <span className={styles['pill-btn']} onClick={() => handlePillClick("IDE")}>AI IDEs</span>
            <span className={styles['pill-btn']} onClick={() => handlePillClick("Free Tier")}>Free Tiers</span>
            <span className={styles['pill-btn']} onClick={() => handlePillClick("Photorealism")}>Photorealism</span>
            <span className={styles['pill-btn']} onClick={() => handlePillClick("Voice Clone")}>Voice Clones</span>
            <span className={styles['pill-btn']} onClick={() => handlePillClick("Citations")}>Research Citations</span>
          </div>
        </div>
      </section>

      {renderBelowFold ? (
        <>
          <section className="sponsored-section">
            <div className="section-headline-container">
              <div>
                <h2 className="section-title">Sponsored Spotlight</h2>
                <p className="section-subtitle">Promoted premium services driving high-impact AI innovation.</p>
              </div>
            </div>
            <div className={styles['sponsored-carousel']}>
              {sponsoredTools.map((t) => <ToolCard key={t.id} tool={t} />)}
            </div>
          </section>

          <section className={styles['quick-compare-section']}>
            <div className="section-headline-container">
              <div>
                <h2 className="section-title">Quick Head-to-Head Comparisons</h2>
                <p className="section-subtitle">Instant technical specs analysis for industry-standard AI pairings.</p>
              </div>
              <Link href="/compare" className="read-more-link">Open Compare Screen &rarr;</Link>
            </div>
            <div className={styles['quick-compare-grid']}>
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
                    className={styles['compare-shortcut-card']}
                    onClick={() => {
                      startComparison(toolA.id);
                      startComparison(toolB.id);
                      router.push(`/compare/${toolA.id}-vs-${toolB.id}`);
                    }}
                  >
                    <div>
                      <div className={styles['compare-shortcut-header']}>
                        <div className={styles['compare-partner-info']}>
                          <div className={styles['compare-partner-logo']} dangerouslySetInnerHTML={{ __html: toolA.logo }} />
                          <span className={styles['compare-partner-name']}>{toolA.name}</span>
                        </div>
                        <div className={styles['compare-shortcut-vs']}>VS</div>
                        <div className={styles['compare-partner-info']} style={{ flexDirection: 'row-reverse' }}>
                          <div className={styles['compare-partner-logo']} dangerouslySetInnerHTML={{ __html: toolB.logo }} />
                          <span className={styles['compare-partner-name']}>{toolB.name}</span>
                        </div>
                      </div>
                      <p className={styles['compare-shortcut-desc']}>{pair.desc}</p>
                    </div>
                    <div className={styles['compare-shortcut-footer']}>
                      <span className={styles['compare-shortcut-desc']} style={{ fontSize: '0.7rem' }}>Official 2026 Diff Matrix</span>
                      <span className={styles['compare-shortcut-cta']}>Compare &rarr;</span>
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
            <div className={styles['sponsored-carousel']}>
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
              <div className={styles['category-dock-wrapper']}>
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
                      className={`${styles['category-dock-btn']} ${isActive ? styles.active : ""}`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles['sponsored-carousel']} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", display: "grid", gap: "1.5rem" }}>
              {catalogTools
                .filter((t) => homeCategory === "all" ? true : t.categoryId === homeCategory)
                .slice(0, 8)
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
        </>
      ) : (
        <div style={{ minHeight: "1000px" }} />
      )}
    </div>
  );
}
