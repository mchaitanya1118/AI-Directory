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
    setIsMounted(true);
    let localTools = null;
    try {
      const savedTools = localStorage.getItem("aura_next_tools");
      if (savedTools) {
        localTools = JSON.parse(savedTools);
        setTools(localTools);
      }
      
      const savedCompared = localStorage.getItem("aura_next_compared");
      if (savedCompared) {
        setComparedTools(JSON.parse(savedCompared));
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }

    // Dynamic Live Sync from Scraped database
    const syncWithServer = async () => {
      try {
        const response = await fetch("/api/tools");
        if (response.ok) {
          const serverTools = await response.json();
          setTools((prevTools) => {
            // Map serverTools and merge any local-only metadata (like user reviews)
            const merged = serverTools.map((sTool) => {
              const localTool = prevTools.find((p) => p.id === sTool.id);
              if (localTool) {
                return {
                  ...sTool,
                  // Keep user-created local reviews and rating averages
                  reviews: localTool.reviews || sTool.reviews,
                  rating: localTool.rating || sTool.rating,
                  userRatingCount: localTool.userRatingCount || sTool.userRatingCount,
                };
              }
              return sTool;
            });

            // Keep custom-submitted tools that do not exist on the server database
            const serverIds = new Set(serverTools.map((s) => s.id));
            const localOnly = prevTools.filter((p) => !serverIds.has(p.id));

            const finalTools = [...merged, ...localOnly];
            
            // Persist the synced data safely
            try {
              localStorage.setItem("aura_next_tools", JSON.stringify(finalTools));
            } catch (_) {}
            
            return finalTools;
          });
        }
      } catch (err) {
        console.warn("Failed to synchronize catalog with live scraper server data:", err);
      }
    };

    syncWithServer();
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
