import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsPath = path.join(__dirname, "../src/data/tools.json");

const NEW_TOOLS = [
  {
    "id": "gemini",
    "name": "Google Gemini",
    "category": "productivity",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 12.5 8.5 16.5 12.5C20.5 16.5 22 12 22 12C22 12 15.5 11.5 11.5 7.5C7.5 3.5 12 2 12 2Z" fill="url(#gradient-gemini)" stroke="url(#gradient-gemini)" stroke-width="1"/>
      <path d="M12 22C12 22 11.5 15.5 7.5 11.5C3.5 7.5 2 12 2 12C2 12 8.5 12.5 12.5 16.5C16.5 20.5 12 22 12 22Z" fill="url(#gradient-gemini)" stroke="url(#gradient-gemini)" stroke-width="1"/>
      <defs>
        <linearGradient id="gradient-gemini" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#38bdf8"/>
          <stop offset="0.5" stop-color="#818cf8"/>
          <stop offset="1" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.7,
    "ratingCount": 4210,
    "pricing": "Freemium",
    "pricingDetails": "Free version powered by Gemini 1.5 Flash. Gemini Advanced is $20/month offering 1.5 Pro and deep Google Workspace integrations.",
    "shortDescription": "Google's highly advanced multimodal AI assistant integrated natively across Android, search, and Google Workspace.",
    "description": "Google Gemini is a highly advanced multimodal AI model capable of reasoning across text, code, images, audio, and video. Integrated natively within the Google ecosystem, Gemini features a massive context window of up to 1 million tokens, making it outstanding for deep analysis of massive datasets, videos, and multi-file codebases.",
    "features": [
      "Massive 1 million token context window for native uploads",
      "Multimodal analysis of files, images, codebases, and audio",
      "Native Google Docs, Gmail, and Workspace integrations",
      "Fast response speed powered by Gemini 1.5 Flash",
      "Double-check answers using real-time Google Search integration"
    ],
    "pros": [
      "Deeply integrated with Google products (Docs, Sheets, Drive)",
      "Unrivaled context window length (up to 1M tokens on Advanced)",
      "Outstanding at analyzing long video files directly",
      "Extremely capable and competitive developer API pricing"
    ],
    "cons": [
      "Can occasionally be overly conservative or safety-blocked",
      "Voice model is slightly less conversational than ChatGPT's Advanced Voice",
      "Workspace integrations require a paid Gemini Advanced subscription"
    ],
    "website": "https://gemini.google.com/?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "Multimodal",
      "Google Ecosystem",
      "Large Context",
      "Free Tier"
    ],
    "specs": {
      "platform": "Web-based, Android & iOS Apps",
      "apiAccess": "Google AI Studio API available",
      "targetAudience": "General Users, Developers, Data Analysts, Students",
      "trialLength": "Free forever basic plan",
      "hosting": "Cloud-Based"
    },
    "reviews": [
      {
        "id": "gem_rev1",
        "username": "data_surfer",
        "rating": 4.8,
        "comment": "Uploading a full 45-minute lecture video and getting a highly precise, timestamped summary in seconds is mind-blowing. Gemini's video context window is completely unmatched.",
        "date": "2026-05-18"
      }
    ],
    "useCases": [
      "Summarizing long YouTube videos or custom audio recordings",
      "Analyzing extremely large codebase repositories in a single prompt",
      "Direct document drafting and action items inside Google Workspace"
    ],
    "faqs": [
      {
        "q": "What models power the free version of Google Gemini?",
        "a": "The free version is powered by Gemini 1.5 Flash, which is optimized for ultra-fast speeds and high reasoning capability."
      },
      {
        "q": "What is the maximum file size Gemini can analyze?",
        "a": "With Gemini Advanced's 1 million token context window, you can upload massive PDFs, complete codebases, or videos up to an hour long."
      }
    ],
    "comparisons": [
      "chatgpt",
      "claude"
    ]
  },
  {
    "id": "leonardo",
    "name": "Leonardo AI",
    "category": "image",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 9L12 16L20 9L12 2Z" fill="url(#gradient-leo)" stroke="url(#gradient-leo)" stroke-width="1"/>
      <path d="M4 15L12 22L20 15" stroke="url(#gradient-leo)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="9" r="2" fill="#FFFFFF"/>
      <defs>
        <linearGradient id="gradient-leo" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFB300"/>
          <stop offset="1" stop-color="#E65100"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.7,
    "ratingCount": 1420,
    "pricing": "Freemium",
    "pricingDetails": "Free tier offers 150 daily credits. Premium plans start at $10/month scaling to $48/month.",
    "shortDescription": "High-fidelity production-ready generative image suite optimized for game assets and digital graphics.",
    "description": "Leonardo AI is an advanced generative platform designed specifically for game designers, character developers, and visual content creators. Built on top of custom-trained Stable Diffusion structures, it features real-time canvas editors, custom model fine-tuning, motion generation, and strict character/pose locks.",
    "features": [
      "Generates highly structured game assets and visual layouts",
      "Real-time canvas for selective inpainting and outpainting edits",
      "Pose and structural guidance locking via ControlNet modules",
      "Custom LoRA model training directly in-browser",
      "Daily recurring free generation credits (150 credits)"
    ],
    "pros": [
      "Extremely generous recurring free tier of 150 daily credits",
      "Outstanding, professional dashboard for asset organization",
      "Highly customizable guidance weights and resolution parameters",
      "Allows hosting and selling fine-tuned community models"
    ],
    "cons": [
      "Web layout is feature-rich but has a steep initial learning curve",
      "Free generations are placed in a public gallery feed",
      "Video motion outputs occasionally warp heavily"
    ],
    "website": "https://leonardo.ai/?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "Game Assets",
      "Character Design",
      "Free Daily",
      "Popular"
    ],
    "specs": {
      "platform": "Web-based, iOS App",
      "apiAccess": "Full Developer API available",
      "targetAudience": "Game Artists, Concept Designers, Content Creators",
      "trialLength": "150 recurring free credits daily",
      "hosting": "Cloud-Based"
    },
    "reviews": [
      {
        "id": "leo_rev1",
        "username": "indie_dev_jack",
        "rating": 5,
        "comment": "As an indie game developer, Leonardo is a lifesaver. I trained a custom model on my own sketches and generated 100 consistent 2D isometric item assets in an afternoon.",
        "date": "2026-05-14"
      }
    ],
    "useCases": [
      "Consistent game asset generation and character rendering",
      "Interactive structural painting via real-time canvas",
      "Custom brand styler training using LoRA models in-browser"
    ],
    "faqs": [
      {
        "q": "Are my images public on Leonardo AI?",
        "a": "Yes, images generated on the free tier are added to the public catalog. Subscribing to a premium tier allows private image generations."
      },
      {
        "q": "What is the daily credit limit?",
        "a": "Free accounts receive 150 tokens every 24 hours, which is enough to generate approximately 30-75 high-fidelity images."
      }
    ],
    "comparisons": [
      "midjourney",
      "stablediffusion"
    ]
  },
  {
    "id": "elevenlabs",
    "name": "ElevenLabs",
    "category": "video",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12C4 8 8 4 12 4C16 4 20 8 20 12" stroke="url(#gradient-eleven)" stroke-width="2" stroke-linecap="round"/>
      <path d="M6 14C6 11 9 9 12 9C15 9 18 11 18 14" stroke="url(#gradient-eleven)" stroke-width="2" stroke-linecap="round"/>
      <path d="M8 16H16" stroke="url(#gradient-eleven)" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 18V20" stroke="url(#gradient-eleven)" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="gradient-eleven" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stop-color="#34d399"/>
          <stop offset="1" stop-color="#059669"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.9,
    "ratingCount": 2100,
    "pricing": "Freemium",
    "pricingDetails": "Free plan gives 10,000 characters monthly. Creator plans start at $5/month up to $330/month.",
    "shortDescription": "Industry-standard AI voice generator producing photorealistic, emotional speech and sound effects.",
    "description": "ElevenLabs is the undisputed leader in generative AI voice synthesis. Able to clone custom voices from short 1-minute audio clips, it produces natural voiceovers with perfect emotional pacing, accents, and punctuation, supporting audiobook generation, game dubbing, and video translations.",
    "features": [
      "Hyper-realistic custom voice cloning and synthesis",
      "AI sound effects generator (actions, atmospheres, hits)",
      "Perfect multi-language translation and voice dubbing",
      "Extensive voice design dashboard (sliders for age, accent, gender)",
      "Enterprise-grade speech-to-speech voice conversions"
    ],
    "pros": [
      "Speech sounds indistinguishable from human voice actors",
      "Clones custom voices with outstanding accuracy from short clips",
      "Auto dubs video clips into 30+ languages keeping the same voice",
      "Outstanding API for real-time applications and game systems"
    ],
    "cons": [
      "Character credit pools exhaust rapidly on long transcripts",
      "Free tier lacks custom voice cloning support",
      "Requires high-quality microphone input for voice cloning references"
    ],
    "website": "https://elevenlabs.io/?ref=aitoolsdir",
    "sponsored": true,
    "tags": [
      "Voice Clone",
      "Sound FX",
      "Video Dubbing",
      "Hobbyist Free"
    ],
    "specs": {
      "platform": "Web-based, Developer APIs",
      "apiAccess": "Full developer REST API with sub-second latency",
      "targetAudience": "Video Editors, HR Trainers, Game Developers, Authors",
      "trialLength": "10,000 monthly characters free",
      "hosting": "Cloud-Based"
    },
    "reviews": [
      {
        "id": "ele_rev1",
        "username": "audio_pro",
        "rating": 5,
        "comment": "The emotional range is incredible. Most text-to-speech tools sound completely robotic, but ElevenLabs can whisper, sigh, or sound energetic based on the written context.",
        "date": "2026-05-19"
      }
    ],
    "useCases": [
      "Autogenerating high-fidelity audiobooks from TXT files",
      "Translating company video ads into German, French, and Japanese",
      "Autonomously generating interactive character audio in games via APIs"
    ],
    "faqs": [
      {
        "q": "What is the minimum audio length needed for voice cloning?",
        "a": "Instant voice cloning can be completed using just a 1-minute audio recording, although longer references provide higher fidelity."
      },
      {
        "q": "Can I monetize the voices generated on ElevenLabs?",
        "a": "Yes, premium subscriptions grant commercial licensing rights for all synthesized audio outputs."
      }
    ],
    "comparisons": [
      "heygen",
      "runway"
    ]
  },
  {
    "id": "sora",
    "name": "Sora by OpenAI",
    "category": "video",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="url(#gradient-sora)" stroke-width="2"/>
      <circle cx="10" cy="12" r="3" fill="url(#gradient-sora)"/>
      <path d="M18 9L21 6V18L18 15" stroke="url(#gradient-sora)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="gradient-sora" x1="3" y1="6" x2="21" y2="18" gradientUnits="userSpaceOnUse">
          <stop stop-color="#10a37f"/>
          <stop offset="1" stop-color="#02e1c3"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.9,
    "ratingCount": 110,
    "pricing": "Paid",
    "pricingDetails": "Enterprise-level custom licensing. Limited access program for creative professionals.",
    "shortDescription": "OpenAI's state-of-the-art text-to-video foundation model producing up to 60 seconds of cinema-grade footage.",
    "description": "Sora is OpenAI's state-of-the-art generative video model. By combining diffusion techniques with transformer architectures, Sora generates complex, cinema-grade video clips up to 60 seconds long with highly consistent physics, lighting, multiple characters, and complex camera movements.",
    "features": [
      "Generates continuous, cinematic videos up to 60 seconds long",
      "Maintains strict structural/object consistency across frames",
      "Highly realistic physics, fluid motion, and light reflection simulation",
      "Support for complex multi-angle panning and camera sweeps",
      "Direct image-to-video and video-to-video creative modifications"
    ],
    "pros": [
      "Completely redefines video lengths (up to 1 minute continuous)",
      "Unrivaled photo quality, matching professional film stock",
      "Excellent understanding of material surfaces and object collisions",
      "Generates multiple high-quality clips from a single prompt context"
    ],
    "cons": [
      "Currently restricted to closed preview / enterprise channels",
      "Render times are extremely high compared to short-clip models",
      "Complex physical interactions (e.g. eating food) can still show logic errors"
    ],
    "website": "https://openai.com/sora?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "Cinematic",
      "OpenAI Suite",
      "General World Model",
      "Enterprise"
    ],
    "specs": {
      "platform": "Web Interface (Closed beta)",
      "apiAccess": "Enterprise custom API only",
      "targetAudience": "Professional filmmakers, advertising agencies, visual artists",
      "trialLength": "Closed select testing program",
      "hosting": "Cloud-Based"
    },
    "reviews": [
      {
        "id": "sora_rev1",
        "username": "hollywood_vfx",
        "rating": 5,
        "comment": "Sora is completely on another level. The physics matching, reflections on car windows, and continuous 60-second shots are absolute game-changers for concept rendering.",
        "date": "2026-05-15"
      }
    ],
    "useCases": [
      "Generating cinema-grade, continuous 60-second video mockups",
      "Animating complex multi-character visual concepts with physics",
      "Direct conceptual storyboarding for marketing campaigns"
    ],
    "faqs": [
      {
        "q": "Can I sign up and use Sora today?",
        "a": "Sora is currently in a rollout phase, restricted to select artists, designers, and film professionals for safety audits before public release."
      },
      {
        "q": "What is the maximum output video length?",
        "a": "Sora is capable of generating continuous video sequences up to 60 seconds in length."
      }
    ],
    "comparisons": [
      "runway",
      "heygen"
    ]
  },
  {
    "id": "suno",
    "name": "Suno AI",
    "category": "video",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="url(#gradient-suno)" stroke-width="2"/>
      <circle cx="12" cy="12" r="6" stroke="url(#gradient-suno)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M9 17L14 12V6L19 9" stroke="url(#gradient-suno)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <defs>
        <linearGradient id="gradient-suno" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ffe259"/>
          <stop offset="1" stop-color="#ffa751"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.8,
    "ratingCount": 1640,
    "pricing": "Freemium",
    "pricingDetails": "Free plan gives 50 daily credits (10 songs). Pro tier starts at $8/month; Premier tier at $24/month.",
    "shortDescription": "Generate high-fidelity complete songs including lyrics, vocals, and instruments from a simple text prompt.",
    "description": "Suno AI is the ultimate generative music platform. Able to produce complete 4-minute songs in any genre, Suno generates professional-quality instrumentals, custom lyrics (or takes your custom poetry), and highly realistic vocals matching the desired vocal style and gender, ready for downloads.",
    "features": [
      "Generates complete, radio-ready songs in any genre (Rock, Pop, Jazz, Synthwave)",
      "Vocal and instrumental generation matching plain-text requests",
      "Allows user-provided custom lyrics and chord structures",
      "Song extensions up to 4-8 minutes continuous",
      "Commercial licensing rights granted on premium tiers"
    ],
    "pros": [
      "Generate a complete high-fidelity song in under 30 seconds",
      "Incredible genre flexibility, including local folk and EDM styles",
      "Vocal quality is outstandingly clear and emotional",
      "Free recurring daily credits (50 credits)"
    ],
    "cons": [
      "Instrumental layers can sometimes sound slightly compressed",
      "Free tier songs cannot be monetized commercially",
      "Occasional voice duplication quirks on specialized metal genres"
    ],
    "website": "https://suno.com/?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "Music Creator",
      "Generative Song",
      "Free Credits",
      "Entertainment"
    ],
    "specs": {
      "platform": "Web-based",
      "apiAccess": "Closed public API",
      "targetAudience": "Musicians, Content Creators, Gamers, Hobbyists",
      "trialLength": "50 daily free credits",
      "hosting": "Cloud-Based"
    },
    "reviews": [
      {
        "id": "sun_rev1",
        "username": "jingle_writer",
        "rating": 4.8,
        "comment": "Suno is incredibly addictive. I prompted a '1980s synthwave corporate presentation track about coding' and got a highly aesthetic song with vocals that sound like a real radio hit.",
        "date": "2026-05-11"
      }
    ],
    "useCases": [
      "Generating custom, royalty-free background tracks for YouTube",
      "Accelerating song mockups and chord drafting workflows",
      "Creating customized musical greetings and funny song parodies"
    ],
    "faqs": [
      {
        "q": "Do I own the copyright to Suno songs?",
        "a": "Yes, if you generate songs under a paid plan (Pro or Premier), you own 100% of the commercial rights to the compositions."
      },
      {
        "q": "Can I write my own lyrics?",
        "a": "Yes, Suno features a 'Custom Mode' where you can paste your own lyrics, structure, and request specific musical instruments."
      }
    ],
    "comparisons": [
      "elevenlabs",
      "runway"
    ]
  },
  {
    "id": "cline",
    "name": "Cline",
    "category": "coding",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="url(#gradient-cline)" stroke-width="2"/>
      <path d="M7 9L11 12L7 15" stroke="url(#gradient-cline)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 15H17" stroke="url(#gradient-cline)" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="gradient-cline" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00F2FE"/>
          <stop offset="1" stop-color="#7F00FF"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.8,
    "ratingCount": 670,
    "pricing": "Free",
    "pricingDetails": "Open-source and 100% free to run. Users bring their own API keys (OpenRouter, Anthropic, OpenAI).",
    "shortDescription": "Autonomous, terminal-integrated coding agent inside VS Code capable of executing commands and building projects.",
    "description": "Cline is a highly autonomous, open-source AI agent that runs directly inside VS Code. Integrated with your terminal, file system, and browser, Cline can read/write files, execute shell commands, install packages, compile scripts, and run web-browser tests to confirm its work automatically, keeping you fully in control.",
    "features": [
      "Autonomous terminal control and command executions",
      "Dynamic file editing, directory reading, and refactoring",
      "Integrated browser rendering and UI debugging tests",
      "Supports major API keys (Claude 3.5 Sonnet, OpenRouter, DeepSeek)",
      "Permission check overlays before command runs"
    ],
    "pros": [
      "Completely open-source and free to install",
      "Tackles complex multi-step coding instructions autonomously",
      "Can run tests, identify errors, and correct them without input",
      "Lets you select and change LLM backends easily"
    ],
    "cons": [
      "Can consume a massive amount of token credits on complex tasks",
      "Steep learning curve to prevent loops or unwanted file creations",
      "Requires caution since it runs real shell commands"
    ],
    "website": "https://github.com/cline/cline?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "Open Source",
      "Autonomous",
      "Extension",
      "Agent"
    ],
    "specs": {
      "platform": "VS Code Extension",
      "apiAccess": "Requires standard LLM API keys",
      "targetAudience": "Power Users, Software Engineers, Builders",
      "trialLength": "Free open-source client",
      "hosting": "Local Client (runs via standard API keys)"
    },
    "reviews": [
      {
        "id": "cli_rev1",
        "username": "agentic_coder",
        "rating": 5,
        "comment": "Cline has replaced 70% of my writing steps. I ask it to build a full React dashboard with mock data, it installs packages, edits pages, runs the build, fixes compile warnings, and shows me the final results. Breathtaking.",
        "date": "2026-05-20"
      }
    ],
    "useCases": [
      "Fully autonomous frontend project scaffolds from single prompts",
      "Batch refactoring complex API endpoints across repositories",
      "Automated troubleshooting and bug correction by executing builds"
    ],
    "faqs": [
      {
        "q": "Is Cline safe to execute commands?",
        "a": "Yes, Cline asks for explicit user approval before executing any terminal command or making file modifications."
      },
      {
        "q": "What is the best model to run with Cline?",
        "a": "Claude 3.5 Sonnet (via Anthropic or OpenRouter) is widely regarded as the most capable model for agentic reasoning."
      }
    ],
    "comparisons": [
      "cursor",
      "copilot"
    ]
  },
  {
    "id": "deepseek",
    "name": "DeepSeek Coder",
    "category": "coding",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="url(#gradient-deep)" stroke-width="2"/>
      <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" stroke="url(#gradient-deep)" stroke-width="2"/>
      <path d="M12 2V6" stroke="url(#gradient-deep)" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 18V22" stroke="url(#gradient-deep)" stroke-width="2" stroke-linecap="round"/>
      <defs>
        <linearGradient id="gradient-deep" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0ea5e9"/>
          <stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.8,
    "ratingCount": 1820,
    "pricing": "Free",
    "pricingDetails": "Highly affordable pay-per-token API (currently starting at $0.14/million tokens). Free model download available.",
    "shortDescription": "High-capability open-weight developer models matching commercial performance at a fraction of the cost.",
    "description": "DeepSeek Coder is a state-of-the-art open-weight AI model optimized specifically for developers. Trained on over 2 trillion code tokens and supporting a massive 128K context window, DeepSeek Coder matches commercial models in coding benchmarks while remaining highly affordable to scale.",
    "features": [
      "Open-weights available for secure self-hosted execution",
      "Massive 128K token context window for large codebase uploads",
      "Highly optimized for code completions and semantic understanding",
      "Peerless mathematical reasoning benchmarks",
      "Extremely affordable pay-as-you-go developer API"
    ],
    "pros": [
      "Extremely cheap API pricing (up to 95% cheaper than competitors)",
      "Self-hostable offline inside local enterprise architectures",
      "Excellent multi-file code understanding and completion support",
      "Supports all major programming languages"
    ],
    "cons": [
      "Self-hosting requires extremely high-end hardware for maximum speed",
      "API lacks secondary search plugins out of the box",
      "Documentation is more technical, focused on developers"
    ],
    "website": "https://deepseek.com/?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "Open Weight",
      "API Model",
      "Cheap API",
      "High Value"
    ],
    "specs": {
      "platform": "Cloud API, Self-Hostable Weights",
      "apiAccess": "Open API access with OpenAI-compatible endpoint",
      "targetAudience": "Developers, Tech Startups, Enterprise Systems",
      "trialLength": "Free credits upon registration",
      "hosting": "Cloud API or Self-Hosted"
    },
    "reviews": [
      {
        "id": "deep_rev1",
        "username": "api_architect",
        "rating": 4.8,
        "comment": "Unbelievable cost-efficiency. I migrated our automated code generation microservice to DeepSeek Coder and cut our monthly API invoice from $4,000 to $180 without losing any quality.",
        "date": "2026-05-18"
      }
    ],
    "useCases": [
      "Migrating scaling company code generators to affordable APIs",
      "Self-hosting secure local programming models offline",
      "Integrating high-speed completions inside terminal CLI utilities"
    ],
    "faqs": [
      {
        "q": "How cheap is the DeepSeek Coder API?",
        "a": "DeepSeek API costs approximately $0.14 per 1 million input tokens, making it roughly 15-30x cheaper than models like GPT-4o."
      },
      {
        "q": "Can I run DeepSeek Coder locally?",
        "a": "Yes, you can download the model weights and run them locally using standard frameworks like Ollama, LM Studio, or vLLM."
      }
    ],
    "comparisons": [
      "cursor",
      "copilot"
    ]
  },
  {
    "id": "replit",
    "name": "Replit Agent",
    "category": "coding",
    "logo": `<svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H20V8H4V4Z" fill="url(#gradient-replit)" stroke="url(#gradient-replit)" stroke-width="1"/>
      <path d="M4 10H14V14H4V10Z" fill="url(#gradient-replit)" stroke="url(#gradient-replit)" stroke-width="1"/>
      <path d="M4 16H20V20H4V16Z" fill="url(#gradient-replit)" stroke="url(#gradient-replit)" stroke-width="1"/>
      <defs>
        <linearGradient id="gradient-replit" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F43F5E"/>
          <stop offset="1" stop-color="#BE123C"/>
        </linearGradient>
      </defs>
    </svg>`,
    "rating": 4.6,
    "ratingCount": 420,
    "pricing": "Paid",
    "pricingDetails": "Included inside the Replit Core plan starting at $15/month or $120/year.",
    "shortDescription": "Fully autonomous cloud development agent that turns plain-English ideas into ready-to-deploy web apps.",
    "description": "Replit Agent is a fully autonomous AI agent embedded within the Replit cloud sandbox. By describing what you want to build (e.g., 'a database tracking real estate portfolios'), the Agent installs databases, configures backends, designs frontends, and hosts a live-running prototype inside Replit, letting you build apps with zero coding skills.",
    "features": [
      "Autonomous full-stack application development in-browser",
      "Automatic SQLite database configurations and schemas mapping",
      "One-click deployment to standard production cloud sandboxes",
      "Interactive code editing sidebar alongside the Agent",
      "Dynamic prompt history tracking and rollbacks"
    ],
    "pros": [
      "Requires absolutely zero local setup or package installation",
      "Outstanding at building complete CRUD databases in minutes",
      "Instant live URL preview of the running application",
      "Supports interactive, conversational code changes"
    ],
    "cons": [
      "Requires an active paid Replit subscription",
      "Restricted strictly to the Replit cloud editor environment",
      "Not designed for massive multi-tier enterprise integrations"
    ],
    "website": "https://replit.com/?ref=aitoolsdir",
    "sponsored": false,
    "tags": [
      "No Code",
      "Full Stack",
      "Sandbox Editor",
      "Agent"
    ],
    "specs": {
      "platform": "Web-based cloud workspace",
      "apiAccess": "API access on enterprise plans",
      "targetAudience": "Product Builders, Startup Founders, Beginners",
      "trialLength": "Available on Replit Core subscriptions",
      "hosting": "Cloud-Based Sandbox"
    },
    "reviews": [
      {
        "id": "rep_rev1",
        "username": "idea_guy",
        "rating": 4.5,
        "comment": "I don't know React or Python, but in 15 minutes, Replit Agent built me a fully functioning client portfolio app with login verification and a SQLite database. Unbelievable.",
        "date": "2026-05-16"
      }
    ],
    "useCases": [
      "Accelerating minimum viable product (MVP) design pitches",
      "Learning full-stack data relationships with live sandbox views",
      "Fast, automated deployment of lightweight databases"
    ],
    "faqs": [
      {
        "q": "Do I need coding experience to use Replit Agent?",
        "a": "No, Replit Agent is designed specifically to convert plain-English instructions into fully functional, deployed cloud apps."
      },
      {
        "q": "What languages does Replit Agent use?",
        "a": "It typically builds full-stack applications using Python, Flask, Express, SQLite, React, and standard CSS frameworks."
      }
    ],
    "comparisons": [
      "cursor",
      "cline"
    ]
  }
];

// Read existing tools data
let tools = [];
try {
  const content = fs.readFileSync(toolsPath, "utf8");
  tools = JSON.parse(content);
} catch (e) {
  console.error("Could not read tools.json:", e);
  process.exit(1);
}

// Append new tools, checking if they exist to avoid duplication
const existingIds = new Set(tools.map(t => t.id));
let addedCount = 0;

NEW_TOOLS.forEach(newTool => {
  if (!existingIds.has(newTool.id)) {
    tools.push(newTool);
    addedCount++;
  }
});

// Save updated tools.json back
try {
  fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), "utf8");
  console.log(`Successfully added ${addedCount} premium AI tools to tools.json! Total tools: ${tools.length}`);
} catch (e) {
  console.error("Could not save tools.json:", e);
  process.exit(1);
}
