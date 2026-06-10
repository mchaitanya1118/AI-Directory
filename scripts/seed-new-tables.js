const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding expanded AuraAI marketplace tables...");

  // 1. Seed Agents
  console.log("Seeding Agents...");
  const agents = [
    {
      id: "customer-support-agent",
      name: "AuraSupport Agent",
      description: "Automate customer support tickets, answer client FAQs, and escalate issues in real-time with zero human interaction.",
      category: "Customer Support",
      capabilities: JSON.stringify(["Automated Ticketing", "Multi-lingual Support", "CRM Sync", "Sentiment Analysis"]),
      supportedModels: JSON.stringify(["GPT-4o", "Claude 3.5 Sonnet"]),
      pricing: "Freemium",
      setupGuide: "### Setup Guide\n1. Copy your API token from the settings panel.\n2. Paste the installation webhook in your Zendesk or Intercom backend.\n3. Train the agent by uploading your website URL or PDF manuals.\n4. Click **Deploy Agent** to go live.",
      demoUrl: "https://support-agent-demo.neqtra.com",
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-headset"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
    },
    {
      id: "sales-outreach-agent",
      name: "OutreachPro Agent",
      description: "Auto-generate outbound email sequences, track lead engagement, and schedule live demos directly on your calendar.",
      category: "Sales",
      capabilities: JSON.stringify(["Lead Enrichment", "Outbound Email Sequences", "Calendar Booking", "LinkedIn Outreach"]),
      supportedModels: JSON.stringify(["GPT-4o", "Llama 3.1 70B"]),
      pricing: "Paid",
      setupGuide: "### Setup Guide\n1. Connect your Gmail or Outlook workspace account.\n2. Configure your booking links (Cal.com or Calendly).\n3. Upload your target spreadsheet or connect HubSpot CRM.\n4. Save settings and activate campaign.",
      demoUrl: "https://outreach-agent-demo.neqtra.com",
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-plus"><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M19 16v6"/><path d="M16 19h6"/></svg>`,
    },
    {
      id: "analyst-research-agent",
      name: "AnalystAI Agent",
      description: "Deep web crawler and document analysis agent that extracts tables, synthesizes financial records, and compiles comprehensive market reports.",
      category: "Research",
      capabilities: JSON.stringify(["PDF Data Extraction", "Web Crawling", "Citations Engine", "Excel Auto-Generation"]),
      supportedModels: JSON.stringify(["Claude 3.5 Sonnet", "Perplexity Online"]),
      pricing: "Paid",
      setupGuide: "### Setup Guide\n1. Upload your source files (PDFs, CSVs, or text).\n2. Write your analysis prompt (e.g., 'Compare quarterly profits').\n3. The agent will crawl and match references in real-time.\n4. Download the generated Excel/Markdown report.",
      demoUrl: null,
      logo: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-big"><path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="10" rx="1"/><rect width="4" height="12" x="15" y="5" rx="1"/></svg>`,
    }
  ];

  for (const a of agents) {
    await prisma.agent.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }

  // 2. Seed MCP Servers
  console.log("Seeding MCP Servers...");
  const mcpServers = [
    {
      id: "postgres-mcp",
      name: "Postgres Database MCP",
      description: "Allow your AI IDEs (Cursor, Windsurf) or Claude Desktop to inspect database schema, run safe queries, and generate entity-relationship diagrams.",
      githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres",
      installation: "npm install -g @modelcontextprotocol/server-postgres",
      supportedClients: JSON.stringify(["Cursor", "Claude Desktop", "Windsurf"]),
      tags: JSON.stringify(["Database", "SQL", "DevTools", "PostgreSQL"]),
    },
    {
      id: "github-mcp",
      name: "GitHub MCP Connector",
      description: "Direct read/write pipeline to query issues, trigger pull requests, search branches, and read code files in repositories.",
      githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/github",
      installation: "npx -y @modelcontextprotocol/server-github",
      supportedClients: JSON.stringify(["Cursor", "Claude Desktop", "Windsurf", "Langflow"]),
      tags: JSON.stringify(["Git", "GitHub", "Automation", "DevTools"]),
    },
    {
      id: "filesystem-mcp",
      name: "Secure Filesystem MCP",
      description: "Give LLMs access to securely read, write, edit, and traverse files under a specific sandbox directory on your host workstation.",
      githubUrl: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem",
      installation: "npx -y @modelcontextprotocol/server-filesystem /path/to/sandbox",
      supportedClients: JSON.stringify(["Cursor", "Claude Desktop"]),
      tags: JSON.stringify(["Files", "Utilities", "Local", "DevTools"]),
    }
  ];

  for (const s of mcpServers) {
    await prisma.mCPServer.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  // 3. Seed Courses & Lessons
  console.log("Seeding Courses and Lessons...");
  const courses = [
    {
      id: "ai-beginners",
      title: "AI & LLM Fundamentals for Beginners",
      summary: "Understand how large language models work, when to choose ChatGPT vs Claude, and how to write basic prompts.",
      category: "Beginners",
    },
    {
      id: "prompt-engineering",
      title: "Advanced Prompt Engineering Masterclass",
      summary: "Master chain-of-thought prompting, system instructions, few-shot conditioning, and structured JSON outputs.",
      category: "Prompt Engineering",
    },
    {
      id: "automation-n8n",
      title: "AI Automation Pipelines with n8n",
      summary: "Connect APIs, build conditional loops, and create autonomous AI agents inside n8n workflows.",
      category: "Automation",
    }
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }

  const lessons = [
    {
      id: "intro-llms",
      courseId: "ai-beginners",
      title: "Introduction to Transformers and LLMs",
      videoUrl: "https://www.youtube.com/embed/5sLYAQS9sDM",
      duration: "12m 45s",
      content: "In this lesson, we explore the core architecture of Transformers, weights, biases, context windows, and how model text prediction works under the hood.",
    },
    {
      id: "model-comparison",
      courseId: "ai-beginners",
      title: "Comparing Claude vs GPT vs Gemini",
      videoUrl: "https://www.youtube.com/embed/air-beginners-2",
      duration: "15m 10s",
      content: "An analytical deep dive comparing Anthropic's reasoning focus, OpenAI's API speed & tool-calling ecosystem, and Google's multi-modal long-context capabilities.",
    },
    {
      id: "chain-of-thought",
      courseId: "prompt-engineering",
      title: "Chain of Thought & Few-Shot Prompting",
      videoUrl: "https://www.youtube.com/embed/prompt-1",
      duration: "18m 30s",
      content: "Learn how asking the model to show its reasoning steps step-by-step increases math and logic accuracy, and how to format few-shot positive examples.",
    },
    {
      id: "n8n-nodes",
      courseId: "automation-n8n",
      title: "Creating Custom n8n Nodes with Webhooks",
      videoUrl: "https://www.youtube.com/embed/automation-1",
      duration: "22m 15s",
      content: "Connect incoming custom webhooks, map JSON responses, and filter results before passing payload parameters to downstream AI integrations.",
    }
  ];

  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: l,
      create: l,
    });
  }

  // 4. Seed News Articles
  console.log("Seeding News Articles...");
  const news = [
    {
      id: "openai-gpt-5-announcement",
      title: "OpenAI Unveils GPT-5 Frontier Model",
      summary: "OpenAI has officially launched its newest flagship model GPT-5, demonstrating significant logic improvements, native video understanding, and sub-100ms response times.",
      body: "<p>OpenAI announced the release of GPT-5, its most advanced frontier intelligence system. GPT-5 sets new industry benchmarks in mathematical reasoning, coding comprehension, and complex agent orchestration. Additionally, it offers native multi-modal support for real-time video, audio, and documents, with speeds up to 3x faster than GPT-4o.</p><p>Developers can access the API endpoint starting today, with plans to roll it out to premium users on ChatGPT over the next few weeks.</p>",
      source: "OpenAI",
      date: "June 8, 2026",
    },
    {
      id: "anthropic-claude-3-5-opus-release",
      title: "Anthropic Releases Claude 3.5 Opus with Deep Reasoning",
      summary: "Anthropic sets a new gold standard for complex engineering and agent workflows with the release of Claude 3.5 Opus.",
      body: "<p>Anthropic launched Claude 3.5 Opus today, showing massive breakthroughs in multi-step planning, automated codebase migrations, and scientific research analysis. Claude 3.5 Opus beats previous models on GPQA (Graduate-Level Google-Proof Q&A) and HumanEval coding challenges.</p><p>It features a 200k token context window and is now available in Claude Console and Claude Pro tiers.</p>",
      source: "Anthropic",
      date: "June 5, 2026",
    },
    {
      id: "meta-llama-4-open-source",
      title: "Meta Releases Llama 4 Open Source Family",
      summary: "Meta shakes up the AI market by open-sourcing Llama 4, featuring a 405B parameter model that matches proprietary closed-source engines.",
      body: "<p>Mark Zuckerberg announced the launch of Llama 4. The model family is fully open-source, including weights, and is available for local deployment on enterprise workstations. The flagship 405B parameter version competes head-to-head with frontier models on coding, reasoning, and multi-lingual translation.</p>",
      source: "Open Source AI",
      date: "May 29, 2026",
    }
  ];

  for (const n of news) {
    await prisma.newsArticle.upsert({
      where: { id: n.id },
      update: n,
      create: n,
    });
  }

  console.log("DB Seeding Complete! Enjoy your expanded database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
