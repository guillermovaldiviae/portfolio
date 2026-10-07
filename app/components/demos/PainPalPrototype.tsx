"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppIcon } from "./PainPalIdentity";

/* ------------------------------------------------------------------
   PainPal — interactive prototype, recreated in code from the original
   designs. Everything is local state; nothing is saved or sent.
   ------------------------------------------------------------------ */

export const C = {
  blue: "#3A86CF",
  blueDark: "#2B6FB5",
  blueLight: "#93C8FE",
  pale: "#E8F2FC",
  ink: "#111111",
  sub: "#6B7280",
};
export const font = { fontFamily: "Poppins, ui-rounded, system-ui, sans-serif", wordSpacing: "0.04em" };

// Intensity scale (matches the app's 1–5 color scale)
export const LEVELS = [
  { n: 1, label: "No Pain", color: "#6CC17A" },
  { n: 2, label: "Light", color: "#A6E57A" },
  { n: 3, label: "Moderate", color: "#F2EE7A" },
  { n: 4, label: "Intense", color: "#F6A057" },
  { n: 5, label: "Extreme", color: "#F9A9A9" },
];
const levelColor = (n: number) => LEVELS[n - 1]?.color ?? "#ccc";

const REGION_COLORS: Record<string, string> = {
  Stomach: "#7FB3F5",
  "Upper Back": "#5DC565",
  "Lower Back": "#8FD3C4",
  Hand: "#F4868A",
  Knee: "#F2EE55",
  Back: "#5DC565",
  Neck: "#B18CF2",
  Head: "#58B7F0",
  Shoulder: "#F6A057",
  Chest: "#F28DC8",
  Hips: "#8FD3C4",
  Feet: "#C9A27A",
  Foot: "#C9A27A",
  "Upper Arm": "#F6C177",
  Forearm: "#F4A3B5",
  Thigh: "#9CC7F2",
  Shin: "#A7D98B",
};
// "Left Knee" and "Right Knee" share the Knee color, and so on.
const regionColor = (r: string) => REGION_COLORS[r] ?? REGION_COLORS[r.replace(/^(Left|Right) /, "")] ?? "#aaa";

export type Entry = { id: number; hour: number; region: string; level: number; triggers: string[] };
type Screen = "home" | "report" | "diary" | "share" | "chat";

const TRIGGERS = ["Weather", "Exercise", "Stress", "Jetlag", "Humidity", "Work", "Pollutants", "Alcohol", "Anxiety", "I don't know"];

// February 2024 diary data (intensity per day, from the design)
const FEB: number[] = [1, 1, 1, 2, 2, 2, 3, 4, 3, 3, 3, 3, 3, 2, 1, 3, 4, 5, 4, 3, 3, 3, 2, 2, 1, 1, 3, 3, 4];
const FEB_START = 4; // Feb 1, 2024 was a Thursday (0 = Sunday)
const TODAY = 8;

/* ---------------- Mascot ---------------- */

