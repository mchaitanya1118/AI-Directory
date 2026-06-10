"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import styles from "./CompareTray.module.css";

export default function CompareTray() {
  const { tools, comparedTools, toggleCompare, clearCompare, isMounted } = useApp();
  const router = useRouter();

  // Hydration safety: do not render floating tray until client mounts
  if (!isMounted || comparedTools.length === 0) {
    return null;
  }

  const comparedObjs = comparedTools
    .map((id) => tools.find((t) => t.id === id))
    .filter(Boolean);

  const handleCompareSubmit = () => {
    if (comparedTools.length < 2) {
      alert("Please select at least 2 tools to compare.");
      return;
    }
    router.push("/compare");
  };

  return (
    <div className={`${styles['compare-tray']} ${styles.active}`} id="floating-compare-tray">
      <div className={styles['compare-tray-left']}>
        <h4 className={styles['compare-title-h4']}>Compare AI Tools</h4>
        <div className={styles['compare-slots']}>
          {[0, 1, 2].map((i) => {
            if (i < comparedObjs.length) {
              const tool = comparedObjs[i];
              return (
                <div key={tool.id} className={`${styles['compare-slot']} ${styles.filled}`}>
                  <span>{tool.name}</span>
                  <span
                    className={styles['slot-remove-btn']}
                    onClick={() => toggleCompare(tool.id)}
                  >
                    &times;
                  </span>
                </div>
              );
            }
            return (
              <div key={i} className={styles['compare-slot']}>
                Empty Slot
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles['compare-tray-actions']}>
        <button className={styles['btn-secondary']} onClick={clearCompare}>
          Clear All
        </button>
        <button
          className={styles['cta-btn']}
          style={{ boxShadow: "0 4px 10px rgba(0, 242, 254, 0.2)" }}
          onClick={handleCompareSubmit}
        >
          Compare Now
        </button>
      </div>
    </div>
  );
}
