"use client";
/* eslint-disable @next/next/no-img-element */

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import Demo, { type DemoId } from "../demos";

/* ------------------------------------------------------------------
   Building blocks shared by every case study exhibit.
   Styles live in app/exhibit.css (scoped to .ex).
   ------------------------------------------------------------------ */

export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Lets pieces inside an exhibit enlarge an image or jump to a step. */
export const ExCtx = createContext<{ zoom: (src: string, alt: string) => void; jump: (id: string) => void }>({ zoom: () => {}, jump: () => {} });
export const useEx = () => useContext(ExCtx);

/** True once the element has scrolled into view. */
export function useSeen<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** Fades and lifts its contents the first time they scroll into view. */
export function Reveal({ className = "", children, style }: { className?: string; children: ReactNode; style?: CSSProperties }) {
  const [ref, seen] = useSeen<HTMLDivElement>(0.15);
  return <div ref={ref} className={`rv ${seen ? "in" : ""} ${className}`} style={style}>{children}</div>;
}

/** A number that counts up when it scrolls into view. */
export function Count({ to, prefix = "", suffix = "", dec = 0, className = "num tab" }: { to: number; prefix?: string; suffix?: string; dec?: number; className?: string }) {
  const [ref, seen] = useSeen<HTMLSpanElement>();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) { setV(to); return; }
    let raf = 0, t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / 1500);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  const n = dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");
  return <span ref={ref} className={className} style={{ display: "block" }}>{prefix}{n}{suffix}</span>;
}

/** A ring that fills toward a fundraising goal, with the amount raised beside it. Values in thousands. */
export function GoalRing({ raised, goal, cap }: { raised: number; goal: number; cap?: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const pct = Math.round((raised / goal) * 100);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) { setV(pct); return; }
    let raf = 0, t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / 1800);
      setV(Math.round(pct * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, pct]);
  const C = 2 * Math.PI * 62;
  return (
    <div ref={ref} className="ex-ringwrap">
      <svg className="ex-ring" viewBox="0 0 150 150" role="img" aria-label={`${pct} percent of the $${goal} thousand dollar goal`}>
        <circle className="trk" cx="75" cy="75" r="62" />
        <circle className="val" cx="75" cy="75" r="62" style={{ strokeDasharray: C, strokeDashoffset: seen ? C * (1 - Math.min(1, pct / 100)) : C }} />
        <text x="75" y="80" textAnchor="middle" className="tab">{v}%</text>
        <text x="75" y="98" textAnchor="middle" className="rs">of goal</text>
      </svg>
      <div style={{ display: "grid", gap: 6 }}>
        <Count to={raised} prefix="$" suffix="K" />
        <div className="cap">{cap ?? `Raised toward a $${goal}K goal`}</div>
      </div>
    </div>
  );
}

/** Before/after bars that grow when they scroll into view. */
export function Bars({ rows }: { rows: { label: string; w: number; value: string; now?: boolean }[] }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className="bars">
      {rows.map((r) => (
        <div key={r.label} className={"brow" + (r.now ? " now" : "")}>
          <span>{r.label}</span>
          <div className="tr"><i style={{ width: seen ? `${r.w}%` : 0 }} /></div>
          <b className="tab">{r.value}</b>
        </div>
      ))}
    </div>
  );
}

/** A numbered step: label on the left, story on the right, then the interactive piece. */
export function Room({ id, n, name, title, how, children, intro, last }: { id: string; n: number; name: string; title?: string; how?: string; children?: ReactNode; intro?: ReactNode; last?: boolean }) {
  const no = String(n).padStart(2, "0");
  return (
    <section className={"room" + (last ? " col" : "")} id={id} data-room={name}>
      <div className={"wall" + (last ? "" : " col")}>
        <div className="wall-no"><b>{no}</b>{name}</div>
        {last ? (
          children
        ) : (
          <div>
            {title && <h3>{title}</h3>}
            {intro}
            {how && <div className="how">{how}</div>}
          </div>
        )}
      </div>
      {!last && children}
    </section>
  );
}

/** One of the site's interactive demos, embedded in an exhibit. */
export const Island = ({ id }: { id: DemoId }) => <div className="island"><Demo id={id} /></div>;

/** An image you can click to enlarge. */
export function Zoom({ src, alt, className = "", style }: { src: string; alt: string; className?: string; style?: CSSProperties }) {
  const { zoom } = useEx();
  return <img src={src} alt={alt} className={"zoomable " + className} style={style} loading="lazy" onClick={() => zoom(src, alt)} />;
}

export function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <Reveal>
      <figure className="clean"><Zoom src={src} alt={alt} /><figcaption>{caption}</figcaption></figure>
    </Reveal>
  );
}

export function Entrance({ eyebrow, title, lede, meta, cover }: { eyebrow: string; title: string; lede: string; meta: [string, string][]; cover?: { src: string; alt: string } }) {
  return (
    <>
      <header className="col entrance">
        <div className="eyebrow">{eyebrow}</div>
        <h2 id="exTitle">{title}</h2>
        <p className="lede">{lede}</p>
        <dl className="meta">
          {meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </header>
      {cover && <Reveal className="cover"><Zoom src={cover.src} alt={cover.alt} /></Reveal>}
    </>
  );
}

export const Tile = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => <div className={"tile" + (wide ? " wide" : "")}>{children}</div>;

/** A segmented row of buttons. */
export function Seg<T extends string | number>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {items.map((it) => (
        <button key={String(it.id)} type="button" aria-pressed={value === it.id} onClick={() => onChange(it.id)}>{it.label}</button>
      ))}
    </div>
  );
}

/** A list of moments on the left, one large image on the right. */
export type StepItem = { when?: string; what: string; why: string; img?: string; alt?: string; node?: ReactNode };
export function Stepper({ items }: { items: StepItem[] }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const [fade, setFade] = useState(false);
  useEffect(() => { setI(0); setShown(0); }, [items]);
  const pick = (k: number) => {
    setI(k);
    if (reduced()) { setShown(k); return; }
    setFade(true);
    setTimeout(() => { setShown(k); setFade(false); }, 180);
  };
  const it = items[shown] ?? items[0];
  return (
    <div className="jx">
      <ol className="jlist">
        {items.map((x, k) => (
          <li key={x.what}>
            <button type="button" aria-pressed={k === i} onClick={() => pick(k)}>
              <span className="when">{k + 1}{x.when ? ` · ${x.when}` : ""}</span>
              <span className="what">{x.what}</span>
              <span className="why">{x.why}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="jstage">
        {it.node ?? <Zoom src={it.img!} alt={it.alt ?? ""} className={fade ? "swap" : ""} />}
      </div>
    </div>
  );
}

export function NextCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="next-card">
      <b>{title}</b>
      {children}
    </div>
  );
}
