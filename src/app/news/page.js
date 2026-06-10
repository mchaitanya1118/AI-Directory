import { prisma } from "@/lib/prisma";
import NewsClient from "@/components/NewsClient";

export const metadata = {
  title: "AI News Hub | Latest Industry Updates | AuraAI",
  description: "Stay informed with real-time news summaries from OpenAI, Anthropic, Google AI, Meta, and the Open Source community.",
  alternates: {
    canonical: "/news",
  },
};

export default async function NewsHubPage() {
  const news = await prisma.newsArticle.findMany({
    orderBy: {
      date: "desc"
    }
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <NewsClient initialNews={news} />
    </div>
  );
}
