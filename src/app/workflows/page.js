import { prisma } from "@/lib/prisma";
import WorkflowsClient from "@/components/WorkflowsClient";

export const metadata = {
  title: "AI Workflow Marketplace & Dynamic Stack Builder | AuraAI",
  description: "Explore industry-standard AI tool workflows or build your own custom AI stack. Curated productivity stacks for Developers, Designers, and Content Creators.",
  keywords: ["AI workflows", "AI stack builder", "AI stack", "developer tools", "creator workflow", "SaaS automation"],
};

export default async function WorkflowsPage() {
  // Fetch all pre-configured workflows with tool steps
  const workflows = await prisma.workflow.findMany({
    include: {
      tools: {
        orderBy: {
          stepNumber: "asc"
        },
        include: {
          tool: true
        }
      }
    }
  });

  // Fetch all tools to populate dynamic custom stack builder selects
  const tools = await prisma.tool.findMany({
    include: {
      reviews: true
    }
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <WorkflowsClient initialWorkflows={workflows} allTools={tools} />
    </div>
  );
}
