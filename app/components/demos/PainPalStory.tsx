"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppIcon } from "./PainPalIdentity";
import { BodyMap, C, font, HomeScreen, Icon, LEVELS, LiveMascot, Mascot, MascotPeek, Segmented, ShareScreen, START } from "./PainPalPrototype";

/* ------------------------------------------------------------------
   PainPal, steps 01–04 of the case study: the problem, the research,
   the features and the first-time onboarding. Built from the same
   pieces as the prototype so the whole story feels like one app.
   ------------------------------------------------------------------ */

const PP = "/work/painpal";
const RED = "#E53225";

/** True once the element has scrolled into view. */
function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Plays frames 0..n-1 on a timer while `on`, then holds or loops. */
function useFrames(n: number, ms: number, on: boolean, key: unknown, loop = true) {
  const [f, setF] = useState(0);
  useEffect(() => {
    setF(0);
    if (!on) return;
    if (reduced()) { setF(n - 1); return; }
    const id = setInterval(() => setF((x) => (x + 1 >= n ? (loop ? 0 : x) : x + 1)), ms);
    return () => clearInterval(id);
  }, [n, ms, on, key, loop]);
  return f;
}

function Phone({ children, w = 300, h = 620, dark = false }: { children: ReactNode; w?: number; h?: number; dark?: boolean }) {
  return (
    <div className="mx-auto max-w-full" style={{ ...font, width: w }}>
      <div className={"relative isolate rounded-[42px] border-[8px] border-[#1C1C1E] shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden " + (dark ? "bg-[#245489]" : "bg-white")} style={{ height: h }}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[84px] h-[24px] rounded-full bg-[#1C1C1E] z-20" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

function Tabs<T extends string>({ items, value, onChange, label }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          aria-pressed={value === it.id}
          onClick={() => onChange(it.id)}
          className={"px-3.5 py-1.5 rounded-full text-sm border transition " + (value === it.id ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/** A tap marker that pulses where a finger would land. */
const Tap = ({ x, y }: { x: string; y: string }) => (
  <span className="pp-tap absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 border-white/90 bg-[#3A86CF]/35 pointer-events-none z-10" style={{ left: x, top: y }} aria-hidden="true" />
);

/* ================================================================
   01 · The problem
   ================================================================ */

const REQS = [
  { id: "simple", label: "Simple & accessible", text: "On a bad day, logging has to take seconds. Where it hurts, how bad, why: three taps, then done." },
  { id: "personal", label: "Personalized tracking", text: "Logs only help if they turn into patterns. PainPal looks across days to surface triggers, like pain rising on rainy days." },
  { id: "support", label: "Support", text: "A clear record makes appointments easier. Pick the dates and details, and send them to a care provider." },
] as const;
type ReqId = (typeof REQS)[number]["id"];

function Person({ hurt }: { hurt: boolean }) {
  return (
    <svg viewBox="0 0 24 36" className="w-full h-auto" aria-hidden="true">
      <circle cx="12" cy="7" r="6" fill={hurt ? RED : "rgba(255,255,255,0.16)"} style={{ transition: "fill 400ms" }} />
      <path d="M2 34 Q2 16 12 16 Q22 16 22 34 Z" fill={hurt ? RED : "rgba(255,255,255,0.16)"} style={{ transition: "fill 400ms" }} />
      {hurt && <circle cx="12" cy="7" r="9" fill="none" stroke={RED} strokeWidth="1.2" className="pp-ring" />}
    </svg>
  );
}

function SimpleVignette({ f }: { f: number }) {
  // 0 body · 1 tap knee · 2 level · 3 tap level · 4 trigger · 5 tap trigger · 6 logged
  const taps = f >= 6 ? 3 : f >= 5 ? 3 : f >= 3 ? 2 : f >= 1 ? 1 : 0;
  return (
    <div className="absolute inset-0 pt-10 px-3.5 pb-4 text-[#111] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <b className="text-[13px] leading-tight pr-2">{f < 2 ? "Describe Your Pain" : f < 4 ? "How Bad is the Pain?" : "What Triggered It?"}</b>
        <span className="shrink-0 whitespace-nowrap inline-flex items-center justify-center text-[10px] leading-none font-semibold rounded-full px-2.5 py-1.5 tabular-nums" style={{ background: C.pale, color: C.blueDark }}>{taps} / 3 taps</span>
      </div>
      <div className="flex gap-1 mb-3">{[0, 1, 2].map((i) => <i key={i} className="h-1 flex-1 rounded-full transition" style={{ background: i < taps ? C.blue : C.pale }} />)}</div>
      {f < 2 && (
        <div className="relative flex justify-center">
          <BodyMap selected={f >= 1 ? ["Right Knee"] : []} toggle={() => {}} side="Front" />
          {f === 1 && <Tap x="61%" y="69%" />}
        </div>
      )}
      {(f === 2 || f === 3) && (
        <div className="relative rounded-2xl p-2.5 flex justify-between" style={{ background: C.pale }}>
          {LEVELS.map((l) => (
            <span key={l.n} className="flex flex-col items-center gap-1 w-[34px]">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] transition" style={{ background: l.color, outline: f === 3 && l.n === 4 ? `2.5px solid ${C.blueDark}` : "1px solid rgba(0,0,0,0.2)", outlineOffset: f === 3 && l.n === 4 ? 2 : 0 }}>{l.n}</span>
              <span className="text-[7px] leading-tight text-center" style={{ color: C.blue }}>{l.label}</span>
            </span>
          ))}
          {f === 3 && <Tap x="70%" y="38%" />}
        </div>
      )}
      {(f === 4 || f === 5) && (
        <div className="relative rounded-2xl p-3 grid grid-cols-2 gap-2" style={{ background: C.pale }}>
          {["Weather", "Exercise", "Stress", "Work", "Humidity", "I don't know"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-[11px]" style={{ color: C.blue }}>
              <i className="w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center" style={{ borderColor: C.blue, background: f === 5 && t === "Weather" ? C.blue : "#fff" }}>{f === 5 && t === "Weather" && <Icon name="check" size={10} />}</i>
              {t}
            </span>
          ))}
          {f === 5 && <Tap x="18%" y="22%" />}
        </div>
      )}
      {f >= 6 && <MascotPeek message={<>Logged in 3 taps!<span className="block text-[10.5px] font-normal mt-0.5" style={{ color: C.sub }}>Right Knee · Intense · Weather</span></>} size={170} hold={60000} />}
    </div>
  );
}

const WEEK = [
  { d: "Mon", lvl: 2, rain: false },
  { d: "Tue", lvl: 2, rain: false },
  { d: "Wed", lvl: 4, rain: true },
  { d: "Thu", lvl: 2, rain: false },
  { d: "Fri", lvl: 1, rain: false },
  { d: "Sat", lvl: 5, rain: true },
  { d: "Sun", lvl: 3, rain: false },
];

function PersonalVignette({ f }: { f: number }) {
  // 0 empty · 1 bars · 2 weather · 3 highlight · 4 insight
  return (
    <div className="absolute inset-0 pt-10 px-3.5 pb-4 text-[#111] flex flex-col">
      <b className="text-[13px] mb-1">This Week</b>
      <p className="text-[10px] mb-3" style={{ color: C.sub }}>Pain intensity by day</p>
      <div className="rounded-2xl p-3" style={{ background: C.pale }}>
        <div className="flex items-end justify-between h-[150px] gap-1.5">
          {WEEK.map((w, i) => {
            const hi = f >= 3 && w.rain;
            return (
              <div key={w.d} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <svg viewBox="0 0 24 20" className="w-5 h-4 transition-opacity" style={{ opacity: f >= 2 && w.rain ? 1 : 0 }} aria-label={w.rain ? "Rain" : undefined} role={w.rain ? "img" : undefined}>
                  <path d="M7 12a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 2 3 3 0 0 1-.5 6z" fill="#7FA6D6" />
                  <path d="M9 14l-1 3M13 14l-1 3M17 14l-1 3" stroke="#3A86CF" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <i
                  className="w-full rounded-md block transition-all duration-700"
                  style={{ height: f >= 1 ? `${w.lvl * 20}%` : "4%", background: LEVELS[w.lvl - 1].color, transitionDelay: `${i * 70}ms`, outline: hi ? `2px solid ${C.blueDark}` : "none", outlineOffset: 2, opacity: f >= 3 && !w.rain ? 0.45 : 1 }}
                />
                <span className="text-[9px]" style={{ color: C.sub }}>{w.d}</span>
              </div>
            );
          })}
        </div>
      </div>
      {f >= 4 && (
        <div className="mt-3 rounded-xl px-3 py-2.5 pp-toast" style={{ background: "#DCCBFD" }}>
          <div className="text-[11.5px] font-bold" style={{ color: "#7A2FE0" }}>Pattern spotted: rainy days</div>
          <div className="text-[10.5px] leading-snug text-[#333]">Your pain was higher on both rainy days this week. We&apos;ll give you a heads-up before the next one.</div>
        </div>
      )}
      <p className="mt-auto text-[9.5px]" style={{ color: C.sub }}>Illustration with sample data.</p>
    </div>
  );
}

function SupportVignette({ f }: { f: number }) {
  // 0 list · 1–3 ticks · 4 send tap · 5 sent
  const items = ["Pain Location", "Intensity Level", "Pain Triggers", "Medications Taken"];
  return (
    <div className="absolute inset-0 pt-10 px-3.5 pb-4 text-[#111] flex flex-col">
      <b className="text-[13px] text-center mb-3">Share My Diary</b>
      {f < 5 ? (
        <>
          <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
            <div><b>From:</b><div className="rounded mt-0.5 px-1.5 py-1" style={{ background: C.pale, color: C.blue }}>1 / Feb / 2024</div></div>
            <div><b>To:</b><div className="rounded mt-0.5 px-1.5 py-1" style={{ background: C.pale, color: C.blue }}>29 / Feb / 2024</div></div>
          </div>
          <div className="rounded-md overflow-hidden text-[11px]" style={{ background: C.blueLight }}>
            <div className="px-2.5 py-1.5 text-white font-medium" style={{ background: C.blueDark }}>Select information to share</div>
            <div className="px-2.5 py-2 space-y-1.5">
              {items.map((it, i) => (
                <span key={it} className="flex items-center gap-1.5 text-white">
                  <i className="w-3.5 h-3.5 rounded-[3px] border border-white flex items-center justify-center transition" style={{ background: f > i ? C.blueDark : "transparent" }}>{f > i && <Icon name="check" size={10} />}</i>
                  {it}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mt-4 self-end rounded-full px-4 py-1.5 text-[11px] font-semibold text-white" style={{ background: C.blueDark }}>
            Send
            {f === 4 && <Tap x="50%" y="50%" />}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center text-center pt-10 pp-pop">
          <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#6CC17A" }}><Icon name="check" size={28} /></span>
          <b className="text-[15px] mt-4">Diary shared</b>
          <span className="text-[11px] mt-1 px-4" style={{ color: C.sub }}>3 details from February, sent securely to your doctor.</span>
        </div>
      )}
    </div>
  );
}

/* Five people in a row; one turns red when the row scrolls into view. */
function OneInFive() {
  const [ref, seen] = useInView<HTMLDivElement>(0.6);
  const [run, setRun] = useState(0);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    setLit(false);
    if (!seen) return;
    const t = setTimeout(() => setLit(true), reduced() ? 0 : 500);
    return () => clearTimeout(t);
  }, [seen, run]);
  return (
    <div ref={ref} className="space-y-3">
      <div className="grid grid-cols-5 gap-4 max-w-[280px]">
        {[0, 1, 2, 3, 4].map((i) => <Person key={i} hurt={lit && i === 2} />)}
      </div>
      <button type="button" onClick={() => setRun((x) => x + 1)} className="text-xs text-[#888890] hover:text-[var(--accent)]">↺ Replay</button>
    </div>
  );
}

export function PpProblem() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [req, setReq] = useState<ReqId>("simple");
  const frames = req === "simple" ? 10 : req === "personal" ? 6 : 7; // the last frames hold the payoff
  const f = useFrames(frames, 1100, seen, req);
  const r = REQS.find((x) => x.id === req)!;

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="rounded-xl border border-white/10 bg-[#141416] p-5 space-y-4">
        <div className="flex items-baseline gap-3">
          <div className="text-5xl font-semibold tracking-tight text-white">1 in 5</div>
          <p className="text-sm text-[#888890]">people worldwide live with chronic pain</p>
        </div>
        <OneInFive />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-[#b4b4bb]">Three requirements came out of the research. Pick one to see what it asks of the app.</p>
        <Tabs items={REQS.map((x) => ({ id: x.id, label: x.label }))} value={req} onChange={setReq} label="Requirements" />
        <div className="grid grid-cols-1 sm:grid-cols-[230px_1fr] gap-5 items-center">
          <Phone w={230} h={430}>
            {req === "simple" && <SimpleVignette f={f} />}
            {req === "personal" && <PersonalVignette f={f} />}
            {req === "support" && <SupportVignette f={f} />}
          </Phone>
          <p className="text-sm text-[#d1d1d6] leading-relaxed" aria-live="polite">{r.text}</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   02 · The research
   ================================================================ */

const PERSONA: { id: string; label: string; items: { t: string; led?: string }[] }[] = [
  { id: "bio", label: "Bio", items: [{ t: "Ollie, a 25-year-old master's student pursuing business management in London, has been navigating the challenges of chronic back pain for the past three years due to a slipped disc. Despite these physical challenges, Ollie remains committed to his two primary pursuits: an intense passion for sports and an unwavering commitment to academic excellence." }] },
  {
    id: "symptoms", label: "Symptoms", items: [
      { t: "Low back pain when sitting", led: "A body map with front and back views" },
      { t: "Numbness or tingling in back, legs" },
      { t: "Problems bending or straightening your back" },
      { t: "Sharp pain and muscle spasms in lower back after playing football" },
    ],
  },
  {
    id: "goals", label: "Goals", items: [
      { t: "Stay informed about the intensity and frequency of pain events.", led: "Pain map and diary" },
      { t: "Focus on studies to prepare for job hunting.", led: "Three-tap logging" },
      { t: "Engage in physical activities with minimal discomfort.", led: "Personalized insights" },
    ],
  },
  {
    id: "needs", label: "Needs + Expectations", items: [
      { t: "A feature that analyzes his unique pain patterns, offering personalized insights to assess and effectively manage discomfort levels following diverse physical activities, with a special focus on sports.", led: "Personalized insights" },
      { t: "Mobile application with a simple and intuitive interface.", led: "One question per screen" },
    ],
  },
  {
    id: "motivations", label: "Motivations", items: [
      { t: "Motivated by a strong desire to maintain physical and mental well-being, emphasizing an active lifestyle with regular sports engagement." },
      { t: "Recognizes the social aspect of job hunting, aiming to navigate the process in a way that fosters meaningful connections and relationships." },
    ],
  },
  {
    id: "pains", label: "Pain Points", items: [
      { t: "Juggling academic demands and an active social life poses a significant challenge for him.", led: "Three-tap logging" },
      { t: "Confronted with back pain, he grapples with feelings of self-doubt and frustration, leading to emotional challenges.", led: "A friendly mascot and tone" },
      { t: "The unpredictability of his pain episodes adds an extra layer of complexity, further intensifying the challenges he faces in maintaining a harmonious and productive lifestyle.", led: "Forecast reminders" },
    ],
  },
];
const TRAITS: [string, number][] = [["Extrovert", 50], ["Analytical", 83], ["Active", 72], ["Team Player", 89]];
const SOURCES = ["Medical journals", "Case studies", "Patient forums"];

export function PpResearch() {
  const [ref, seen] = useInView<HTMLDivElement>();
  const [tab, setTab] = useState("goals");
  const sec = PERSONA.find((p) => p.id === tab)!;

  return (
    <div ref={ref} className="space-y-6">
      {/* sources → persona */}
      <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-[1fr_60px_1fr] items-center gap-3 max-w-[640px]">
        <div className="space-y-2">
          {SOURCES.map((s, i) => (
            <div key={s} className="rounded-lg border border-white/10 bg-[#141416] px-3 py-2 text-sm text-[#d1d1d6] transition duration-500" style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : "translateX(-12px)", transitionDelay: `${i * 150}ms` }}>
              {s}
            </div>
          ))}
        </div>
        <svg viewBox="0 0 60 120" className="w-full h-[120px]" aria-hidden="true">
          {[20, 60, 100].map((y, i) => (
            <path key={y} d={`M0 ${y} C30 ${y} 30 60 60 60`} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 4" className={seen ? "sm-flow" : ""} style={{ opacity: seen ? 1 : 0, transition: `opacity 400ms ${400 + i * 150}ms` }} />
          ))}
        </svg>
        <div className="rounded-lg border border-[var(--accent)] bg-[#141416] px-3 py-3 transition duration-500" style={{ opacity: seen ? 1 : 0, transitionDelay: "900ms" }}>
          <div className="text-xs uppercase tracking-wider text-[#888890]">Persona</div>
          <div className="text-white font-medium">Ollie Jones, 25</div>
          <div className="text-xs text-[#888890]">Student with chronic back pain</div>
        </div>
      </div>

      {/* persona card */}
      <div className="rounded-2xl bg-white text-[#111] overflow-hidden grid grid-cols-1 sm:grid-cols-[200px_1fr]" style={font}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${PP}/persona-photo.jpg`} alt="Ollie Jones, smiling, holding a football on a court" className="w-full h-[220px] sm:h-full object-cover object-top" />
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h5 className="text-[26px] font-bold leading-none" style={{ color: "#2C7FD0" }}>Ollie Jones</h5>
            <span className="text-[12px]" style={{ color: C.sub }}>25 · Master&apos;s student in Business Management · London</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRAITS.map(([t, v], i) => (
              <div key={t}>
                <div className="text-[11px] mb-1">{t}</div>
                <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "#E8F2FC" }}>
                  <i className="block h-full rounded-full transition-all duration-1000" style={{ width: seen ? `${v}%` : "0%", background: `linear-gradient(90deg, ${C.blueLight} 70%, #2C7FD0 70%)`, transitionDelay: `${300 + i * 120}ms` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Persona sections">
            {PERSONA.map((p) => (
              <button key={p.id} type="button" onClick={() => setTab(p.id)} aria-pressed={tab === p.id} className="rounded-full px-3 py-1 text-[11.5px] font-semibold transition" style={tab === p.id ? { background: "#2C7FD0", color: "#fff" } : { background: "#E8F2FC", color: "#2C7FD0" }}>
                {p.label}
              </button>
            ))}
          </div>
          <ul key={tab} className="space-y-2.5 pp-toast">
            {sec.items.map((it) => (
              <li key={it.t} className="text-[13px] leading-relaxed">
                {sec.id !== "bio" && <span style={{ color: "#2C7FD0" }}>• </span>}
                {it.t}
                {it.led && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold align-middle" style={{ background: "#FDE7E5", color: RED }}>
                    → {it.led}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="text-[10.5px]" style={{ color: C.sub }}>Red tags show the part of PainPal each line shaped.</p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   03 · The features
   ================================================================ */

const FACES = [
  { l: "No pain", c: "#3FA34D", m: "M8 15 Q12 19 16 15" },
  { l: "Hurts a little", c: "#7CC08A", m: "M8 15.5 Q12 18 16 15.5" },
  { l: "Hurts a little more", c: "#B5D35B", m: "M8 16 L16 16" },
  { l: "Hurts even more", c: "#F2B33D", m: "M8 17 Q12 14.5 16 17" },
  { l: "Hurts a whole lot", c: "#EF8A3C", m: "M8 17.5 Q12 14 16 17.5" },
  { l: "Hurts worst", c: "#E5574C", m: "M8 18 Q12 13 16 18" },
];
const ICON_SHAPES = [
  { l: "back", c: "#E5574C" },
  { l: "ankle", c: "#5BC0C4" },
  { l: "neck", c: "#A6D86B" },
  { l: "shoulder", c: "#F2B33D" },
  { l: "other", c: "#B06FE0" },
];

function Explore({ title, explored, final, why }: { title: string; explored: ReactNode; final: ReactNode; why: [string, string] }) {
  const [on, setOn] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-[#141416] p-4 space-y-3 flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <span className="text-white text-sm">{title}</span>
        <label className="flex items-center gap-2 text-xs text-[#888890] cursor-pointer select-none">
          <span className={on ? "" : "text-white"}>Explored</span>
          <button type="button" role="switch" aria-checked={on} aria-label={`${title}: show final design`} onClick={() => setOn(!on)} className="relative w-10 h-6 rounded-full transition" style={{ background: on ? "var(--accent)" : "rgba(255,255,255,0.18)" }}>
            <i className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: on ? 20 : 4 }} />
          </button>
          <span className={on ? "text-white" : ""}>Final</span>
        </label>
      </div>
      <div className="rounded-lg bg-white p-4 min-h-[190px] flex items-center justify-center" style={font}>
        <div key={on ? "f" : "e"} className="pp-toast w-full">{on ? final : explored}</div>
      </div>
      <p className="text-sm text-[#b4b4bb] leading-relaxed" aria-live="polite">{on ? why[1] : why[0]}</p>
    </div>
  );
}

function LockScreen({ onOpen }: { onOpen: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), reduced() ? 0 : 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="absolute inset-0 text-white flex flex-col items-center pt-14 px-3" style={{ background: "radial-gradient(120% 70% at 50% 30%, #3B6EA5, #22507F)" }}>
      <span className="text-[13px] opacity-90">80% Charged</span>
      <span className="text-[64px] font-semibold leading-none tracking-tight opacity-90">8:13</span>
      {show && (
        <button type="button" onClick={onOpen} className="pp-drop mt-4 w-full rounded-2xl bg-white/25 backdrop-blur px-3 py-2.5 flex gap-2.5 text-left hover:bg-white/35 transition">
          <span className="shrink-0 w-9 h-9"><AppIcon wink={false} /></span>
          <span className="min-w-0">
            <span className="flex justify-between text-[12px]"><b>PainPal</b><span className="opacity-80">now</span></span>
            <span className="block text-[11px] leading-snug">Tomorrow&apos;s forecast: rain expected. Take care and prepare for possible increased discomfort.</span>
          </span>
        </button>
      )}
      {show && <span className="mt-3 text-[10.5px] opacity-80">Tap the notification</span>}
      <span className="mt-auto mb-4 text-[11px] opacity-70">Swipe up to open</span>
    </div>
  );
}

type Feat = "tracking" | "insights" | "support";
const FEATS: { id: Feat; label: string; text: string }[] = [
  { id: "tracking", label: "Pain tracking", text: "Simple tools for logging where it hurts, how much, what triggered it, and what medication was taken. The day's events land on a pain map. Tap a chip to clear it." },
  { id: "insights", label: "Personalized insights", text: "Daily reminders and alerts, like a heads-up before rainy weather. Tap the notification to open the reminders it leads to." },
  { id: "support", label: "Management support", text: "Share pain logs with a healthcare provider: choose the date range and exactly which details to send." },
];

export function PpFeatures() {
  const [feat, setFeat] = useState<Feat>("tracking");
  const [entries, setEntries] = useState(START);
  const [opened, setOpened] = useState(false);
  const [region, setRegion] = useState<string[]>(["Right Knee"]);
  const f = FEATS.find((x) => x.id === feat)!;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm text-[#b4b4bb]">Two explorations from the wireframe board, and where they landed. Flip each switch.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Explore
            title="Rating the pain"
            explored={
              <div className="flex justify-between gap-1">
                {FACES.map((x) => (
                  <span key={x.l} className="flex flex-col items-center gap-1 w-[48px] text-center">
                    <svg viewBox="0 0 24 24" className="w-9 h-9" aria-hidden="true"><circle cx="12" cy="12" r="11" fill={x.c} stroke="#333" strokeWidth="0.8" /><circle cx="8.5" cy="10" r="1.2" fill="#222" /><circle cx="15.5" cy="10" r="1.2" fill="#222" /><path d={x.m} fill="none" stroke="#222" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    <span className="text-[8px] leading-tight text-[#555] uppercase">{x.l}</span>
                  </span>
                ))}
              </div>
            }
            final={
              <div className="flex justify-between rounded-2xl p-2.5" style={{ background: C.pale }}>
                {LEVELS.map((l) => (
                  <span key={l.n} className="flex flex-col items-center gap-1 w-[48px]">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-[13px]" style={{ background: l.color, outline: "1px solid rgba(0,0,0,0.2)" }}>{l.n}</span>
                    <span className="text-[9.5px]" style={{ color: C.blue }}>{l.label}</span>
                  </span>
                ))}
              </div>
            }
            why={["A six-step categorical face scale, one of several alternatives for rating intensity.", "A five-point color scale. The same five colors carry through the log, the chart and the diary calendar."]}
          />
          <Explore
            title="Showing where it hurts"
            explored={
              <div className="flex justify-center gap-4">
                {ICON_SHAPES.map((x) => (
                  <span key={x.l} className="flex flex-col items-center gap-1.5">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: x.c }}><span className="w-4 h-4 rounded-sm bg-white/80" /></span>
                    <span className="text-[11px] text-[#333]">{x.l}</span>
                  </span>
                ))}
              </div>
            }
            final={
              <div className="flex items-center gap-4">
                <div className="shrink-0 [&_svg]:!h-[170px]"><BodyMap selected={region} toggle={(r) => setRegion((s) => (s.includes(r) ? s.filter((x) => x !== r) : [...s, r]))} side="Front" /></div>
                <div className="flex flex-wrap gap-1.5">
                  {region.map((r) => <span key={r} className="rounded-full px-2 py-0.5 text-[10.5px] text-white" style={{ background: C.blue }}>{r}</span>)}
                  {region.length === 0 && <span className="text-[11px]" style={{ color: C.sub }}>Tap the body</span>}
                </div>
              </div>
            }
            why={["Icon shapes for body areas: back, ankle, neck, shoulder, other.", "A tappable body map, front and back, so the exact spot is one tap away. Try it."]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-[#b4b4bb]">Crazy 8s and a feasibility-relevance matrix narrowed dozens of ideas to three core features.</p>
        <Tabs items={FEATS.map((x) => ({ id: x.id, label: x.label }))} value={feat} onChange={(v) => { setFeat(v); setOpened(false); }} label="Features" />
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-center">
          <Phone dark={feat === "insights" && !opened}>
            {feat === "tracking" && (
              <div className="absolute inset-0 pt-11 px-4 pb-4 overflow-y-auto text-[#111]">
                <HomeScreen entries={entries} lastAdded={null} onRemove={(r) => setEntries((e) => e.filter((x) => x.region !== r))} />
              </div>
            )}
            {feat === "insights" && !opened && <LockScreen onOpen={() => setOpened(true)} />}
            {feat === "insights" && opened && (
              <div className="absolute inset-0 pt-11 px-4 pb-4 text-[#111] pp-toast">
                <div className="flex items-center justify-between"><b className="text-[17px]">Today&apos;s Reminders</b><LiveMascot size={34} /></div>
                <div className="space-y-2 mt-3">
                  <div className="rounded-xl px-3 py-2.5" style={{ background: "#DCCBFD" }}>
                    <div className="text-[11.5px] font-bold" style={{ color: "#7A2FE0" }}>Rainy weather ahead</div>
                    <div className="text-[10.5px] leading-snug text-[#333]">Remember to keep your surroundings warm and comfortable</div>
                  </div>
                  <div className="rounded-xl px-3 py-2.5" style={{ background: "#FFC9C9" }}>
                    <div className="text-[11.5px] font-bold" style={{ color: "#E0302E" }}>Coping with a flare up</div>
                    <div className="text-[10.5px] leading-snug text-[#333]">Consider a 5-minute mindfulness or relaxation exercise this evening</div>
                  </div>
                </div>
                <button type="button" onClick={() => setOpened(false)} className="mt-4 text-[11px] font-semibold" style={{ color: C.blue }}>↺ Back to the lock screen</button>
              </div>
            )}
            {feat === "support" && (
              <div className="absolute inset-0 pt-11 px-4 pb-4 overflow-y-auto text-[#111]">
                <ShareScreen onBack={() => {}} />
              </div>
            )}
          </Phone>
          <div className="space-y-3">
            <div className="text-white text-lg">{f.label}</div>
            <p className="text-sm text-[#d1d1d6] leading-relaxed">{f.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   04 · The onboarding
   ================================================================ */

const OB = [
  { t: "Welcome", d: "A friendly mascot and one clear action, Get Started. Nothing to read before you begin." },
  { t: "Describe your pain", d: "A tappable body map, front and back. Each spot you tap shows up below as a chip." },
  { t: "How bad is the pain?", d: "A five-point color scale from No Pain to Extreme, with an optional note." },
  { t: "What triggered it?", d: "Checkbox triggers instead of free text, plus a field for anything else." },
  { t: "Tell me a bit more", d: "When it started and ended, with “Don’t remember” and “Pain is ongoing” options, and what you were doing." },
  { t: "Medications", d: "A yes or no, then add what you’re taking as a chip." },
  { t: "Should we alert someone?", d: "A yes or no, then pick from emergency contacts already on the phone." },
  { t: "Anything else?", d: "Free notes for whatever didn’t fit, then Complete." },
];
const OB_TRIGGERS = ["Weather", "Exercise", "Stress", "Jetlag", "Humidity", "Work", "Pollutants", "Alcohol", "Smoking", "Depression", "I don't know"];

function Check({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className="flex items-center gap-1.5 text-[11px] text-left" style={{ color: C.blue }}>
      <i className="w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center shrink-0" style={{ borderColor: C.blue, background: on ? C.blue : "#fff" }}>{on && <Icon name="check" size={10} />}</i>
      {label}
    </button>
  );
}
function YesNo({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map((v) => (
        <button key={String(v)} type="button" onClick={() => onChange(v)} aria-pressed={value === v} className="rounded-full py-1.5 text-[11.5px] font-semibold transition border" style={value === v ? { background: C.blue, color: "#fff", borderColor: C.blue } : { background: C.pale, color: C.blue, borderColor: C.pale }}>
          {v ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}
const field = "w-full rounded-md px-2 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-[#93C8FE]";

export function PpOnboarding() {
  const [s, setS] = useState(0);
  const [done, setDone] = useState(false);
  const [side, setSide] = useState("Front");
  const [regions, setRegions] = useState<string[]>([]);
  const [level, setLevel] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [trig, setTrig] = useState<string[]>([]);
  const [noStart, setNoStart] = useState(false);
  const [ongoing, setOngoing] = useState(true);
  const [doing, setDoing] = useState<string[]>([]);
  const [doingIn, setDoingIn] = useState("");
  const [meds, setMeds] = useState<boolean | null>(null);
  const [medList, setMedList] = useState<string[]>([]);
  const [medIn, setMedIn] = useState("");
  const [alert, setAlert] = useState<boolean | null>(null);
  const [contacts, setContacts] = useState<string[]>([]);
  const [extra, setExtra] = useState("");
  const tog = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const reset = () => { setS(0); setDone(false); setRegions([]); setLevel(null); setNote(""); setTrig([]); setNoStart(false); setOngoing(true); setDoing([]); setMeds(null); setMedList([]); setAlert(null); setContacts([]); setExtra(""); };
  const go = (n: number) => { setDone(false); setS(Math.max(0, Math.min(7, n))); };
  const next = () => (s === 7 ? setDone(true) : go(s + 1));
  const titles = ["", "Describe Your Pain", "How Bad is the Pain?", "What Triggered the Pain?", "Tell Me a Little Bit More", "Are You Taking Any Medications?", "Should We Alert Someone?", "Anything Else You Would Like to Add?"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-start">
      <Phone>
        {s === 0 && !done ? (
          <div className="absolute inset-0 flex flex-col">
            <div className="h-[48%] flex flex-col items-center justify-center text-center px-6 pt-4 text-white" style={{ background: C.blue }}>
              <b className="text-[21px]">Welcome to PainPal!</b>
              <span className="text-[12px] opacity-90 mt-1">A pain diary and management support app</span>
              <button type="button" onClick={next} className="pp-pulse mt-6 rounded-full bg-white px-9 py-2.5 text-[14px] font-bold" style={{ color: C.blue }}>Get Started</button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute left-1/2 -translate-x-1/2 top-1"><div className="pp-rise"><LiveMascot size={292} bob={false} /></div></div>
            </div>
          </div>
        ) : done ? (
          <div className="absolute inset-0 pt-12 px-5 flex flex-col items-center text-center text-[#111] overflow-hidden" style={{ background: C.pale }}>
            <b className="text-[18px]">You&apos;re all set!</b>
            <span className="text-[11px] mt-1" style={{ color: C.sub }}>Here&apos;s your first log</span>
            <div className="w-full mt-3 rounded-2xl p-3 text-left space-y-1.5 text-[11px] bg-white relative z-10 pp-toast">
              <div><b>Where:</b> {regions.length ? regions.join(", ") : "Skipped"}</div>
              <div><b>How bad:</b> {level ? LEVELS[level - 1].label : "Skipped"}</div>
              <div><b>Triggers:</b> {trig.length ? trig.join(", ") : "Skipped"}</div>
              <div><b>Medications:</b> {meds ? (medList.length ? medList.join(", ") : "Yes") : meds === false ? "None" : "Skipped"}</div>
              <div><b>Alert:</b> {alert ? (contacts.length ? contacts.join(", ") : "Yes") : alert === false ? "No one" : "Skipped"}</div>
            </div>
            <button type="button" onClick={reset} className="relative z-10 mt-3 rounded-full px-5 py-2 text-[12px] font-semibold text-white" style={{ background: C.blue }}>↺ Start over</button>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[70px]"><div className="pp-rise"><LiveMascot size={210} bob={false} /></div></div>
          </div>
        ) : (
          <div className="absolute inset-0 pt-10 px-4 pb-4 flex flex-col text-[#111]">
            <div className="relative flex items-center justify-center min-h-10 mb-1">
              <button type="button" onClick={() => go(s - 1)} className="absolute left-0 p-1" aria-label="Back"><Icon name="back" /></button>
              <h3 className="text-[14px] font-bold px-8 text-center leading-tight">{titles[s]}</h3>
              <button type="button" onClick={next} className="absolute right-0 text-[10px]" style={{ color: C.sub }}>Skip</button>
            </div>
            <div className="flex gap-1 mb-3" aria-label={`Step ${s + 1} of 8`}>{OB.map((_, i) => <i key={i} className="h-1 flex-1 rounded-full transition" style={{ background: i <= s ? C.blue : C.pale }} />)}</div>
            <div key={s} className="flex-1 min-h-0 overflow-y-auto pp-toast">
              {s === 1 && (
                <div>
                  <p className="text-[11px] font-semibold mb-1.5">Where does it hurt?</p>
                  <Segmented options={["Front", "Back"]} value={side} onChange={setSide} />
                  <div className="mt-2 flex justify-center [&_svg]:!h-[260px]"><BodyMap selected={regions} toggle={(r) => tog(regions, setRegions, r)} side={side} /></div>
                  <p className="text-[11px] font-semibold mt-1 mb-1">Selected Regions</p>
                  <div className="flex flex-wrap gap-1.5 min-h-[22px]">
                    {regions.length === 0 ? <span className="text-[10.5px]" style={{ color: C.sub }}>Tap the body to add an area.</span> : regions.map((r) => (
                      <button key={r} type="button" onClick={() => tog(regions, setRegions, r)} className="rounded-full px-2 py-0.5 text-[10.5px] text-white" style={{ background: C.blue }}>{r} ×</button>
                    ))}
                  </div>
                </div>
              )}
              {s === 2 && (
                <div className="space-y-3">
                  <div className="rounded-2xl p-2.5 flex justify-between" style={{ background: C.pale }}>
                    {LEVELS.map((l) => (
                      <button key={l.n} type="button" onClick={() => setLevel(l.n)} aria-pressed={level === l.n} className="flex flex-col items-center gap-1 w-[46px]">
                        <span className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] transition" style={{ background: l.color, outline: level === l.n ? `2.5px solid ${C.blueDark}` : "1px solid rgba(0,0,0,0.25)", outlineOffset: level === l.n ? 2 : 0, transform: level === l.n ? "scale(1.08)" : undefined }}>{l.n}</span>
                        <span className="text-[9px]" style={{ color: C.blue }}>{l.label}</span>
                      </button>
                    ))}
                  </div>
                  <label className="block text-[11px] font-semibold">Please Specify
                    <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Share any symptoms experienced" className={field + " mt-1 font-normal"} style={{ background: C.pale }} />
                  </label>
                </div>
              )}
              {s === 3 && (
                <div className="space-y-3">
                  <div className="rounded-2xl p-3 grid grid-cols-2 gap-2" style={{ background: C.pale }}>
                    {OB_TRIGGERS.map((t) => <Check key={t} label={t} on={trig.includes(t)} onClick={() => tog(trig, setTrig, t)} />)}
                  </div>
                  <label className="block text-[11px] font-semibold">Others
                    <input placeholder="Type any possible triggers" className={field + " mt-1 font-normal"} style={{ background: C.pale }} />
                  </label>
                </div>
              )}
              {s === 4 && (
                <div className="space-y-3 text-[11px]">
                  <div>
                    <b>When did the pain start?</b>
                    <div className="grid grid-cols-[1fr_auto] gap-2 mt-1 items-center">
                      <input type="date" disabled={noStart} className={field + " disabled:opacity-40"} style={{ background: C.pale }} aria-label="Start date" />
                      <input type="time" disabled={noStart} className={field + " w-[84px] disabled:opacity-40"} style={{ background: C.pale }} aria-label="Start time" />
                    </div>
                    <div className="mt-1.5"><Check label="Don't remember" on={noStart} onClick={() => setNoStart(!noStart)} /></div>
                  </div>
                  <div>
                    <b>When did the pain end?</b>
                    <div className="grid grid-cols-[1fr_auto] gap-2 mt-1 items-center">
                      <input type="date" disabled={ongoing} className={field + " disabled:opacity-40"} style={{ background: C.pale }} aria-label="End date" />
                      <input type="time" disabled={ongoing} className={field + " w-[84px] disabled:opacity-40"} style={{ background: C.pale }} aria-label="End time" />
                    </div>
                    <div className="mt-1.5"><Check label="Pain is ongoing" on={ongoing} onClick={() => setOngoing(!ongoing)} /></div>
                  </div>
                  <div>
                    <b>What were you doing when you felt the pain?</b>
                    <form className="flex gap-2 mt-1" onSubmit={(e) => { e.preventDefault(); const v = doingIn.trim(); if (v && !doing.includes(v)) setDoing([...doing, v]); setDoingIn(""); }}>
                      <input value={doingIn} onChange={(e) => setDoingIn(e.target.value)} placeholder="e.g. Walking" className={field} style={{ background: C.pale }} />
                      <button className="rounded-full px-3 text-[11px] font-semibold text-white shrink-0" style={{ background: C.blue }}>Add</button>
                    </form>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {["Walking", "Sitting", "Sports"].filter((x) => !doing.includes(x)).map((x) => <button key={x} type="button" onClick={() => setDoing([...doing, x])} className="rounded-full px-2 py-0.5 text-[10.5px] border" style={{ borderColor: C.blueLight, color: C.blue }}>+ {x}</button>)}
                      {doing.map((x) => <button key={x} type="button" onClick={() => tog(doing, setDoing, x)} className="rounded-full px-2 py-0.5 text-[10.5px] text-white" style={{ background: C.blue }}>{x} ×</button>)}
                    </div>
                  </div>
                </div>
              )}
              {s === 5 && (
                <div className="space-y-3 text-[11px]">
                  <YesNo value={meds} onChange={setMeds} />
                  {meds && (
                    <div className="pp-toast">
                      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = medIn.trim(); if (v && !medList.includes(v)) setMedList([...medList, v]); setMedIn(""); }}>
                        <input value={medIn} onChange={(e) => setMedIn(e.target.value)} placeholder="Type a medication" className={field} style={{ background: C.pale }} />
                        <button className="rounded-full px-3 text-[11px] font-semibold text-white shrink-0" style={{ background: C.blue }}>Add</button>
                      </form>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {["Naproxen", "Ibuprofen"].filter((x) => !medList.includes(x)).map((x) => <button key={x} type="button" onClick={() => setMedList([...medList, x])} className="rounded-full px-2 py-0.5 text-[10.5px] border" style={{ borderColor: C.blueLight, color: C.blue }}>+ {x}</button>)}
                        {medList.map((x) => <button key={x} type="button" onClick={() => tog(medList, setMedList, x)} className="rounded-full px-2 py-0.5 text-[10.5px] text-white" style={{ background: RED }}>{x} ×</button>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {s === 6 && (
                <div className="space-y-3 text-[11px]">
                  <YesNo value={alert} onChange={setAlert} />
                  {alert && (
                    <div className="pp-toast space-y-2">
                      <b className="block text-center text-[12.5px]">Who Should We Contact?</b>
                      <span style={{ color: C.blue }}>2 Emergency Contacts Found</span>
                      {["Mom", "Greg"].map((c) => (
                        <button key={c} type="button" onClick={() => tog(contacts, setContacts, c)} aria-pressed={contacts.includes(c)} className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 transition" style={{ background: contacts.includes(c) ? C.pale : "transparent" }}>
                          <span className="w-7 h-7 rounded-full border flex items-center justify-center text-[10px]" style={{ borderColor: C.blueLight, color: C.blue }}>{c[0]}</span>
                          <b className="flex-1 text-left">{c}</b>
                          {contacts.includes(c) && <span style={{ color: C.blue }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {s === 7 && (
                <textarea value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Anything else about today’s pain…" className={field + " h-[300px] resize-none"} style={{ background: C.pale }} aria-label="Anything else" />
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button type="button" onClick={next} className="rounded-full px-5 py-2 text-[12px] font-semibold text-white" style={{ background: C.blue }}>{s === 7 ? "Complete" : "Next ›"}</button>
            </div>
          </div>
        )}
      </Phone>

      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2" role="group" aria-label="Onboarding screens">
          {OB.map((o, i) => (
            <button key={o.t} type="button" onClick={() => go(i)} aria-current={!done && s === i ? "step" : undefined} className={"rounded-lg border px-2 py-2 text-left transition " + (!done && s === i ? "border-[var(--accent)] bg-white/5" : "border-white/10 hover:border-white/30")}>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center shrink-0" style={!done && s === i ? { background: "var(--accent)", color: "#0B0B0C" } : { background: "#2F5BEA", color: "#fff" }}>{i + 1}</span>
                <span className="text-[11px] text-[#d1d1d6] leading-tight">{o.t}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-[#141416] p-4 space-y-1.5" aria-live="polite">
          <div className="text-white">{done ? "Done" : `${s + 1} · ${OB[s].t}`}</div>
          <p className="text-sm text-[#b4b4bb] leading-relaxed">{done ? "Everything you entered becomes the first entry in your diary. Every step could be skipped." : OB[s].d}</p>
        </div>
        <p className="text-xs text-[#888890]">Recreated in code from the onboarding designs. Nothing you enter is saved or sent.</p>
      </div>
    </div>
  );
}
