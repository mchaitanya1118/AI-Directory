"use client";

import React, { useState, useEffect } from "react";
import styles from "./AffiliateBanner.module.css";

export default function AffiliateBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem("auraai-affiliate-banner-dismissed");
    if (isDismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("auraai-affiliate-banner-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem("auraai-affiliate-banner-dismissed") === "true") {
                document.documentElement.setAttribute("data-banner-dismissed", "true");
              }
            } catch (e) {}
          `,
        }}
      />
      <div className={styles['affiliate-disclosure-banner']}>
        <div className={styles['banner-content']}>
          <span className={styles['banner-icon']}>ℹ️</span>
          <p className={styles['banner-text']}>
            <strong>Affiliate Disclosure:</strong> Some links on AuraAI are affiliate links. If you click through and make a purchase, we may receive a commission at no extra cost to you. This helps support our independent comparison engine.
          </p>
          <button className={styles['banner-close-btn']} onClick={handleDismiss} aria-label="Close disclosure">
            &times;
          </button>
        </div>
      </div>
    </>
  );
}
