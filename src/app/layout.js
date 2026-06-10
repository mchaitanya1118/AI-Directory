import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import { Inter } from "next/font/google";
import AdPlacement from "@/components/AdPlacement";
import AdSenseScript from "@/components/AdSenseScript";

const InterFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const Header = dynamicImport(() => import("@/components/Header"), { ssr: true });
const AffiliateBanner = dynamicImport(() => import("@/components/AffiliateBanner"), { ssr: true });
const CompareTray = dynamicImport(() => import("@/components/CompareTray"), { ssr: true });

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
    description: "Discover, compare, and read verified reviews for the best AI tools.",
    url: "https://ai.neqtra.com",
    siteName: "AuraAI",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "AuraAI Directory" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
    description: "Discover the best AI tools for your workflow.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://ai.neqtra.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={InterFont.variable}>
      <body>

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
              <AdPlacement type="top-banner" />

              {children}
            </main>

            {/* MOCK ADSENSE BANNER BOTTOM */}
            <AdPlacement type="bottom-banner" />

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
        {/* Google AdSense Script - Deferred dynamically via idle callbacks */}
        <AdSenseScript />
      </body>
    </html>
  );
}
