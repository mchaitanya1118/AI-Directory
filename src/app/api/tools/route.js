import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// GET /api/tools - Serves the current parsed data from SQLite database dynamically
export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      include: {
        reviews: true,
        tags: { include: { tag: true } }
      }
    });

    const parsedTools = tools.map((t) => {
      let tags = [];
      if (t.tags) {
        tags = t.tags.map((tt) => tt.tag.name);
      }
      return {
        id: t.id,
        name: t.name,
        category: t.categoryId,
        categoryId: t.categoryId,
        logo: t.logo,
        rating: t.rating,
        ratingCount: t.ratingCount,
        pricing: t.pricing,
        pricingDetails: t.pricingDetails,
        shortDescription: t.shortDescription,
        description: t.description,
        website: t.website,
        sponsored: t.sponsored,
        features: safeParse(t.features, []),
        pros: safeParse(t.pros, []),
        cons: safeParse(t.cons, []),
        useCases: safeParse(t.useCases, []),
        comparisons: safeParse(t.comparisons, []),
        faqs: safeParse(t.faqs, []),
        specs: safeParse(t.specs, {}),
        reviews: t.reviews || [],
        tags: tags,
      };
    });

    return NextResponse.json(parsedTools, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("API GET /api/tools error:", error);
    return NextResponse.json(
      { error: "Failed to read database parameters", details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/tools - Creates a new tool in the SQLite database dynamically
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      category, // maps to categoryId
      pricing,
      website,
      shortDescription,
      description,
      features,
      sponsored,
      logo,
      pricingDetails,
      pros,
      cons,
      specs,
      tags
    } = body;

    if (!name || !category || !website || !shortDescription || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const toolId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if category exists in database. If not, create it.
    const catId = category.toLowerCase();
    await prisma.category.upsert({
      where: { id: catId },
      update: {},
      create: {
        id: catId,
        name: category.charAt(0).toUpperCase() + category.slice(1),
      }
    });

    // Default values if not provided
    const finalFeatures = Array.isArray(features) 
      ? features 
      : (typeof features === "string" ? features.split(",").map(f => f.trim()).filter(Boolean) : []);
    
    const finalPros = Array.isArray(pros) 
      ? pros 
      : ["High efficiency features", "Intuitive Apple-style dashboard integration", "Quick setup & fast learning curve"];
    
    const finalCons = Array.isArray(cons) 
      ? cons 
      : ["Relatively new entry in the software directory", "Requires modern browser for all layout engines"];

    const finalSpecs = specs && typeof specs === "object" ? specs : {
      platform: "Web-based / Cross-Platform",
      apiAccess: "Refer to support / website",
      targetAudience: "Developers, Content Creators, Professionals",
      trialLength: "Free basic tier / dynamic trials",
      hosting: "Cloud Hosted"
    };

    const finalLogo = logo || `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="url(#gradient-violet)" fill-opacity="0.2" stroke="url(#gradient-violet)" stroke-width="2"/>
      <text x="50%" y="62%" font-family="sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">${name.slice(0, 2).toUpperCase()}</text>
      <defs>
        <linearGradient id="gradient-violet" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stop-color="#8A2387"/>
          <stop offset="0.5" stop-color="#E94057"/>
          <stop offset="1" stop-color="#F27121"/>
        </linearGradient>
      </defs>
    </svg>`;

    const finalTags = Array.isArray(tags) ? tags : ["New Listing", pricing, "Creator Submitted"];

    // Check if tool with this ID already exists, if so append unique suffix
    let finalToolId = toolId;
    const existingTool = await prisma.tool.findUnique({ where: { id: toolId } });
    if (existingTool) {
      finalToolId = `${toolId}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Insert into DB
    const newTool = await prisma.tool.create({
      data: {
        id: finalToolId,
        name: name.trim(),
        categoryId: catId,
        logo: finalLogo,
        rating: sponsored ? 4.9 : 4.2,
        ratingCount: 1,
        pricing: pricing,
        pricingDetails: pricingDetails || `${pricing} tier structure, self-submitted.`,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        website: website.trim(),
        sponsored: !!sponsored,
        features: JSON.stringify(finalFeatures),
        pros: JSON.stringify(finalPros),
        cons: JSON.stringify(finalCons),
        useCases: JSON.stringify([`Automating ${category} workflows`, `Optimizing professional tasks`]),
        comparisons: JSON.stringify([]),
        faqs: JSON.stringify([
          { q: `What is ${name}?`, a: shortDescription },
          { q: `Is there a free tier?`, a: `Yes, ${pricing} is available.` }
        ]),
        specs: JSON.stringify(finalSpecs),
      }
    });

    // Create ToolTags
    for (const tagName of finalTags) {
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

    return NextResponse.json({ success: true, tool: newTool });
  } catch (error) {
    console.error("API POST /api/tools error:", error);
    return NextResponse.json(
      { error: "Failed to submit tool", details: error.message },
      { status: 500 }
    );
  }
}

