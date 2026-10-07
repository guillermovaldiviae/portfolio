import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "../../projects";
import CaseStudyView from "./CaseStudyView";

// Each case study is its own page: /work/give-2025, /work/painpal, and so on.
// The list of pages comes from app/projects.ts; the content from components/exhibits/.

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false; // unknown slugs are a 404

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.title} — Guillermo Valdivia`;
  return {
    title,
    description: p.summary,
    openGraph: { title, description: p.summary, ...(p.image ? { images: [p.image.src] } : {}) },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!projects.some((p) => p.slug === slug)) notFound();
  return <CaseStudyView slug={slug} />;
}
