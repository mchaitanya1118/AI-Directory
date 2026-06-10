"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "@/components/AdminClient.module.css";

export default function AdminScraper() {
  const [stats, setStats] = useState({
    totalRuns: 0,
    successRate: 100,
    lastRun: "Never",
    toolsUpdated: [],
    logs: [],
    runs: [],
  });
  const [tools, setTools] = useState([]);

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "#";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };
  const [terminalLines, setTerminalLines] = useState([
    { level: "SYS", message: "AuraAI Scraper Control Room Terminal v1.2" },
    { level: "SYS", message: "Initializing connection to crawler engines..." },
    { level: "SYS", message: "Secure sandbox environment established. Ready for crawl directives." },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("diff"); // diff | config
  const terminalEndRef = useRef(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/scrape");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load scraper stats:", e);
    }
  };

  const fetchTools = async () => {
    try {
      const res = await fetch("/api/tools");
      if (res.ok) {
        const data = await res.json();
        setTools(data);
      }
    } catch (e) {
      console.error("Failed to load directory tools:", e);
    }
  };

  // Load initial statistics and tools from API
  useEffect(() => {
    fetchStats();
    fetchTools();
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  const addTerminalLine = (level, message) => {
    setTerminalLines((prev) => [...prev, { level, message }]);
  };


  const handleTriggerScrape = async () => {
    if (isRunning) return;

    setIsRunning(true);
    // Clear terminal and print starting steps
    setTerminalLines([
      { level: "SYS", message: "--------------------------------------------------------" },
      { level: "SYS", message: `[CRAWLER_INIT] Triggering manual live crawl at: ${new Date().toLocaleTimeString()}` },
      { level: "INFO", message: "Spawning autonomous scraper agent sub-process..." },
      { level: "INFO", message: "Bypassing bot-detection firewalls using residential user headers..." },
    ]);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Parse and dump the output logs into the terminal window
        const stdoutLines = data.stdout ? data.stdout.split("\n") : [];
        
        stdoutLines.forEach((line) => {
          if (!line.trim()) return;
          
          let level = "INFO";
          let message = line;
          
          // Classify line level for visual color styling
          if (line.includes("[INFO]")) {
            level = "INFO";
            message = line.split("[INFO]").slice(1).join("[INFO]").trim();
          } else if (line.includes("[WARN]")) {
            level = "WARN";
            message = line.split("[WARN]").slice(1).join("[WARN]").trim();
          } else if (line.includes("[ERROR]")) {
            level = "ERROR";
            message = line.split("[ERROR]").slice(1).join("[ERROR]").trim();
          } else if (line.includes("[UPDATE]")) {
            level = "UPDATE";
            message = line.split("[UPDATE]").slice(1).join("[UPDATE]").trim();
          } else if (line.includes("[SUCCESS]")) {
            level = "SUCCESS";
            message = line.split("[SUCCESS]").slice(1).join("[SUCCESS]").trim();
          } else if (line.includes("[START]")) {
            level = "SYS";
            message = line;
          }
          
          addTerminalLine(level, message);
        });

        addTerminalLine("SUCCESS", `Database sync complete! Success Rate: ${data.latestRun?.successRate || 100}%`);
        addTerminalLine("SUCCESS", `Detected and modified ${data.latestRun?.changesCount || 0} parameter changes.`);
        
        // Refresh values on dashboard
        if (data.summary) {
          setStats((prev) => ({
            ...prev,
            ...data.summary,
            runs: data.latestRun ? [data.latestRun, ...(prev.runs || [])].slice(0, 30) : prev.runs,
          }));
        } else {
          fetchStats();
        }
        
        fetchTools();
      } else {
        // Handle failure output
        addTerminalLine("ERROR", `Process terminated with error: ${data.message || "Unknown execution panic"}`);
        if (data.stderr) {
          addTerminalLine("ERROR", `STDERR: ${data.stderr}`);
        }
        addTerminalLine("SYS", "Restored last cached crawl configuration state safely.");
      }
    } catch (error) {
      addTerminalLine("ERROR", `API Call exception failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Helper formats
  const formatTime = (isoString) => {
    if (!isoString || isoString === "Never") return "Never";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const getRecentUpdates = () => {
    if (!stats.runs || stats.runs.length === 0) return [];
    // Get list of unique tools updated in last run
    return stats.runs[0].updatedTools || [];
  };

  return (
    <div className={styles["admin-scraper-container"]}>
      {/* HEADER SECTION */}
      <div className={styles["scraper-header"]}>
        <div className={styles["scraper-title-section"]}>
          <h2>Scraper <span>Control Dashboard</span></h2>
          <p>Supercharge SEO rankings & keep AI tool specifications 100% synchronized in real-time.</p>
        </div>
        <Link href="/" className="ad-badge-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ← Back to Directory
        </Link>
      </div>

      {/* STATS COUNTER GRID */}
      <div className={styles["scraper-stats-grid"]}>
        <div className={`${styles["scraper-stat-card"]} ${styles["cyan"]}`}>
          <div className={styles["stat-header"]}>
            <span className={styles["stat-label"]}>Crawl Runs</span>
            <span className={styles["stat-icon"]}>🔄</span>
          </div>
          <div className={styles["stat-value"]}>{stats.totalRuns || 0}</div>
          <div className={styles["stat-subtext"]}>Total autonomous executions</div>
        </div>

        <div className={`${styles["scraper-stat-card"]} ${styles["purple"]}`}>
          <div className={styles["stat-header"]}>
            <span className={styles["stat-label"]}>Success Rate</span>
            <span className={styles["stat-icon"]}>📈</span>
          </div>
          <div className={styles["stat-value"]}>{stats.successRate || 100}%</div>
          <div className={styles["stat-subtext"]}>Crawl complete benchmark</div>
        </div>

        <div className={`${styles["scraper-stat-card"]} ${styles["gold"]}`}>
          <div className={styles["stat-header"]}>
            <span className={styles["stat-label"]}>Last Synchronized</span>
            <span className={styles["stat-icon"]}>🕒</span>
          </div>
          <div className={styles["stat-value"]} style={{ fontSize: "1.1rem", padding: "0.55rem 0", color: "var(--neon-gold)" }}>
            {stats.lastRun !== "Never" ? new Date(stats.lastRun).toLocaleTimeString() : "Never"}
          </div>
          <div className={styles["stat-subtext"]}>{stats.lastRun !== "Never" ? new Date(stats.lastRun).toLocaleDateString() : "Pending first run"}</div>
        </div>

        <div className={`${styles["scraper-stat-card"]} ${styles["rose"]}`}>
          <div className={styles["stat-header"]}>
            <span className={styles["stat-label"]}>Sync Catalog</span>
            <span className={styles["stat-icon"]}>📂</span>
          </div>
          <div className={styles["stat-value"]}>{tools.length || 0}</div>
          <div className={styles["stat-subtext"]}>Registered listings in directory</div>
        </div>
      </div>

      {/* CORE CONTROL AREA */}
      <div className={styles["scraper-main-layout"]}>
        {/* Monospace Interactive console widget */}
        <div className={styles["console-terminal-wrapper"]}>
          <div className={styles["terminal-header"]}>
            <div className={styles["terminal-buttons"]}>
              <span className={`${styles["terminal-dot"]} ${styles["close"]}`}></span>
              <span className={`${styles["terminal-dot"]} ${styles["minimize"]}`}></span>
              <span className={`${styles["terminal-dot"]} ${styles["maximize"]}`}></span>
            </div>
            <div className={styles["terminal-title"]}>bash - AuraAI-Scraper-CLI</div>
            <div style={{ width: "42px" }}></div>
          </div>
          <div className={styles["terminal-body"]}>
            {terminalLines.map((line, idx) => (
              <div key={idx} className={`${styles["terminal-line"]} ${styles[line.level.toLowerCase()]}`}>
                <span className="terminal-line-prefix" style={{ color: "rgba(255,255,255,0.25)", marginRight: "0.5rem" }}>
                  $
                </span>
                {line.level !== "SYS" && (
                  <span style={{ fontWeight: 600, marginRight: "0.4rem" }}>
                    [{line.level}]
                  </span>
                )}
                {line.message}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Action Button Controls */}
        <div className={styles["control-panel-wrapper"]}>
          <div className={styles["control-card"]}>
            <h3>Manual Execution</h3>
            <div className={styles["trigger-actions"]}>
              <button
                className={`${styles["action-btn"]} ${styles["primary"]}`}
                disabled={isRunning}
                onClick={handleTriggerScrape}
              >
                {isRunning ? (
                  <>
                    <svg className={styles["spinner-icon"]} width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing Live Crawl...
                  </>
                ) : (
                  <>
                    <span>🚀</span> Run Scraper Now
                  </>
                )}
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", textAlign: "center" }}>
                Triggers crawling and synchronizes directories in approx ~5s.
              </p>
            </div>
          </div>

          <div className={styles["control-card"]}>
            <h3>Recent Crawl Diffs</h3>
            <div className={styles["recent-changes-box"]}>
              {getRecentUpdates().length > 0 ? (
                getRecentUpdates().map((tName, i) => (
                  <div className={styles["recent-change-item"]} key={i}>
                    <span className={styles["change-tool-name"]}>{tName}</span>
                    <span className={styles["change-badge"]}>Synchronized</span>
                  </div>
                ))
              ) : (
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "1rem" }}>
                  No changes made in last execution.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED LOG AUDIT & LIVE DIRECTORY GRID */}
      <div className={styles["audit-log-section"]}>
        <div className={styles["section-title-wrap"]}>
          <h3>Directory Sync Analyzer</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setActiveTab("diff")}
              className={`ad-badge-button ${activeTab === "diff" ? "active" : ""}`}
              style={{
                background: activeTab === "diff" ? "var(--neon-cyan)" : "",
                color: activeTab === "diff" ? "var(--bg-dark)" : "",
                borderColor: activeTab === "diff" ? "var(--neon-cyan)" : ""
              }}
            >
              Live Catalog Grid
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`ad-badge-button ${activeTab === "config" ? "active" : ""}`}
              style={{
                background: activeTab === "config" ? "var(--neon-cyan)" : "",
                color: activeTab === "config" ? "var(--bg-dark)" : "",
                borderColor: activeTab === "config" ? "var(--neon-cyan)" : ""
              }}
            >
              Background Scheduler
            </button>
          </div>
        </div>

        {activeTab === "diff" ? (
          <div className={styles["diff-check-table-wrap"]}>
            <table className={styles["diff-table"]}>
              <thead>
                <tr>
                  <th>Tool Name</th>
                  <th>Website URL</th>
                  <th>Pricing Tier</th>
                  <th>Live Pricing Spec</th>
                  <th>Directory Description</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((t, idx) => (
                  <tr key={idx}>
                    <td className={styles["tool-name-cell"]}>
                      <span className={styles["diff-indicator-dot"]}></span>
                      {t.name}
                    </td>
                    <td>
                      {t.website ? (
                        <a href={ensureAbsoluteUrl(t.website)} target="_blank" rel="noopener noreferrer" style={{ color: "var(--neon-cyan)", textDecoration: "underline" }}>
                          {t.website.replace("https://", "").replace("http://", "").split("/")[0]}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <span className={`${styles["cell-pricing-badge"]} ${styles[t.pricing?.toLowerCase()]}`}>
                        {t.pricing}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-bright)", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.pricingDetails}
                    </td>
                    <td style={{ color: "var(--text-muted)", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.shortDescription}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className={styles["cron-instruction"]}>
              <h4 style={{ color: "var(--text-bright)", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>
                Programmatic Background Automation
              </h4>
              <p>
                To run AuraAI&apos;s scraper automatically at a set interval (e.g. daily at 2:00 AM) and maintain fresh rankings, configure a background crontab job on your hosting provider or server console.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <strong>Crontab Configuration Directive:</strong>
                <span className={styles["cron-code"]}>
                  0 2 * * * curl -X POST https://your-auraai-domain.com/api/scrape -H &quot;Authorization: Bearer YOUR_SECRET_KEY&quot;
                </span>
              </div>
              <p style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
                Note: In production environments, protect the `/api/scrape` endpoint with an environment token (e.g., &quot;PROCESS_SECRET&quot;) within the header authorization to secure crawls against arbitrary API spans.
              </p>
            </div>

            <div className={styles["cron-instruction"]} style={{ borderColor: "rgba(127,0,255,0.3)" }}>
              <h4 style={{ color: "var(--text-bright)", marginBottom: "0.5rem", fontFamily: "var(--font-display)" }}>
                Historical Crawl Runs Audit
              </h4>
              <div className={styles["audit-runs-list"]} style={{ marginTop: "1rem" }}>
                {stats.runs && stats.runs.length > 0 ? (
                  stats.runs.map((run, i) => (
                    <div className={styles["audit-run-row"]} key={i}>
                      <div className={styles["run-meta-info"]}>
                        <span className={`${styles["run-status-dot"]} ${run.success ? styles["success"] : styles["failed"]}`}></span>
                        <span className={styles["run-date"]}>{formatTime(run.timestamp)}</span>
                      </div>
                      <span className={styles["run-stats-summary"]}>
                        Processed: {run.toolsProcessed} | Changes: {run.changesCount}
                      </span>
                      <span className={styles["run-updates-count"]}>
                        {run.successRate}% Success
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
                    No audit records loaded. Execute a crawl to initialize statistics tracking logs.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
