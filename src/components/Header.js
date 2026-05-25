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
    { href: "/", label: "Home" },
    { href: "/category/all", label: "Categories" },
    { href: "/reviews", label: "Reviews" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%', maxWidth: '1200px', padding: '0 1rem', margin: '0 auto' }}>
        
        {/* 1. Left Logo */}
        <Link href="/" className="logo-container" style={{ flexShrink: 0, gap: '0.75rem', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#paint0_linear_logo)" />
            <defs>
              <linearGradient id="paint0_linear_logo" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6C63FF" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Aitool Hub</span>
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav className="desktop-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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
        </nav>

        {/* 3. Header Action Controls (Sign In, Get Started) */}
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
          <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" style={{ 
            background: 'var(--gradient-main)', 
            color: '#fff', 
            padding: '0.5rem 1.25rem', 
            borderRadius: '8px', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(108, 99, 255, 0.25)'
          }}>
            Get Started
          </Link>

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
              className={`nav-link ${isLoginActive ? "active" : ""}`}
              style={{ 
                fontWeight: isLoginActive ? '600' : '400',
                padding: '0.25rem 0.5rem'
              }}
            >
              Sign In
            </Link>
          ) : null}

          {/* Submit CTA Button (Desktop-only via css class) */}
          <Link href="/submit" className="cta-btn header-submit-btn">
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
