"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* ------------------------------------------------------------------
   Central Park Challenge: 4 strongest section upgrades.
   Flip the switch for 2025 → 2026, then step through the design
   process: lo-fi wireframe → mid-fi mockup → hi-fi (live site).
   Wireframes are drawn on a 1600px-wide canvas and scaled to fit.
   ------------------------------------------------------------------ */

const NAVY = "#1B4472";
const ORANGE = "#F26322";
const AMBER = "#F7941D";
const BLUE = "#00A1D0";
const MUL: CSSProperties = { fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif" };
const R = "/work/central-park-challenge/redesign";

type Fid = "lo" | "mid" | "hi";

/* Scales a fixed-size design canvas to the width of its container. */
function Canvas({ w, h, children, bg = "#fff" }: { w: number; h: number; children: ReactNode; bg?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.5);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: `${w} / ${h}`, background: bg }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, transform: `scale(${s})` }}>
        {children}
      </div>
    </div>
  );
}

/* ---------- lo-fi primitives ---------- */
const at = (x: number, y: number, w: number, h: number): CSSProperties => ({ position: "absolute", left: x, top: y, width: w, height: h });
function XBox({ x, y, w, h, round = 6, label }: { x: number; y: number; w: number; h: number; round?: number; label?: string }) {
  return (
    <div style={{ ...at(x, y, w, h), borderRadius: round, background: "#E7E7E2", border: "3px solid #B9B9B2", overflow: "hidden" }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
        <line x1="0" y1="0" x2="100" y2="100" stroke="#C9C9C2" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#C9C9C2" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
      </svg>
      {label && <span style={{ position: "absolute", left: 16, bottom: 12, font: "500 22px ui-monospace, monospace", color: "#8A8A83" }}>{label}</span>}
    </div>
  );
}
const Bar = ({ x, y, w, h = 16, c = "#C9C9C2" }: { x: number; y: number; w: number; h?: number; c?: string }) => (
  <div style={{ ...at(x, y, w, h), background: c, borderRadius: h / 2 }} />
);
const Outline = ({ x, y, w, h, round = 40, dash = false, label }: { x: number; y: number; w: number; h: number; round?: number; dash?: boolean; label?: string }) => (
  <div style={{ ...at(x, y, w, h), borderRadius: round, border: `3px ${dash ? "dashed" : "solid"} #55554F`, display: "flex", alignItems: "center", justifyContent: "center", font: "600 22px ui-monospace, monospace", color: "#55554F" }}>
    {label}
  </div>
);
function Pin({ n, x, y, note }: { n: number; x: number; y: number; note: string }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 12, zIndex: 5 }}>
      <span style={{ width: 46, height: 46, borderRadius: 23, background: "#2F5BFF", color: "#fff", font: "600 22px ui-monospace, monospace", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 6px rgba(255,255,255,0.9)" }}>{n}</span>
      <span style={{ background: "#fff", border: "2px solid #2F5BFF", color: "#1B2A6B", borderRadius: 10, padding: "6px 14px", font: "600 22px ui-sans-serif, system-ui", whiteSpace: "nowrap" }}>{note}</span>
    </div>
  );
}
const ImgIcon = ({ c = "#fff" }: { c?: string }) => (
  <svg width="64" height="52" viewBox="0 0 32 26" fill="none" stroke={c} strokeWidth="2">
    <rect x="1" y="1" width="30" height="24" rx="3" />
    <circle cx="10" cy="9" r="3" />
    <path d="M1 21l9-8 7 6 5-4 9 7" />
  </svg>
);
const Placeholder = ({ style, dark = false, note, icon = true }: { style: CSSProperties; dark?: boolean; note?: string; icon?: boolean }) => (
  <div style={{ ...style, background: dark ? "#3B4452" : "#C9D3DE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: dark ? "#E5E9EF" : "#51606F", font: "600 20px Mulish, sans-serif" }}>
    {icon && <ImgIcon c={dark ? "#E5E9EF" : "#51606F"} />}
    {note}
  </div>
);

/* ---------- sections ---------- */

type Section = {
  id: string;
  label: string;
  w: number;
  h: number;
  before: string;
  after: string;
  change: string;
  notes: Record<Fid | "old", string>;
  lo: ReactNode;
  mid: ReactNode;
};

const SECTIONS: Section[] = [
  {
    id: "hero",
    label: "Hero",
    w: 1600,
    h: 704,
    before: `${R}/hero-2025.jpg`,
    after: `${R}/hero-2026.jpg`,
    change: "From washed-out to confident",
    notes: {
      old: "A white haze let the logo and date compete with the crowd, under seven equal links.",
      lo: "Structure first: a lockup that leads, one persistent Donate, and three nav choices instead of seven.",
      mid: "Real type and brand color. The photo darkens so the white lockup and sponsor read at a glance.",
      hi: "Live on the site: the 40th-anniversary lockup, presented by Waymo, over a full-color crowd.",
    },
    lo: (
      <>
        <XBox x={190} y={22} w={170} h={62} round={6} label="logo" />
        <Bar x={1150} y={44} w={90} h={20} /> <Bar x={1270} y={44} w={120} h={20} /> <Bar x={1420} y={36} w={40} h={36} />
        <div style={{ ...at(0, 105, 1600, 66), background: "#EDEDE8" }} />
        <Outline x={205} y={118} w={130} h={42} label="Donate" />
        <Bar x={1165} y={132} w={110} /> <Bar x={1300} y={132} w={150} />
        <XBox x={0} y={171} w={1600} h={533} round={0} label="crowd photo, darkened" />
        <Outline x={520} y={255} w={560} h={330} round={8} dash label="LOCKUP + SPONSOR" />
        <Pin n={1} x={1110} y={380} note="Lockup + sponsor, not a date" />
        <Pin n={2} x={1070} y={186} note="Three choices, not seven" />
        <Pin n={3} x={120} y={186} note="One persistent action" />
      </>
    ),
    mid: (
      <div style={MUL}>
        <div style={{ ...at(190, 20, 240, 70), lineHeight: 1 }}>
          <div style={{ font: "900 30px Mulish", color: NAVY }}><span style={{ color: AMBER }}>YAI</span><span style={{ color: BLUE }}>40th</span></div>
          <div style={{ font: "900 17px Mulish", color: ORANGE }}>CENTRAL PARK</div>
          <div style={{ font: "900 24px Mulish", color: NAVY }}>CHALLENGE</div>
        </div>
        <div style={{ ...at(1180, 36, 110, 40), background: "#222", color: "#fff", borderRadius: 6, font: "600 18px Mulish", display: "flex", alignItems: "center", justifyContent: "center" }}>⇧ SHARE</div>
        <div style={{ ...at(0, 105, 1600, 66), background: "#F6F6F6" }} />
        <div style={{ ...at(205, 116, 130, 46), background: AMBER, color: "#fff", borderRadius: 23, font: "800 22px Mulish", display: "flex", alignItems: "center", justifyContent: "center" }}>Donate</div>
        <div style={{ position: "absolute", left: 1160, top: 124, font: "800 22px Mulish", color: NAVY, display: "flex", gap: 34 }}>
          <span>Event Info</span><span>Ways to Support ▾</span>
        </div>
        <Placeholder dark icon={false} style={at(0, 171, 1600, 533)} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", lineHeight: 0.95 }}>
          <div style={{ font: "900 120px Mulish", letterSpacing: -2 }}><span style={{ color: AMBER }}>YAI</span><span style={{ color: BLUE }}>40th</span></div>
          <div style={{ font: "900 78px Mulish", color: ORANGE }}>CENTRAL <span style={{ color: AMBER }}>PARK</span></div>
          <div style={{ font: "900 96px Mulish", color: "#fff" }}>CHALLENGE</div>
          <div style={{ font: "700 34px Mulish", color: "#fff", letterSpacing: 6, marginTop: 22 }}>PRESENTED BY WAYMO</div>
        </div>
      </div>
    ),
  },
  {
    id: "ask",
    label: "Donation bar",
    w: 1600,
    h: 557,
    before: `${R}/ask-2025.jpg`,
    after: `${R}/ask-2026.jpg`,
    change: "From abstract to human",
    notes: {
      old: "A progress ring beside a generic paragraph about “raising funds to make a difference.”",
      lo: "Keep the built-in ring (it updates itself), and give the copy one job: say what the day is.",
      mid: "Plain, specific copy, tax-deductibility at the moment of decision, and room for a photo.",
      hi: "Live: the same platform ring, now next to a joyful photo and a single bright button.",
    },
    lo: (
      <>
        <div style={{ ...at(187, 87, 380, 380), borderRadius: 190, border: "30px solid #C9C9C2" }} />
        <Bar x={300} y={250} w={160} h={22} /> <Bar x={270} y={290} w={220} h={40} />
        <Bar x={594} y={140} w={560} h={24} c="#9C9C95" />
        <Bar x={594} y={210} w={620} /> <Bar x={594} y={245} w={560} />
        <Bar x={594} y={312} w={300} c="#9C9C95" />
        <Outline x={594} y={360} w={170} h={66} label="Donate" />
        <XBox x={1230} y={0} w={370} h={557} round={0} label="photo" />
        <Pin n={1} x={120} y={480} note="Keep the built-in ring" />
        <Pin n={2} x={640} y={80} note="Say what the day is" />
        <Pin n={3} x={930} y={296} note="Tax-deductible, right here" />
      </>
    ),
    mid: (
      <div style={MUL}>
        <svg style={at(187, 87, 380, 380)} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#E6E6E6" strokeWidth="8" />
          <circle cx="50" cy="50" r="44" fill="none" stroke={BLUE} strokeWidth="8" strokeDasharray="262 276" transform="rotate(-86 50 50)" />
        </svg>
        <div style={{ position: "absolute", left: 187, width: 380, top: 225, textAlign: "center" }}>
          <div style={{ font: "500 24px Mulish", color: "#222" }}>We’ve raised</div>
          <div style={{ font: "500 84px Mulish", color: "#111", lineHeight: 1 }}>$610K</div>
        </div>
        <div style={{ position: "absolute", left: 594, top: 130, width: 600 }}>
          <div style={{ font: "800 28px Mulish", color: "#0A8FC0" }}>Join us for a morning of free, inclusive family fun.</div>
          <div style={{ font: "400 26px/1.55 Mulish", color: "#222", marginTop: 28 }}>Take part in our signature 3K Walk, volunteer, donate, or fundraise to support thousands of people with I/DD.</div>
          <div style={{ font: "italic 800 21px Mulish", color: NAVY, marginTop: 26 }}>Donations are 100% tax-deductible</div>
          <div style={{ width: 170, height: 66, borderRadius: 33, background: AMBER, color: "#fff", font: "600 22px Mulish", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 32 }}>DONATE</div>
        </div>
        <Placeholder style={{ ...at(1215, 0, 385, 557), clipPath: "polygon(0 0, 100% 0, 100% 100%, 22% 100%)" }} note="Joyful family photo" />
      </div>
    ),
  },
  {
    id: "activities",
    label: "Activities",
    w: 1600,
    h: 890,
    before: `${R}/activities-2025.jpg`,
    after: `${R}/activities-2026.jpg`,
    change: "From a wall of text to an invitation",
    notes: {
      old: "Centered, all-caps headings over centered paragraphs. Hard to scan, no images, and little sense of fun.",
      lo: "A left-aligned list you can scan, one activity per row, with the event's ring collage beside it.",
      mid: "Sentence-case titles in navy, one short line each, and photos framed in the same rings used across the site.",
      hi: "Live: five activities, clear dividers, and a joyful ring collage that matches every other section.",
    },
    lo: (
      <>
        {Array.from({ length: 5 }).map((_, k) => (
          <div key={k}>
            <Bar x={110} y={70 + k * 160} w={260 + ((k * 53) % 120)} h={26} c="#9C9C95" />
            <Bar x={110} y={118 + k * 160} w={560} /> <Bar x={110} y={148 + k * 160} w={400} />
            {k < 4 && <div style={{ ...at(110, 196 + k * 160, 630, 3), background: "#D6D6D0" }} />}
          </div>
        ))}
        <XBox x={865} y={80} w={230} h={230} round={115} />
        <XBox x={985} y={225} w={390} h={390} round={195} label="photo" />
        <div style={{ ...at(1265, 140, 110, 110), borderRadius: 55, border: "3px solid #B9B9B2" }} />
        <div style={{ ...at(965, 555, 120, 120), borderRadius: 60, border: "3px solid #B9B9B2" }} />
        <div style={{ ...at(1390, 445, 70, 70), borderRadius: 35, border: "3px solid #B9B9B2" }} />
        <Pin n={1} x={480} y={36} note="Scannable rows, left-aligned" />
        <Pin n={2} x={1110} y={690} note="Same ring collage as the site" />
        <Pin n={3} x={560} y={500} note="One line per activity" />
      </>
    ),
    mid: (
      <div style={MUL}>
        {[["Inclusive Junior Races", "A family favorite, the Junior Races let kids of all ages join in fast-paced relay fun."], ["Switch Adapted Carnival Games", "Try out one of our new switch adapted carnival games designed for people of all abilities."], ["Adaptive Clothing Closet", "Try on clothing, shoes, and accessories specially designed to increase independence."], ["Adaptive Art & Music Tent", "Celebrate all abilities through song, dance, creativity, and community."], ["Assistive Technology Showcase", "Explore assistive technology and tools that help people connect and thrive."]].map(([t, d], k) => (
          <div key={t} style={{ position: "absolute", left: 110, top: 60 + k * 160, width: 630 }}>
            <div style={{ font: "800 30px Mulish", color: NAVY }}>{t}</div>
            <div style={{ font: "400 21px/1.55 Mulish", color: "#555", marginTop: 12 }}>{d}</div>
            {k < 4 && <div style={{ height: 2, background: "#E3E3E3", marginTop: 26 }} />}
          </div>
        ))}
        <Placeholder style={{ ...at(865, 80, 230, 230), borderRadius: 115, outline: `6px solid ${ORANGE}` }} />
        <Placeholder style={{ ...at(985, 225, 390, 390), borderRadius: 195, outline: `5px solid ${NAVY}` }} note="Junior Races photo" />
        <div style={{ ...at(1265, 140, 110, 110), borderRadius: 55, border: `11px solid ${BLUE}` }} />
        <div style={{ ...at(965, 555, 120, 120), borderRadius: 60, border: `8px solid ${AMBER}` }} />
        <div style={{ ...at(1390, 445, 70, 70), borderRadius: 35, border: `8px solid ${ORANGE}` }} />
      </div>
    ),
  },
  {
    id: "volunteers",
    label: "Volunteers",
    w: 1600,
    h: 633,
    before: `${R}/volunteers-2025.jpg`,
    after: `${R}/volunteers-2026.jpg`,
    change: "From a form to an invitation",
    notes: {
      old: "A line about a free t-shirt and a grey Register button. No faces, no reason to join.",
      lo: "People first: volunteers see themselves, read why they matter, then get one clear action.",
      mid: "The event’s circle-and-ring motif frames real volunteers; copy leads with belonging.",
      hi: "Live: photos, a two-line headline, and one bright Sign Up button.",
    },
    lo: (
      <>
        <XBox x={272} y={105} w={170} h={170} round={85} />
        <XBox x={372} y={213} w={310} h={310} round={155} label="volunteer photo" />
        <div style={{ ...at(600, 150, 80, 80), borderRadius: 40, border: "3px solid #B9B9B2" }} />
        <div style={{ ...at(360, 450, 100, 100), borderRadius: 50, border: "3px solid #B9B9B2" }} />
        <Bar x={840} y={175} w={360} h={30} c="#9C9C95" /> <Bar x={840} y={218} w={480} h={30} c="#9C9C95" />
        <Bar x={840} y={285} w={620} /> <Bar x={840} y={320} w={600} /> <Bar x={840} y={355} w={560} />
        <Outline x={840} y={410} w={250} h={60} label="Sign up" />
        <Pin n={1} x={60} y={40} note="Faces first" />
        <Pin n={2} x={1130} y={120} note="Why it matters, in a line" />
        <Pin n={3} x={1120} y={420} note="One bright action" />
      </>
    ),
    mid: (
      <div style={MUL}>
        <Placeholder style={{ ...at(272, 105, 170, 170), borderRadius: 85, outline: `5px solid ${ORANGE}`, outlineOffset: 0 }} />
        <Placeholder style={{ ...at(372, 213, 310, 310), borderRadius: 155, outline: `5px solid ${NAVY}` }} note="Volunteer photo" />
        <div style={{ ...at(600, 150, 80, 80), borderRadius: 40, border: `9px solid ${BLUE}` }} />
        <div style={{ ...at(360, 450, 100, 100), borderRadius: 50, border: `7px solid ${AMBER}` }} />
        <div style={{ ...at(700, 390, 55, 55), borderRadius: 28, border: `7px solid ${ORANGE}` }} />
        <div style={{ position: "absolute", left: 840, top: 160, width: 640 }}>
          <div style={{ font: "800 44px/1.05 Mulish", color: NAVY }}>Simply Stated,</div>
          <div style={{ font: "800 44px/1.05 Mulish", color: "#0A8FC0" }}>Volunteers Make it Happen</div>
          <div style={{ font: "400 22px/1.7 Mulish", color: "#333", marginTop: 24 }}>Every smile, race, performance, and unforgettable moment at the Central Park Challenge is made possible by volunteers.</div>
          <div style={{ width: 260, height: 58, borderRadius: 29, background: ORANGE, color: "#fff", font: "700 22px Mulish", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 28 }}>Sign Up To Volunteer</div>
        </div>
      </div>
    ),
  },
];

const FIDS: { id: Fid; label: string }[] = [
  { id: "lo", label: "Lo-fi" },
  { id: "mid", label: "Mid-fi" },
  { id: "hi", label: "Hi-fi" },
];

export default function CpcRedesign() {
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);
  const [fid, setFid] = useState<Fid>("hi");
  const s = SECTIONS[i];
  const note = on ? s.notes[fid] : s.notes.old;

  return (
    <div className="space-y-4">
      {/* Section buttons */}
      <div role="tablist" aria-label="Redesigned sections" className="flex flex-wrap gap-2">
        {SECTIONS.map((x, k) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={"px-3.5 py-1.5 rounded-full text-sm border transition " + (k === i ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}
          >
            {x.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={() => setOn((v) => !v)}
          className="flex items-center gap-3 text-sm"
        >
          <span className={"font-mono text-xs " + (on ? "text-[#888890]" : "text-white")}>2025</span>
          <span className={"relative w-14 h-8 rounded-full transition-colors " + (on ? "bg-[var(--accent)]" : "bg-white/15")}>
            <span className={"absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 " + (on ? "translate-x-6" : "")} />
          </span>
          <span className={"font-mono text-xs " + (on ? "text-white" : "text-[#888890]")}>2026 redesign</span>
        </button>
        <div className={"inline-flex rounded-full border border-white/15 p-1 transition-opacity " + (on ? "" : "opacity-35 pointer-events-none")} aria-label="Design fidelity">
          {FIDS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={fid === f.id}
              onClick={() => setFid(f.id)}
              className={"px-3.5 py-1 rounded-full text-xs font-mono transition " + (fid === f.id ? "bg-white text-[#0B0B0C]" : "text-[#b4b4bb] hover:text-[var(--accent)]")}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stage */}
      <div className="relative isolate rounded-lg overflow-hidden border border-white/10 bg-white">
        <span className={"absolute top-3 right-3 z-10 px-2 py-1 rounded font-mono text-[11px] tracking-wider " + (on ? "bg-[var(--accent)] text-[#0B0B0C]" : "bg-black/70 text-white")}>
          {on ? (fid === "lo" ? "2026 · WIREFRAME" : fid === "mid" ? "2026 · MOCKUP" : "2026 · LIVE") : "2025"}
        </span>
        <div key={`${s.id}-${on}-${fid}`} className="cs-fade">
          {!on ? (
            <Canvas w={s.w} h={s.h}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.before} alt={`2025 ${s.label} section`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Canvas>
          ) : fid === "hi" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.after} alt={`2026 ${s.label} section, live`} className="block w-full h-auto" />
          ) : (
            <Canvas w={s.w} h={s.h} bg={fid === "lo" ? "#FBFBF9" : "#fff"}>
              {fid === "lo" ? s.lo : s.mid}
            </Canvas>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-start" aria-live="polite">
        <div>
          <div className="text-white text-base">{s.change}</div>
          <p className="text-sm text-[#888890] leading-relaxed mt-1 max-w-[680px]">{note}</p>
        </div>
        <p className="text-xs text-[#888890] font-mono sm:text-right">Flip the switch · step through the process</p>
      </div>
    </div>
  );
}
