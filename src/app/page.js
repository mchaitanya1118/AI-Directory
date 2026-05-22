import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export const metadata = {
  title: "AuraAI | The Ultimate AI Directory & Comparison Engine 2026",
  description: "Discover, compare, and read verified reviews for the best AI tools, coding assistants, image generators, and video platforms.",
  keywords: ["AI tools", "AI directory", "AI comparisons", "AuraAI"],
};

export default async function HomePage() {
  const tools = await prisma.tool.findMany({
    include: { 
      reviews: true,
      tags: { include: { tag: true } }
    }
  });

  return <HomeClient initialTools={tools} />;
}
