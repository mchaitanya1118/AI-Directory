import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import CompareTray from "@/components/CompareTray";
import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "AuraAI | Directory of Premium AI Tools, Reviews, & Comparisons",
  description:
    "Explore, compare, and review the best AI coding assistants, image generators, productivity suites, and video tools. Verified user ratings and affiliate updates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <AppProvider>
            <div className="app-container">
              
              {/* PREMIUM FLOATING NAVIGATION HEADER */}
              <Header />

            {/* DYNAMIC CHILD PAGES */}
            <main id="app-main-content">
              {/* MOCK ADSENSE BANNER TOP */}
              <div className="adsense-placement" id="top-ad-banner">
                <span className="ad-label">Sponsored Placement</span>
                <div className="ad-content">
                  <div>
                    <span className="ad-title">Cursor AI Editor</span>
                    <span className="ad-desc">
                      {" "}
                      — Build software faster than ever. Standard-setting
                      multi-file edits.
                    </span>
                  </div>
                  <a
                    href="https://cursor.com/?via=aitoolsdir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ad-badge-button"
                  >
                    Get Started For Free
                  </a>
                </div>
              </div>

              {children}
            </main>

            {/* MOCK ADSENSE BANNER BOTTOM */}
            <div
              className="adsense-placement"
              id="bottom-ad-banner"
              style={{ marginTop: "4rem" }}
            >
              <span className="ad-label">AdSense Advertisement</span>
              <div className="ad-content">
                <div>
                  <span className="ad-title">Scale Your Dev Team with HeyGen</span>
                  <span className="ad-desc">
                    {" "}
                    — Generate natural AI spokesperson videos in 40+ languages
                    instantly.
                  </span>
                </div>
                <Link href="/tool/heygen" className="ad-badge-button">
                  Read HeyGen Reviews
                </Link>
              </div>
            </div>

            {/* FLOATING COMPARE BAR CONTAINER */}
            <CompareTray />

            {/* PREMIUM FOOTER */}
            <footer className="app-footer">
              <div>
                <p>
                  &copy; 2026 AuraAI Directory. Crafted for explorers, builders,
                  and developers.
                </p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
                  Disclaimer: Some listings contain affiliate redirect links
                  that support the website at no additional cost to you.
                </p>
              </div>
              <div className="footer-links">
                <Link href="/" className="nav-link">
                  Home
                </Link>
                <Link href="/category/all" className="nav-link">
                  Explore Directory
                </Link>
                <Link href="/blog" className="nav-link">
                  Blog
                </Link>
                <Link href="/submit" className="nav-link">
                  Submit a Tool
                </Link>
              </div>
            </footer>
          </div>
        </AppProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
