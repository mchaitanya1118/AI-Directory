"use client";

import { useEffect } from "react";

export default function AdSenseScript() {
  useEffect(() => {
    // Delay loading the AdSense script until browser is idle and interactive
    const loadScript = () => {
      if (document.querySelector('script[src*="adsbygoogle.js"]')) {
        return; // Already loaded
      }
      const script = document.createElement("script");
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9876543210123456";
      script.async = true;
      script.crossOrigin = "anonymous";
      document.body.appendChild(script);
    };

    let idleId;
    const delayLoad = () => {
      if (window.requestIdleCallback) {
        idleId = window.requestIdleCallback(() => {
          setTimeout(loadScript, 2000);
        });
      } else {
        setTimeout(loadScript, 3000);
      }
    };

    if (document.readyState === "complete") {
      delayLoad();
    } else {
      window.addEventListener("load", delayLoad, { once: true });
    }

    return () => {
      if (idleId && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return null;
}
