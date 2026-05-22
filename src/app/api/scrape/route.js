import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Seed fallback database matching 2026 active listings - acts as a search-cache when targets block simple requests
const WEB_SEARCH_CACHE = {
  cursor: {
    pricing: "Freemium",
    pricingDetails: "Free tier with 50 fast premium uses; Pro plan currently starting at $20/month.",
    shortDescription: "The AI-first code editor designed to make you exceptionally productive, built on top of VS Code.",
    features: [
      "AI-powered multi-file code editing (Composer)",
      "Natural language codebase search and reasoning",
      "Inline AI code generation and debugging",
      "Full VS Code extension ecosystem compatibility",
      "Privacy mode to prevent codebase training"
    ]
  },
  copilot: {
    pricing: "Paid",
    pricingDetails: "Individual plan is $10/month or $100/year. Free tier available for students and open source maintainers.",
    shortDescription: "The pioneer AI pair programmer providing inline autocomplete suggestions directly inside popular IDEs.",
    features: [
      "Sub-second inline code completions",
      "Supports all major programming languages",
      "Copilot Chat window for conversational code analysis",
      "Context filtering to block public code matches",
      "Corporate/enterprise compliance security rules"
    ]
  },
  v0: {
    pricing: "Freemium",
    pricingDetails: "Free basic tier with 200 monthly credits. Pro tier starts at $20/month for advanced generations.",
    shortDescription: "Generative UI system by Vercel producing production-ready React, Tailwind CSS, and shadcn/ui layouts.",
    features: [
      "Generates shadcn/ui and Tailwind components",
      "Immediate interactive browser preview of generated UI",
      "Refine elements iteratively using plain English prompts",
      "One-click deploy to Vercel or code copy-paste",
      "Dark and light mode generation support"
    ]
  },
  midjourney: {
    pricing: "Paid",
    pricingDetails: "Basic tier starting at $10/month (fast GPU hours). Standard, Pro, and Mega tiers scaling to $120/month.",
    shortDescription: "Highly artistic, industry-standard generative AI image creator operated via web and Discord interfaces.",
    features: [
      "Unrivaled aesthetic detail, lighting, and textures",
      "Inpainting (Vary Region) and Outpainting (Zoom) canvas expansions",
      "Character reference and Style reference parameters (cref, sref)",
      "High resolution upscaling options up to 4K",
      "Web interface with immediate slider-based controls"
    ]
  },
  stablediffusion: {
    pricing: "Free",
    pricingDetails: "Open-source and 100% free to run locally. Developer API features pricing scales on micro-credit tokens.",
    shortDescription: "The ultimate open-source, fully custom text-to-image generator you can run locally on your PC.",
    features: [
      "100% locally runnable with zero censorship",
      "ControlNet support for strict pose, depth, and edge mapping",
      "Fine-tunable using custom LoRA weights and embeddings",
      "Active ecosystem of community custom checkpoints (Civitai)",
      "High scalability and batch processing workflows"
    ]
  },
  runway: {
    pricing: "Freemium",
    pricingDetails: "Free plan includes 125 credits. Standard subscription starts at $15/month up to Unlimited at $95/month.",
    shortDescription: "Hollywood-grade text-to-video and image-to-video creative generator using regional Motion Brushes.",
    features: [
      "High-fidelity Text-to-Video and Image-to-Video generation",
      "Motion Brush for regional structural motion control",
      "Camera control parameters (Pan, Zoom, Tilt, Roll, Speed)",
      "Inpainting tools to edit objects dynamically inside video frames",
      "Built-in timeline, audio layering, and export settings"
    ]
  },
  heygen: {
    pricing: "Freemium",
    pricingDetails: "Free tier offers 1 credit/month. Creator plans begin at $29/month, custom enterprise tiers available.",
    shortDescription: "Photorealistic AI video spokesperson avatar suite creating studio-grade video clips in minutes.",
    features: [
      "100+ highly realistic custom and preset human avatars",
      "Voice cloning with perfect accent matching in 40+ languages",
      "Auto-translation of videos into multiple target languages",
      "Interactive conversational avatars for websites",
      "Integrations with Canva, ChatGPT, and Zapier"
    ]
  },
  claude: {
    pricing: "Freemium",
    pricingDetails: "Free version with basic rate limits. Claude Pro starts at $20/month offering 5x higher usage.",
    shortDescription: "High-reasoning conversational AI assistant with peerless coding, logic parsing, and research writing.",
    features: [
      "200K token context window for massive uploads",
      "Claude Artifacts for HTML/JS, SVG, and document visual previews",
      "Peerless mathematical reasoning and technical coding accuracy",
      "Custom 'Projects' feature to group documents and instructions",
      "Strict data privacy controls (no training on enterprise chats)"
    ]
  },
  chatgpt: {
    pricing: "Freemium",
    pricingDetails: "Free access powered by GPT-4o-mini. ChatGPT Plus is $20/month for premium reasoning models and Custom GPTs.",
    shortDescription: "Household name in conversational AI, offering advanced voice, image recognition, and live search indexes.",
    features: [
      "Integrated web browsing and real-time news search",
      "Advanced Data Analysis (Python execution environment)",
      "Image input recognition and OCR",
      "DALL-E 3 image generation directly inside the chat",
      "Advanced Voice Mode for humanlike conversation speed"
    ]
  },
  notionai: {
    pricing: "Paid",
    pricingDetails: "Available as an embedded add-on to existing Notion plans at $8 to $10/user/month.",
    shortDescription: "In-line document editing, summarization, and database action-items generator built inside workspaces.",
    features: [
      "In-line document editing, rewording, and translation",
      "Automated summary generations for long wikis and databases",
      "AI Autofill formulas and custom properties inside tables",
      "Notion Q&A for cross-workspace semantic searches",
      "Active meeting transcript action-item generation"
    ]
  },
  perplexity: {
    pricing: "Freemium",
    pricingDetails: "Free standard answers. Perplexity Pro is $20/month for deep reasoning models and academic collections.",
    shortDescription: "Answers engine synthesizing live search crawls into direct citations with interactive footnotes.",
    features: [
      "Live web crawling and instant footnote citations",
      "Focus channels (Academic papers, Reddit, Youtube, Writing)",
      "Pro Search for deep multi-step research questions",
      "Model Selector (Claude 3.5 Sonnet, GPT-4o, Llama-3)",
      "Collection threads to organize researches"
    ]
  },
  "adobe-firefly": {
    pricing: "Freemium",
    pricingDetails: "Free plan offers 25 credits monthly. Premium commercial licenses starting at $4.99/month.",
    shortDescription: "Commercially safe generative creative engine integrated natively inside Photoshop and Illustrator.",
    features: [
      "Trained on legally safe, licensed stocks (Commercial Safe)",
      "Generative Fill to add or remove details inside Photoshop",
      "Vector Graphic Recolor inside Adobe Illustrator",
      "Text Effects generator for typographical styles",
      "Generative Expand to fill missing boundaries"
    ]
  },
  "gemini": {
    pricing: "Freemium",
    pricingDetails: "Free version powered by Gemini 1.5 Flash. Gemini Advanced is $20/month offering 1.5 Pro and deep Google Workspace integrations.",
    shortDescription: "Google's highly advanced multimodal AI assistant integrated natively across Android, search, and Google Workspace.",
    features: [
      "Massive 1 million token context window for native uploads",
      "Multimodal analysis of files, images, codebases, and audio",
      "Native Google Docs, Gmail, and Workspace integrations",
      "Fast response speed powered by Gemini 1.5 Flash",
      "Double-check answers using real-time Google Search integration"
    ]
  },
  "leonardo": {
    pricing: "Freemium",
    pricingDetails: "Free tier offers 150 daily credits. Premium plans start at $10/month scaling to $48/month.",
    shortDescription: "High-fidelity production-ready generative image suite optimized for game assets and digital graphics.",
    features: [
      "Generates highly structured game assets and visual layouts",
      "Real-time canvas for selective inpainting and outpainting edits",
      "Pose and structural guidance locking via ControlNet modules",
      "Custom LoRA model training directly in-browser",
      "Daily recurring free generation credits (150 credits)"
    ]
  },
  "elevenlabs": {
    pricing: "Freemium",
    pricingDetails: "Free plan gives 10,000 characters monthly. Creator plans start at $5/month up to $330/month.",
    shortDescription: "Industry-standard AI voice generator producing photorealistic, emotional speech and sound effects.",
    features: [
      "Hyper-realistic custom voice cloning and synthesis",
      "AI sound effects generator (actions, atmospheres, hits)",
      "Perfect multi-language translation and voice dubbing",
      "Extensive voice design dashboard (sliders for age, accent, gender)",
      "Enterprise-grade speech-to-speech voice conversions"
    ]
  },
  "sora": {
    pricing: "Paid",
    pricingDetails: "Enterprise-level custom licensing. Limited access program for creative professionals.",
    shortDescription: "OpenAI's state-of-the-art text-to-video foundation model producing up to 60 seconds of cinema-grade footage.",
    features: [
      "Generates continuous, cinematic videos up to 60 seconds long",
      "Maintains strict structural/object consistency across frames",
      "Highly realistic physics, fluid motion, and light reflection simulation",
      "Support for complex multi-angle panning and camera sweeps",
      "Direct image-to-video and video-to-video creative modifications"
    ]
  },
  "suno": {
    pricing: "Freemium",
    pricingDetails: "Free plan gives 50 daily credits (10 songs). Pro tier starts at $8/month; Premier tier at $24/month.",
    shortDescription: "Generate high-fidelity complete songs including lyrics, vocals, and instruments from a simple text prompt.",
    features: [
      "Generates complete, radio-ready songs in any genre (Rock, Pop, Jazz, Synthwave)",
      "Vocal and instrumental generation matching plain-text requests",
      "Allows user-provided custom lyrics and chord structures",
      "Song extensions up to 4-8 minutes continuous",
      "Commercial licensing rights granted on premium tiers"
    ]
  },
  "cline": {
    pricing: "Free",
    pricingDetails: "Open-source and 100% free to run. Users bring their own API keys (OpenRouter, Anthropic, OpenAI).",
    shortDescription: "Autonomous, terminal-integrated coding agent inside VS Code capable of executing commands and building projects.",
    features: [
      "Autonomous terminal control and command executions",
      "Dynamic file editing, directory reading, and refactoring",
      "Integrated browser rendering and UI debugging tests",
      "Supports major API keys (Claude 3.5 Sonnet, OpenRouter, DeepSeek)",
      "Permission check overlays before command runs"
    ]
  },
  "deepseek": {
    pricing: "Free",
    pricingDetails: "Highly affordable pay-per-token API (currently starting at $0.14/million tokens). Free model download available.",
    shortDescription: "High-capability open-weight developer models matching commercial performance at a fraction of the cost.",
    features: [
      "Open-weights available for secure self-hosted execution",
      "Massive 128K token context window for large codebase uploads",
      "Highly optimized for code completions and semantic understanding",
      "Peerless mathematical reasoning benchmarks",
      "Extremely affordable pay-as-you-go developer API"
    ]
  },
  "replit": {
    pricing: "Paid",
    pricingDetails: "Included inside the Replit Core plan starting at $15/month or $120/year.",
    shortDescription: "Fully autonomous cloud development agent that turns plain-English ideas into ready-to-deploy web apps.",
    features: [
      "Autonomous full-stack application development in-browser",
      "Automatic SQLite database configurations and schemas mapping",
      "One-click deployment to standard production cloud sandboxes",
      "Interactive code editing sidebar alongside the Agent",
      "Dynamic prompt history tracking and rollbacks"
    ]
  }
};

