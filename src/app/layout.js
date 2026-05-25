import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import CompareTray from "@/components/CompareTray";
import Header from "@/components/Header";
import Link from "next/link";
import Script from "next/script";
import AffiliateBanner from "@/components/AffiliateBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  metadataBase: new URL("https://ai.neqtra.com"),
  title: {
    default: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
    template: "%s | AuraAI",
  },
  description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
  openGraph: {
    title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
    description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
    url: "https://ai.neqtra.com/",
    siteName: "AuraAI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AuraAI Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
    description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Google AdSense Script - Optimized to lazyOnload */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9876543210123456" 
          strategy="lazyOnload" 
          crossOrigin="anonymous" 
        />
        <NextAuthProvider>
          <AppProvider>
            <div className="app-container">
              
              {/* PREMIUM FLOATING NAVIGATION HEADER */}
              <Header />

            {/* DYNAMIC CHILD PAGES */}
            <main id="app-main-content">
              {/* STATEFUL DISMISSIBLE AFFILIATE BANNER */}
              <AffiliateBanner />

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a
                      href="https://cursor.com/?via=aitoolsdir"
                      target="_blank"
                      rel="nofollow sponsored"
                      className="ad-badge-button"
                    >
                      Get Started For Free
                    </a>
                    <span className="affiliate-badge">Affiliate</span>
                  </div>
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
