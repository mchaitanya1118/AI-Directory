import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock pool of discoverable web tools per category
const DISCOVERABLE_POOL = {
  coding: [
    {
      id: "codeium",
      name: "Codeium",
      pricing: "Free",
      pricingDetails: "Free forever for individuals with unlimited autocompletions.",
      shortDescription: "Ultra-fast, free AI code autocomplete, chat, and search toolkit supporting 70+ languages.",
      description: "Codeium is a free, modern AI developer toolkit designed to provide sub-second code completions and contextual repo searches. Built with proprietary low-latency models, it integrates directly with VS Code, JetBrains, and web-based IDEs without requiring subscription fees.",
      website: "https://codeium.com",
      logoColor: "#00F2FE",
      features: ["Sub-second inline code completion", "Full-repository context-aware chat", "Supports 70+ programming languages", "Completely free tier forever"],
      pros: ["Zero cost for developers", "Highly optimized latency", "Secure enterprise hosting options"],
      cons: ["Larger repositories might require initial indexing time"]
    },
    {
      id: "tabnine",
      name: "Tabnine",
      pricing: "Freemium",
      pricingDetails: "Basic tier is free; Pro tier starts at $12/user/month with private custom models.",
      shortDescription: "Secure, context-aware AI assistant for software developers featuring private custom trained models.",
      description: "Tabnine is an enterprise-grade AI coding assistant that focuses on privacy and security. It offers context-aware code completions and allows developers to train custom AI models locally or in secure cloud enclaves, ensuring no public source code leakage.",
      website: "https://tabnine.com",
      logoColor: "#7F00FF",
      features: ["Private model local training", "Enterprise security compliance", "Contextual code completions", "Integrates with all major editors"],
      pros: ["Strong security focus", "Highly customizable", "Runs on local hardware enclaves"],
      cons: ["Setup can be complex for enterprise secure vaults"]
    }
  ],
  image: [
    {
      id: "canva-ai",
      name: "Canva Magic Design",
      pricing: "Freemium",
      pricingDetails: "Free basic tools; Magic Studio features require Canva Pro starting at $12.99/month.",
      shortDescription: "Magic Design creative suite to instantly generate beautiful presentations, templates, and social graphics.",
      description: "Canva Magic Design leverages advanced creative visual models to transform simple text prompts or uploaded images into fully editable Canva templates, slides, and branding kits. Perfect for social media managers and marketers.",
      website: "https://canva.com",
      logoColor: "#FF007F",
      features: ["Instant layout and slide generation", "AI-powered branding kit matching", "Magic Eraser and background remover", "Multi-platform export controls"],
      pros: ["Extremely intuitive templates", "Instant design to social media workflow", "Large stock catalog integration"],
      cons: ["Advanced animations require Canva Pro subscription"]
    },
    {
      id: "photoroom",
      name: "Photoroom",
      pricing: "Freemium",
      pricingDetails: "Free standard background removal; Pro starts at $9.99/month for HD studio staging.",
      shortDescription: "The absolute best AI background remover and photorealistic studio staging for e-commerce products.",
      description: "Photoroom uses highly specialized semantic segmentation models to isolate products and subjects from images in milliseconds, applying beautiful lighting and studio staging backgrounds automatically for commercial catalogues.",
      website: "https://photoroom.com",
      logoColor: "#FF5E3A",
      features: ["Sub-second background isolation", "AI studio-stage lighting rendering", "Batch photo processing", "Direct eBay and Shopify export feeds"],
      pros: ["Exceptional edge-detection accuracy", "Saves hours of Photoshop manual lasso work", "Great templates for webshops"],
      cons: ["Watermark applied on free tier downloads"]
    }
  ],
  video: [
    {
      id: "capcut-ai",
      name: "CapCut AI",
      pricing: "Freemium",
      pricingDetails: "Free basic video filters; Pro cloud capabilities start at $7.99/month.",
      shortDescription: "Automated video editing suite featuring voiceovers, auto-captions, and body effects.",
      description: "CapCut AI integrates state-of-the-art text-to-speech, auto-transcription, and motion tracking modules into a simple, high-performance video editor. Highly optimized for TikTok, YouTube Shorts, and creative influencers.",
      website: "https://capcut.com",
      logoColor: "#00FF7F",
      features: ["Automated dynamic subtitle captions", "Hyper-realistic voiceovers in 15+ languages", "Intelligent video frame reframing", "AI smart background cutout effects"],
      pros: ["Outstanding selection of templates", "Very fast cloud rendering", "Easiest editor for mobile creators"],
      cons: ["Cloud exports are limited on high resolution 4K free tiers"]
    },
    {
      id: "pika",
      name: "Pika Labs",
      pricing: "Freemium",
      pricingDetails: "Free daily credits; Pro subscriptions start at $15/month for watermark-free generations.",
      shortDescription: "Generative text-to-video creative generator allowing detailed motion and 3D style modifications.",
      description: "Pika is an advanced video foundation model that converts prompts and images into highly dynamic 3-4 second video clips. It supports direct control parameters like camera panning, zoom speeds, and character movements.",
      website: "https://pika.art",
      logoColor: "#00E2FF",
      features: ["Highly coherent text-to-video generation", "Style modifications (3D animation, photorealism)", "Precise camera movement parameters", "Inpainting regional object replacements"],
      pros: ["Exceptional 3D animation styling", "Fast preview rendering", "Active and supportive creator community"],
      cons: ["Free generation clips are capped at 3 seconds"]
    }
  ],
  productivity: [
    {
      id: "gamma",
      name: "Gamma App",
      pricing: "Freemium",
      pricingDetails: "Free starter credits; Plus subscription starts at $8/month; Pro starts at $15/month.",
      shortDescription: "Generate beautiful, engaging slides, webpages, and documents in seconds with conversational AI.",
      description: "Gamma is an interactive workspace that uses LLMs to design beautiful slide decks and document layouts from a single prompt. It features a conversational sidebar where users can tweak layouts, change colors, and rewrite text dynamically.",
      website: "https://gamma.app",
      logoColor: "#F5A623",
      features: ["Generates full slide decks from a prompt", "Conversational design editing sidebar", "Built-in analytics and viewer tracking", "Responsive mobile web layouts"],
      pros: ["Stunning modern layouts", "Infinitely better than generic PowerPoint", "Instant site publishing support"],
      cons: ["Custom domain export requires premium Pro plans"]
    },
    {
      id: "otter-ai",
      name: "Otter AI",
      pricing: "Freemium",
      pricingDetails: "Free basic transcriptions (300 minutes); Pro plan starts at $10/month for advanced notes.",
      shortDescription: "Virtual meeting assistant that transcribes audio and generates structured summaries.",
      description: "Otter AI connects natively to Zoom, Microsoft Teams, and Google Meet to transcribe discussions, identify speakers, and automatically outline key decisions and action items in real-time, boosting workspace productivity.",
      website: "https://otter.ai",
      logoColor: "#4A90E2",
      features: ["Real-time audio transcription and speaker tags", "AI-driven action item summaries", "Automatic calendar meeting joining sync", "Interactive chat to query transcripts"],
      pros: ["Exceptionally accurate transcription", "Auto-joins meetings when you're away", "Integrates nicely with Slack"],
      cons: ["Free monthly allowance runs out quickly on daily meetings"]
    }
  ]
};

