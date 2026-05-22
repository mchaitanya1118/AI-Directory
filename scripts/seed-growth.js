const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting Seeding of Growth Features (Prompts & Workflows)...");

  // 1. Seed Prompts
  console.log("Seeding Prompts...");
  const prompts = [
    {
      title: "Prisma Schema for Feedback System",
      promptText: "Create a complete, optimized Prisma schema model block for a multi-user user feedback, review, and comment system. The schema must include relations to a standard User model, supporting average score calculations and chronological comments on a SQLite datasource. Also write a sample prisma.$transaction query to query active ratings average.",
      category: "Coding",
      views: 145,
      useCount: 68
    },
    {
      title: "Expert SaaS Landing Page Copy (AIDA)",
      promptText: "Act as an expert conversion copywriting lead. Write a premium landing page copy following the Attention-Interest-Desire-Action (AIDA) layout framework for a B2B AI task automation workspace tool called AuraFlow. Include clear, punchy header options, sub-headers emphasizing metric results, secondary CTA blocks, and microcopy reassuring email security.",
      category: "Marketing",
      views: 312,
      useCount: 124
    },
    {
      title: "Cinematic Interior Photography (Midjourney)",
      promptText: "A cinematic, award-winning architectural photo of a minimalist Scandinavian concrete villa nestled in foggy pine forests. Moody lighting, warm interior glow leaking from floor-to-ceiling glass windows, wet ground reflections, raw natural textures, shot on Hasselblad, 8k resolution, photorealistic, cinematic composition, golden hour, highly detailed --ar 16:9 --style raw --v 6.0",
      category: "Images",
      views: 642,
      useCount: 420
    },
    {
      title: "Cyberpunk Tokyo Alleyway (Stable Diffusion)",
      promptText: "A hyper-detailed, highly stylized masterpiece of a cyberpunk neon alleyway in Tokyo. A futuristic street vendor preparing ramen under warm glowing paper lanterns, rain reflections on damp asphalt, high-contrast dark metallic shadows, holographic digital billboard signs in katakana, cinematic lighting, 8k resolution, volumetric smoke and steam, Unreal Engine 5 render style.",
      category: "Images",
      views: 450,
      useCount: 215
    },
    {
      title: "Academic Bibliography Generator",
      promptText: "You are a senior research assistant. Synthesize a comprehensive annotated bibliography outline detailing the latest 5 breakthroughs in utilizing reinforcement learning for clean energy grid storage and battery decay optimization. Include primary keywords, methodology summaries, prospective journals, and structured citation footprints.",
      category: "Writing",
      views: 198,
      useCount: 84
    }
  ];

  for (const p of prompts) {
    await prisma.prompt.create({
      data: p
    });
  }

  // 2. Seed Workflows
  console.log("Seeding Workflows...");
  
  // Solopreneur SaaS Engine
  const w1 = await prisma.workflow.create({
    data: {
      title: "Solopreneur SaaS Development Stack",
      slug: "solopreneur-saas-development-stack",
      summary: "Automate code base edits, UI layout building, and sprint task backlogs as a single developer.",
      description: "As a solopreneur launching SaaS projects, time is your ultimate bottleneck. This highly optimized workflow is designed to compress your product lifecycle from months to days. By combining Cursor's robust AI-first editor with Claude's logical parsing, you can construct massive React scaffolding at near-zero-latency. Use Notion AI to keep track of backlog cards and translate technical updates into customer-facing copy.",
      role: "Developer",
      industry: "SaaS",
      budget: "Freemium",
      views: 280,
      upvotes: 45,
    }
  });

  const toolsW1 = [
    { toolId: "cursor", stepNumber: 1, useCase: "AI Code Editor: Edit code, refactor directories, and write modular functions rapidly." },
    { toolId: "claude", stepNumber: 2, useCase: "General Intelligence: Parse complex logical problems, design APIs, and resolve database bugs." },
    { toolId: "notionai", stepNumber: 3, useCase: "Workspace Backlog: Organise sprints, outline project timelines, and draft blog releases." }
  ];

  for (const t of toolsW1) {
    await prisma.workflowTool.create({
      data: {
        workflowId: w1.id,
        toolId: t.toolId,
        stepNumber: t.stepNumber,
        useCase: t.useCase
      }
    });
  }

  // Cinematic YouTuber Pipeline
  const w2 = await prisma.workflow.create({
    data: {
      title: "Cinematic YouTuber Creation Pipeline",
      slug: "cinematic-youtuber-creation-pipeline",
      summary: "Render cinematic cover arts, create text-to-video reels, and clone perfect audio transcripts.",
      description: "Achieving high user retention on modern video platforms requires cinematic pacing. This pipeline enables solo creators to produce professional, high-fidelity YouTube contents at minimal cost. Generate cinematic thumbnail mockups in Midjourney, transform prompt descriptions into 4K video clips using Runway, and clone clear synthetic narrator voices with ElevenLabs.",
      role: "Creator",
      industry: "Marketing",
      budget: "Premium",
      views: 395,
      upvotes: 78,
    }
  });

  const toolsW2 = [
    { toolId: "midjourney", stepNumber: 1, useCase: "Visual Art: Render ultra-realistic cinematic images for thumbnails and graphic assets." },
    { toolId: "runway", stepNumber: 2, useCase: "Text-to-Video: Transform text storyboards into highly realistic 4K video reels." },
    { toolId: "elevenlabs", stepNumber: 3, useCase: "AI Voice: Generate clear synthetic voiceovers and narrations in multiple languages." }
  ];

  for (const t of toolsW2) {
    await prisma.workflowTool.create({
      data: {
        workflowId: w2.id,
        toolId: t.toolId,
        stepNumber: t.stepNumber,
        useCase: t.useCase
      }
    });
  }

  console.log("Growth Features Seed Completed Successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
