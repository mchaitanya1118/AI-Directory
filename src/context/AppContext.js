"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { INITIAL_TOOLS } from "@/data/data";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tools, setTools] = useState(INITIAL_TOOLS);
  const [comparedTools, setComparedTools] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration safety: only read from localStorage on client mount & sync from server
  useEffect(() => {
    let active = true;
    let deferTimer = null;

    const initLocalStorage = () => {
      if (!active) return;
      let localTools = null;
      let localCompared = null;
      try {
        const savedTools = localStorage.getItem("aura_next_tools");
        if (savedTools) {
          localTools = JSON.parse(savedTools);
        }
        
        const savedCompared = localStorage.getItem("aura_next_compared");
        if (savedCompared) {
          localCompared = JSON.parse(savedCompared);
        }
      } catch (e) {
        console.error("Failed to load local storage state:", e);
      }

      // Mark the state updates as transitions so React yields to browser paints/interactions
      React.startTransition(() => {
        if (localTools) {
          setTools(localTools);
        }
        if (localCompared) {
          setComparedTools(localCompared);
        }
        setIsMounted(true);
      });

      // Defer server sync to run 2.5 seconds later (after Time to Interactive has fully finished)
      deferTimer = setTimeout(() => {
        const syncWithServer = async () => {
          if (!active) return;
          try {
            const response = await fetch("/api/tools");
            if (response.ok) {
              const serverTools = await response.json();
              if (!active) return;

              React.startTransition(() => {
                setTools((prevTools) => {
                  const activeTools = localTools || prevTools;
                  const merged = serverTools.map((sTool) => {
                    const localTool = activeTools.find((p) => p.id === sTool.id);
                    if (localTool) {
                      return {
                        ...sTool,
                        reviews: localTool.reviews || sTool.reviews,
                        rating: localTool.rating || sTool.rating,
                        userRatingCount: localTool.userRatingCount || sTool.userRatingCount,
                      };
                    }
                    return sTool;
                  });

                  const serverIds = new Set(serverTools.map((s) => s.id));
                  const localOnly = activeTools.filter((p) => !serverIds.has(p.id));
                  const finalTools = [...merged, ...localOnly];
                  
                  try {
                    localStorage.setItem("aura_next_tools", JSON.stringify(finalTools));
                  } catch (_) {}
                  
                  return finalTools;
                });
              });
            }
          } catch (err) {
            console.warn("Failed to synchronize catalog with live scraper server data:", err);
          }
        };

        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => syncWithServer());
        } else {
          syncWithServer();
        }
      }, 2500);
    };

    // Initialize after the initial mount, utilizing idle callbacks if available
    let idleId = null;
    if (window.requestIdleCallback) {
      idleId = window.requestIdleCallback(() => initLocalStorage());
    } else {
      idleId = setTimeout(initLocalStorage, 150);
    }

    return () => {
      active = false;
      if (deferTimer) clearTimeout(deferTimer);
      if (window.requestIdleCallback && idleId) {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      } else if (idleId) {
        clearTimeout(idleId);
      }
    };
  }, []);

  // Save state helpers
  const saveTools = (newTools) => {
    setTools(newTools);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aura_next_tools", JSON.stringify(newTools));
      } catch (e) {}
    }
  };

  const saveCompared = (newCompared) => {
    setComparedTools(newCompared);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aura_next_compared", JSON.stringify(newCompared));
      } catch (e) {}
    }
  };

  // State actions
  const toggleCompare = (toolId) => {
    const index = comparedTools.indexOf(toolId);
    if (index > -1) {
      const copy = [...comparedTools];
      copy.splice(index, 1);
      saveCompared(copy);
    } else {
      if (comparedTools.length >= 3) {
        alert("You can compare a maximum of 3 tools simultaneously. Remove a tool to add another.");
        return;
      }
      saveCompared([...comparedTools, toolId]);
    }
  };

  const clearCompare = () => {
    saveCompared([]);
  };

  const startComparison = (toolId1, toolId2) => {
    saveCompared([toolId1, toolId2]);
  };

  const addReview = (toolId, reviewObj) => {
    const updatedTools = tools.map((t) => {
      if (t.id === toolId) {
        const copyReviews = t.reviews ? [...t.reviews] : [];
        return {
          ...t,
          reviews: [...copyReviews, reviewObj],
        };
      }
      return t;
    });
    saveTools(updatedTools);
  };

  const submitTool = async (toolObj) => {
    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: toolObj.name,
          category: toolObj.category,
          pricing: toolObj.pricing,
          website: toolObj.website || toolObj.url,
          shortDescription: toolObj.shortDescription || toolObj.shortPitch,
          description: toolObj.description,
          features: toolObj.features,
          sponsored: toolObj.sponsored,
          logo: toolObj.logo,
          pricingDetails: toolObj.pricingDetails,
          pros: toolObj.pros,
          cons: toolObj.cons,
          specs: toolObj.specs,
          tags: toolObj.tags,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.tool) {
          const formattedTool = {
            ...data.tool,
            features: typeof data.tool.features === 'string' ? JSON.parse(data.tool.features) : (data.tool.features || []),
            pros: typeof data.tool.pros === 'string' ? JSON.parse(data.tool.pros) : (data.tool.pros || []),
            cons: typeof data.tool.cons === 'string' ? JSON.parse(data.tool.cons) : (data.tool.cons || []),
            specs: typeof data.tool.specs === 'string' ? JSON.parse(data.tool.specs) : (data.tool.specs || {}),
            category: data.tool.categoryId,
            tags: toolObj.tags || ["New Listing", toolObj.pricing]
          };
          saveTools([...tools, formattedTool]);
          return formattedTool;
        }
      }
    } catch (error) {
      console.error("Error submitting tool to database, falling back to client-only cache:", error);
    }
    // Fallback: save locally
    saveTools([...tools, toolObj]);
    return toolObj;
  };

  return (
    <AppContext.Provider
      value={{
        tools,
        comparedTools: isMounted ? comparedTools : [],
        isMounted,
        toggleCompare,
        clearCompare,
        startComparison,
        addReview,
        submitTool,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
