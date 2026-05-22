const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// In Next.js ES6 projects, we can read the JSON file directly or import.
// For the seed script, reading via fs is safest.
async function main() {
  console.log("Starting DB Seed...");

  // 1. Load tools.json
  const toolsPath = path.join(__dirname, '../src/data/tools.json');
  const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

  // Collect unique categories and tags
  const categories = new Set();
  const tags = new Set();
  
  for (const tool of toolsData) {
    categories.add(tool.category);
    if (tool.tags) {
      tool.tags.forEach(t => tags.add(t));
    }
  }

  // 2. Insert Categories
  console.log(`Inserting ${categories.size} categories...`);
  for (const catName of categories) {
    await prisma.category.upsert({
      where: { id: catName.toLowerCase() },
      update: {},
      create: {
        id: catName.toLowerCase(),
        name: catName,
      }
    });
  }

  // 3. Insert Tags
  console.log(`Inserting ${tags.size} tags...`);
  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName
      }
    });
  }

  // 4. Insert Tools
  console.log(`Inserting ${toolsData.length} tools...`);
  for (const t of toolsData) {
    // stringify arrays
    const features = JSON.stringify(t.features || []);
    const pros = JSON.stringify(t.pros || []);
    const cons = JSON.stringify(t.cons || []);
    const useCases = JSON.stringify(t.useCases || []);
    const faqs = JSON.stringify(t.faqs || []);
    const comparisons = JSON.stringify(t.comparisons || []);
    const specs = JSON.stringify(t.specs || {});

    await prisma.tool.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        name: t.name,
        categoryId: t.category.toLowerCase(),
        logo: t.logo,
        rating: t.rating || 0,
        ratingCount: t.ratingCount || 0,
        pricing: t.pricing || 'Unknown',
        pricingDetails: t.pricingDetails || '',
        shortDescription: t.shortDescription || '',
        description: t.description || '',
        website: t.website || '',
        sponsored: t.sponsored || false,
        features,
        pros,
        cons,
        useCases,
        comparisons,
        faqs,
        specs
      }
    });

    // Handle ToolTags
    if (t.tags) {
      for (const tagName of t.tags) {
        const tag = await prisma.tag.findUnique({ where: { name: tagName } });
        if (tag) {
          await prisma.toolTag.upsert({
            where: { toolId_tagId: { toolId: t.id, tagId: tag.id } },
            update: {},
            create: { toolId: t.id, tagId: tag.id }
          });
        }
      }
    }

    // Handle Reviews
    if (t.reviews) {
      for (const rev of t.reviews) {
        await prisma.review.upsert({
          where: { id: rev.id },
          update: {},
          create: {
            id: rev.id,
            username: rev.username,
            rating: rev.rating,
            comment: rev.comment,
            date: rev.date,
            toolId: t.id
          }
        });
      }
    }
  }

  // 5. Load and Insert Blogs (We'll parse the ES6 file using a simple regex since it's JS, 
  // or we can just skip it in the script and insert it later, but let's try to extract it)
  // Actually, wait, blogData is ES6 export. We can just convert it to JSON or read it.
  console.log("DB Seed Completed!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
