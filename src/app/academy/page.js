import { prisma } from "@/lib/prisma";
import AcademyClient from "@/components/AcademyClient";

export const metadata = {
  title: "AI Academy | Learn AI Automation & Prompting | AuraAI",
  description: "Enhance your skills with professional courses on Prompt Engineering, AI Agents, n8n automation, and Model Context Protocols.",
  alternates: {
    canonical: "/academy",
  },
};

export default async function AcademyPage() {
  const courses = await prisma.course.findMany({
    include: {
      lessons: true,
    },
  });

  return (
    <div className="app-container" style={{ minHeight: "85vh", paddingTop: "5.5rem", paddingBottom: "4rem" }}>
      <AcademyClient initialCourses={courses} />
    </div>
  );
}
