import { prisma } from "@/lib/prisma";
import { CURATED_PAGES } from "@/data/data";

export default async function sitemap() {
  const baseUrl = "https://ai.neqtra.com";

  // 1. Core pages
  const corePages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/category/all`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/prompts`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/workflows`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 }
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
      priority: 0.7
    }));

    // 4. Dynamic Tool Detail Pages
    const toolUrls = tools.map((tool) => ({
      url: `${baseUrl}/tool/${tool.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8
    }));

    // 5. Dynamic Blog Pages
    const blogUrls = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.id || post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    }));

    // 6. Dynamic Curated Guide Pages
    const curatedUrls = Object.keys(CURATED_PAGES).map((slug) => ({
      url: `${baseUrl}/curated/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    }));

    // 7. Dynamic Programmatic SEO Pages (PSEO)
    const pseoIntents = [];
    categories.forEach((cat) => {
      pseoIntents.push(`best-ai-tools-for-${cat.id}`);
      pseoIntents.push(`free-ai-tools-for-${cat.id}`);
    });

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
      priority: 0.7
    }));

    // 8. Head-to-Head Comparison Pages
    const compareUrls = [];
    categories.forEach((cat) => {
      const catTools = tools.filter((t) => t.categoryId === cat.id || t.category === cat.id);
      if (catTools.length >= 2) {
        for (let i = 0; i < catTools.length; i++) {
          for (let j = i + 1; j < catTools.length; j++) {
            const toolA = catTools[i];
            const toolB = catTools[j];
            const slug = `${toolA.id}-vs-${toolB.id}`;
            compareUrls.push({
              url: `${baseUrl}/compare/${slug}`,
              lastModified: new Date(),
              changeFrequency: "weekly",
              priority: 0.6
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
      ...curatedUrls,
      ...pseoUrls,
      ...compareUrls
    ];
  } catch (error) {
    console.error("Failed to build sitemap metadata: ", error);
    return corePages;
  }
}
