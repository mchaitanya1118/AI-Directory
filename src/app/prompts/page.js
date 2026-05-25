import { prisma } from "@/lib/prisma";
import PromptsClient from "@/components/PromptsClient";

export const metadata = {
  title: "AI Prompt Library: Copy Top ChatGPT, Claude & Midjourney Prompts | AuraAI",
  description: "Browse our premium curated AI Prompt Library. Copy industry-standard prompts for Coding, Marketing, Writing, and Midjourney image generation in one click.",
  alternates: {
    canonical: "/prompts",
  },
};

export default async function PromptsPage() {
  const prompts = await prisma.prompt.findMany({
    orderBy: {
      useCount: "desc"
    }
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <PromptsClient initialPrompts={prompts} />
    </div>
  );
}
