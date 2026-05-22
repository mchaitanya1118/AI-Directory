"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dropdownRef = useRef(null);

  const links = [
    { href: "/", label: "Home" },
    { href: "/category/all", label: "All Tools" },
    { href: "/category/coding", label: "Coding" },
    { href: "/category/image", label: "Design" },
    { href: "/category/video", label: "Video" },
    { href: "/category/productivity", label: "Productivity" },
    { href: "/blog", label: "Blog" },
    { href: "/quiz", label: "AI Finder ⚡" },
    { href: "/prompts", label: "Prompts" },
    { href: "/workflows", label: "Workflows" },
  ];

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="app-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* 1. Left Logo */}
        <Link href="/" className="logo-container" style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          <img 
            src="/logo.png" 
            alt="AI Tools Hub" 
            style={{ 
              height: "28px", 
              width: "auto", 
              objectFit: "contain",
              filter: "invert(1) hue-rotate(180deg)",
              mixBlendMode: "lighten"
            }} 
          />
        </Link>

        {/* 2. Navigation Links */}
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}

        {/* 3. Search */}
        <div className="header-search-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <div className="search-wrapper" style={{ margin: 0, width: '140px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', border: 'none' }}>
            <svg
              className="search-icon-svg"
              style={{ position: 'absolute', left: '0.75rem', width: '0.9rem', height: '0.9rem', color: '#f5f5f7' }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              className="search-input"
              suppressHydrationWarning
              style={{ 
                padding: '0.35rem 0.5rem 0.35rem 2.25rem', 
                fontSize: '0.75rem', 
                background: 'transparent',
                color: '#ffffff',
                border: 'none',
                width: '100%',
                boxShadow: 'none',
                borderRadius: '0'
              }}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowDropdown(true);
              }}
              onKeyDown={handleSearchSubmit}
            />
          </div>

          {/* Live Search Dropdown */}
          {showDropdown && (searchQuery.trim().length > 0) && (
            <div 
              className="detail-glass-card search-dropdown" 
              style={{ 
                position: 'absolute', 
                top: '150%', 
                right: 0, 
                width: '300px', 
                padding: '0.5rem',
                zIndex: 1000,
                maxHeight: '400px',
                overflowY: 'auto',
                background: 'rgba(20,20,20,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                borderRadius: '12px'
              }}
            >
              {isSearching ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#86868b', fontSize: '0.75rem' }}>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {searchResults.map((t) => (
                    <Link 
                      href={`/tool/${t.id}`} 
                      key={t.id}
                      onClick={() => setShowDropdown(false)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        padding: '0.5rem',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        transition: 'background 0.2s'
                      }}
                      className="search-dropdown-item"
                    >
                      <div 
                        style={{ width: '20px', height: '20px', flexShrink: 0 }}
                        dangerouslySetInnerHTML={{ __html: t.logo }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ color: '#f5f5f7', fontSize: '0.8rem', fontWeight: '500', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {t.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div 
                    style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#0071e3', cursor: 'pointer' }}
                    onClick={() => {
                      setShowDropdown(false);
                      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                  >
                    View all results &rarr;
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#86868b', fontSize: '0.75rem' }}>
                  No tools found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Auth & Admin */}
        {status !== "loading" && session && session.user?.role === "ADMIN" && (
          <Link href="/admin" className="nav-link" style={{ color: '#ff4d4d' }}>
            Admin
          </Link>
        )}
        
        {status !== "loading" && session ? (
          <Link href="/profile" className="nav-link">
            Profile
          </Link>
        ) : status !== "loading" ? (
          <Link href="/login" className="nav-link">
            Sign In
          </Link>
        ) : null}

        {/* 5. Submit Button */}
        <Link href="/submit" className="cta-btn">
          Submit AI
        </Link>
      </div>
    </header>
  );
}
