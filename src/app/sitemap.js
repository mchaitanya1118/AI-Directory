import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const baseUrl = "https://auraai.com";

  // 1. Core pages
  const corePages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/category/all`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 }
  ];

  try {
    // 2. Fetch active tools & categories
    const [categories, tools, blogPosts] = await Promise.all([
      prisma.category.findMany(),
      prisma.tool.findMany({ where: { approved: true } }),
      prisma.blogPost ? prisma.blogPost.findMany() : Promise.resolve([])
    ]);

    // 3. Dynamic Category Pages
    const categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }));

    // 4. Dynamic Tool Detail Pages
    const toolUrls = tools.map((tool) => ({
      url: `${baseUrl}/tool/${tool.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    }));

    // 5. Dynamic Blog Pages
    const blogUrls = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.id || post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    }));

    // 6. Dynamic Programmatic SEO Pages (PSEO)
    // For every category, we generate a "best-ai-tools-for-[cat]" and a "free-ai-tools-for-[cat]" page
    const pseoIntents = [];
    categories.forEach((cat) => {
      pseoIntents.push(`best-ai-tools-for-${cat.id}`);
      pseoIntents.push(`free-ai-tools-for-${cat.id}`);
    });

    // Plus some general high-converting professional ones
    const generalIntents = [
      "best-ai-tools-for-students",
      "best-ai-tools-for-startups",
      "best-ai-tools-for-architects",
      "best-ai-tools-for-teachers",
      "chatgpt-alternatives-for-developers"
    ];

    const allPseoIntents = Array.from(new Set([...pseoIntents, ...generalIntents]));
    const pseoUrls = allPseoIntents.map((slug) => ({
      url: `${baseUrl}/best/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }));

    // 7. Head-to-Head Comparison Pages
    // For each category, combine every pairwise tool combo to build comparison sitemaps
    const compareUrls = [];
    categories.forEach((cat) => {
      const catTools = tools.filter((t) => t.categoryId === cat.id || t.category === cat.id);
      if (catTools.length >= 2) {
        for (let i = 0; i < catTools.length; i++) {
          for (let j = i + 1; j < catTools.length; j++) {
            const toolA = catTools[i];
            const toolB = catTools[j];
            // E.g. "cursor-vs-github-copilot"
            const slug = `${toolA.id}-vs-${toolB.id}`;
            compareUrls.push({
              url: `${baseUrl}/compare/${slug}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.7
            });
          }
        }
      }
    });

    return [
      ...corePages,
      ...categoryUrls,
      ...toolUrls,
      ...blogUrls,
      ...pseoUrls,
      ...compareUrls
    ];
  } catch (error) {
    console.error("Failed to build sitemap metadata: ", error);
    return corePages;
  }
}
