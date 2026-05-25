// Mock database for AI Tools Directory and Reviews

const INITIAL_TOOLS = [
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="url(#gradient-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="url(#gradient-cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="gradient-cyan" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00F2FE"/>
          <stop offset="1" stop-color="#4FACFE"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.9,
    ratingCount: 382,
    pricing: "Freemium",
    pricingDetails: "Free tier with 50 fast premium uses; Pro at $20/month for unlimited completions.",
    shortDescription: "The AI-first code editor designed to make you exceptionally productive, built on top of VS Code.",
    description: "Cursor is an AI-powered code editor fork of VS Code. It features seamless integration with powerful large language models to enable multi-file edits, natural language codebase search, auto-completions, and direct chat. Designed to run locally with full support for VS Code extensions, it integrates AI directly into the editing experience.",
    features: [
      "AI-powered multi-file code editing (Composer)",
      "Natural language codebase search and reasoning",
      "Inline AI code generation and debugging",
      "Full VS Code extension ecosystem compatibility",
      "Privacy mode to prevent codebase training"
    ],
    pros: [
      "Incredibly fast and context-aware autocomplete",
      "Seamless migration for existing VS Code users",
      "Multi-file edit feature saves hours of refactoring",
      "Excellent local project reasoning capabilities"
    ],
    cons: [
      "Can consume high memory on larger codebases",
      "Paid plans are required for high-volume developer usage",
      "Heavy reliance on internet connection for cloud models"
    ],
    website: "https://cursor.com/?via=aitoolsdir",
    sponsored: true,
    tags: ["IDE", "Autocomplete", "Free Tier", "Best Value", "Editor"],
    specs: {
      platform: "Windows, macOS, Linux",
      apiAccess: "Available via API keys or subscription",
      targetAudience: "Software Engineers, Web Developers, Students",
      trialLength: "Free forever basic plan",
      hosting: "Desktop Client (Local Editor)"
    },
    reviews: [
      {
        id: "rev1",
        username: "dev_architect",
        rating: 5,
        comment: "Absolutely game-changing editor. Composer has completely changed how I refactor entire folders. I rarely open standard VS Code now.",
        date: "2026-05-10"
      },
      {
        id: "rev2",
        username: "sarah_code",
        rating: 4.8,
        comment: "The codebase search is incredibly accurate. It saved me hours trying to figure out where a custom hook was registered in a messy legacy project.",
        date: "2026-05-18"
      }
    ]
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    category: "coding",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" stroke="url(#gradient-violet)" stroke-width="2"/>
      <path d="M12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6Z" fill="url(#gradient-violet)" fill-opacity="0.2" stroke="url(#gradient-violet)" stroke-width="2"/>
      <path d="M8 14C8 16.5 10 18 12 18C14 18 16 16.5 16 14" stroke="url(#gradient-violet)" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="gradient-violet" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7F00FF"/>
          <stop offset="1" stop-color="#E100FF"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.7,
    ratingCount: 1540,
    pricing: "Paid",
    pricingDetails: "Individual plan is $10/month or $100/year. Free for students and popular open source maintainers.",
    shortDescription: "The original AI pair programmer that provides autocomplete suggestions directly inside your favorite IDEs.",
    description: "GitHub Copilot is the pioneer AI autocomplete tool trained on billions of lines of public code. It acts as an extension in VS Code, JetBrains, Visual Studio, and Neovim, helping developers write code faster by suggesting entire lines or blocks based on comments and context.",
    features: [
      "Sub-second inline code completions",
      "Supports all major programming languages",
      "Copilot Chat window for conversational code analysis",
      "Context filtering to block public code matches",
      "Corporate/enterprise compliance security rules"
    ],
    pros: [
      "Integrates natively inside standard IDEs without layout shifts",
      "Free for verified students and open-source contributors",
      "Extremely fast suggestions backed by Github's infrastructure",
      "Great at repetitive boilerplate tasks"
    ],
    cons: [
      "No native standalone desktop app (strictly extension-based)",
      "Occasionally hallucinates older API syntaxes",
      "Context window is more limited compared to new AI-native editors"
    ],
    website: "https://github.com/features/copilot?ref=aitoolsdir",
    sponsored: false,
    tags: ["Autocomplete", "Extension", "Students Free", "Popular"],
    specs: {
      platform: "VS Code, JetBrains, Neovim, Visual Studio",
      apiAccess: "Enterprise integrations only",
      targetAudience: "Developers of all experience levels, Students",
      trialLength: "30-day free trial",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "cop_rev1",
        username: "rust_cean",
        rating: 4.5,
        comment: "Excellent at boilerplate. It excels at filling out repetitive match arms in Rust, but fails slightly on complex type logic.",
        date: "2026-04-12"
      }
    ]
  },
  {
    id: "v0",
    name: "v0 by Vercel",
    category: "coding",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H22L12 2Z" fill="url(#gradient-dark)" stroke="url(#gradient-cyan)" stroke-width="2"/>
      <circle cx="12" cy="14" r="3" stroke="#00F2FE" stroke-width="2"/>
      <defs>
        <linearGradient id="gradient-dark" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#151124"/>
          <stop offset="1" stop-color="#0B0813"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.8,
    ratingCount: 290,
    pricing: "Freemium",
    pricingDetails: "Free plan with 200 monthly credits. Premium plans starting at $20/month.",
    shortDescription: "A generative UI system by Vercel that produces clean, copy-pasteable React, Tailwind, and HTML layouts.",
    description: "v0 is an AI system designed to build user interfaces. You describe the UI you want, and v0 generates production-ready, beautifully designed React code styling with Tailwind CSS and shadcn/ui components. You can iterate directly, asking v0 to tweak alignments, colors, or add custom components.",
    features: [
      "Generates shadcn/ui and Tailwind components",
      "Immediate interactive browser preview of generated UI",
      "Refine elements iteratively using plain English prompts",
      "One-click deploy to Vercel or code copy-paste",
      "Dark and light mode generation support"
    ],
    pros: [
      "Cuts UI scaffolding time down by 80%",
      "Generates modern, standard layouts adhering to best design practices",
      "Fully interactive previews in-browser",
      "Clean, modern React/Tailwind/TypeScript code output"
    ],
    cons: [
      "Can exhaust free generation credits very quickly",
      "Not suited for backend or heavy business logic generation",
      "Heavy bias towards React and Tailwind CSS stacks"
    ],
    website: "https://v0.dev/?ref=aitoolsdir",
    sponsored: false,
    tags: ["UI Builder", "React", "Tailwind", "Free Tier"],
    specs: {
      platform: "Web-based",
      apiAccess: "None",
      targetAudience: "Frontend Developers, UI/UX Designers, Builders",
      trialLength: "Recurring free monthly credits",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "v0_rev1",
        username: "frontend_ninja",
        rating: 5,
        comment: "This has completely replaced my boilerplate step. I prompt the layout, copy the React/Tailwind, and put it in my code. Absolutely spectacular.",
        date: "2026-05-15"
      }
    ]
  },
  {
    id: "midjourney",
    name: "Midjourney",
    category: "image",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="url(#gradient-gold)" stroke="url(#gradient-gold)" stroke-width="1"/>
      <path d="M5 12H19" stroke="url(#gradient-gold)" stroke-width="2" stroke-dasharray="2 2"/>
      <defs>
        <linearGradient id="gradient-gold" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFE259"/>
          <stop offset="1" stop-color="#FFA751"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.8,
    ratingCount: 1940,
    pricing: "Paid",
    pricingDetails: "Plans start at $10/month (Basic plan with fast GPU hours) up to $120/month.",
    shortDescription: "An incredibly artistic, industry-standard AI image generator operated via Discord and a web interface.",
    description: "Midjourney produces highly detailed, photorealistic, and cinematic illustrations based on text descriptions. Widely regarded as the most aesthetic and creative AI image engine, Midjourney has evolved from running purely inside Discord channels to launching a fully interactive web interface for image creation.",
    features: [
      "Unrivaled aesthetic detail, lighting, and textures",
      "Inpainting (Vary Region) and Outpainting (Zoom) canvas expansions",
      "Character reference and Style reference parameters (cref, sref)",
      "High resolution upscaling options up to 4K",
      "Web interface with immediate slider-based controls"
    ],
    pros: [
      "Stunning, photographic, and abstract artistic quality",
      "Style reference (sref) allows strict visual design consistency",
      "Incredible lighting and portrait rendering out of the box",
      "Active, massive community of creators sharing prompts"
    ],
    cons: [
      "No longer offers a free tier (strictly paid service)",
      "Prompt system is quirky with highly specific parameter codes (e.g. --v 6 --ar 16:9)",
      "Text rendering inside images still requires highly careful prompt tuning"
    ],
    website: "https://midjourney.com/?ref=aitoolsdir",
    sponsored: true,
    tags: ["Artistic", "Photorealism", "Designers Fav", "Editor's Choice"],
    specs: {
      platform: "Web & Discord client",
      apiAccess: "No official public API (third parties exist)",
      targetAudience: "Digital Artists, Graphic Designers, Creative Directors",
      trialLength: "No free trials available",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "mid_rev1",
        username: "cyber_art",
        rating: 5,
        comment: "Nothing matches the style of Midjourney V6. It renders human skin, dynamic lighting, and cinematic scenes with details that Stable Diffusion needs 100 extensions to match.",
        date: "2026-05-19"
      }
    ]
  },
  {
    id: "stablediffusion",
    name: "Stable Diffusion (SDXL)",
    category: "image",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#gradient-rose)" stroke-width="2"/>
      <path d="M12 6V18" stroke="url(#gradient-rose)" stroke-width="2"/>
      <path d="M6 12H18" stroke="url(#gradient-rose)" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="url(#gradient-rose)"/>
      <defs>
        <linearGradient id="gradient-rose" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F857A6"/>
          <stop offset="1" stop-color="#FF5858"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.6,
    ratingCount: 1120,
    pricing: "Free",
    pricingDetails: "Open source and 100% free to download and run locally. Commercial cloud hosting variants exist.",
    shortDescription: "The ultimate open-source, highly customizable AI image model you can download and run on your own PC.",
    description: "Stable Diffusion (developed by Stability AI) is an open-source text-to-image model. Because the weights are public, it is the cornerstone of the local AI generation movement, supporting thousands of custom models, ControlNet adapters for structured generation, LoRAs, and UI frameworks like Automatic1111 and ComfyUI.",
    features: [
      "100% locally runnable with zero censorship",
      "ControlNet support for strict pose, depth, and edge mapping",
      "Fine-tunable using custom LoRA weights and embeddings",
      "Active ecosystem of community custom checkpoints (Civitai)",
      "High scalability and batch processing workflows"
    ],
    pros: [
      "Completely free to run without restrictions",
      "Unmatched precision over composition via ControlNet",
      "Extensive customizability through plugins and UIs",
      "Runs fully offline on standard gaming graphics cards"
    ],
    cons: [
      "Requires high-end PC hardware (NVIDIA GPU with 8GB+ VRAM recommended)",
      "Steep learning curve, especially ComfyUI node setups",
      "Requires manual updates and troubleshooting"
    ],
    website: "https://stability.ai/?ref=aitoolsdir",
    sponsored: false,
    tags: ["Open Source", "Free", "Offline Mode", "Highly Custom"],
    specs: {
      platform: "Windows, Linux, macOS (Web interfaces available)",
      apiAccess: "Available via Stability Developer Platform",
      targetAudience: "Tech-savvy Creators, Developers, Game Designers",
      trialLength: "Free forever (Local)",
      hosting: "Local (Self-Hosted) or Cloud API"
    },
    reviews: [
      {
        id: "sd_rev1",
        username: "render_master",
        rating: 4,
        comment: "Amazing control! With ControlNet, I can lock an architect's blueprint lines and generate photorealistic interior renderings in seconds. Not easy to set up though.",
        date: "2026-05-02"
      }
    ]
  },
  {
    id: "runway",
    name: "Runway Gen-2",
    category: "video",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12H3" stroke="url(#gradient-purple-blue)" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 3V21" stroke="url(#gradient-purple-blue)" stroke-width="2" stroke-linecap="round"/>
      <rect x="5" y="5" width="6" height="6" rx="1" fill="url(#gradient-purple-blue)" fill-opacity="0.3" stroke="url(#gradient-purple-blue)" stroke-width="2"/>
      <rect x="13" y="13" width="6" height="6" rx="1" fill="url(#gradient-purple-blue)" fill-opacity="0.3" stroke="url(#gradient-purple-blue)" stroke-width="2"/>
      <defs>
        <linearGradient id="gradient-purple-blue" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stop-color="#a8c0ff"/>
          <stop offset="1" stop-color="#3f2b96"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.5,
    ratingCount: 450,
    pricing: "Freemium",
    pricingDetails: "Free trial includes 125 credits. Subscriptions range from $15/month (Standard) to $95/month (Unlimited).",
    shortDescription: "A pioneering text-to-video and image-to-video AI suite trusted by Hollywood and indie filmmakers.",
    description: "Runway Gen-2 is a web-based multimodal AI system that generates new video clips from text prompts, static images, or existing video streams. It offers advanced control tools such as Motion Brush, which lets users specify precise movement directions for specific image regions.",
    features: [
      "High-fidelity Text-to-Video and Image-to-Video generation",
      "Motion Brush for regional structural motion control",
      "Camera control parameters (Pan, Zoom, Tilt, Roll, Speed)",
      "Inpainting tools to edit objects dynamically inside video frames",
      "Built-in timeline, audio layering, and export settings"
    ],
    pros: [
      "Industry standard with regular AI updates",
      "Motion Brush offers unmatched control over video details",
      "Full cloud-based editor makes importing and cutting footage easy",
      "Great variety of styling prompts built in"
    ],
    cons: [
      "Free credits disappear in a few standard generation trials",
      "Highly dynamic motions can cause fluid warping or surreal morphs",
      "Maximum single-clip output length is relatively short (4-16s)"
    ],
    website: "https://runwayml.com/?ref=aitoolsdir",
    sponsored: true,
    tags: ["Video Editor", "Hollywood Tech", "Motion Brush", "Free Trial"],
    specs: {
      platform: "Web-based, iOS App",
      apiAccess: "Available for Enterprise integrations",
      targetAudience: "Filmmakers, Motion designers, Advertisers, Architects",
      trialLength: "125 one-time free credits",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "run_rev1",
        username: "indie_director",
        rating: 5,
        comment: "For B-roll, Runway is magical. Image-to-Video combined with Motion Brush lets me animate static digital paintings into atmospheric visual sequences.",
        date: "2026-05-14"
      }
    ]
  },
  {
    id: "heygen",
    name: "HeyGen",
    category: "video",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="url(#gradient-neon)" stroke-width="2"/>
      <path d="M10 8L16 12L10 16V8Z" fill="url(#gradient-neon)"/>
      <defs>
        <linearGradient id="gradient-neon" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00FF87"/>
          <stop offset="1" stop-color="#60EFFF"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.7,
    ratingCount: 310,
    pricing: "Freemium",
    pricingDetails: "Free tier offers 1 credit/month. Creator plans start at $29/mo, custom plans available.",
    shortDescription: "An AI-powered video avatar platform that creates photorealistic talking-head videos in minutes.",
    description: "HeyGen utilizes advanced deep learning to create humanlike avatars that speak in over 40 languages. Ideal for marketing, sales training, tutorials, and onboarding, HeyGen translates text inputs into natural speech perfectly synced with high-fidelity visual avatars, custom-cloned voices, or cartoon illustrations.",
    features: [
      "100+ highly realistic custom and preset human avatars",
      "Voice cloning with perfect accent matching in 40+ languages",
      "Auto-translation of videos into multiple target languages",
      "Interactive conversational avatars for websites",
      "Integrations with Canva, ChatGPT, and Zapier"
    ],
    pros: [
      "Uncanny mouth syncing and blinking logic",
      "Saves thousands of dollars on actors and voiceovers",
      "Extremely quick video assembly from script text",
      "Allows creation of a personalized avatar of yourself"
    ],
    cons: [
      "Pricing can be high for scaling teams requiring high resolutions",
      "Can look slightly static in the torso and hands",
      "Requires strict video proof of consent to clone custom voices"
    ],
    website: "https://heygen.com/?ref=aitoolsdir",
    sponsored: false,
    tags: ["Avatar", "Marketing", "Voice Clone", "Sales Helper"],
    specs: {
      platform: "Web-based",
      apiAccess: "Full REST APIs for avatar generation",
      targetAudience: "Content Creators, Marketers, HR Managers",
      trialLength: "1 free credit per month",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "hey_rev1",
        username: "marketing_gal",
        rating: 5,
        comment: "This has cut down our employee training video budget by 90%. I just update the script text, click render, and the avatar delivers the training without reshoots.",
        date: "2026-05-17"
      }
    ]
  },
  {
    id: "claude",
    name: "Claude by Anthropic",
    category: "productivity",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="url(#gradient-anthropic)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M12 6V18" stroke="url(#gradient-anthropic)" stroke-width="2"/>
      <path d="M8 10H16" stroke="url(#gradient-anthropic)" stroke-width="2"/>
      <path d="M8 14H16" stroke="url(#gradient-anthropic)" stroke-width="2"/>
      <defs>
        <linearGradient id="gradient-anthropic" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#D97706"/>
          <stop offset="1" stop-color="#F59E0B"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.9,
    ratingCount: 2200,
    pricing: "Freemium",
    pricingDetails: "Free web version with limits. Claude Pro is $20/month offering 5x usage.",
    shortDescription: "A highly intelligent, secure conversational AI with peerless reasoning, coding, and analytical writing.",
    description: "Claude, developed by Anthropic, is one of the world's most advanced LLMs. With a massive 200,000 token context window, it can digest entire code bases or books. Claude is highly praised by developers for its natural conversational tone, superior code generation, strict ethical alignment, and its interactive 'Artifacts' window for previewing generated files in real time.",
    features: [
      "200K token context window for massive uploads",
      "Claude Artifacts for HTML/JS, SVG, and document visual previews",
      "Peerless mathematical reasoning and technical coding accuracy",
      "Custom 'Projects' feature to group documents and instructions",
      "Strict data privacy controls (no training on enterprise chats)"
    ],
    pros: [
      "Writing tone feels human and far less formulaic than ChatGPT",
      "Extraordinary comprehension of dense technical research documents",
      "Interactive Artifacts makes frontend prototyping a joy",
      "Capable of reading and compiling mathematical logic"
    ],
    cons: [
      "Web interface limits message rates quickly under heavy load",
      "Free tier context limits can feel restricted during peak hours",
      "No native live voice mode like ChatGPT's Advanced Voice"
    ],
    website: "https://claude.ai/?ref=aitoolsdir",
    sponsored: true,
    tags: ["Best Value", "Students Choice", "Artifacts", "Coding Helper"],
    specs: {
      platform: "Web-based, iOS & Android Apps",
      apiAccess: "Anthropic API & Amazon Bedrock",
      targetAudience: "Writers, Software Engineers, Researchers, Students",
      trialLength: "Free basic tier with limits",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "claude_rev1",
        username: "grad_student",
        rating: 5,
        comment: "Claude is my primary research assistant. I upload 4 different 50-page PDF studies, and it synthesizes the contradictory data points flawlessly. The writing style is top notch.",
        date: "2026-05-20"
      }
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "productivity",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="url(#gradient-chatgpt)" stroke-width="2"/>
      <path d="M12 8V16M8 12H16" stroke="url(#gradient-chatgpt)" stroke-width="2" stroke-linecap="round"/>
      <path d="M9.5 9.5L14.5 14.5" stroke="url(#gradient-chatgpt)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M14.5 9.5L9.5 14.5" stroke="url(#gradient-chatgpt)" stroke-width="1.5" stroke-linecap="round"/>
      <defs>
        <linearGradient id="gradient-chatgpt" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10A37F"/>
          <stop offset="1" stop-color="#057053"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.8,
    ratingCount: 8900,
    pricing: "Freemium",
    pricingDetails: "Free tier uses GPT-4o-mini. Plus plan is $20/month for advanced GPT-4o access and custom GPTs.",
    shortDescription: "The household name in conversational AI, offering advanced voice, image recognition, and web searching.",
    description: "OpenAI's ChatGPT is the most widely adopted AI assistant. Powered by GPT-4o and custom o1 reasoning models, it offers integrated web search, DALL-E 3 image generation, data analysis scripting (Advanced Data Analysis), and a revolutionary Advanced Voice Mode that holds real-time, emotionally responsive vocal conversations.",
    features: [
      "Integrated web browsing and real-time news search",
      "Advanced Data Analysis (Python execution environment)",
      "Image input recognition and OCR",
      "DALL-E 3 image generation directly inside the chat",
      "Advanced Voice Mode for humanlike conversation speed"
    ],
    pros: [
      "Incredible voice-to-voice interaction feels like science fiction",
      "Highly capable Python sandbox for charting and data processing",
      "Huge marketplace of custom user GPTs",
      "Extremely reliable server availability"
    ],
    cons: [
      "Text styling can feel boilerplate (excessive use of 'delve', 'testament', etc.)",
      "Web searching sometimes summarizes low-quality SEO articles",
      "Advanced features are heavily rate-limited on peak days"
    ],
    website: "https://chatgpt.com/?ref=aitoolsdir",
    sponsored: false,
    tags: ["Household Name", "Voice Mode", "Web Search", "Free Tier"],
    specs: {
      platform: "Web, iOS, Android, macOS & Windows Clients",
      apiAccess: "OpenAI API",
      targetAudience: "General Public, Professionals, Students",
      trialLength: "Free basic tier with limits",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "gpt_rev1",
        username: "josh_ventures",
        rating: 5,
        comment: "The advanced voice mode is spectacular for learning languages. I practice my conversational Spanish during commutes and it corrects my grammar perfectly.",
        date: "2026-05-12"
      }
    ]
  },
  {
    id: "notionai",
    name: "Notion AI",
    category: "productivity",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="url(#gradient-notion)" stroke-width="2"/>
      <path d="M8 8V16L11 12L13 16V8" stroke="url(#gradient-notion)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="gradient-notion" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stop-color="#e2e2e2"/>
          <stop offset="1" stop-color="#111111"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.6,
    ratingCount: 520,
    pricing: "Paid",
    pricingDetails: "Available as an add-on to Notion workspace plans for $8-$10/user/month.",
    shortDescription: "An embedded writing, summarization, and cognitive search assistant built directly inside Notion workspaces.",
    description: "Notion AI integrates generative models straight into your text canvas and documents. Users can trigger AI anywhere on a page using the spacebar or slash commands to brainstorm ideas, summarize meeting notes, rewrite style tones, autofill tabular databases, and query their entire Notion database for answers.",
    features: [
      "In-line document editing, rewording, and translation",
      "Automated summary generations for long wikis and databases",
      "AI Autofill formulas and custom properties inside tables",
      "Notion Q&A for cross-workspace semantic searches",
      "Active meeting transcript action-item generation"
    ],
    pros: [
      "Extremely convenient—no need to copy-paste between external chat tools",
      "Semantic search (Q&A) scans thousands of your private docs instantly",
      "Tabular database auto-filling saves massive manual entry time",
      "Outstanding document translation capabilities"
    ],
    cons: [
      "Requires subscription—no permanent free-tier version available",
      "Requires already being an active user of the Notion document ecosystem",
      "Underlying model is slightly less optimized for complex custom programming tasks"
    ],
    website: "https://notion.so/product/ai?ref=aitoolsdir",
    sponsored: false,
    tags: ["Embedded AI", "Database Helper", "Organizers Choice"],
    specs: {
      platform: "Web-based, Desktop App, Mobile Apps",
      apiAccess: "Available via Notion API",
      targetAudience: "Project Managers, Team Leaders, Organizers, Writers",
      trialLength: "Limited free AI responses for test workspaces",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "not_rev1",
        username: "agile_pm",
        rating: 4.5,
        comment: "We compile all user stories here. Using Q&A, I can ask: 'What did we decide on the payment gateway API in March?' and it instantly gives the correct citation. Priceless.",
        date: "2026-05-09"
      }
    ]
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    category: "productivity",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="url(#gradient-perplexity)" stroke-width="2"/>
      <path d="M12 6V18" stroke="url(#gradient-perplexity)" stroke-width="2" stroke-dasharray="2 2"/>
      <circle cx="12" cy="12" r="2" fill="url(#gradient-perplexity)"/>
      <defs>
        <linearGradient id="gradient-perplexity" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#20B2AA"/>
          <stop offset="1" stop-color="#008B8B"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.8,
    ratingCount: 780,
    pricing: "Freemium",
    pricingDetails: "Free version with standard queries. Pro is $20/month with access to Opus, GPT-4o, and unlimited search files.",
    shortDescription: "A revolutionary conversational search engine that provides instant, citation-backed answers to queries.",
    description: "Perplexity AI functions as a search-first answers engine. Instead of a list of blue links, it reads and crawls the live web, synthesizing a comprehensive response with superscript footnotes linked directly to sources. Users can toggles models, upload document files, and search specific channels like Reddit, Academic Journals, or Youtube.",
    features: [
      "Live web crawling and instant footnote citations",
      "Focus channels (Academic papers, Reddit, Youtube, Writing)",
      "Pro Search for deep multi-step research questions",
      "Model Selector (Claude 3.5 Sonnet, GPT-4o, Llama-3)",
      "Collection threads to organize researches"
    ],
    pros: [
      "Provides direct, objective answers with source validation",
      "Virtually eliminates SEO spam links by reading text directly",
      "Pro search solves multi-layered queries by generating sub-questions",
      "Outstanding research tool for academic students and writers"
    ],
    cons: [
      "Can occasionally miss details behind paywalled publications",
      "Synthesizes matches instead of letting you explore design layouts directly",
      "Copy-paste text contains markup footnotes which requires minor cleanup"
    ],
    website: "https://perplexity.ai/?ref=aitoolsdir",
    sponsored: false,
    tags: ["Search Engine", "Citations", "Students Choice", "Editor's Choice"],
    specs: {
      platform: "Web-based, iOS & Android Apps",
      apiAccess: "Perplexity Sonar API for developers",
      targetAudience: "Researchers, Analysts, Students, Journalists",
      trialLength: "Free basic tier with limits",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "perp_rev1",
        username: "fact_checker",
        rating: 5,
        comment: "Google is dead to me. Perplexity gives me a comprehensive answer with 8 source citations in 2 seconds. Perfect for researching hardware reviews.",
        date: "2026-05-21"
      }
    ]
  },
  {
    id: "adobe-firefly",
    name: "Adobe Firefly",
    category: "image",
    logo: `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 22H22L12 2Z" fill="url(#gradient-adobe)" stroke="url(#gradient-adobe)" stroke-width="2"/>
      <path d="M12 8L6 18H18L12 8Z" fill="#ffffff" fill-opacity="0.2"/>
      <defs>
        <linearGradient id="gradient-adobe" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF0000"/>
          <stop offset="1" stop-color="#FF7A00"/>
        </linearGradient>
      </defs>
    </svg>`,
    rating: 4.5,
    ratingCount: 610,
    pricing: "Freemium",
    pricingDetails: "Free tier gives 25 monthly generative credits. Premium starts at $4.99/mo.",
    shortDescription: "Safe-for-commercial-use generative AI model integrated natively inside Adobe Photoshop and Illustrator.",
    description: "Adobe Firefly is a family of generative creative AI models. Trained exclusively on licensed content, public domain items, and Adobe Stock, Firefly offers enterprise indemnity. It powers features like Generative Fill and Generative Expand directly within Photoshop, allowing smooth image manipulation.",
    features: [
      "Trained on legally safe, licensed stocks (Commercial Safe)",
      "Generative Fill to add or remove details inside Photoshop",
      "Vector Graphic Recolor inside Adobe Illustrator",
      "Text Effects generator for typographical styles",
      "Generative Expand to fill missing boundaries"
    ],
    pros: [
      "100% commercially safe with legal protection for companies",
      "Outstanding, seamless Photoshop integration",
      "Excellent vector matching tools",
      "High-speed generation on web interface"
    ],
    cons: [
      "Artistic aesthetics are sometimes more conservative/stock-like than Midjourney",
      "Credits are depleted fast when using high resolutions",
      "Requires Adobe Creative Cloud ecosystem for maximum benefit"
    ],
    website: "https://adobe.com/products/firefly.html?ref=aitoolsdir",
    sponsored: false,
    tags: ["Commercial Safe", "Adobe Suite", "Vector Helper", "Free Tier"],
    specs: {
      platform: "Web-based, Photoshop / Illustrator Integration",
      apiAccess: "Adobe Firefly APIs available",
      targetAudience: "Enterprise designers, Branding agencies, Illustrators",
      trialLength: "25 monthly credits free",
      hosting: "Cloud-Based"
    },
    reviews: [
      {
        id: "ad_rev1",
        username: "brand_lead",
        rating: 5,
        comment: "The commercial safety is why our agency uses it. We cannot risk using Midjourney for client logos due to copyright queries. Generative Fill in Photoshop works like magic.",
        date: "2026-05-04"
      }
    ]
  }
];

const CURATED_PAGES = {
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
