// Core SPA Application Logic for AuraAI

document.addEventListener("DOMContentLoaded", () => {
  // Initialize state from LocalStorage or fallback to data.js initial variables
  let tools = [];
  try {
    const savedTools = localStorage.getItem("aura_tools");
    if (savedTools) {
      tools = JSON.parse(savedTools);
    } else {
      tools = [...INITIAL_TOOLS];
      localStorage.setItem("aura_tools", JSON.stringify(tools));
    }
  } catch (e) {
    tools = [...INITIAL_TOOLS];
  }

  // Active user selections for comparison
  let comparedTools = [];
  try {
    const savedCompared = localStorage.getItem("aura_compared");
    if (savedCompared) {
      comparedTools = JSON.parse(savedCompared);
    }
  } catch (e) {
    comparedTools = [];
  }

  // Global variables
  let currentSearchQuery = "";
  let selectedRatingStars = 5; // Default review rating star selection

  // Dom references
  const mainContent = document.getElementById("app-main-content");
  const compareTray = document.getElementById("floating-compare-tray");
  const compareSlotsContainer = document.getElementById("compare-slots-container");
  const compareClearBtn = document.getElementById("compare-clear-btn");
  const compareSubmitBtn = document.getElementById("compare-submit-btn");

  // Navigation handlers
  const navLinks = {
    home: document.getElementById("nav-home"),
    explore: document.getElementById("nav-explore"),
    coding: document.getElementById("nav-coding"),
    image: document.getElementById("nav-image"),
    productivity: document.getElementById("nav-productivity"),
    submit: document.getElementById("nav-submit"),
    logo: document.getElementById("logo-nav")
  };

  // Setup navigation event listeners
  navLinks.logo.addEventListener("click", () => navigateTo("#/"));
  navLinks.home.addEventListener("click", () => navigateTo("#/"));
  navLinks.explore.addEventListener("click", () => navigateTo("#/category/all"));
  navLinks.coding.addEventListener("click", () => navigateTo("#/category/coding"));
  navLinks.image.addEventListener("click", () => navigateTo("#/category/image"));
  navLinks.productivity.addEventListener("click", () => navigateTo("#/category/productivity"));
  navLinks.submit.addEventListener("click", () => navigateTo("#/submit"));

  // Comparison Bar Handlers
  compareClearBtn.addEventListener("click", () => {
    comparedTools = [];
    saveCompareState();
    updateCompareTray();
    router(); // Re-render current page to uncheck boxes
  });

  compareSubmitBtn.addEventListener("click", () => {
    if (comparedTools.length < 2) {
      alert("Please select at least 2 tools to compare.");
      return;
    }
    navigateTo("#/compare");
  });

  // Helper: Save comparison state to localStorage
  function saveCompareState() {
    try {
      localStorage.setItem("aura_compared", JSON.stringify(comparedTools));
    } catch (e) {}
  }

  // Helper: Save tools data to localStorage
  function saveToolsState() {
    try {
      localStorage.setItem("aura_tools", JSON.stringify(tools));
    } catch (e) {}
  }

  // Helper: Navigate wrapper
  function navigateTo(hash) {
    window.location.hash = hash;
  }

  // Helper: Calculate average rating for a tool
  function getAverageRating(tool) {
    if (!tool.reviews || tool.reviews.length === 0) return tool.rating || 0;
    const total = tool.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avg = total / tool.reviews.length;
    return parseFloat(avg.toFixed(1));
  }

  // Helper: Toggle compare list
  function toggleCompare(toolId, event) {
    if (event) event.stopPropagation();
    
    const index = comparedTools.indexOf(toolId);
    if (index > -1) {
      comparedTools.splice(index, 1);
    } else {
      if (comparedTools.length >= 3) {
        alert("You can compare a maximum of 3 tools simultaneously. Remove a tool to add another.");
        return;
      }
      comparedTools.push(toolId);
    }
    saveCompareState();
    updateCompareTray();
    
    // Toggle active visually inside checked cards
    const cardEl = document.querySelector(`.card-glass[data-id="${toolId}"]`);
    if (cardEl) {
      const checkboxContainer = cardEl.querySelector(".compare-checkbox-container");
      if (checkboxContainer) {
        checkboxContainer.classList.toggle("checked", index === -1);
      }
    }
  }

  // Update Floating Comparison Tray UI
  function updateCompareTray() {
    if (comparedTools.length === 0) {
      compareTray.classList.remove("active");
      return;
    }

    compareTray.classList.add("active");
    compareSlotsContainer.innerHTML = "";

    // Fill slots (up to 3)
    for (let i = 0; i < 3; i++) {
      const slotEl = document.createElement("div");
      slotEl.className = "compare-slot";

      if (i < comparedTools.length) {
        const toolId = comparedTools[i];
        const toolObj = tools.find(t => t.id === toolId);
        if (toolObj) {
          slotEl.classList.add("filled");
          slotEl.innerHTML = `
            <span>${toolObj.name}</span>
            <span class="slot-remove-btn" data-id="${toolId}">&times;</span>
          `;
          
          slotEl.querySelector(".slot-remove-btn").addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            toggleCompare(id);
            router(); // Refresh the active view checkmarks
          });
        } else {
          slotEl.innerHTML = `Empty Slot`;
        }
      } else {
        slotEl.innerHTML = `Empty Slot`;
      }
      compareSlotsContainer.appendChild(slotEl);
    }
  }

  // Highlights top navigation header links
  function updateActiveNavHighlights(activeKey) {
    Object.values(navLinks).forEach(link => {
      if (link && link.classList) link.classList.remove("active");
    });

    if (activeKey === "home" && navLinks.home) navLinks.home.classList.add("active");
    if (activeKey === "explore" && navLinks.explore) navLinks.explore.classList.add("active");
    if (activeKey === "coding" && navLinks.coding) navLinks.coding.classList.add("active");
    if (activeKey === "image" && navLinks.image) navLinks.image.classList.add("active");
    if (activeKey === "productivity" && navLinks.productivity) navLinks.productivity.classList.add("active");
  }

  // SPA Hash Router
  function router() {
    const hash = window.location.hash || "#/";
    window.scrollTo(0, 0);

    // Synchronize UI headers
    if (hash === "#/") {
      updateActiveNavHighlights("home");
      renderDashboard();
    } else if (hash.startsWith("#/category/")) {
      const category = hash.replace("#/category/", "");
      updateActiveNavHighlights(category);
      renderCategoryExplorer(category);
    } else if (hash.startsWith("#/tool/")) {
      const toolId = hash.replace("#/tool/", "");
      updateActiveNavHighlights("");
      renderToolDetail(toolId);
    } else if (hash === "#/compare") {
      updateActiveNavHighlights("");
      renderCompareMatrix();
    } else if (hash.startsWith("#/curated/")) {
      const curatedId = hash.replace("#/curated/", "");
      updateActiveNavHighlights("");
      renderCuratedPage(curatedId);
    } else if (hash === "#/submit") {
      updateActiveNavHighlights("");
      renderSubmissionForm();
    } else {
      // 404/Fallback to Dashboard
      navigateTo("#/");
    }

    updateCompareTray();
  }

  // --- VIEW 1: HOME/DASHBOARD ---
  function renderDashboard() {
    // Generate trending/sponsored list (e.g. Cursor, Claude, Midjourney)
    const sponsoredList = tools.filter(t => t.sponsored);
    const popularList = [...tools].sort((a, b) => b.rating - a.rating).slice(0, 4);

    let sponsoredCardsHtml = "";
    sponsoredList.forEach(t => {
      sponsoredCardsHtml += renderToolCard(t, true);
    });

    let popularCardsHtml = "";
    popularList.forEach(t => {
      popularCardsHtml += renderToolCard(t, false);
    });

    // Populate dynamic html
    mainContent.innerHTML = `
      <!-- HERO -->
      <section class="hero-section">
        <span class="hero-tagline">The Ultimate AI Database</span>
        <h2 class="hero-title">Discover the Best <span>AI Tools</span> for Your Workflow</h2>
        <p class="hero-subtitle">Compare pricing models, explore verified user reviews, and filter through industry-standard AI productivity, coding, image, and video generators.</p>
        
        <div class="search-wrapper">
          <input type="text" id="dashboard-search" class="search-input" placeholder="Search 50+ AI tools (e.g., 'Cursor', 'Photoshop', 'Claude')..." value="${currentSearchQuery}">
          <svg class="search-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div class="quick-pills">
          <span class="pill-btn" data-tag="IDE">AI IDEs</span>
          <span class="pill-btn" data-tag="Free Tier">Free Tiers</span>
          <span class="pill-btn" data-tag="Photorealism">Photorealism</span>
          <span class="pill-btn" data-tag="Voice Clone">Voice Clones</span>
          <span class="pill-btn" data-tag="Citations">Research Citations</span>
        </div>
      </section>

      <!-- SPONSORED SPOTLIGHT -->
      <section class="sponsored-section">
        <div class="section-headline-container">
          <div>
            <h2 class="section-title">Sponsored Spotlight</h2>
            <p class="section-subtitle">Promoted premium services driving high-impact AI innovation.</p>
          </div>
        </div>
        <div class="sponsored-carousel">
          ${sponsoredCardsHtml}
        </div>
      </section>

      <!-- CURATED LANDING ARTICLES (Why it works, students, free tools) -->
      <section class="curated-landing-articles" style="margin-top: 4rem;">
        <div class="section-headline-container">
          <div>
            <h2 class="section-title">Curated Playlists & Guides</h2>
            <p class="section-subtitle">Expert editorials designed to answer specific structural requirements.</p>
          </div>
        </div>
        <div class="curated-lists-grid">
          <div class="curated-card">
            <div>
              <span class="curated-card-tag">Student Pack</span>
              <h3>Best AI Tools for Students</h3>
              <p>Accelerate your homework, parse massive academic textbooks, and learn languages efficiently with verified zero-cost tools.</p>
            </div>
            <span class="read-more-link" onclick="window.location.hash = '#/curated/students-best'">Read Student Guide &rarr;</span>
          </div>

          <div class="curated-card" style="border-color: rgba(0, 255, 135, 0.15);">
            <div>
              <span class="curated-card-tag" style="color: #00FF87;">Zero Cost</span>
              <h3>Top Free AI Tools (100% Free)</h3>
              <p>Explore robust open-source image suites and React scaffolding generators that don't charge hefty monthly fees.</p>
            </div>
            <span class="read-more-link" style="color: #00FF87;" onclick="window.location.hash = '#/curated/top-free'">View Free Tools &rarr;</span>
          </div>

          <div class="curated-card">
            <div>
              <span class="curated-card-tag" style="color: #00F2FE;">Developer Core</span>
              <h3>Best AI Coding Assistants</h3>
              <p>An in-depth review comparing local code editors, inline autocompletes, and multi-file code decorators in 2026.</p>
            </div>
            <span class="read-more-link" style="color: #00F2FE;" onclick="window.location.hash = '#/curated/best-coding-assistants'">Analyze Editors &rarr;</span>
          </div>
        </div>
      </section>

      <!-- TRENDING / HIGHEST RATED -->
      <section class="trending-section" style="margin-top: 4rem; margin-bottom: 2rem;">
        <div class="section-headline-container">
          <div>
            <h2 class="section-title">Highest Rated Platforms</h2>
            <p class="section-subtitle">Top user-voted AI systems sorted by authentic verified reviews.</p>
          </div>
          <span class="read-more-link" onclick="window.location.hash = '#/category/all'">See All Tools &rarr;</span>
        </div>
        <div class="sponsored-carousel">
          ${popularCardsHtml}
        </div>
      </section>

      <!-- ADDITIONAL EDITORIAL GUIDES -->
      <section class="additional-editorials" style="margin-top: 4rem;">
        <div class="section-headline-container">
          <div>
            <h2 class="section-title">Popular Alternatives & Verticals</h2>
            <p class="section-subtitle">Read detailed custom breakdowns for specific industries.</p>
          </div>
        </div>
        <div class="curated-lists-grid" style="grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));">
          <div class="curated-card" style="min-height: 180px;">
            <div>
              <span class="curated-card-tag">ChatGPT Alternatives</span>
              <h3>ChatGPT Alternatives for Coding & Fact Research</h3>
              <p>Claude and Perplexity are beating ChatGPT at code comprehension and cited web searches. Compare specs.</p>
            </div>
            <span class="read-more-link" onclick="window.location.hash = '#/curated/chatgpt-alternatives'">Compare Alternatives &rarr;</span>
          </div>

          <div class="curated-card" style="min-height: 180px;">
            <div>
              <span class="curated-card-tag">Aesthetic Design</span>
              <h3>AI Tools for Architects & Blueprints</h3>
              <p>Discover how Stable Diffusion pose adapters and Midjourney V6 cinematic frames can speed up architectural concepts.</p>
            </div>
            <span class="read-more-link" onclick="window.location.hash = '#/curated/ai-architects'">Read Blueprint Guide &rarr;</span>
          </div>
        </div>
      </section>
    `;

    // Wire up search bar in Hero
    const dashSearch = document.getElementById("dashboard-search");
    dashSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        currentSearchQuery = dashSearch.value.trim();
        navigateTo(`#/category/all`);
      }
    });

    // Wire up quick pills
    document.querySelectorAll(".pill-btn").forEach(pill => {
      pill.addEventListener("click", () => {
        const tag = pill.getAttribute("data-tag");
        currentSearchQuery = tag;
        navigateTo(`#/category/all`);
      });
    });

    // Wire up standard buttons in cards
    wireCardButtons();
  }

  // --- VIEW 2: CATEGORY EXPLORER & SEARCH ---
  function renderCategoryExplorer(category = "all", initialFilters = {}) {
    // Current filtering state
    let pricingFilter = initialFilters.pricing || "all";
    let ratingFilter = initialFilters.rating || "all";
    let sortBy = initialFilters.sortBy || "popularity"; // popularity or rating

    function getFilteredTools() {
      return tools.filter(t => {
        // Category match
        if (category !== "all" && t.category !== category) return false;
        
        // Search query match (Search by name, tags, description)
        if (currentSearchQuery) {
          const query = currentSearchQuery.toLowerCase();
          const matchesName = t.name.toLowerCase().includes(query);
          const matchesDesc = t.shortDescription.toLowerCase().includes(query);
          const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(query));
          const matchesCat = t.category.toLowerCase().includes(query);
          if (!matchesName && !matchesDesc && !matchesTags && !matchesCat) return false;
        }

        // Pricing filter
        if (pricingFilter !== "all" && t.pricing.toLowerCase() !== pricingFilter.toLowerCase()) return false;

        // Rating filter
        if (ratingFilter !== "all") {
          const avgRating = getAverageRating(t);
          if (ratingFilter === "4.5" && avgRating < 4.5) return false;
          if (ratingFilter === "4.0" && avgRating < 4.0) return false;
        }

        return true;
      }).sort((a, b) => {
        if (sortBy === "rating") {
          return getAverageRating(b) - getAverageRating(a);
        } else {
          // Popularity (based on number of reviews)
          return (b.ratingCount + (b.reviews ? b.reviews.length : 0)) - (a.ratingCount + (a.reviews ? a.reviews.length : 0));
        }
      });
    }

    function renderExplorerLayout() {
      const filtered = getFilteredTools();
      let cardsHtml = "";
      
      if (filtered.length === 0) {
        cardsHtml = `
          <div class="detail-glass-card" style="text-align: center; padding: 4rem; width: 100%;">
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-bright);">No AI tools found</h3>
            <p style="color: var(--text-muted);">Try adjusting your keywords, pricing tiers, or category selectors.</p>
            <button class="cta-btn" id="explorer-clear-search-btn" style="margin-top: 1.5rem;">Reset All Filters</button>
          </div>
        `;
      } else {
        filtered.forEach(t => {
          cardsHtml += renderToolCard(t, false);
        });
      }

      // Generate tags pills at top
      const categories = [
        { id: "all", name: "All Technologies" },
        { id: "coding", name: "AI Coding Tools" },
        { id: "image", name: "AI Image Generators" },
        { id: "video", name: "AI Video Tools" },
        { id: "productivity", name: "AI Productivity Tools" }
      ];

      let tabsHtml = "";
      categories.forEach(cat => {
        const isActive = cat.id === category ? "active" : "";
        tabsHtml += `<button class="category-tab ${isActive}" data-id="${cat.id}">${cat.name}</button>`;
      });

      let activeSearchBadge = "";
      if (currentSearchQuery) {
        activeSearchBadge = `
          <div class="filter-badge">
            Search: "${currentSearchQuery}"
            <span class="remove-btn" id="remove-search-badge">&times;</span>
          </div>
        `;
      }

      mainContent.innerHTML = `
        <div class="category-explorer-container">
          <div class="section-headline-container">
            <div>
              <h2 class="section-title" style="text-transform: capitalize;">${category === "all" ? "Explore AI Directory" : category + " Tools"}</h2>
              <p class="section-subtitle">Real-time dynamic filters spanning monetization channels and technical specifications.</p>
            </div>
            <div class="results-count">Showing ${filtered.length} platforms</div>
          </div>

          <!-- CATEGORY PILL TABS -->
          <div class="category-tabs">
            ${tabsHtml}
          </div>

          <!-- SEARCH FILTER WRAPPER -->
          <div class="search-wrapper" style="max-width: 100%; margin-bottom: 1.5rem;">
            <input type="text" id="explorer-search" class="search-input" placeholder="Refine search by keyword, tag, or spec..." value="${currentSearchQuery}">
            <svg class="search-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- MULTI-CONTROL FILTER BAR -->
          <div class="filter-control-panel">
            <div class="filters-left">
              <select id="filter-pricing" class="select-filter">
                <option value="all" ${pricingFilter === "all" ? "selected" : ""}>All Pricing Models</option>
                <option value="free" ${pricingFilter === "free" ? "selected" : ""}>Free Only</option>
                <option value="freemium" ${pricingFilter === "freemium" ? "selected" : ""}>Freemium</option>
                <option value="paid" ${pricingFilter === "paid" ? "selected" : ""}>Paid</option>
              </select>

              <select id="filter-rating" class="select-filter">
                <option value="all" ${ratingFilter === "all" ? "selected" : ""}>All Verified Ratings</option>
                <option value="4.5" ${ratingFilter === "4.5" ? "selected" : ""}>Rating &gt;= 4.5</option>
                <option value="4.0" ${ratingFilter === "4.0" ? "selected" : ""}>Rating &gt;= 4.0</option>
              </select>

              <select id="sort-by" class="select-filter">
                <option value="popularity" ${sortBy === "popularity" ? "selected" : ""}>Sort by Popularity</option>
                <option value="rating" ${sortBy === "rating" ? "selected" : ""}>Sort by Top Rated</option>
              </select>
            </div>
            
            <button class="btn-secondary" id="reset-all-filters-btn" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">Clear Filters</button>
          </div>

          <!-- ACTIVE BADGES ROW -->
          ${activeSearchBadge ? `<div class="active-filters-badges">${activeSearchBadge}</div>` : ""}

          <!-- CARDS GRID -->
          <div class="sponsored-carousel" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
            ${cardsHtml}
          </div>
        </div>
      `;

      // Setup actions
      wireExplorerListeners();
    }

    function wireExplorerListeners() {
      // Wire tabs
      document.querySelectorAll(".category-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          const catId = tab.getAttribute("data-id");
          navigateTo(`#/category/${catId}`);
        });
      });

      // Wire search input
      const explorerSearch = document.getElementById("explorer-search");
      explorerSearch.addEventListener("input", (e) => {
        currentSearchQuery = explorerSearch.value.trim();
        renderExplorerLayout();
      });

      // Wire filters
      document.getElementById("filter-pricing").addEventListener("change", (e) => {
        pricingFilter = e.target.value;
        renderExplorerLayout();
      });

      document.getElementById("filter-rating").addEventListener("change", (e) => {
        ratingFilter = e.target.value;
        renderExplorerLayout();
      });

      document.getElementById("sort-by").addEventListener("change", (e) => {
        sortBy = e.target.value;
        renderExplorerLayout();
      });

      // Wire resets
      const resetBtn = document.getElementById("reset-all-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          currentSearchQuery = "";
          pricingFilter = "all";
          ratingFilter = "all";
          sortBy = "popularity";
          renderExplorerLayout();
        });
      }

      const emptyResetBtn = document.getElementById("explorer-clear-search-btn");
      if (emptyResetBtn) {
        emptyResetBtn.addEventListener("click", () => {
          currentSearchQuery = "";
          pricingFilter = "all";
          ratingFilter = "all";
          renderExplorerLayout();
        });
      }

      // Wire search badge dismiss
      const removeSearchBadge = document.getElementById("remove-search-badge");
      if (removeSearchBadge) {
        removeSearchBadge.addEventListener("click", () => {
          currentSearchQuery = "";
          renderExplorerLayout();
        });
      }

      // Wire buttons inside generated cards
      wireCardButtons();
    }

    renderExplorerLayout();
  }

  // --- VIEW 3: TOOL DETAILED REVIEWS ---
  function renderToolDetail(toolId) {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) {
      navigateTo("#/");
      return;
    }

    // Refresh dynamic metrics
    const avgRating = getAverageRating(tool);
    const similarTools = tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 3);

    let similarToolsHtml = "";
    similarTools.forEach(st => {
      similarToolsHtml += `
        <div class="card-glass" style="min-height: auto; margin-bottom: 1rem; padding: 1.25rem;" onclick="window.location.hash = '#/tool/${st.id}'" style="cursor: pointer;">
          <div class="card-header" style="margin-bottom: 0.5rem;">
            ${st.logo}
            <div class="card-title-area">
              <h3 style="font-size: 1.1rem;">${st.name}</h3>
              <div class="card-rating-row">
                <span class="rating-value" style="color: var(--neon-gold); font-size: 0.8rem;">★ ${getAverageRating(st)}</span>
                <span class="rating-count">(${st.ratingCount + (st.reviews ? st.reviews.length : 0)})</span>
              </div>
            </div>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">${st.shortDescription}</p>
        </div>
      `;
    });

    let reviewsHtml = "";
    if (!tool.reviews || tool.reviews.length === 0) {
      reviewsHtml = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No verified reviews yet. Be the first to share your thoughts!</p>`;
    } else {
      // Sort reviews newest first
      const sortedReviews = [...tool.reviews].reverse();
      sortedReviews.forEach(rev => {
        let starsHtml = "";
        for (let i = 1; i <= 5; i++) {
          starsHtml += `<span style="color: ${i <= rev.rating ? "var(--neon-gold)" : "rgba(255,255,255,0.15)"}; font-size: 0.85rem;">★</span>`;
        }
        reviewsHtml += `
          <div class="review-item">
            <div class="review-meta">
              <span class="review-user">@${rev.username}</span>
              <span class="review-date">${rev.date}</span>
            </div>
            <div style="margin-bottom: 0.5rem;">${starsHtml}</div>
            <p class="review-comment">"${rev.comment}"</p>
          </div>
        `;
      });
    }

    let specsHtml = "";
    Object.entries(tool.specs || {}).forEach(([key, val]) => {
      const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
      specsHtml += `
        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">${formattedKey}</span>
          <span style="font-size: 0.85rem; color: var(--text-bright); text-align: right; max-width: 60%;">${val}</span>
        </div>
      `;
    });

    let featuresHtml = "";
    tool.features.forEach(feat => {
      featuresHtml += `<li style="font-size: 0.9rem; margin-bottom: 0.5rem; display: flex; gap: 0.5rem; align-items: flex-start;">
        <span style="color: var(--neon-cyan);">✦</span> ${feat}
      </li>`;
    });

    mainContent.innerHTML = `
      <div class="tool-detail-grid">
        
        <!-- LEFT MAIN COLUMN -->
        <div class="tool-detail-main">
          
          <!-- BRAND DEEP HEADER -->
          <div class="detail-glass-card">
            <div class="detail-header-block">
              <div class="detail-brand-row">
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; padding: 0.5rem; display: flex; align-items: center; justify-content: center;">
                  ${tool.logo}
                </div>
                <div class="detail-brand-info">
                  <h1>${tool.name}</h1>
                  <div class="detail-sub-meta">
                    <span class="card-pricing-badge pricing-${tool.pricing.toLowerCase()}">${tool.pricing}</span>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">|</span>
                    <span style="font-size: 0.85rem; color: var(--neon-cyan); text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">${tool.category} AI</span>
                  </div>
                </div>
              </div>

              <div class="detail-visit-affiliate-box">
                <button class="cta-btn action-primary" style="padding: 0.75rem 1.75rem; border-radius: 8px;" onclick="window.open('${tool.website}', '_blank')">
                  Visit Official Website &rarr;
                </button>
                <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Affiliate Link Supported</span>
              </div>
            </div>

            <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 2rem; line-height: 1.6;">${tool.description}</p>
            
            <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; color: var(--text-bright); margin-bottom: 0.75rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem;">Core AI Capabilities</h3>
            <ul style="list-style: none; margin-bottom: 2rem;">
              ${featuresHtml}
            </ul>

            <div class="pros-cons-grid">
              <div class="pros-box">
                <h4>Strengths & Pros</h4>
                <ul class="pros-cons-list">
                  ${tool.pros.map(p => `<li>${p}</li>`).join("")}
                </ul>
              </div>
              <div class="cons-box">
                <h4>Limitations & Cons</h4>
                <ul class="pros-cons-list">
                  ${tool.cons.map(c => `<li>${c}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>

          <!-- USER RATINGS & REVIEWS SECTION -->
          <div class="detail-glass-card">
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--text-bright); margin-bottom: 1.5rem;">Verified Community Reviews</h3>
            
            <div class="reviews-section">
              ${reviewsHtml}
            </div>

            <!-- REVIEW CREATION PORTAL -->
            <div class="add-review-form">
              <h4 class="form-title">Write an Authentic Review</h4>
              
              <div class="form-group">
                <span class="form-label">Your Rating Value</span>
                <div class="rating-select-stars" id="review-stars-input-row">
                  <span class="star-input active" data-rating="1">★</span>
                  <span class="star-input active" data-rating="2">★</span>
                  <span class="star-input active" data-rating="3">★</span>
                  <span class="star-input active" data-rating="4">★</span>
                  <span class="star-input active" data-rating="5">★</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="review-username">User Profile Handle</label>
                <input type="text" id="review-username" class="form-input" placeholder="e.g. creative_pixel" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="review-comment">Review Description</label>
                <textarea id="review-comment" class="form-textarea" placeholder="Explain your experience, pricing value, speed, and overall verdict..." required></textarea>
              </div>

              <button class="cta-btn" id="submit-review-btn" style="box-shadow: 0 4px 10px rgba(0, 242, 254, 0.2);">Publish Review</button>
            </div>
          </div>

        </div>

        <!-- RIGHT SIDE PANEL -->
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          
          <!-- RATING SUMMARY MATRIX -->
          <div class="detail-glass-card" style="text-align: center; padding: 2.5rem 1.5rem;">
            <span style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">AuraScore Rating</span>
            <div class="rating-huge-number" style="margin: 0.75rem 0;">${avgRating}</div>
            <div class="star-rating" style="justify-content: center; font-size: 1.25rem; margin-bottom: 0.5rem;">
              ${"★".repeat(Math.round(avgRating))}${"☆".repeat(5 - Math.round(avgRating))}
            </div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Based on ${tool.ratingCount + (tool.reviews ? tool.reviews.length : 0)} community votes</span>
          </div>

          <!-- SPECIFICATIONS CARD -->
          <div class="detail-glass-card">
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-bright);">Technical Specs</h4>
            <div>
              ${specsHtml}
              <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: none;">
                <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">Pricing Structure</span>
                <span style="font-size: 0.85rem; color: var(--text-bright); text-align: right; max-width: 60%;">${tool.pricingDetails}</span>
              </div>
            </div>
          </div>

          <!-- COMPARE CTA QUICK -->
          <div class="detail-glass-card" style="background: linear-gradient(135deg, rgba(0, 242, 254, 0.05) 0%, rgba(127, 0, 255, 0.05) 100%); border-color: rgba(0, 242, 254, 0.2);">
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-bright);">Want to compare?</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Compare ${tool.name} side-by-side with industry alternatives.</p>
            <button class="btn-secondary" id="detail-compare-toggle-btn" style="width: 100%;">
              ${comparedTools.includes(tool.id) ? "✓ Added to Compare" : "+ Add to Comparison"}
            </button>
          </div>

          <!-- SIMILAR TOOLS SIDEBAR -->
          <div class="detail-glass-card">
            <h4 style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-bright);">Similar AI Solutions</h4>
            <div>
              ${similarToolsHtml}
            </div>
          </div>

        </div>

      </div>
    `;

    // Wire up Star hover selectors
    const starElRow = document.getElementById("review-stars-input-row");
    const starElItems = starElRow.querySelectorAll(".star-input");
    starElItems.forEach(s => {
      s.addEventListener("click", () => {
        const r = parseInt(s.getAttribute("data-rating"));
        selectedRatingStars = r;
        starElItems.forEach(star => {
          const sr = parseInt(star.getAttribute("data-rating"));
          star.classList.toggle("active", sr <= r);
        });
      });
    });

    // Wire up Review submission
    document.getElementById("submit-review-btn").addEventListener("click", () => {
      const usernameInput = document.getElementById("review-username");
      const commentInput = document.getElementById("review-comment");
      
      const usernameVal = usernameInput.value.trim();
      const commentVal = commentInput.value.trim();

      if (!usernameVal || !commentVal) {
        alert("Please complete both username and comment fields.");
        return;
      }

      // Add review to state
      if (!tool.reviews) tool.reviews = [];
      
      const newReview = {
        id: "custom_rev_" + Date.now(),
        username: usernameVal.replace("@", ""),
        rating: selectedRatingStars,
        comment: commentVal,
        date: new Date().toISOString().split("T")[0]
      };

      tool.reviews.push(newReview);
      saveToolsState();

      alert("Thank you! Your verified review has been submitted successfully.");
      renderToolDetail(toolId); // Refresh detailed page views
    });

    // Wire up compare toggle
    document.getElementById("detail-compare-toggle-btn").addEventListener("click", () => {
      toggleCompare(tool.id);
      const btn = document.getElementById("detail-compare-toggle-btn");
      btn.innerText = comparedTools.includes(tool.id) ? "✓ Added to Compare" : "+ Add to Comparison";
    });
  }

  // --- VIEW 4: SIDE-BY-SIDE COMPARE SCREEN ---
  function renderCompareMatrix() {
    if (comparedTools.length < 2) {
      mainContent.innerHTML = `
        <div class="detail-glass-card" style="text-align: center; padding: 4rem;">
          <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-bright);">Comparison Tray Empty</h3>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">Please select at least two tools from our directory cards or headers to perform analysis.</p>
          <button class="cta-btn" onclick="window.location.hash = '#/category/all'">Browse AI Directory</button>
        </div>
      `;
      return;
    }

    const comparedObjs = comparedTools.map(id => tools.find(t => t.id === id)).filter(Boolean);

    // Headers cells html
    let headersHtml = "<th>Specifications</th>";
    comparedObjs.forEach(t => {
      headersHtml += `
        <th class="compare-header-cell" style="width: calc(75% / ${comparedObjs.length});">
          <div class="compare-header-cell">
            <div class="tool-logo-wrap">${t.logo}</div>
            <h3>${t.name}</h3>
            <span class="card-pricing-badge pricing-${t.pricing.toLowerCase()}">${t.pricing}</span>
            <div class="card-rating-row" style="justify-content: center; margin-top: 0.5rem;">
              <span class="rating-value" style="color: var(--neon-gold);">★ ${getAverageRating(t)}</span>
              <span class="rating-count">(${t.ratingCount + (t.reviews ? t.reviews.length : 0)} votes)</span>
            </div>
          </div>
        </th>
      `;
    });

    // Generate specifications keys dynamically from available
    const specKeys = [
      { key: "category", label: "Core Category" },
      { key: "pricingDetails", label: "Pricing Structure" },
      { key: "platform", label: "Supported Platforms", isSpec: true },
      { key: "hosting", label: "Hosting / Deployment", isSpec: true },
      { key: "apiAccess", label: "API Availability", isSpec: true },
      { key: "trialLength", label: "Trial Parameters", isSpec: true },
      { key: "targetAudience", label: "Target Audience", isSpec: true },
    ];

    let rowsHtml = "";
    specKeys.forEach(spec => {
      let rowHtml = `<tr><td style="font-weight: 600; color: var(--text-muted);">${spec.label}</td>`;
      comparedObjs.forEach(t => {
        let val = "";
        if (spec.isSpec) {
          val = t.specs ? t.specs[spec.key] : "";
        } else {
          val = t[spec.key];
        }
        
        if (spec.key === "category") {
          val = `<span style="text-transform: capitalize; color: var(--neon-cyan); font-weight: 600;">${val}</span>`;
        }
        
        rowHtml += `<td>${val || "Not Specified"}</td>`;
      });
      rowHtml += "</tr>";
      rowsHtml += rowHtml;
    });

    // Core Features List row
    let featuresRowHtml = `<tr><td style="font-weight: 600; color: var(--text-muted);">Core Features</td>`;
    comparedObjs.forEach(t => {
      let featsHtml = `<ul style="list-style: none; padding-left: 0;">`;
      t.features.forEach(feat => {
        featsHtml += `<li style="font-size: 0.85rem; margin-bottom: 0.4rem;"><span class="feature-check-icon">✓</span> ${feat}</li>`;
      });
      featsHtml += "</ul>";
      featuresRowHtml += `<td>${featsHtml}</td>`;
    });
    featuresRowHtml += "</tr>";
    rowsHtml += featuresRowHtml;

    // Strengths row
    let strengthsRowHtml = `<tr><td style="font-weight: 600; color: var(--text-muted);">Strengths / Pros</td>`;
    comparedObjs.forEach(t => {
      let list = `<ul style="list-style: none; padding-left: 0;">`;
      t.pros.slice(0, 3).forEach(p => {
        list += `<li style="font-size: 0.85rem; margin-bottom: 0.4rem; color: #00FF87;">✓ ${p}</li>`;
      });
      list += "</ul>";
      strengthsRowHtml += `<td>${list}</td>`;
    });
    strengthsRowHtml += "</tr>";
    rowsHtml += strengthsRowHtml;

    // Verdict Row
    let verdictRowHtml = `<tr><td style="font-weight: 600; color: var(--text-muted);">Platform Verdict</td>`;
    comparedObjs.forEach(t => {
      let verdictText = "";
      if (t.id === "cursor") {
        verdictText = "<strong>Highly Recommended</strong> for modern engineers wanting modular, AI-first directory and folder refactoring.";
      } else if (t.id === "claude") {
        verdictText = "<strong>Best Overall Productivity Tool</strong> for writing, logic parsing, and multi-doc reasoning.";
      } else if (t.id === "perplexity") {
        verdictText = "<strong>Ultimate Web Searcher</strong>. Highly recommended for students requiring validated external sources.";
      } else if (t.id === "midjourney") {
        verdictText = "<strong>Aesthetic Gold Standard</strong>. Ideal for final production cinematic visuals and artworks.";
      } else if (t.id === "stablediffusion") {
        verdictText = "<strong>Highly Customizable</strong>. Recommended for experienced editors wanting 100% control locally.";
      } else {
        verdictText = `A superb, highly capable <strong>${t.pricing}</strong> tool, scoring an impressive <strong>${getAverageRating(t)} ★</strong> AuraScore.`;
      }

      verdictRowHtml += `<td><p style="font-size: 0.85rem; line-height: 1.5;">${verdictText}</p></td>`;
    });
    verdictRowHtml += "</tr>";
    rowsHtml += verdictRowHtml;

    // Footer actions row
    let actionsRowHtml = `<tr><td></td>`;
    comparedObjs.forEach(t => {
      actionsRowHtml += `
        <td style="text-align: center;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="cta-btn action-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem;" onclick="window.open('${t.website}', '_blank')">
              Visit Site &rarr;
            </button>
            <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.location.hash = '#/tool/${t.id}'">
              Read ${t.reviews.length + t.ratingCount} Reviews
            </button>
          </div>
        </td>
      `;
    });
    actionsRowHtml += "</tr>";
    rowsHtml += actionsRowHtml;

    mainContent.innerHTML = `
      <div class="compare-screen-container">
        <div class="section-headline-container">
          <div>
            <h2 class="section-title">AuraAI Comparative Matrix</h2>
            <p class="section-subtitle">Side-by-side technical specs, monetized parameters, and editorial conclusions.</p>
          </div>
          <button class="btn-secondary" onclick="window.location.hash = '#/category/all'">Add More Tools</button>
        </div>

        <div style="overflow-x: auto; width: 100%;">
          <table class="compare-matrix-table">
            <thead>
              <tr>${headersHtml}</tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // --- VIEW 5: CURATED EDITORIAL DETAILS VIEW ---
  function renderCuratedPage(curatedId) {
    const pageObj = CURATED_PAGES[curatedId];
    if (!pageObj) {
      navigateTo("#/");
      return;
    }

    const linkedTools = pageObj.listIds.map(id => tools.find(t => t.id === id)).filter(Boolean);

    let stackHtml = "";
    linkedTools.forEach((t, i) => {
      const avg = getAverageRating(t);
      let featuresHtml = "";
      t.features.slice(0, 3).forEach(f => {
        featuresHtml += `<li style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">• ${f}</li>`;
      });

      stackHtml += `
        <div class="curated-item-row">
          <div class="rank-badge">#${i + 1}</div>
          <div class="detail-glass-card" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
              <div style="display: flex; align-items: center; gap: 1rem;">
                ${t.logo}
                <div>
                  <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--text-bright); font-weight: 700;">${t.name}</h3>
                  <div class="card-rating-row">
                    <span class="rating-value" style="color: var(--neon-gold);">★ ${avg}</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">|</span>
                    <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">${t.pricing}</span>
                  </div>
                </div>
              </div>
              
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn-secondary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.location.hash = '#/tool/${t.id}'">Detailed Reviews</button>
                <button class="cta-btn action-primary" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;" onclick="window.open('${t.website}', '_blank')">Visit Website</button>
              </div>
            </div>

            <p style="font-size: 0.95rem; color: var(--text-main); margin-bottom: 1rem; line-height: 1.5;">${t.description}</p>
            
            <div style="background: rgba(255,255,255,0.01); border-radius: 8px; padding: 1rem; border: 1px solid rgba(255,255,255,0.03);">
              <h4 style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--neon-cyan); letter-spacing: 0.5px; margin-bottom: 0.5rem;">Key Feature Spotlight</h4>
              <ul style="list-style: none;">
                ${featuresHtml}
              </ul>
            </div>
          </div>
        </div>
      `;
    });

    mainContent.innerHTML = `
      <div class="curated-deep-page">
        
        <div class="curated-deep-header">
          <span class="hero-tagline" style="letter-spacing: 2px;">Curated Editorial Review</span>
          <h1 class="hero-title" style="font-size: 2.75rem; margin-top: 0.5rem;">${pageObj.title}</h1>
          <p class="curated-deep-intro">"${pageObj.introduction}"</p>
        </div>

        <div class="curated-items-stack">
          ${stackHtml}
        </div>

        <div class="curated-verdict-box">
          <h4 class="verdict-header">Our Editorial Conclusion</h4>
          <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.6;">${pageObj.verdict}</p>
        </div>

      </div>
    `;
  }

  // --- VIEW 6: SUBMIT A TOOL CREATOR PORTAL ---
  function renderSubmissionForm() {
    mainContent.innerHTML = `
      <div class="submission-form-container">
        
        <div class="curated-deep-header" style="padding: 2rem 0;">
          <span class="hero-tagline">Promote Your Innovation</span>
          <h1 class="hero-title" style="font-size: 2.5rem; margin-top: 0.5rem;">Submit Your AI Product</h1>
          <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 600px; margin: 0.75rem auto 0;">Get listed on AuraAI. Drive massive organic traffic and acquire high-intent users looking for your specific AI capabilities.</p>
        </div>

        <div class="detail-glass-card" style="margin-top: 1rem;">
          
          <div class="form-group">
            <label class="form-label" for="sub-name">Product Name</label>
            <input type="text" id="sub-name" class="form-input" placeholder="e.g. CodePulse AI" required>
          </div>

          <div class="form-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label class="form-label" for="sub-category">Core Category</label>
              <select id="sub-category" class="select-filter" style="width: 100%; height: 42px;">
                <option value="coding">AI Coding Tool</option>
                <option value="image">AI Image Generator</option>
                <option value="video">AI Video Tool</option>
                <option value="productivity">AI Productivity Tool</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="sub-pricing">Pricing Structure</label>
              <select id="sub-pricing" class="select-filter" style="width: 100%; height: 42px;">
                <option value="Free">Free / Open Source</option>
                <option value="Freemium">Freemium Tier</option>
                <option value="Paid">Paid Only</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="sub-url">Official Website URL (With Referral Tags)</label>
            <input type="url" id="sub-url" class="form-input" placeholder="e.g. https://codepulse.ai/?ref=aura" required>
          </div>

          <div class="form-group">
            <label class="form-label" for="sub-short">Elevator Pitch (1 sentence)</label>
            <input type="text" id="sub-short" class="form-input" placeholder="e.g. The fastest real-time dashboard analytics assistant..." required>
          </div>

          <div class="form-group">
            <label class="form-label" for="sub-desc">Comprehensive Description</label>
            <textarea id="sub-desc" class="form-textarea" placeholder="Explain the underlying LLM/API framework, who this benefits most, hosting options, and platform support..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="sub-features">Core Features (Comma separated)</label>
            <input type="text" id="sub-features" class="form-input" placeholder="e.g. In-line completions, Local Docker, Custom models">
          </div>

          <div style="background: rgba(255, 226, 89, 0.03); border: 1.5px dashed var(--neon-gold); border-radius: 8px; padding: 1.25rem; margin: 1.5rem 0;">
            <h4 style="font-family: var(--font-display); font-size: 0.95rem; font-weight: 700; color: var(--neon-gold); margin-bottom: 0.35rem;">Sponsored Listing Program Available</h4>
            <p style="font-size: 0.8rem; color: var(--text-main); line-height: 1.4;">Boost your product to the Home Page Spotlight and get a highlighted golden gradient card by selecting sponsored placement. Mock sponsored listings are supported instantly.</p>
            <label class="compare-checkbox-container" id="sub-sponsored-box" style="margin-top: 0.75rem; font-size: 0.85rem; font-weight: 600; color: var(--text-bright);">
              <span class="compare-circle"></span> Select Sponsored Spotlight Placement (Simulation)
            </label>
          </div>

          <button class="cta-btn action-primary" id="submit-product-btn" style="width: 100%; height: 48px; border-radius: 8px; margin-top: 1rem;">
            Submit Product Application
          </button>
        </div>

      </div>
    `;

    // Wire up custom sponsored check
    const checkSponsored = document.getElementById("sub-sponsored-box");
    checkSponsored.addEventListener("click", () => {
      checkSponsored.classList.toggle("checked");
    });

    // Wire up product submission
    document.getElementById("submit-product-btn").addEventListener("click", () => {
      const nameInput = document.getElementById("sub-name");
      const categorySelect = document.getElementById("sub-category");
      const pricingSelect = document.getElementById("sub-pricing");
      const urlInput = document.getElementById("sub-url");
      const shortInput = document.getElementById("sub-short");
      const descInput = document.getElementById("sub-desc");
      const featsInput = document.getElementById("sub-features");
      const isSponsored = checkSponsored.classList.contains("checked");

      const name = nameInput.value.trim();
      const url = urlInput.value.trim();
      const short = shortInput.value.trim();
      const desc = descInput.value.trim();

      if (!name || !url || !short || !desc) {
        alert("Please complete all product text fields.");
        return;
      }

      // Dynamic placeholder svg
      const colorGradients = ["gradient-cyan", "gradient-violet", "gradient-rose", "gradient-neon"];
      const randGrad = colorGradients[Math.floor(Math.random() * colorGradients.length)];
      const customLogo = `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="url(#${randGrad})" fill-opacity="0.2" stroke="url(#${randGrad})" stroke-width="2"/>
        <text x="50%" y="62%" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">${name.slice(0,2).toUpperCase()}</text>
      </svg>`;

      const newTool = {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: name,
        category: categorySelect.value,
        logo: customLogo,
        rating: 5.0,
        ratingCount: 1,
        pricing: pricingSelect.value,
        pricingDetails: pricingSelect.value + " structure self-registered by creator.",
        shortDescription: short,
        description: desc,
        features: featsInput.value ? featsInput.value.split(",").map(f => f.trim()) : ["AI Auto-generation model", "Real-time API Sync", "Intuitive layout"],
        pros: ["Easy user interface configuration", "Active support desk integrations", "Fast response latency"],
        cons: ["Relatively new platform in directory", "Limited review feedback history"],
        website: url,
        sponsored: isSponsored,
        tags: ["New Listing", pricingSelect.value, "Creator Submitted"],
        specs: {
          platform: "Web-based / Cross-Platform",
          apiAccess: "Refer to support desk",
          targetAudience: "General Professionals, Explorers",
          trialLength: "Variable trial options",
          hosting: "Cloud-Based"
        },
        reviews: [
          {
            id: "sub_initial_rev",
            username: "early_adopter",
            rating: 5,
            comment: "Just launched, really excited to see this evolve. Outstanding potential and seamless configuration.",
            date: new Date().toISOString().split("T")[0]
          }
        ]
      };

      tools.push(newTool);
      saveToolsState();

      alert(`Congratulations! "${name}" has been successfully added to our active directory database. Let's browse the explorer!`);
      
      // Redirect to the newly updated category explorer
      navigateTo(`#/category/${categorySelect.value}`);
    });
  }

  // --- REUSABLE COMPONENT: TOOL GRID CARD ---
  function renderToolCard(tool, showSponsoredBadge = false) {
    const isCompared = comparedTools.includes(tool.id);
    const avgRating = getAverageRating(tool);
    
    // Select styling for pricing tags
    const pricingClass = `pricing-${tool.pricing.toLowerCase()}`;
    const sponsoredClass = (tool.sponsored || showSponsoredBadge) ? "sponsored" : "";
    
    let starHtml = "";
    const rounded = Math.round(avgRating);
    for (let i = 1; i <= 5; i++) {
      starHtml += `<span style="font-size: 0.8rem; color: ${i <= rounded ? "var(--neon-gold)" : "rgba(255,255,255,0.15)"}">★</span>`;
    }

    return `
      <div class="card-glass ${sponsoredClass}" data-id="${tool.id}">
        ${(tool.sponsored || showSponsoredBadge) ? `<span class="sponsored-tag">Sponsored Spotlight</span>` : ""}
        
        <div>
          <div class="card-header">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 8px; padding: 0.35rem; display: flex; align-items: center; justify-content: center;">
              ${tool.logo}
            </div>
            <div class="card-title-area">
              <h3 onclick="window.location.hash = '#/tool/${tool.id}'" style="cursor: pointer;">${tool.name}</h3>
              <div class="card-rating-row">
                <span class="star-rating">${starHtml}</span>
                <span class="rating-value">${avgRating}</span>
                <span class="rating-count">(${tool.ratingCount + (tool.reviews ? tool.reviews.length : 0)})</span>
              </div>
            </div>
          </div>

          <p class="card-desc">${tool.shortDescription}</p>

          <div class="card-tags">
            ${tool.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join("")}
          </div>
        </div>

        <div class="card-footer">
          <span class="card-pricing-badge ${pricingClass}">${tool.pricing}</span>
          
          <div class="card-actions">
            <!-- Checkbox compare trigger -->
            <label class="compare-checkbox-container ${isCompared ? "checked" : ""}" data-id="${tool.id}">
              <span class="compare-circle"></span> Compare
            </label>
            <button class="card-btn" onclick="window.location.hash = '#/tool/${tool.id}'">Reviews</button>
            <button class="card-btn action-primary" onclick="window.open('${tool.website}', '_blank')">Visit Site</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- HELPER: CARD BUTTONS EVENT LISTENER ATTACHMENT ---
  function wireCardButtons() {
    // Wire up compares checkboxes inside cards
    document.querySelectorAll(".compare-checkbox-container").forEach(c => {
      c.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = c.getAttribute("data-id");
        toggleCompare(id);
      });
    });
  }

  // Monitor hash modifications
  window.addEventListener("hashchange", router);

  // Initialize view router on fresh load
  router();
});
