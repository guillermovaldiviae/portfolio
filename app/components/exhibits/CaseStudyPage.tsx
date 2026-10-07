"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { projects, type Project } from "../../projects";
import { ExCtx, reduced } from "./kit";
import { EXHIBITS } from "./registry";

/**
 * A case study as its own full-screen page (no popup): the same exhibit content,
 * laid out on the landing page's 12-column grid. Step labels stay pinned in the
 * left columns while you scroll through each step; the top bar tracks progress.
 */
export default function CaseStudyPage({ project, onBack, onNavigate }: { project: Project; onBack: () => void; onNavigate: (slug: string) => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [cur, setCur] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [lb, setLb] = useState<{ src: string; alt: string } | null>(null);
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  // Build the step list from the page, and follow the window's scroll.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    window.scrollTo({ top: 0 });
    const els = Array.from(body.querySelectorAll<HTMLElement>(".room"));
    setRooms(els.map((r) => ({ id: r.id, name: r.dataset.room ?? "" })));
    let queued = false;
    const measure = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      let c = -1;
      els.forEach((r, i) => { if (r.getBoundingClientRect().top < window.innerHeight * 0.45) c = i; });
      setCur(c);
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(measure); } };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [project.slug]);

  // Size the title so it runs the full width of the screen, like the name on the landing page.
  useEffect(() => {
    const body = bodyRef.current, h = body?.querySelector<HTMLElement>(".entrance h2");
    if (!body || !h) return;
    // Short titles sit on one line across the screen; long ones wrap at a size where the longest word still fits.
    const fit = () => {
      const avail = body.clientWidth - parseFloat(getComputedStyle(body).paddingLeft) * 2;
      h.style.whiteSpace = "nowrap";
      h.style.lineHeight = "";
      h.style.fontSize = "100px";
      const one = (100 * avail) / h.scrollWidth * 0.97;
      if (one >= 96) { h.style.fontSize = `${Math.min(360, Math.floor(one))}px`; return; }
      const probe = document.createElement("span");
      probe.style.whiteSpace = "nowrap";
      h.appendChild(probe);
      let longest = 0;
      for (const word of (h.firstChild?.textContent ?? "").split(/\s+/)) {
        probe.textContent = word;
        longest = Math.max(longest, probe.getBoundingClientRect().width);
      }
      probe.remove();
      h.style.whiteSpace = "normal";
      h.style.lineHeight = "0.92";
      const size = Math.min((100 * avail) / (longest || 1) * 0.97, avail * 0.2, 168);
      h.style.fontSize = `${Math.max(40, Math.floor(size))}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(body);
    return () => ro.disconnect();
  }, [project.slug]);

  // Keep the active step visible in the bar on small screens.
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".ex.full .rail");
    if (rail && cur < 0) { rail.scrollTo({ left: 0 }); return; }
    const el = document.getElementById(`rail-${cur}`);
    if (el && rail) rail.scrollTo({ left: el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2, behavior: reduced() ? "auto" : "smooth" });
  }, [cur]);

  useEffect(() => {
    if (!lb) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLb(null); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lb]);

  const jump = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: reduced() ? "auto" : "smooth" });
  }, []);
  const zoom = useCallback((src: string, alt: string) => setLb({ src, alt }), []);

  const style = { "--accent": project.accent ?? "var(--yellow)" } as CSSProperties;

  return (
    <div className="ex full" style={style}>
      <header className="cs-bar">
        <div className="cs-bar-in">
          <button className="back" type="button" onClick={onBack}>← All work</button>
          <nav className="rail" aria-label="Steps in this case study">
            {rooms.map((r, i) => (
              <button key={r.id} id={`rail-${i}`} type="button" className={i === cur ? "on" : ""} onClick={() => jump(r.id)}>
                <b>{String(i + 1).padStart(2, "0")}</b>{r.name}
              </button>
            ))}
          </nav>
          {project.link && (
            <a className="visit" href={project.link.href} target="_blank" rel="noreferrer">Visit page ↗</a>
          )}
        </div>
        <div className="rail-progress" style={{ transform: `scaleX(${progress})` }} />
      </header>

      <ExCtx.Provider value={{ zoom, jump }}>
        <main ref={bodyRef} className="ex-body" key={project.slug}>
          {EXHIBITS[project.slug]?.()}
        </main>
      </ExCtx.Provider>

      <footer className="cs-next" style={{ "--next": next.accent ?? "var(--yellow)" } as CSSProperties}>
        <button type="button" onClick={() => onNavigate(next.slug)}>
          <span className="cs-next-lbl">Next project · {next.type}</span>
          <span className="cs-next-t">{next.title} <i aria-hidden="true">→</i></span>
          <span className="cs-next-s">{next.summary}</span>
        </button>
        <div className="cs-fine">
          <button type="button" className="back" onClick={onBack}>← All work</button>
          <span>{project.eyebrow}</span>
        </div>
      </footer>

      {lb && (
        <div className="lb on" role="dialog" aria-modal="true" aria-label={lb.alt}>
          <div className="lb-top"><button type="button" onClick={() => setLb(null)} autoFocus>Close ✕</button></div>
          <div className="lb-body" onClick={(e) => { if (e.target === e.currentTarget) setLb(null); }}>
            <img src={lb.src} alt={lb.alt} />
          </div>
          <div className="lb-cap">{lb.alt}</div>
        </div>
      )}
    </div>
  );
}
