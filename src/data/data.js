// Seed database for AuraAI Next.js app loading directly from structured JSON
import toolsJson from "./tools.json";

export const INITIAL_TOOLS = toolsJson;

export const CURATED_PAGES = {
  "best-coding-assistants": {
    title: "Best AI Coding Assistants (2026)",
    metaDescription: "An in-depth review of the top AI-first code editors and autocomplete extensions. Boost your developer productivity with Cursor, Copilot, and more.",
    introduction: "In 2026, writing code without an AI assistant is like writing code in notepad without syntax highlighting. The landscape has expanded from simple autocomplete helpers to completely autonomous AI-first IDEs capable of reasoning across entire codebases. Here are the top-rated AI coding assistants analyzed by our developer editors.",
    listIds: ["cursor", "copilot", "v0"],
    verdict: "If you want a drop-in autocomplete extension that works inside standard VS Code or JetBrains, **GitHub Copilot** remains highly reliable. However, if you are looking for a state-of-the-art developer experience where the AI can refactor multiple files simultaneously and explain logic semantically, **Cursor** is the clear industry leader."
  },
  "chatgpt-alternatives": {
    title: "Top ChatGPT Alternatives That are Better at Specific Tasks",
    metaDescription: "Looking for something better than ChatGPT? Read our comparisons of Claude, Perplexity, and local models.",
    introduction: "While OpenAI's ChatGPT is a fantastic generalist, specific platforms have surpassed it in key areas: Anthropic's Claude leads in logical writing, coding, and mathematical reasoning, while Perplexity offers superior source verification. Here are the top alternatives you should explore.",
    listIds: ["claude", "perplexity", "notionai"],
    verdict: "For general writing, creative copy, or detailed computer programming, switch to **Claude**. If you are performing research, fact-checking, or looking for up-to-date references, **Perplexity** is the ultimate answers engine."
  },
  "ai-architects": {
    title: "Best AI Tools for Architects & Interior Designers",
    metaDescription: "Discover how top-rated AI generators like Stable Diffusion, Midjourney, and Runway can automate blueprint renderings and mood boards.",
    introduction: "Architectural firms are rapidly deploying generative AI to render concept designs, create mood boards, and experiment with interior styling options. By combining stable structure outlines with artistic texturing, these tools convert basic shapes into stunning visual pitches.",
    listIds: ["midjourney", "stablediffusion", "runway"],
    verdict: "For quick, breathtaking concepts and client pitches, **Midjourney** is unmatched. If your architecture firm needs precise alignment with actual blueprint lines or CAD outputs, download **Stable Diffusion** and configure ControlNet depth filters."
  },
  "students-best": {
    title: "Best AI Tools for Students",
    metaDescription: "Accelerate your studies, write citation-backed essays, and learn languages efficiently using these top student AI platforms.",
    introduction: "Students are utilizing AI as personalized 24/7 tutors. From summarizing dry 100-page academic papers to building interactive voice conversations to practice speaking Spanish, these tools represent the ultimate digital study cohort.",
    listIds: ["perplexity", "claude", "chatgpt"],
    verdict: "To study smart, combine **Perplexity AI** for locating verified sources and **Claude** to draft summaries, outlines, and debug your engineering homework code."
  },
  "top-free": {
    title: "Top Free & Open Source AI Tools",
    metaDescription: "Explore the best AI engines that offer rich free tiers or are fully open source, letting you run them completely free on your computer.",
    introduction: "You don't need to spend $20/month for every AI subscription. A thriving community of developers and open-source models allow you to generate artwork, build frontends, or summarize documents entirely for free.",
    listIds: ["stablediffusion", "v0", "chatgpt"],
    verdict: "If you have a modern computer, run **Stable Diffusion** locally for free image creation. For web development, utilize **v0's** generous free credits, and fall back on **ChatGPT's** free web interface for basic tasks."
  }
};
