"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Splits text into one span per word, for <ScrollWords>. Keeps the spaces as they are.
export function Words({ children }: { children: string }) {
  return (
    <>
      {children.split(/(\s+)/).map((part, i) =>
        !part ? null : /^\s+$/.test(part) ? part : (
          // Hyphenated words ("Human-Computer") get one span per half, so a half that
          // wraps to the next line lights up with that line instead of jumping ahead.
          part.split(/(?<=-)/).map((piece, j) => <span key={`${i}-${j}`} className="w">{piece}</span>)
        )
      )}
    </>
  );
}

// Text inside this starts dim and brightens word by word, left to right,
// as each line scrolls past the lower third of the screen.
export function ScrollWords({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !document.documentElement.classList.contains("motion")) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>(".w"));
    let queued = false;
    const paint = () => {
      queued = false;
      const line = window.innerHeight * 0.68;
      const box = root.getBoundingClientRect();
      for (const w of words) {
        const r = w.getBoundingClientRect();
        const along = ((r.left - box.left) / box.width) * r.height * 1.6;
        w.classList.toggle("lit", r.top + along < line);
      }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className={`words ${className}`}>{children}</div>;
}

// Fades and lifts every element with the "reveal" class the first time it scrolls into view.
// Put it once on the page. Add style={{ "--reveal-delay": "120ms" }} to stagger neighbours.
export function ScrollReveal() {
  useEffect(() => {
    const w = window as Window & { __revealFallback?: number };
    window.clearTimeout(w.__revealFallback);
    if (!document.documentElement.classList.contains("motion")) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
