import { prisma } from "@/lib/prisma";
import AgentsClient from "@/components/AgentsClient";

export const metadata = {
  title: "AI Agent Marketplace | AuraAI",
  description: "Discover, clone, and deploy autonomous AI agents for Sales, Customer Support, HR, Finance, and Marketing automation.",
  alternates: {
    canonical: "/agents",
  },
};

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    where: { approved: true },
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <AgentsClient initialAgents={agents} />
    </div>
  );
}