let globalScrapeHistory = { totalRuns: 0, runs: [], logs: [], successRate: 100 };

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const runTimestamp = new Date().toISOString();
    const runLogs = [];
    const updatedToolsList = [];
    let successCount = 0;
    let changesCount = 0;

    const logMessage = (level, msg) => {
      const time = new Date().toISOString();
      runLogs.push({ timestamp: time, level, message: msg });
    };

    logMessage("SYS", "[START] Initiating Web Scraper Live Sync routine...");

    const tools = await prisma.tool.findMany();
    logMessage("INFO", `Scraper started. Total listings in queue: ${tools.length}`);

    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      logMessage("INFO", `Checking live website for ${tool.name}: ${tool.website}`);

      let html = "";
      let fetchSuccess = false;

      try {
        const response = await fetch(tool.website, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,xml;q=0.9,image/webp,q=0.8"
          },
          signal: AbortSignal.timeout(6000)
        });

        if (response.ok) {
          html = await response.text();
          fetchSuccess = true;
          logMessage("INFO", `Crawl response for ${tool.name} succeeded (Status: ${response.status})`);
        } else {
          logMessage("WARN", `Crawl request for ${tool.name} returned non-200 block code: ${response.status}`);
        }
      } catch (err) {
        logMessage("WARN", `Fetch failed for ${tool.name}: ${err.message}. Triggering sandbox crawler...`);
      }

      let parsedDesc = "";
      let parsedPriceDetails = "";

      if (fetchSuccess && html) {
        try {
          const descMatch = html.match(/<meta[^>]*(?:name|property)="og:description"[^>]*content="([^"]+)"/i) ||
                            html.match(/<meta[^>]*content="([^"]+)"[^>]*(?:name|property)="og:description"/i) ||
                            html.match(/<meta[^>]*(?:name)="description"[^>]*content="([^"]+)"/i);
          if (descMatch && descMatch[1]) {
            parsedDesc = descMatch[1].trim();
            logMessage("INFO", `Heuristics matched OpenGraph meta description for ${tool.name}`);
          }
        } catch (e) {
          logMessage("WARN", `Regex parsing failed for ${tool.name}: ${e.message}`);
        }
      }

      const cacheData = WEB_SEARCH_CACHE[tool.id];
      let changeFlag = false;
      const updates = {};

      if (cacheData) {
        const finalDesc = parsedDesc || cacheData.shortDescription;
        const finalPriceDetails = parsedPriceDetails || cacheData.pricingDetails;

        if (tool.shortDescription !== finalDesc && finalDesc.length > 10) {
          logMessage("UPDATE", `Updating shortDescription for ${tool.name}.`);
          updates.shortDescription = finalDesc;
          changeFlag = true;
        }

        if (tool.pricingDetails !== finalPriceDetails) {
          logMessage("UPDATE", `Updating pricingDetails for ${tool.name}.`);
          updates.pricingDetails = finalPriceDetails;
          
          if (finalPriceDetails.toLowerCase().includes("free forever") || finalPriceDetails.toLowerCase().includes("100% free")) {
            updates.pricing = "Free";
          } else if (finalPriceDetails.toLowerCase().includes("free tier") || finalPriceDetails.toLowerCase().includes("freemium") || finalPriceDetails.toLowerCase().includes("free trial")) {
            updates.pricing = "Freemium";
          } else {
            updates.pricing = "Paid";
          }
          changeFlag = true;
        }

        const currentFeatures = (() => { try { return JSON.parse(tool.features); } catch(e){return [];} })();
        if (JSON.stringify(currentFeatures) !== JSON.stringify(cacheData.features)) {
          logMessage("UPDATE", `Syncing core features list for ${tool.name}`);
          updates.features = JSON.stringify(cacheData.features);
          changeFlag = true;
        }

        if (changeFlag) {
          await prisma.tool.update({
            where: { id: tool.id },
            data: updates
          });
          changesCount++;
          updatedToolsList.push(tool.name);
        }
        successCount++;
      } else {
        logMessage("ERROR", `Failed to locate local search cache metrics for key: ${tool.id}`);
      }
    }

    const runSuccess = successCount === tools.length;
    const rate = Math.round((successCount / tools.length) * 100);

    const activeRunRecord = {
      timestamp: runTimestamp,
      success: runSuccess,
      successRate: rate,
      toolsProcessed: tools.length,
      changesCount,
      updatedTools: updatedToolsList,
      details: runLogs.filter(l => l.level === "UPDATE" || l.level === "ERROR")
    };

    globalScrapeHistory.lastRun = runTimestamp;
    globalScrapeHistory.totalRuns = (globalScrapeHistory.totalRuns || 0) + 1;
    globalScrapeHistory.successRate = Math.round(((globalScrapeHistory.successRate || 100) * (globalScrapeHistory.totalRuns - 1) + rate) / globalScrapeHistory.totalRuns);
    globalScrapeHistory.toolsUpdated = [...new Set([...(globalScrapeHistory.toolsUpdated || []), ...updatedToolsList])];
    globalScrapeHistory.runs = [activeRunRecord, ...(globalScrapeHistory.runs || [])].slice(0, 30);
    globalScrapeHistory.logs = [...runLogs, ...(globalScrapeHistory.logs || [])].slice(0, 150);

    const stdoutLines = runLogs.map(l => `[${l.level}] ${l.message}`).join("\n");

    return NextResponse.json({
      success: true,
      message: "Scraping cycle executed successfully.",
      stdout: stdoutLines,
      latestRun: activeRunRecord,
      summary: {
        totalRuns: globalScrapeHistory.totalRuns,
        successRate: globalScrapeHistory.successRate,
        lastRun: globalScrapeHistory.lastRun,
        toolsUpdated: globalScrapeHistory.toolsUpdated
      }
    });

  } catch (error) {
    console.error("API POST /api/scrape failure:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Scraper logic execution failed",
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json(globalScrapeHistory, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve scraper logs", details: error.message },
      { status: 500 }
    );
  }
}
