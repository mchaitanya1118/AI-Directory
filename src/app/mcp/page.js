import { prisma } from "@/lib/prisma";
import McpClient from "@/components/McpClient";

export const metadata = {
  title: "MCP Server Directory | AuraAI",
  description: "Browse the ultimate registry of Model Context Protocol (MCP) servers. Connect databases, filesystems, and tools to Cursor and Claude Desktop.",
  alternates: {
    canonical: "/mcp",
  },
};

export default async function McpPage() {
  const servers = await prisma.mCPServer.findMany({
    where: { approved: true },
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <McpClient initialServers={servers} />
    </div>
  );
}
