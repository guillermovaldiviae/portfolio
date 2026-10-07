"use client";

import { useState, type ReactNode } from "react";

/* PainPal identity: app icon, icon set, color, and type, recreated as live SVG/CSS. */

const BLUE = "#3A86CF";
const LIGHT = "#93C8FE";
const PALE = "#E8F2FC";
const RED = "#E43325";
const INK = "#111111";
const POP = { fontFamily: "Poppins, ui-rounded, system-ui, sans-serif", wordSpacing: "0.06em" };

/* ---------- App icon ---------- */
export function AppIcon({ wink }: { wink: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" aria-hidden="true">
      <rect x="2" y="2" width="116" height="116" rx="30" fill={LIGHT} />
      {/* antenna badge */}
      <circle cx="60" cy="19" r="10" fill={LIGHT} stroke={BLUE} strokeWidth="3.5" />
      <rect x="58.2" y="13" width="3.6" height="12" rx="0.8" fill={RED} />
      <rect x="54" y="17.2" width="12" height="3.6" rx="0.8" fill={RED} />
      {/* visor */}
      <rect x="11" y="36" width="98" height="38" rx="13" fill="#fff" stroke={BLUE} strokeWidth="4" />
      {/* eyes: thick, shallow chevrons with flat-cut ends, as in the original icon; a wink squeezes them into a squint */}
      <g style={{ transformBox: "fill-box", transformOrigin: "center", transform: wink ? "scaleY(0.55)" : "none", transition: "transform 160ms ease" }}>
        <path d="M21 61 L35 53 L47 60" fill="none" stroke={INK} strokeWidth="8" strokeLinejoin="miter" strokeLinecap="butt" />
        <path d="M73 60 L85 53 L99 61" fill="none" stroke={INK} strokeWidth="8" strokeLinejoin="miter" strokeLinecap="butt" />
      </g>
      {/* smile */}
      <path d="M33 82 H87 C87 100 74 108 60 108 C46 108 33 100 33 82 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Icon set ---------- */
type Ico = { label: string; use: string; svg: ReactNode };
const s = { fill: "none", stroke: BLUE, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const NAV: Ico[] = [
  {
    label: "Diary",
    use: "Your pain log, day by day",
    svg: (
      <>
        <rect x="11" y="9" width="26" height="33" rx="5" {...s} fill={LIGHT} />
        <rect x="17" y="5" width="14" height="8" rx="2.5" {...s} fill={LIGHT} />
      </>
    ),
  },
  {
    label: "Log pain",
    use: "The one action that matters most",
    svg: (
      <>
        <circle cx="24" cy="24" r="18" fill={LIGHT} />
        <path d="M24 16v16M16 24h16" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Share",
    use: "Send a clear report to your doctor",
    svg: (
      <>
        <path d="M24 30V7M15 15l9-9 9 9" {...s} stroke={LIGHT} strokeWidth="4" />
        <path d="M11 24v12a4 4 0 0 0 4 4h18a4 4 0 0 0 4-4V24" {...s} stroke={LIGHT} strokeWidth="4" />
      </>
    ),
  },
  {
    label: "Chats",
    use: "Talk it through with PainPal",
    svg: <path d="M24 6c10 0 18 7.6 18 17s-8 17-18 17c-2.6 0-5-.5-7.2-1.4L8 42l2.4-8.4C8 30.7 6 27 6 23 6 13.6 14 6 24 6z" {...s} fill={LIGHT} strokeWidth={3.6} />,
  },
];

const w = { fill: "none", stroke: "#fff", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const BODY: Ico[] = [
  {
    label: "Back",
    use: "Upper and lower back",
    svg: (
      <g {...w}>
        <path d="M14 36V22c0-4 2-6 5-7M34 36V22c0-4-2-6-5-7" />
        <path d="M19 15c1-2 2-3 2-5M29 15c-1-2-2-3-2-5" />
        <path d="M24 17v19M18 36l1-12M30 36l-1-12" />
      </g>
    ),
  },
  {
    label: "Feet",
    use: "Ankles, heels, and soles",
    svg: (
      <g {...w}>
        <path d="M19 10v14c0 3-2 5-2 8 0 2 1 3 3 3h15c2 0 3-1 3-2s-1-2-3-2c-4 0-8-3-11-5V10" />
      </g>
    ),
  },
  {
    label: "Neck",
    use: "Neck and shoulders",
    svg: (
      <g {...w}>
        <path d="M17 10c0 5 2 9 5 11M31 10c0 5-2 9-5 11" />
        <path d="M22 17c1 .8 3 .8 4 0" />
        <path d="M22 21v5l-8 3M26 21v5l8 3M20 32c2 .6 6 .6 8 0" />
      </g>
    ),
  },
  {
    label: "Knee",
    use: "Knees and joints",
    svg: (
      <g {...w}>
        <path d="M14 36v-6c0-5 4-8 9-9l9-3V10h4v26H26v-4" />
        <path d="M32 14l2 4" />
      </g>
    ),
  },
  {
    label: "More",
    use: "Any other area",
    svg: (
      <g {...w}>
        <circle cx="15" cy="24" r="3" />
        <circle cx="24" cy="24" r="3" />
        <circle cx="33" cy="24" r="3" />
      </g>
    ),
  },
];

/* ---------- Color ---------- */
const COLORS = [
  { name: "PainPal Blue", hex: BLUE, use: "Primary actions, outlines, body-area icons", text: "#fff" },
  { name: "Sky", hex: LIGHT, use: "App icon, nav fills, soft surfaces", text: INK },
  { name: "Mist", hex: PALE, use: "Backgrounds and cards", text: INK },
  { name: "Signal Red", hex: RED, use: "Used sparingly: the medical cross and urgent alerts", text: "#fff" },
];
const SCALE = ["#6CC17A", "#A6E57A", "#F2EE7A", "#F6A057", "#F9A9A9"];

export default function PainPalIdentity() {
  const [wink, setWink] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const cur = [...NAV, ...BODY].find((i) => i.label === hover);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-4" style={POP}>
      {/* App icon */}
      <button
        type="button"
        onMouseEnter={() => setWink(true)}
        onMouseLeave={() => setWink(false)}
        onClick={() => setWink((v) => !v)}
        aria-label="PainPal app icon (tap to wink)"
        className="rounded-xl bg-[#E8F2FC] p-6 flex flex-col items-center justify-center gap-4 text-left"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 transition-transform duration-300 hover:-rotate-3 drop-shadow-[0_12px_20px_rgba(58,134,207,0.35)]">
          <AppIcon wink={wink} />
        </div>
        <div className="text-center">
          <div className="text-[22px] font-bold tracking-tight" style={{ color: BLUE }}>
            PainPal
          </div>
          <p className="text-[12px] text-[#51606F] mt-1 max-w-[240px]">
            A friendly robot with a medic&rsquo;s cross: approachable first, clinical second. Tap to wink.
          </p>
        </div>
      </button>

      <div className="grid gap-4">
        {/* Icons */}
        <div className="rounded-xl bg-white p-5">
          <div className="flex items-baseline justify-between gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Icons</div>
            <div className="text-[12px] text-[#51606F] min-h-[1.2em] text-right" aria-live="polite">
              {cur ? (
                <>
                  <span className="font-semibold" style={{ color: INK }}>{cur.label}</span> · {cur.use}
                </>
              ) : (
                "Hover or tap an icon"
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {NAV.map((i) => (
              <span
                key={i.label}
                tabIndex={0}
                onMouseEnter={() => setHover(i.label)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i.label)}
                onBlur={() => setHover(null)}
                className="w-11 h-11 rounded-lg flex items-center justify-center transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A86CF]"
                aria-label={`${i.label}: ${i.use}`}
              >
                <svg viewBox="0 0 48 48" className="w-9 h-9">{i.svg}</svg>
              </span>
            ))}
            <span className="w-px h-8 bg-[#E3E8EF] mx-1" aria-hidden="true" />
            {BODY.map((i) => (
              <span
                key={i.label}
                tabIndex={0}
                onMouseEnter={() => setHover(i.label)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i.label)}
                onBlur={() => setHover(null)}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3A86CF]"
                style={{ background: BLUE }}
                aria-label={`${i.label}: ${i.use}`}
              >
                <svg viewBox="0 0 48 48" className="w-9 h-9">{i.svg}</svg>
              </span>
            ))}
          </div>
          <p className="mt-3 text-[12px] text-[#51606F] leading-relaxed">
            Soft, filled navigation icons for the core actions; white line-art body areas on blue for picking where it hurts. Big, round targets for tired hands.
          </p>
        </div>

        {/* Color + type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Color</div>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {COLORS.map((c) => (
                <div key={c.hex} className="group relative">
                  <div className="h-14 rounded-md flex items-end p-1.5 text-[9px] font-semibold" style={{ background: c.hex, color: c.text, border: c.hex === PALE ? "1px solid #D6E4F2" : undefined }}>
                    {c.hex.replace("#", "")}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold leading-tight" style={{ color: INK }}>{c.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-[#8A97A8]">Pain scale</div>
            <div className="mt-1 flex h-3 rounded-full overflow-hidden">
              {SCALE.map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[9px] text-[#8A97A8]">
              <span>No pain</span>
              <span>Extreme</span>
            </div>
            <p className="mt-3 text-[12px] text-[#51606F] leading-relaxed">
              Calm blues build trust without feeling clinical. Red is saved for the medic&rsquo;s cross and alerts, and the pain scale runs green to soft red so a bad day reads clearly without alarming.
            </p>
          </div>

          <div className="rounded-xl bg-white p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Type</div>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-[56px] leading-none font-semibold" style={{ color: INK }}>Aa</span>
              <div className="pb-1">
                <div className="text-[15px] font-semibold" style={{ color: INK }}>Poppins</div>
                <div className="text-[11px] text-[#8A97A8]">Regular · SemiBold · Bold</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="text-[18px] font-bold leading-tight" style={{ color: INK }}>How&rsquo;s your pain today?</div>
              <div className="text-[13px] font-semibold" style={{ color: BLUE }}>Log pain</div>
              <div className="text-[12px] text-[#51606F]">Moderate · Lower back · 2:40 PM</div>
            </div>
            <p className="mt-3 text-[12px] text-[#51606F] leading-relaxed">
              A rounded geometric sans that feels warm, matches the robot&rsquo;s soft shapes, and stays legible at small sizes on a phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
