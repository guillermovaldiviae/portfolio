"use client";

import { useRouter } from "next/navigation";
import { projects } from "../../projects";
import CaseStudyPage from "../../components/exhibits/CaseStudyPage";

// Connects the case study's "All work" and "Next project" buttons to the site's pages.
export default function CaseStudyView({ slug }: { slug: string }) {
  const router = useRouter();
  const project = projects.find((p) => p.slug === slug)!;
  return (
    <CaseStudyPage
      project={project}
      onBack={() => router.push("/#projects")}
      onNavigate={(next) => router.push(`/work/${next}`)}
    />
  );
}