// Dynamic helper to construct a completely unique tool if all predefined ones are already added
function generateDynamicTool(category) {
  const adjs = ["Quantum", "Cortex", "Hyper", "Deep", "Synthetix", "Nexus", "Cerebral", "Omni", "Prism", "Aero"];
  const nouns = ["Mind", "Coder", "Visualizer", "Assistant", "Generator", "Engine", "Canvas", "Flow", "Sync", "Link"];
  const categoryTerms = {
    coding: ["code completions", "terminal optimization", "automated refactoring", "developer enclaves"],
    image: ["artistic generative images", "layout canvas staging", "vector design layers", "creative textures"],
    video: ["cinema-grade footage", "avatar spokesperson voiceovers", "motion brush expansion", "dynamic clips"],
    productivity: ["meeting transcript action items", "slide deck layouts", "workspace collaboration", "formulations"]
  };
  
  const randAdj = adjs[Math.floor(Math.random() * adjs.length)];
  const randNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const name = `${randAdj}${randNoun} AI`;
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  const terms = categoryTerms[category] || ["AI operations", "dynamic workflow automations"];
  const pricing = Math.random() > 0.5 ? "Freemium" : "Free";
  
  return {
    id,
    name,
    pricing,
    pricingDetails: `${pricing} pricing model found on web registries.`,
    shortDescription: `A newly launched web tool providing advanced ${terms[0]} and automated category pipelines.`,
    description: `Found during background crawl: ${name} is a high-performance cognitive assistant designed to revolutionize ${terms[0]}, featuring local workspace support, active ${terms[1]} modules, and cloud integrations.`,
    website: `https://${id}.com/?ref=aura`,
    logoColor: "#E94057",
    features: [
      `Automated ${terms[0]} system`,
      `Integrated ${terms[1]} suite`,
      "Real-time workspace sync api",
      "Dynamic browser preview enclaves"
    ],
    pros: ["Fast initial loading rates", "Highly intuitive modular layout", "Active developer supports"],
    cons: ["Recently crawled web tool", "Limited historical reviews catalog"]
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "coding";
    const catId = category.toLowerCase();
    
    // Simulate real web crawl timing (1.2 seconds delay in background)
    await new Promise(r => setTimeout(r, 1200));

    // Fetch existing tools to avoid duplications
    const existingTools = await prisma.tool.findMany({
      where: { categoryId: catId }
    });
    const existingIds = new Set(existingTools.map(t => t.id));

    const pool = DISCOVERABLE_POOL[catId] || [];
    let toolToCreate = pool.find(p => !existingIds.has(p.id));

    // If all predefined tools are already added, dynamically synthesize a unique one!
    if (!toolToCreate) {
      toolToCreate = generateDynamicTool(catId);
    }

    // Double check that we don't duplicate dynamic tools
    const finalId = toolToCreate.id;
    const dbCheck = await prisma.tool.findUnique({ where: { id: finalId } });
    if (dbCheck) {
      // Already there, return nothing newly crawled this time
      return NextResponse.json({ success: true, newlyCrawled: [] });
    }

    // Make sure Category exists
    await prisma.category.upsert({
      where: { id: catId },
      update: {},
      create: {
        id: catId,
        name: category.charAt(0).toUpperCase() + category.slice(1),
      }
    });

    const finalLogo = `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="${toolToCreate.logoColor || "#E94057"}" fill-opacity="0.2" stroke="${toolToCreate.logoColor || "#E94057"}" stroke-width="2"/>
      <text x="50%" y="62%" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">${toolToCreate.name.slice(0, 2).toUpperCase()}</text>
    </svg>`;

    let newTool;
    const tags = ["Crawled", "Web Discovery", toolToCreate.pricing];

    try {
      newTool = await prisma.tool.create({
        data: {
          id: finalId,
          name: toolToCreate.name,
          categoryId: catId,
          logo: finalLogo,
          rating: 4.5,
          ratingCount: Math.floor(10 + Math.random() * 40),
          pricing: toolToCreate.pricing,
          pricingDetails: toolToCreate.pricingDetails,
          shortDescription: toolToCreate.shortDescription,
          description: toolToCreate.description,
          website: toolToCreate.website,
          sponsored: false,
          features: JSON.stringify(toolToCreate.features),
          pros: JSON.stringify(toolToCreate.pros),
          cons: JSON.stringify(toolToCreate.cons),
          useCases: JSON.stringify([`Automating ${category} tasks`, `Speeding up dynamic pipelines`]),
          comparisons: JSON.stringify([]),
          faqs: JSON.stringify([
            { q: `What is ${toolToCreate.name}?`, a: toolToCreate.shortDescription },
            { q: `Is it free?`, a: toolToCreate.pricingDetails }
          ]),
          specs: JSON.stringify({
            platform: "Web-Based / SaaS",
            apiAccess: "Available",
            targetAudience: "Creative Professionals",
            trialLength: "Variable",
            hosting: "Cloud"
          })
        }
      });

      // Create ToolTags
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });
        await prisma.toolTag.upsert({
          where: { toolId_tagId: { toolId: newTool.id, tagId: tag.id } },
          update: {},
          create: { toolId: newTool.id, tagId: tag.id }
        });
      }
    } catch (createError) {
      if (createError.code === "P2002") {
        console.warn(`Parallel scrape race condition caught for ID: ${finalId}. Fetching already created entry.`);
        const existingTool = await prisma.tool.findUnique({
          where: { id: finalId }
        });
        if (existingTool) {
          return NextResponse.json({
            success: true,
            newlyCrawled: [{
              ...existingTool,
              features: toolToCreate.features,
              pros: toolToCreate.pros,
              cons: toolToCreate.cons,
              specs: {
                platform: "Web-Based / SaaS",
                apiAccess: "Available",
                targetAudience: "Creative Professionals",
                trialLength: "Variable",
                hosting: "Cloud"
              },
              category: catId,
              tags: tags
            }]
          });
        }
      }
      // Re-throw if it's another error
      throw createError;
    }

    return NextResponse.json({
      success: true,
      newlyCrawled: [{
        ...newTool,
        features: toolToCreate.features,
        pros: toolToCreate.pros,
        cons: toolToCreate.cons,
        specs: {
          platform: "Web-Based / SaaS",
          apiAccess: "Available",
          targetAudience: "Creative Professionals",
          trialLength: "Variable",
          hosting: "Cloud"
        },
        category: catId,
        tags: tags
      }]
    });

  } catch (error) {
    console.error("API /api/scrape/public error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
