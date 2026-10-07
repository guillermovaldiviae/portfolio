"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects, type Project } from "../projects";

// Group projects by their `group` field, keeping the order they appear in projects.ts
const groups = projects.reduce<{ name: string; items: Project[] }[]>((acc, p) => {
  const g = acc.find((x) => x.name === p.group);
  if (g) g.items.push(p);
  else acc.push({ name: p.group, items: [p] });
  return acc;
}, []);

// The image that follows the cursor when you hover a project
const peekOf = (p: Project) => p.image?.src ?? (p.kind === "collection" ? "/work/graphic-design/poster-2026.jpg" : undefined);

function WorkRow({ project: p, onPeek }: { project: Project; onPeek: (src: string | null) => void }) {
  return (
    <Link
      href={`/work/${p.slug}`}
      onMouseEnter={() => onPeek(peekOf(p) ?? null)}
      onMouseLeave={() => onPeek(null)}
      onClick={() => onPeek(null)}
      style={{ "--accent": p.accent } as CSSProperties}
      className="work-row"
    >
      <span className="work-t">{p.title}</span>
      <p className="work-s">{p.summary}</p>
      <span className="work-k">{p.type} <i aria-hidden="true">→</i></span>
    </Link>
  );
}

/** A preview of the project's cover that follows the cursor (mouse only). */
function Peek({ src }: { src: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [last, setLast] = useState<string | null>(null);
  useEffect(() => { if (src) setLast(src); }, [src]);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      // keep the preview on screen: flip to the left of the cursor near the right edge
      const x = e.clientX + 340 > window.innerWidth ? e.clientX - 340 : e.clientX + 40;
      ref.current.style.transform = `translate(${x}px, ${Math.max(12, e.clientY - 100)}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={ref} className="hidden [@media(hover:hover)]:block fixed left-0 top-0 z-40 pointer-events-none" aria-hidden="true">
      <div className={"w-[300px] rounded-lg overflow-hidden border border-white/10 bg-[#141416] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition duration-200 " + (src ? "opacity-100 scale-100" : "opacity-0 scale-95")}>
        {last && <img src={last} alt="" className="w-full h-auto block" />}
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const [peek, setPeek] = useState<string | null>(null);

  // Old links like /#give-2025 (from when case studies opened as popups) go to the page instead.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    if (projects.some((p) => p.slug === slug)) window.location.replace(`/work/${slug}`);
  }, []);

  return (
    <>
      <section id="projects" className="home-wrap home-sec">
        <div className="home-grid">
          <div className="home-lbl reveal">Selected Work</div>
          <div className="home-main">
            {groups.map((g) => (
              <div key={g.name} className="work-group reveal">
                <div className="home-lbl">{g.name}</div>
                {g.items.map((p) => (
                  <WorkRow key={p.slug} project={p} onPeek={setPeek} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Peek src={peek} />
    </>
  );
}
