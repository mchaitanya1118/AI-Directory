"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const links = [
    { href: "/category/all", label: "Tools" },
    { href: "/agents", label: "Agents" },
    { href: "/mcp", label: "MCP Servers" },
    { href: "/prompts", label: "Prompts" },
    { href: "/workflows", label: "Workflows" },
    { href: "/academy", label: "Academy" },
    { href: "/news", label: "News" },
    { href: "/consultant", label: "AI Consultant ⚡" },
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
    <header className={styles['app-header']}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', maxWidth: '1200px', padding: '0 1rem', margin: '0 auto' }}>
        
        {/* 1. Left Logo */}
        <Link href="/" className={styles['logo-container']} style={{ flexShrink: 0, gap: '0.5rem' }}>
          <div className={styles['logo-glow']}>
            <span>A</span>
          </div>
          <h1 className={styles['brand-name']} style={{ display: 'none' }}>AuraAI</h1>
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav className="desktop-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles['nav-link']} ${isActive ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Header Action Controls (Search, Auth, CTA, Mobile Toggle) */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Search Wrapper */}
          <div className="header-search-container" ref={dropdownRef} style={{ position: 'relative' }}>
            <div className="search-wrapper" style={{ margin: 0, width: '140px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', border: 'none', transition: 'width 0.25s' }}>
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

          {/* User / Auth dropdown section */}
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
                  border: '1px solid rgba(255,255,255,0.1)',
                  flexShrink: 0
                }}>
                  {session.user.username ? session.user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="header-username" style={{ color: '#f5f5f7', fontWeight: '500' }}>{session.user.username || 'Account'}</span>
                <span style={{ fontSize: '0.55rem', color: '#86868b', transition: 'transform 0.2s', transform: showProfileDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
              </button>

              {showProfileDropdown && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '160%',
                    right: 0,
                    width: '220px',
                    padding: '0.75rem',
                    zIndex: 1000,
                    background: 'rgba(20, 20, 25, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    backdropFilter: 'blur(20px)',
                    textAlign: 'left'
                  }}
                >
                  {/* User Info Header Section */}
                  <div style={{ padding: '0.25rem 0.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.6rem', marginBottom: '0.2rem' }}>
                    <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.8rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {session.user.username || 'User Account'}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.7rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '0.1rem' }}>
                      {session.user.email}
                    </div>
                    {session.user.role === "ADMIN" && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        background: 'rgba(255, 59, 48, 0.15)',
                        color: '#ff453a',
                        border: '1px solid rgba(255, 59, 48, 0.3)',
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
                        color: isAdminActive ? '#ff453a' : 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        fontWeight: isAdminActive ? '600' : '400',
                        background: isAdminActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                      }}
                      className="profile-dropdown-item"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Admin Console
                    </Link>
                  )}

                  <Link 
                    href="/profile" 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: isProfileActive ? '#0071e3' : 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontWeight: isProfileActive ? '600' : '400',
                      background: isProfileActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent'
                    }}
                    className="profile-dropdown-item"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                  </Link>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '0.2rem', paddingTop: '0.3rem' }}>
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
                        color: '#ff453a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        fontWeight: '600'
                      }}
                      className="profile-dropdown-item-signout"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : status !== "loading" ? (
            <Link 
              href="/login" 
              className={`${styles['nav-link']} ${isLoginActive ? styles.active : ""}`}
              style={{ 
                fontWeight: isLoginActive ? '600' : '400',
                padding: '0.25rem 0.5rem'
              }}
            >
              Sign In
            </Link>
          ) : null}

          {/* Submit CTA Button (Desktop-only via css class) */}
          <Link href="/submit" className={`${styles['cta-btn']} header-submit-btn`}>
            Submit AI
          </Link>

          {/* Premium Mobile Menu Drawer Toggle Button */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'none', // Managed in media queries
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.2s',
              zIndex: 1001,
              flexShrink: 0
            }}
          >
            <div className="hamburger-icon" style={{ width: '16px', height: '12px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <span className="hamburger-line top" style={{
                display: 'block',
                width: '100%',
                height: '2px',
                background: '#f5f5f7',
                borderRadius: '2px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(3.5px, 3.5px)' : 'none'
              }}></span>
              <span className="hamburger-line middle" style={{
                display: 'block',
                width: '100%',
                height: '2px',
                background: '#f5f5f7',
                borderRadius: '2px',
                transition: 'opacity 0.15s ease',
                opacity: mobileMenuOpen ? 0 : 1
              }}></span>
              <span className="hamburger-line bottom" style={{
                display: 'block',
                width: '100%',
                height: '2px',
                background: '#f5f5f7',
                borderRadius: '2px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(3.5px, -3.5px)' : 'none'
              }}></span>
            </div>
          </button>
        </div>

        {/* Dynamic & Hover Styles */}
        <style jsx global>{`
          .profile-dropdown-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            color: #ffffff !important;
          }
          .profile-dropdown-item:hover svg {
            opacity: 1 !important;
          }
          .profile-dropdown-item-signout:hover {
            background: rgba(255, 59, 48, 0.12) !important;
            color: #ff453a !important;
          }

          /* --- MOBILE RESPONSIVE TOPNAV MEDIA RULES --- */
          @media (max-width: 968px) {
            .desktop-links {
              display: none !important;
            }
            .header-submit-btn {
              display: none !important;
            }
            .mobile-menu-toggle {
              display: flex !important;
            }
            .header-username {
              display: none !important;
            }
            .header-search-container {
              max-width: 110px;
            }
            .search-wrapper {
              width: 110px !important;
            }
          }

          @media (max-width: 480px) {
            .header-search-container {
              max-width: 90px;
            }
            .search-wrapper {
              width: 90px !important;
            }
            header.app-header {
              padding: 0 1rem;
            }
          }

          /* Drawer Slide down Animation */
          @keyframes slideDownDrawer {
            0% {
              opacity: 0;
              transform: translateY(-15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>

      {/* 4. Sliding Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-drawer"
          style={{
            position: 'fixed',
            top: '48px',
            left: 0,
            width: '100vw',
            height: 'calc(100vh - 48px)',
            background: 'rgba(10, 10, 15, 0.98)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            gap: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            overflowY: 'auto',
            animation: 'slideDownDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Scrollable Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? 'var(--neon-cyan)' : '#f5f5f7',
                    padding: '0.75rem 0.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textDecoration: 'none'
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && <span style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)' }}>●</span>}
                </Link>
              );
            })}
          </div>

          {/* Quick-Submit CTA inside drawer */}
          <Link 
            href="/submit" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--gradient-main)',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(0, 113, 227, 0.3)',
              transition: 'transform 0.2s'
            }}
          >
            Submit AI Tool
          </Link>
        </div>
      )}
    </header>
  );
}
