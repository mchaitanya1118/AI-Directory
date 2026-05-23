import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import AdminClient from "@/components/AdminClient";

export const metadata = {
  title: "Admin CMS | AuraAI",
};

function safeParse(str, fallback) {
  if (!str) return fallback;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    return fallback;
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return null; // Caught by middleware
  }

  // Fetch initial rosters
  const [rawTools, users, reviews, totalBookmarks, subscribers] = await Promise.all([
    prisma.tool.findMany({
      include: {
        reviews: true,
        tags: { include: { tag: true } }
      },
      orderBy: {
        name: "asc"
      }
    }),
    prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      },
      orderBy: {
        username: "asc"
      }
    }),
    prisma.review.findMany({
      include: {
        tool: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    }),
    prisma.bookmark.count(),
    prisma.newsletterSubscriber.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })
  ]);

  // Cleanly parse SQLite strings into proper arrays/objects for client rendering
  const formattedTools = rawTools.map((t) => {
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
      sponsored: !!t.sponsored,
      approved: !!t.approved,
      features: safeParse(t.features, []),
      pros: safeParse(t.pros, []),
      cons: safeParse(t.cons, []),
      specs: safeParse(t.specs, {}),
      reviews: t.reviews || [],
      tags: tags,
    };
  });

  return (
    <AdminClient
      initialTools={formattedTools}
      initialUsers={users}
      initialReviews={reviews}
      totalBookmarks={totalBookmarks}
      initialSubscribers={subscribers}
    />
  );
}