export function Mascot({ size = 40, wink = false, bob = true, className = "" }: { size?: number; wink?: boolean; bob?: boolean; className?: string }) {
  // Traced from the original illustration: the body fills ~80% of the width, a wide white visor
  // with thick flat-ended chevron eyes, a wide open smile, side ears, a heart, and a medic's antenna.
  // "wink" is the happy squint: the chevrons squeeze down, keeping their shape.
  const eyes = { transformBox: "fill-box" as const, transformOrigin: "center", transform: wink ? "scaleY(0.55)" : "none", transition: "transform 160ms ease" };
  return (
    <svg viewBox="0 0 120 150" width={size} height={size * 1.25} className={(bob ? "pp-bob " : "") + className} aria-hidden="true">
      <line x1="59.5" y1="27" x2="59.5" y2="37" stroke="#3A86CF" strokeWidth="2.8" />
      <g className="pp-antenna">
        <circle cx="59.5" cy="21.5" r="6.6" fill="#fff" stroke="#3A86CF" strokeWidth="2.6" />
        <rect x="58.1" y="17.6" width="2.8" height="7.8" rx="0.6" fill="#E43325" />
        <rect x="55.6" y="20.1" width="7.8" height="2.8" rx="0.6" fill="#E43325" />
      </g>
      <path d="M14 51 Q3 51 3 65 Q3 79 14 79 Z" fill="#3A86CF" />
      <path d="M106 51 Q117 51 117 65 Q117 79 106 79 Z" fill="#3A86CF" />
      <rect x="13.5" y="36.5" width="93" height="113" rx="11" fill="#93C8FE" stroke="#3A86CF" strokeWidth="3.6" />
      <rect x="18.5" y="43.5" width="83" height="31" rx="8" fill="#fff" stroke="#3A86CF" strokeWidth="3.6" />
      <g style={eyes}>
        <path d="M25 61 L39.5 54.6 L48 60.6" fill="none" stroke="#111" strokeWidth="5.8" strokeLinejoin="miter" strokeLinecap="butt" />
        <path d="M67.5 60.6 L79.5 54.6 L91 61" fill="none" stroke="#111" strokeWidth="5.8" strokeLinejoin="miter" strokeLinecap="butt" />
      </g>
      <path d="M36.7 78.3 H84 C84 89.5 74 95.4 60.3 95.4 C46.6 95.4 36.7 89.5 36.7 78.3 Z" fill="#fff" stroke="#111" strokeWidth="2.6" strokeLinejoin="round" />
      <g className="pp-heart" style={{ transformOrigin: "60.3px 117px", transformBox: "view-box" }}>
        <path d="M60.3 130 L47 116.6 A7.4 7.4 0 0 1 60.3 107.6 A7.4 7.4 0 0 1 73.6 116.6 Z" fill="#F28B86" stroke="#E8261C" strokeWidth="2.6" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

/** PainPal rises from the bottom of the screen, winks and says something, then slips back down. */
export function MascotPeek({ message, onDone, hold = 2300, size = 230 }: { message: ReactNode; onDone?: () => void; hold?: number; size?: number }) {
  const [out, setOut] = useState(false);
  const [wink, setWink] = useState(false);
  useEffect(() => {
    const t = [
      setTimeout(() => setWink(true), 650),
      setTimeout(() => setWink(false), 1250),
      setTimeout(() => setOut(true), hold),
      setTimeout(() => onDone?.(), hold + 480),
    ];
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={"absolute inset-0 z-30 flex flex-col items-center justify-end overflow-hidden " + (out ? "pp-fade-out" : "cs-fade")} style={{ background: "rgba(232,242,252,0.94)" }} onClick={() => onDone?.()} role="status">
      <div className="pp-bubble relative mx-5 mb-3 rounded-2xl bg-white px-4 py-3 text-center text-[13px] font-semibold text-[#111] shadow-[0_8px_24px_rgba(58,134,207,0.25)]">
        {message}
        <i className="absolute left-1/2 -bottom-1.5 w-3 h-3 -ml-1.5 rotate-45 bg-white" />
      </div>
      <div className={out ? "pp-sink" : "pp-rise"} style={{ marginBottom: -size * 0.32 }}>
        <Mascot size={size} wink={wink} bob={false} />
      </div>
    </div>
  );
}

/** The app icon from the original designs, winking on hover or tap. */
function GuideIcon() {
  const [wink, setWink] = useState(false);
  return (
    <button type="button" onMouseEnter={() => setWink(true)} onMouseLeave={() => setWink(false)} onClick={() => setWink((w) => !w)} aria-label="PainPal app icon (tap to wink)" className="shrink-0 w-[76px] h-[76px] transition-transform duration-300 hover:-rotate-3 drop-shadow-[0_10px_18px_rgba(58,134,207,0.35)]">
      <AppIcon wink={wink} />
    </button>
  );
}

/** Mascot that winks now and then, and on hover/tap. */
export function LiveMascot({ size = 40, bob = true }: { size?: number; bob?: boolean }) {
  const [wink, setWink] = useState(false);
  const doWink = () => {
    setWink(true);
    setTimeout(() => setWink(false), 650);
  };
  useEffect(() => {
    const id = setInterval(doWink, 5200);
    return () => clearInterval(id);
  }, []);
  return (
    <span onMouseEnter={doWink} onClick={doWink} className="inline-block cursor-pointer">
      <Mascot size={size} wink={wink} bob={bob} />
    </span>
  );
}

/* ---------------- Small UI pieces ---------------- */

export function Icon({ name, size = 22, color = C.blue }: { name: "diary" | "home" | "chat" | "share" | "back" | "plus" | "check"; size?: number; color?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "diary":
      return (<svg {...p}><rect x="5" y="4" width="14" height="17" rx="2.5" fill={C.blueLight} /><rect x="9" y="2.5" width="6" height="3.5" rx="1" fill={C.blueLight} /></svg>);
    case "home":
      return (<svg {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" fill={C.blueLight} /></svg>);
    case "chat":
      return (<svg {...p}><path d="M12 3.5a8.5 8.5 0 0 1 0 17c-1.5 0-3-.4-4.2-1.1L4 20.5l1.1-3.6A8.5 8.5 0 0 1 12 3.5z" fill={C.blueLight} /></svg>);
    case "share":
      return (<svg {...p}><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>);
    case "back":
      return (<svg {...p}><path d="M15 5l-7 7 7 7" /></svg>);
    case "plus":
      return (<svg {...p} stroke="#fff" strokeWidth={3}><path d="M12 5v14M5 12h14" /></svg>);
    case "check":
      return (<svg {...p} stroke="#fff" strokeWidth={3}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
  }
}

function TabBar({ screen, go, onReport }: { screen: Screen; go: (s: Screen) => void; onReport: () => void }) {
  const Tab = ({ to, name, label }: { to: Screen; name: "diary" | "home" | "chat"; label: string }) => (
    <button type="button" onClick={() => go(to)} className="flex flex-col items-center gap-0.5 w-16" aria-current={screen === to ? "page" : undefined}>
      <Icon name={name} />
      <span className="text-[10px] font-semibold" style={{ color: screen === to ? C.blueDark : C.blue }}>{label}</span>
    </button>
  );
  return (
    <div className="absolute bottom-0 inset-x-0 h-[68px] rounded-t-[22px] flex items-center justify-around px-3" style={{ background: C.pale }}>
      <Tab to="diary" name="diary" label="Diary" />
      {screen === "home" ? (
        <button type="button" onClick={onReport} className="flex flex-col items-center -mt-10" aria-label="Report pain">
          <span className="w-[62px] h-[62px] rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(58,134,207,0.45)]" style={{ background: C.blue }}>
            <Icon name="plus" size={28} />
          </span>
          <span className="text-[10px] font-semibold mt-1" style={{ color: C.blue }}>Report Pain</span>
        </button>
      ) : (
        <Tab to="home" name="home" label="Home" />
      )}
      <Tab to="chat" name="chat" label="Chatbot" />
    </div>
  );
}

export function Header({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-center h-10 mb-2">
      {onBack && (
        <button type="button" onClick={onBack} className="absolute left-0 p-1" aria-label="Back">
          <Icon name="back" />
        </button>
      )}
      <h3 className="text-[15.5px] font-bold px-7 text-center leading-tight" style={{ color: C.ink }}>{title}</h3>
      {right && <div className="absolute right-0">{right}</div>}
    </div>
  );
}

export function Segmented({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-full p-[3px]" style={{ background: C.blueLight }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className="flex-1 rounded-full py-1 text-[11.5px] transition"
          style={value === o ? { background: C.blueDark, color: "#fff" } : { color: C.blueDark }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Screens ---------------- */

export function HomeScreen({ entries, onRemove, lastAdded }: { entries: Entry[]; onRemove: (region: string) => void; lastAdded: number | null }) {
  const [tab, setTab] = useState("Today");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const regions = Array.from(new Set(entries.map((e) => e.region)));
  const W = 236, H = 118, top = 8, bottom = 100;
  const y = (lvl: number) => bottom - ((lvl - 0.2) / 5) * (bottom - top);

  const reminders = [
    { id: "rain", title: "Rainy weather ahead", body: "Remember to keep your surroundings warm and comfortable", bg: "#DCCBFD", fg: "#7A2FE0" },
    { id: "flare", title: "Coping with a flare up", body: "Consider a 5-minute mindfulness or relaxation exercise this evening", bg: "#FFC9C9", fg: "#E0302E" },
  ].filter((r) => !dismissed.includes(r.id));

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[21px] font-bold leading-tight" style={{ color: C.ink }}>Hello Vivian 👋</h3>
          <p className="text-[11px]" style={{ color: C.ink }}>8 February 2024</p>
        </div>
      </div>
      <h4 className="text-[13px] font-bold mt-3 mb-1.5" style={{ color: C.ink }}>Pain Map</h4>
      <Segmented options={["Today", "This Month"]} value={tab} onChange={setTab} />

      <div className="rounded-2xl mt-2 p-3" style={{ background: C.pale }}>
        {tab === "Today" ? (
          <>
            <div className="flex justify-between text-[10px]" style={{ color: C.sub }}>
              <div>
                Today
                <div className="text-[11px]" style={{ color: C.blueDark }}>
                  <b className="text-[16px]">{entries.length}</b> pain events
                </div>
              </div>
              <div className="text-right" style={{ color: C.blueLight }}>
                Average
                <div className="text-[11px]"><b className="text-[16px]">5</b> pain events</div>
              </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-1" role="img" aria-label={`Chart of ${entries.length} pain events today`}>
              {[["Extreme", 5], ["Mod.", 3], ["Light", 1.5]].map(([l, v]) => (
                <g key={l as string}>
                  <line x1="30" x2={W} y1={y(v as number)} y2={y(v as number)} stroke="#9CB8D6" strokeDasharray="2 3" strokeWidth="0.7" />
                  <text x="0" y={y(v as number) + 3} fontSize="7.5" fill={C.sub}>{l}</text>
                </g>
              ))}
              <line x1={30 + (14 / 24) * (W - 34)} x2={30 + (14 / 24) * (W - 34)} y1={top - 4} y2={bottom} stroke="#8AA7C7" strokeWidth="0.8" />
              {entries.map((e) => {
                const x = 30 + (e.hour / 24) * (W - 34);
                const h = bottom - y(e.level);
                return (
                  <rect
                    key={e.id}
                    x={x - 4.5}
                    y={bottom - h}
                    width="9"
                    height={h}
                    rx="4.5"
                    fill={regionColor(e.region)}
                    className={e.id === lastAdded ? "pp-grow" : ""}
                    style={{ transformOrigin: `${x}px ${bottom}px` }}
                  />
                );
              })}
              {Array.from({ length: 49 }).map((_, i) => (
                <line key={i} x1={30 + (i / 48) * (W - 34)} x2={30 + (i / 48) * (W - 34)} y1={bottom + 1} y2={bottom + (i % 4 === 0 ? 4 : 2.5)} stroke="#8AA7C7" strokeWidth="0.6" />
              ))}
              <text x="28" y={H - 2} fontSize="7" fill={C.sub}>12AM</text>
              <text x={30 + (14 / 24) * (W - 34) - 8} y={H - 2} fontSize="7" fill={C.sub}>2PM</text>
              <text x={W - 20} y={H - 2} fontSize="7" fill={C.sub}>12AM</text>
            </svg>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onRemove(r)}
                  className="flex items-center gap-1 rounded-full pl-1 pr-1.5 py-[2px] text-[10px] text-white"
                  style={{ background: C.blueDark }}
                  title={`Clear ${r}`}
                >
                  <i className="w-2.5 h-2.5 rounded-full" style={{ background: regionColor(r) }} />
                  {r}
                  <span className="opacity-80">×</span>
                </button>
              ))}
              {regions.length === 0 && <span className="text-[10.5px]" style={{ color: C.sub }}>No pain logged today. Tap + to add.</span>}
            </div>
          </>
        ) : (
          <div className="space-y-2.5 py-1">
            <div className="flex justify-between text-[11px]">
              <span style={{ color: C.sub }}>Pain-free days</span>
              <b style={{ color: C.blueDark }}>{FEB.filter((d) => d <= 2).length} of 29</b>
            </div>
            <div className="flex justify-between text-[11px]">
              <span style={{ color: C.sub }}>Most common area</span>
              <b style={{ color: C.blueDark }}>Knee</b>
            </div>
            <div className="flex justify-between text-[11px]">
              <span style={{ color: C.sub }}>Top trigger</span>
              <b style={{ color: C.blueDark }}>Weather</b>
            </div>
            <div className="flex gap-[3px] pt-1" aria-label="Daily intensity this month">
              {FEB.map((d, i) => (
                <i key={i} className="flex-1 rounded-sm" style={{ height: 8 + d * 7, background: levelColor(d), alignSelf: "flex-end" }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <h4 className="text-[13px] font-bold mt-3.5 mb-1.5" style={{ color: C.ink }}>Today’s Reminders</h4>
      <div className="space-y-2">
        {reminders.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setDismissed((d) => [...d, r.id])}
            className="w-full text-left rounded-xl px-3 py-2"
            style={{ background: r.bg }}
            title="Tap to dismiss"
          >
            <div className="text-[11.5px] font-bold" style={{ color: r.fg }}>{r.title}</div>
            <div className="text-[10.5px] leading-snug text-[#333]">{r.body}</div>
          </button>
        ))}
        {reminders.length === 0 && <p className="text-[10.5px]" style={{ color: C.sub }}>All caught up.</p>}
      </div>
    </div>
  );
}

export function BodyMap({ selected, toggle, side }: { selected: string[]; toggle: (r: string) => void; side: string }) {
  const torso = side === "Front" ? ["Chest", "Stomach"] : ["Upper Back", "Lower Back"];
  const RED = "#E53225";
  const shield = (x: number, y: number) => `M${x - 21},${y - 29} Q${x},${y - 20} ${x + 21},${y - 29} L${x + 19},${y + 8} Q${x},${y + 36} ${x - 19},${y + 8} Z`;
  // Regions drawn over the body illustration (700 × 997 space). "Left" and "Right" follow the labels printed on the map.
  const E = (k: string, cx: number, cy: number, rx: number, ry: number, rot = 0) => (
    <ellipse key={k} cx={cx} cy={cy} rx={rx} ry={ry} transform={rot ? `rotate(${rot} ${cx} ${cy})` : undefined} />
  );
  const pair = (name: string, l: React.ReactNode, r: React.ReactNode) => [
    { id: `Left ${name}`, shapes: [l] },
    { id: `Right ${name}`, shapes: [r] },
  ];
  const REGIONS: { id: string; shapes: React.ReactNode[] }[] = [
    { id: "Head", shapes: [E("h", 347, 100, 44, 55)] },
    { id: "Neck", shapes: [E("n", 347, 166, 24, 15)] },
    ...pair("Shoulder", E("l", 268, 218, 26, 30), E("r", 426, 218, 26, 30)),
    { id: torso[0], shapes: [E("c", 347, 248, 62, 42)] },
    { id: torso[1], shapes: [E("s", 347, 382, 52, 76)] },
    ...pair("Upper Arm", E("l", 236, 300, 15, 46, 32), E("r", 458, 300, 15, 46, -32)),
    ...pair("Forearm", E("l", 192, 372, 13, 42, 48), E("r", 503, 372, 13, 42, -48)),
    ...pair("Hand", E("l", 142, 440, 27, 22), E("r", 555, 440, 27, 22)),
    { id: "Hips", shapes: [E("hp", 347, 492, 90, 28)] },
    ...pair("Thigh", E("l", 296, 572, 40, 68), E("r", 400, 572, 40, 68)),
    ...pair("Knee", <path key="l" d={shield(299, 686)} />, <path key="r" d={shield(395, 686)} />),
    ...pair("Shin", E("l", 300, 790, 24, 62), E("r", 394, 790, 24, 62)),
    ...pair("Foot", E("l", 281, 915, 38, 17), E("r", 410, 915, 38, 17)),
  ];
  return (
    <svg viewBox="0 12 700 985" className="pp-map w-auto h-[300px] max-w-full" role="group" aria-label={`Body map, ${side.toLowerCase()} view`}>
      <image href="/work/painpal/body-front.png" x="0" y="0" width="700" height="997" />
      {REGIONS.map((r) => {
        const on = selected.includes(r.id);
        return (
          <g
            key={r.id}
            role="button"
            aria-label={r.id}
            aria-pressed={on}
            tabIndex={0}
            onClick={() => toggle(r.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(r.id))}
            className="pp-region outline-none"
            fill={on ? RED : "transparent"}
            stroke={on ? RED : "transparent"}
            strokeWidth="3"
            style={{ cursor: "pointer" }}
          >
            <title>{r.id}</title>
            {r.shapes}
          </g>
        );
      })}
    </svg>
  );
}

function ReportFlow({ onDone, onCancel }: { onDone: (e: Omit<Entry, "id" | "hour">[]) => void; onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const [side, setSide] = useState("Front");
  const [regions, setRegions] = useState<string[]>([]);
  const [level, setLevel] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const titles = ["Describe Your Pain", "How Bad is the Pain?", "What Triggered the Pain?"];
  const canNext = step === 0 ? regions.length > 0 : step === 1 ? level !== null : true;

  return (
    <div className="flex flex-col h-full">
      <Header title={titles[step]} onBack={() => (step === 0 ? onCancel() : setStep(step - 1))} right={<button type="button" onClick={onCancel} className="text-[10px]" style={{ color: C.sub }}>Skip</button>} />
      <div className="flex gap-1 mb-3" aria-label={`Step ${step + 1} of 3`}>
        {[0, 1, 2].map((i) => (
          <i key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? C.blue : C.pale }} />
        ))}
      </div>

      {step === 0 && (
        <div>
          <p className="text-[11px] font-semibold mb-1.5">Where does it hurt?</p>
          <Segmented options={["Front", "Back"]} value={side} onChange={setSide} />
          <div className="mt-2 flex justify-center">
            <BodyMap selected={regions} toggle={(r) => toggle(regions, setRegions, r)} side={side} />
          </div>
          <p className="text-[11px] font-semibold mt-2 mb-1">Selected Regions</p>
          <div className="flex flex-wrap gap-1.5 min-h-[24px]">
            {regions.length === 0 ? (
              <span className="text-[10.5px]" style={{ color: C.sub }}>Tap the body to add an area.</span>
            ) : (
              regions.map((r) => (
                <span key={r} className="rounded-full px-2 py-0.5 text-[10.5px] text-white" style={{ background: C.blue }}>{r}</span>
              ))
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="rounded-2xl p-3" style={{ background: C.pale }}>
          <div className="flex justify-between">
            {LEVELS.map((l) => (
              <button key={l.n} type="button" onClick={() => setLevel(l.n)} className="flex flex-col items-center gap-1 w-[48px]" aria-pressed={level === l.n}>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] transition"
                  style={{ background: l.color, outline: level === l.n ? `2.5px solid ${C.blueDark}` : "1px solid rgba(0,0,0,0.25)", outlineOffset: level === l.n ? 2 : 0, transform: level === l.n ? "scale(1.08)" : undefined }}
                >
                  {l.n}
                </span>
                <span className="text-[9.5px]" style={{ color: C.blue }}>{l.label}</span>
              </button>
            ))}
          </div>
          <p className="text-[10.5px] mt-3" style={{ color: C.sub }}>
            {level ? `${LEVELS[level - 1].label}. You can add details in your diary later.` : "Choose the number that fits best right now."}
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-2xl p-3 grid grid-cols-2 gap-y-2 gap-x-2" style={{ background: C.pale }}>
          {TRIGGERS.map((t) => (
            <label key={t} className="flex items-center gap-1.5 text-[11px] cursor-pointer" style={{ color: C.blue }}>
              <input type="checkbox" checked={triggers.includes(t)} onChange={() => toggle(triggers, setTriggers, t)} className="w-3.5 h-3.5 accent-[#3A86CF]" />
              {t}
            </label>
          ))}
        </div>
      )}

      <div className="mt-auto pb-1 flex justify-end">
        <button
          type="button"
          disabled={!canNext}
          onClick={() => (step < 2 ? setStep(step + 1) : onDone(regions.map((region) => ({ region, level: level ?? 3, triggers }))))}
          className="rounded-full px-5 py-2 text-[12px] font-semibold text-white disabled:opacity-40 transition"
          style={{ background: C.blue }}
        >
          {step < 2 ? "Next ›" : "Complete"}
        </button>
      </div>
    </div>
  );
}

// Diary months (Feb 2024 matches the design; other months are sample data; March is still ahead)
const MONTH_LIST = [
  { name: "December", year: 2023, m: 11 },
  { name: "January", year: 2024, m: 0 },
  { name: "February", year: 2024, m: 1 },
  { name: "March", year: 2024, m: 2 },
];
function monthData(idx: number): (number | null)[] {
  const { year, m } = MONTH_LIST[idx];
  const days = new Date(year, m + 1, 0).getDate();
  if (idx === 2) return FEB;
  if (idx === 3) return Array.from({ length: days }, () => null);
  return Array.from({ length: days }, (_, i) => {
    const v = 2.6 + 1.3 * Math.sin((i + idx * 5) / 3.1) + 0.8 * Math.sin((i * 7 + idx) / 2.3);
    return Math.max(1, Math.min(5, Math.round(v)));
  });
}

function DiaryScreen({ entries, onShare }: { entries: Entry[]; onShare: () => void }) {
  const [mi, setMi] = useState(2);
  const [day, setDay] = useState(TODAY);
  const { name, year, m } = MONTH_LIST[mi];
  const data = monthData(mi);
  const start = new Date(year, m, 1).getDay();
  const isToday = (d: number) => mi === 2 && d === TODAY;
  const levelFor = (d: number) => (isToday(d) && entries.length ? Math.max(...entries.map((e) => e.level)) : data[d - 1]);
  const lvl = levelFor(day);
  const places = ["Knee", "Back", "Hand", "Neck", "Knee", "Shoulder"];
  const chars = ["Aching", "Throbbing", "Stiff", "Sharp", "Dull"];
  const location = isToday(day) && entries.length ? Array.from(new Set(entries.map((e) => e.region))).join(", ") : places[(day + mi) % places.length];
  const dayName = new Date(year, m, day).toLocaleDateString("en-GB", { weekday: "long" });
  const go = (d: number) => {
    const n = Math.max(0, Math.min(MONTH_LIST.length - 1, mi + d));
    setMi(n);
    setDay(n === 2 ? TODAY : 1);
  };

  return (
    <div>
      <Header title="Pain Diary" right={<button type="button" onClick={onShare} aria-label="Share my diary" className="p-1"><Icon name="share" /></button>} />
      <div className="flex items-center justify-center gap-4 text-[13px] mb-1.5">
        <button type="button" onClick={() => go(-1)} disabled={mi === 0} aria-label="Previous month" className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-25 hover:bg-[#E8F2FC]">←</button>
        <span className="w-[112px] text-center">{name}{year !== 2024 ? ` ${year}` : ""}</span>
        <button type="button" onClick={() => go(1)} disabled={mi === MONTH_LIST.length - 1} aria-label="Next month" className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-25 hover:bg-[#E8F2FC]">→</button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10.5px] mb-1" style={{ color: C.ink }}>
        {["Su", "M", "T", "W", "Th", "F", "S"].map((d) => (<span key={d}>{d}</span>))}
      </div>
      <div key={mi} className="rounded-2xl p-2 grid grid-cols-7 gap-y-1.5 place-items-center pp-toast" style={{ background: C.pale }}>
        {Array.from({ length: start }).map((_, i) => (<span key={`b${i}`} />))}
        {data.map((_, i) => {
          const d = i + 1;
          const shown = levelFor(d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              className="w-[27px] h-[27px] rounded-full text-[10.5px] transition"
              style={{ background: shown ? levelColor(shown) : "#fff", color: shown ? undefined : "#9AA3AF", outline: d === day ? `2px solid ${C.blueDark}` : undefined, outlineOffset: 1.5 }}
              aria-pressed={d === day}
              aria-label={`${name} ${d}, ${shown ? `intensity ${shown}` : "no entry"}`}
            >
              {d}
            </button>
          );
        })}
      </div>
      <dl className="mt-3 space-y-1.5 text-[11px]">
        {(lvl
          ? [
              ["Date", `${dayName} ${day} ${name}, ${year}`],
              ["Pain Location", location],
              ["Intensity Level", `(${lvl}) ${LEVELS[lvl - 1].label}`],
              ["Pain Characteristics", chars[(day + mi) % chars.length]],
            ]
          : [["Date", `${dayName} ${day} ${name}, ${year}`], ["Entries", "Nothing logged yet"]]
        ).map(([k, v]) => (
          <div key={k}>
            <dt style={{ color: C.blue }}>{k}:</dt>
            <dd style={{ color: C.ink }}>{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ShareScreen({ onBack }: { onBack: () => void }) {
  const items = ["Pain Duration", "Pain Location", "Intensity Level", "Pain Characteristics", "Pain Triggers", "Activities Performed", "Medications Taken", "Comments"];
  const [picked, setPicked] = useState<string[]>(["Pain Location", "Intensity Level"]);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const all = picked.length === items.length;
  const valid = /.+@.+\..+/.test(email) && picked.length > 0;

  if (sent)
    return (
      <div className="flex flex-col items-center text-center pt-16">
        <span className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#6CC17A" }}><Icon name="check" size={28} /></span>
        <h3 className="text-[16px] font-bold mt-4">Diary shared</h3>
        <p className="text-[11px] mt-1 px-4" style={{ color: C.sub }}>{sent}</p>
        <button type="button" onClick={onBack} className="mt-6 rounded-full px-5 py-2 text-[12px] font-semibold text-white" style={{ background: C.blue }}>Back to diary</button>
      </div>
    );

  return (
    <div>
      <Header title="Share My Diary" onBack={onBack} />
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div><b>From:</b><div className="rounded mt-0.5 px-1.5 py-1" style={{ background: C.pale, color: C.blue }}>20 / Dec / 2023</div></div>
        <div><b>To:</b><div className="rounded mt-0.5 px-1.5 py-1" style={{ background: C.pale, color: C.blue }}>19 / Feb / 2024</div></div>
      </div>
      <div className="mt-3 rounded-md overflow-hidden text-[11px]" style={{ background: C.blueLight }}>
        <div className="px-2.5 py-1.5 text-white font-medium" style={{ background: C.blueDark }}>Select information to share</div>
        <div className="px-2.5 py-1.5 space-y-1">
          <label className="flex items-center gap-1.5 cursor-pointer text-white">
            <input type="checkbox" checked={all} onChange={() => setPicked(all ? [] : items)} className="w-3.5 h-3.5 accent-[#2B6FB5]" /> Select all
          </label>
          {items.map((i) => (
            <label key={i} className="flex items-center gap-1.5 cursor-pointer text-white">
              <input type="checkbox" checked={picked.includes(i)} onChange={() => setPicked(picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i])} className="w-3.5 h-3.5 accent-[#2B6FB5]" /> {i}
            </label>
          ))}
        </div>
      </div>
      <p className="text-[10.5px] font-bold mt-3 mb-1">Share to:</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="doctor@clinic.com"
          className="flex-1 min-w-0 rounded px-2 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-[#93C8FE]"
          style={{ background: C.pale }}
        />
        <button
          type="button"
          disabled={!valid}
          onClick={() => setSent(`${picked.length} ${picked.length === 1 ? "detail" : "details"} sent securely to ${email}.`)}
          className="rounded-full px-3.5 text-[11px] font-semibold text-white disabled:opacity-40"
          style={{ background: C.blueDark }}
        >
          Send
        </button>
      </div>
      <p className="text-[9.5px] mt-1.5" style={{ color: C.sub }}>Prototype: nothing is actually sent.</p>
    </div>
  );
}

type Msg = { from: "bot" | "me"; text: string };
const REPLIES: Record<string, string> = {
  "My knee hurts after walking": "Sorry to hear that. Resting and a warm compress can help. I noticed knee pain on 4 of your last 7 walks, so it may be worth mentioning to your doctor. Want to log it now?",
  "Any tips for rainy days?": "Cold, damp weather often makes joint pain worse. Dress in warm layers, keep moving gently indoors, and try a short stretching routine.",
  "Log pain for me": "Sure, let's record it. Opening the pain log…",
};

function ChatScreen({ onLog }: { onLog: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi Vivian! How are you feeling today?" }]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const send = (text: string) => {
    if (!text.trim() || typing) return;
    setMsgs((m) => [...m, { from: "me", text }]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: REPLIES[text] ?? "In the full app I'd look at your diary to answer that. For now, try one of the suggestions below." }]);
      if (text === "Log pain for me") setTimeout(onLog, 700);
    }, 750);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 h-10 mb-2">
        <LiveMascot size={24} />
        <b className="text-[14px]">PainPal</b>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5" aria-live="polite">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={"max-w-[82%] rounded-2xl px-3 py-2 text-[11px] leading-snug " + (m.from === "me" ? "ml-auto rounded-br-sm text-white" : "rounded-bl-sm")}
            style={m.from === "me" ? { background: C.blue } : { background: C.blueLight, color: "#0F2E4F" }}
          >
            {m.text}
          </div>
        ))}
        {typing && <div className="w-12 rounded-2xl px-3 py-2 text-[11px] tracking-widest" style={{ background: C.blueLight }}>•••</div>}
      </div>
      <div className="flex flex-wrap gap-1.5 py-2">
        {Object.keys(REPLIES).map((q) => (
          <button key={q} type="button" onClick={() => send(q)} className="rounded-full border px-2.5 py-1 text-[10px]" style={{ borderColor: C.blue, color: C.blue }}>
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(draft); }} className="flex gap-1.5">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a question…" className="flex-1 min-w-0 rounded-full px-3 py-1.5 text-[11px] outline-none" style={{ background: C.pale }} />
        <button type="submit" className="rounded-full px-3 text-[11px] font-semibold text-white" style={{ background: C.blue }}>Send</button>
      </form>
    </div>
  );
}

/* ---------------- Shell ---------------- */

export const START: Entry[] = [
  { id: 1, hour: 9.5, region: "Hand", level: 2, triggers: ["Work"] },
  { id: 2, hour: 11.25, region: "Knee", level: 4, triggers: ["Weather"] },
  { id: 3, hour: 13.25, region: "Back", level: 2, triggers: ["Exercise"] },
];

export default function PainPalPrototype() {
  const [screen, setScreen] = useState<Screen>("home");
  const [entries, setEntries] = useState<Entry[]>(START);
  const [toast, setToast] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<number | null>(null);
  const [nextHour, setNextHour] = useState(14.5);


  const steps = useMemo(
    () => [
      { label: "Tap + to log pain", done: entries.length > START.length },
      { label: "Open the diary and tap a day", done: screen === "diary" },
      { label: "Share your diary with a doctor", done: screen === "share" },
      { label: "Ask PainPal a question", done: screen === "chat" },
    ],
    [entries.length, screen]
  );

  const reset = () => {
    setEntries(START);
    setScreen("home");
    setNextHour(14.5);
    setLastAdded(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 items-start">
      {/* Phone */}
      <div className="mx-auto w-[300px] max-w-full" style={font}>
        <div className="relative isolate rounded-[46px] border-[9px] border-[#1C1C1E] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden" style={{ height: 620 }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[92px] h-[26px] rounded-full bg-[#1C1C1E] z-20" aria-hidden="true" />
          <div className="absolute inset-0 pt-11 px-4 pb-[80px] overflow-y-auto overflow-x-hidden text-[#111]">
            {screen === "home" && <HomeScreen entries={entries} lastAdded={lastAdded} onRemove={(r) => setEntries((e) => e.filter((x) => x.region !== r))} />}
            {screen === "report" && (
              <ReportFlow
                onCancel={() => setScreen("home")}
                onDone={(items) => {
                  const base = Date.now();
                  const added = items.map((it, i) => ({ ...it, id: base + i, hour: Math.min(23, nextHour + i * 0.6) }));
                  setEntries((e) => [...e, ...added]);
                  setLastAdded(added[0].id);
                  setNextHour((h) => Math.min(23, h + 1.5));
                  setScreen("home");
                  setToast("Pain logged! Added to today’s map and your diary.");
                }}
              />
            )}
            {screen === "diary" && <DiaryScreen entries={entries} onShare={() => setScreen("share")} />}
            {screen === "share" && <ShareScreen onBack={() => setScreen("diary")} />}
            {screen === "chat" && <div className="h-full"><ChatScreen onLog={() => setScreen("report")} /></div>}
          </div>
          {screen !== "report" && <TabBar screen={screen} go={setScreen} onReport={() => setScreen("report")} />}
          {toast && <MascotPeek key={toast} message={toast} onDone={() => setToast(null)} />}
        </div>
      </div>

      {/* Guide */}
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <GuideIcon />
          <p className="text-sm text-[#b4b4bb] leading-relaxed">
            <span className="text-white">Meet PainPal.</span> A friendly mascot makes a hard subject feel lighter: it greets you, cheers when you log, and answers in chat. Tap it to say hi.
          </p>
        </div>
        <p className="text-sm text-[#b4b4bb] leading-relaxed">
          A working prototype of the core flows, recreated in code from the original designs. Tap around. Nothing is saved or sent.
        </p>
        <ol className="space-y-2.5">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono shrink-0 transition"
                style={s.done ? { background: "var(--accent)", color: "#0B0B0C" } : { border: "1px solid rgba(255,255,255,0.2)", color: "#888890" }}
              >
                {s.done ? "✓" : i + 1}
              </span>
              <span className={s.done ? "text-white" : "text-[#b4b4bb]"}>{s.label}</span>
            </li>
          ))}
        </ol>
        <div className="text-sm text-[#888890] leading-relaxed space-y-2 border-t border-white/10 pt-4">
          <p><span className="text-white">One question per screen.</span> Logging takes three taps on a bad day: where, how bad, why.</p>
          <p><span className="text-white">Color carries meaning.</span> The same five-step scale colors the log, the chart, and the diary calendar.</p>
          <p><span className="text-white">You choose what to share.</span> Every detail is opt-in before anything goes to a provider.</p>
        </div>
        <button type="button" onClick={reset} className="hl-text text-xs font-mono text-[#888890]">
          ↺ Reset prototype
        </button>
      </div>
    </div>
  );
}
