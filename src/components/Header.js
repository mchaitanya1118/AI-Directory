"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const isAdminActive = pathname?.startsWith("/admin");
  const isProfileActive = pathname === "/profile";
  const isLoginActive = pathname === "/login";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

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

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
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
        <Link href="/" className="logo-container" style={{ flexShrink: 0, gap: '0.5rem' }}>
          <div className="logo-glow">
            <span>A</span>
          </div>
          <h1 className="brand-name" style={{ display: 'none' }}>AuraAI</h1>
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

        {/* 4. Auth, Profile Dropdown, & Sign Out */}
        {status !== "loading" && session ? (
          <div style={{ position: 'relative' }} ref={profileDropdownRef}>
            <button 
              onClick={() => setShowProfileDropdown(prev => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#f5f5f7',
                fontSize: '0.75rem',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '20px',
                transition: 'all 0.2s',
                opacity: 0.9
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
            >
              {/* Glowing Avatar */}
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'var(--gradient-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                boxShadow: '0 0 10px rgba(0, 113, 227, 0.4)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {session.user.username ? session.user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ color: '#f5f5f7', fontWeight: '500' }}>{session.user.username || 'Account'}</span>
              <span style={{ fontSize: '0.55rem', color: '#86868b', transition: 'transform 0.2s', transform: showProfileDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
            </button>

            {showProfileDropdown && (
              <div 
                className="detail-glass-card" 
                style={{
                  position: 'absolute',
                  top: '160%',
                  right: 0,
                  width: '220px',
                  padding: '0.75rem',
                  zIndex: 1000,
                  background: 'rgba(10, 10, 15, 0.96)',
                  border: '1px solid var(--border-glass)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  backdropFilter: 'blur(20px)',
                  textAlign: 'left'
                }}
              >
                {/* User Info Header Section */}
                <div style={{ padding: '0.25rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem', marginBottom: '0.2rem' }}>
                  <div style={{ color: 'var(--text-bright)', fontWeight: '600', fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {session.user.username || 'User Account'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '0.1rem' }}>
                    {session.user.email}
                  </div>
                  {session.user.role === "ADMIN" && (
                    <span style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      background: 'rgba(255, 59, 48, 0.1)',
                      color: 'var(--neon-rose)',
                      border: '1px solid rgba(255, 59, 48, 0.2)',
                      marginTop: '0.4rem'
                    }}>
                      ⚡ Administrator
                    </span>
                  )}
                </div>

                {/* Navigation Links */}
                {session.user.role === "ADMIN" && (
                  <Link 
                    href="/admin" 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: isAdminActive ? 'var(--neon-rose)' : 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontWeight: isAdminActive ? '600' : '400',
                      background: isAdminActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                      textShadow: isAdminActive ? '0 0 10px var(--neon-rose-glow)' : 'none'
                    }}
                    className="profile-dropdown-item"
                  >
                    <span>🛡️</span> Admin Console
                  </Link>
                )}

                <Link 
                  href="/profile" 
                  onClick={() => setShowProfileDropdown(false)}
                  style={{
                    padding: '0.4rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: isProfileActive ? 'var(--neon-cyan)' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    fontWeight: isProfileActive ? '600' : '400',
                    background: isProfileActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                  }}
                  className="profile-dropdown-item"
                >
                  <span>👤</span> My Profile
                </Link>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '0.2rem', paddingTop: '0.3rem' }}>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#ff4d4d',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontWeight: '600'
                    }}
                    className="profile-dropdown-item-signout"
                  >
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : status !== "loading" ? (
          <Link 
            href="/login" 
            className={`nav-link ${isLoginActive ? "active" : ""}`}
            style={{ 
              fontWeight: isLoginActive ? '600' : '400'
            }}
          >
            Sign In
          </Link>
        ) : null}

        {/* Custom Header Dropdown hover transitions injected locally */}
        <style jsx global>{`
          .profile-dropdown-item:hover {
            background: rgba(255, 255, 255, 0.06) !important;
            color: var(--text-bright) !important;
          }
          .profile-dropdown-item-signout:hover {
            background: rgba(255, 59, 48, 0.08) !important;
            color: #ff3b30 !important;
          }
        `}</style>

        {/* 5. Submit Button */}
        <Link href="/submit" className="cta-btn">
          Submit AI
        </Link>
      </div>
    </header>
  );
}
