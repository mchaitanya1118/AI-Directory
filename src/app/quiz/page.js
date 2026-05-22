import { prisma } from "@/lib/prisma";
import QuizClient from "@/components/QuizClient";

export const metadata = {
  title: "Interactive AI Tool Finder Quiz | AuraAI",
  description: "Answer 3 quick questions to discover the perfect AI tools for your specific workflow, profession, and budget. Get your personalized AI stack instantly.",
  keywords: ["AI finder", "AI stack builder", "AI recommendation quiz", "best AI tools", "personalized AI tools"],
};

export default async function QuizPage() {
  // Fetch all tools with reviews to enable client-side high-fidelity scoring
  const tools = await prisma.tool.findMany({
    include: {
      reviews: true,
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <QuizClient tools={tools} />
    </div>
  );
}
