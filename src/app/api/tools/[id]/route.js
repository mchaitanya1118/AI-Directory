import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    return fallback;
  }
}

// PUT /api/tools/[id] - Update an existing tool (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      categoryId,
      logo,
      pricing,
      pricingDetails,
      shortDescription,
      description,
      website,
      sponsored,
      approved,
      features,
      pros,
      cons,
      specs,
      tags
    } = body;

    // Check if tool exists
    const tool = await prisma.tool.findUnique({
      where: { id }
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // Prepare data arrays
    const finalFeatures = Array.isArray(features) ? features : safeParse(features, []);
    const finalPros = Array.isArray(pros) ? pros : safeParse(pros, []);
    const finalCons = Array.isArray(cons) ? cons : safeParse(cons, []);
    const finalSpecs = specs && typeof specs === "object" ? specs : safeParse(specs, {});

    // Update Category if needed
    if (categoryId) {
      const catId = categoryId.toLowerCase();
      await prisma.category.upsert({
        where: { id: catId },
        update: {},
        create: {
          id: catId,
          name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
        }
      });
    }

    // Update Tool records
    const updatedTool = await prisma.tool.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : tool.name,
        categoryId: categoryId !== undefined ? categoryId.toLowerCase() : tool.categoryId,
        logo: logo !== undefined ? logo : tool.logo,
        pricing: pricing !== undefined ? pricing : tool.pricing,
        pricingDetails: pricingDetails !== undefined ? pricingDetails : tool.pricingDetails,
        shortDescription: shortDescription !== undefined ? shortDescription.trim() : tool.shortDescription,
        description: description !== undefined ? description.trim() : tool.description,
        website: website !== undefined ? website.trim() : tool.website,
        sponsored: sponsored !== undefined ? !!sponsored : tool.sponsored,
        approved: approved !== undefined ? !!approved : tool.approved,
        features: JSON.stringify(finalFeatures),
        pros: JSON.stringify(finalPros),
        cons: JSON.stringify(finalCons),
        specs: JSON.stringify(finalSpecs)
      }
    });

    // Update ToolTags if tags were provided
    if (Array.isArray(tags)) {
      // 1. Delete all existing relations for this tool
      await prisma.toolTag.deleteMany({
        where: { toolId: id }
      });

      // 2. Insert new ones
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName }
        });
        await prisma.toolTag.upsert({
          where: { toolId_tagId: { toolId: id, tagId: tag.id } },
          update: {},
          create: { toolId: id, tagId: tag.id }
        });
      }
    }

    return NextResponse.json({ success: true, tool: updatedTool });
  } catch (error) {
    console.error("API PUT /api/tools/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update tool", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/tools/[id] - Remove a tool (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if tool exists
    const tool = await prisma.tool.findUnique({
      where: { id }
    });

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    }

    // Delete tool tags, bookmarks, reviews, workflow tools, and then the tool
    await prisma.toolTag.deleteMany({ where: { toolId: id } });
    await prisma.bookmark.deleteMany({ where: { toolId: id } });
    await prisma.review.deleteMany({ where: { toolId: id } });
    await prisma.workflowTool.deleteMany({ where: { toolId: id } });
    
    // Check if there is a ToolLaunch relation and delete it
    const launch = await prisma.toolLaunch.findUnique({ where: { toolId: id } });
    if (launch) {
      await prisma.toolLaunch.delete({ where: { toolId: id } });
    }

    await prisma.tool.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Tool deleted successfully" });
  } catch (error) {
    console.error("API DELETE /api/tools/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete tool", details: error.message },
      { status: 500 }
    );
  }
}
