import { prisma } from "@/lib/prisma";
import CategoryClient from "@/components/CategoryClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const categoryName = id === "all" ? "All AI Tools" : id.charAt(0).toUpperCase() + id.slice(1);
  return {
    title: `Best ${categoryName} Directory 2026 | AuraAI`,
    description: `Explore the top-rated ${categoryName} applications, compare pricing, and read verified reviews.`,
    alternates: {
      canonical: `/category/${id}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  
  let tools = [];
  if (id === "all") {
    tools = await prisma.tool.findMany({ include: { reviews: true } });
  } else {
    tools = await prisma.tool.findMany({
      where: { categoryId: id },
      include: { reviews: true }
    });
  }

  return <CategoryClient category={id} initialTools={tools} />;
}
