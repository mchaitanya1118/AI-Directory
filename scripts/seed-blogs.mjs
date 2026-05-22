import { PrismaClient } from '@prisma/client';
import { BLOG_ARTICLES } from '../src/data/blogData.js';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Blogs...");
  for (const article of BLOG_ARTICLES) {
    await prisma.blogPost.upsert({
      where: { id: article.id },
      update: {},
      create: {
        id: article.id,
        title: article.title,
        summary: article.summary,
        category: article.category,
        readTime: article.readTime,
        date: article.date,
        keywords: JSON.stringify(article.keywords || []),
        logo: article.logo,
        body: JSON.stringify(article.body || []),
        relatedTools: JSON.stringify(article.relatedTools || [])
      }
    });
  }
  console.log("Blogs Seeding Completed!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
