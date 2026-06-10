import { prisma } from "@/lib/prisma";
import ConsultantClient from "@/components/ConsultantClient";

export const metadata = {
  title: "AI Consultant & Custom Stack Builder | AuraAI",
  description: "Consult with our AI assistant to discover the perfect tools, build customized software stacks, and generate automation workflows.",
  alternates: {
    canonical: "/consultant",
  },
};

export default async function ConsultantPage() {
  const tools = await prisma.tool.findMany({
    include: {
      reviews: true
    }
  });

  const agents = await prisma.agent.findMany();
  const workflows = await prisma.workflow.findMany({
    include: {
      tools: {
        include: {
          tool: true
        }
      }
    }
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <ConsultantClient tools={tools} agents={agents} workflows={workflows} />
    </div>
  );
}
