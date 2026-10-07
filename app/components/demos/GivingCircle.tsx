"use client";

import { useMemo, useState } from "react";

const GC = "/work/giving-circle";
const AVG = 82.78; // current average monthly gift
const ACCENT = "#14A9D8";

/* ======================= Growth chart ======================= */

const MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
const YEAR = (i: number) => (i >= 11 ? "27" : "26");
type Metric = "donors" | "mrr";

export function GcGrowth() {
  const [metric, setMetric] = useState<Metric>("donors");
  const [perMonth, setPerMonth] = useState(8);
  const [hover, setHover] = useState<number | null>(null);

  // Real data: launch (Feb 2026) and today (Sep 2026). Everything after is a projection.
  const actual = [
    { i: 0, donors: 7, mrr: 864 },
    { i: 7, donors: 12, mrr: 993.38 },
  ];
  const proj = useMemo(
    () => Array.from({ length: 5 }, (_, k) => {
      const donors = 12 + perMonth * (k + 1);
      return { i: 8 + k, donors, mrr: 993.38 + perMonth * (k + 1) * AVG };
    }),
    [perMonth]
  );
  const end = proj[proj.length - 1];
  const val = (p: { donors: number; mrr: number }) => (metric === "donors" ? p.donors : p.mrr);
  const max = metric === "donors" ? 120 : 10000;
  const goal = metric === "donors" ? [50, 100] : [50 * AVG, 100 * AVG];
  const fmt = (v: number) => (metric === "donors" ? `${Math.round(v)}` : `$${Math.round(v).toLocaleString()}`);

  const W = 640, H = 280, L = 52, Rr = 16, T = 16, B = 34;
  const x = (i: number) => L + (i / 12) * (W - L - Rr);
  const y = (v: number) => T + (1 - v / max) * (H - T - B);
  const ticks = metric === "donors" ? [0, 25, 50, 75, 100] : [0, 2500, 5000, 7500, 10000];
  const pts = [...actual, ...proj];
  const hoverPt = hover === null ? null : pts.find((p) => p.i === hover) ?? null;
  const meets = end.donors >= 50;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-white/15 p-1" role="tablist" aria-label="Metric">
          {([["donors", "Monthly donors"], ["mrr", "Monthly revenue"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={metric === k} type="button" onClick={() => setMetric(k)} className={"px-3.5 py-1 rounded-full text-xs transition " + (metric === k ? "bg-white text-[#0B0B0C]" : "text-[#b4b4bb] hover:text-[var(--accent)]")}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#888890]">
          <span className="flex items-center gap-1.5"><i className="w-5 h-0.5 rounded" style={{ background: ACCENT }} />Actual</span>
          <span className="flex items-center gap-1.5"><i className="w-5 h-0 border-t-2 border-dashed" style={{ borderColor: ACCENT }} />Projection</span>
          <span className="flex items-center gap-1.5"><i className="w-3 h-3 rounded-sm bg-white/10" />Goal</span>
        </div>
      </div>

      <div className="relative rounded-lg border border-white/10 bg-white/[0.02] p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Giving Circle ${metric === "donors" ? "donors" : "monthly revenue"}: ${fmt(val(actual[0]))} at launch, ${fmt(val(actual[1]))} today, ${fmt(val(end))} projected by February 2027`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - Rr} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.07)" />
              <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#888890" fontFamily="ui-monospace, monospace">
                {metric === "donors" ? t : t === 0 ? "$0" : `$${t / 1000}K`}
              </text>
            </g>
          ))}
          <rect x={x(8)} width={x(12) - x(8)} y={y(goal[1])} height={y(goal[0]) - y(goal[1])} fill="rgba(255,255,255,0.07)" rx="4" />
          <text x={x(12) - 4} y={y(goal[1]) + 14} textAnchor="end" fontSize="10" fill="#b4b4bb">Goal by Feb ’27</text>
          {MONTHS.map((m, i) => (
            <text key={i} x={x(i)} y={H - 12} textAnchor="middle" fontSize="10" fill={i === 7 ? "#EDEDEF" : "#888890"} fontFamily="ui-monospace, monospace">
              {m}
              {i === 0 || i === 11 ? ` ’${YEAR(i)}` : ""}
            </text>
          ))}
          <line x1={x(7)} x2={x(7)} y1={T} y2={H - B} stroke="rgba(255,255,255,0.15)" strokeDasharray="2 3" />
          <text x={x(7) + 5} y={T + 10} fontSize="10" fill="#888890">Today</text>
          {/* actual */}
          <path d={`M${x(0)},${y(val(actual[0]))} L${x(7)},${y(val(actual[1]))}`} stroke={ACCENT} strokeWidth="2" fill="none" />
          {/* projection */}
          <path d={`M${x(7)},${y(val(actual[1]))} ${proj.map((p) => `L${x(p.i)},${y(val(p))}`).join(" ")}`} stroke={ACCENT} strokeWidth="2" strokeDasharray="5 5" fill="none" style={{ transition: "d 300ms" }} />
          {pts.map((p) => (
            <circle key={p.i} cx={x(p.i)} cy={y(val(p))} r={p.i <= 7 ? 5 : 4} fill={p.i <= 7 ? ACCENT : "#0B0B0C"} stroke={ACCENT} strokeWidth="2" />
          ))}
          <text x={x(0) + 8} y={y(val(actual[0])) - 8} fontSize="11" fill="#EDEDEF">{fmt(val(actual[0]))} at launch</text>
          <text x={x(7) - 8} y={y(val(actual[1])) - 10} textAnchor="end" fontSize="11" fill="#EDEDEF">{fmt(val(actual[1]))} today</text>
          {/* hover targets */}
          {pts.map((p) => (
            <rect key={`h${p.i}`} x={x(p.i) - 18} y={T} width="36" height={H - T - B} fill="transparent" onMouseEnter={() => setHover(p.i)} onMouseLeave={() => setHover(null)} />
          ))}
          {hoverPt && <line x1={x(hoverPt.i)} x2={x(hoverPt.i)} y1={T} y2={H - B} stroke="rgba(255,255,255,0.25)" pointerEvents="none" />}
        </svg>
        {hoverPt && (
          <div className="absolute pointer-events-none rounded-md bg-[#1C1C20] border border-white/10 px-2.5 py-1.5 text-xs shadow-lg" style={{ left: `${(x(hoverPt.i) / W) * 100}%`, top: 8, transform: "translateX(-50%)" }}>
            <div className="text-[#888890] font-mono">{MONTHS[hoverPt.i]} ’{YEAR(hoverPt.i)} · {hoverPt.i <= 7 ? "actual" : "projected"}</div>
            <div className="text-white">{Math.round(hoverPt.donors)} donors · ${Math.round(hoverPt.mrr).toLocaleString()}/mo</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">
        <label className="block">
          <span className="flex justify-between text-sm">
            <span className="text-[#b4b4bb]">New monthly donors per month</span>
            <span className="text-white font-mono">{perMonth}</span>
          </span>
          <input type="range" min={0} max={20} value={perMonth} onChange={(e) => setPerMonth(Number(e.target.value))} className="w-full mt-2 accent-[var(--accent)]" aria-label="New monthly donors per month" />
        </label>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ["Donors", `${end.donors}`],
            ["Per month", `$${Math.round(end.mrr).toLocaleString()}`],
            ["Per year", `$${(Math.round(end.mrr * 12 / 100) / 10).toLocaleString()}K`],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-white/10 px-3 py-2">
              <div className="text-white text-lg tabular-nums">{v}</div>
              <div className="text-[10px] font-mono text-[#888890] uppercase tracking-wider">{k}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#888890]" aria-live="polite">
        By Feb 2027 at {perMonth} new donors a month{meets ? ", the program reaches its goal of 50–100 monthly donors." : ", short of the 50-donor goal."} Projection assumes today’s average gift of ${AVG}/month.
      </p>
    </div>
  );
}

/* ======================= Tier explorer ======================= */

type Tier = { name: string; amount: number; perks: string[]; img: string; kind: "png" | "frame" | "photo"; caption: string; alt: string };
const TIERS: Tier[] = [
  { name: "Friend", amount: 10, perks: ["Welcome email", "Digital impact report", "Postcards featuring YAI artists’ work"], img: `${GC}/postcard.png`, kind: "png", caption: "Postcards featuring art by Jimmy Tucker", alt: "Postcard mockup: Jimmy Tucker's painting of a caped space hero among planets on the front, and a YAI Giving Circle thank-you on the back" },
  { name: "Supporter", amount: 25, perks: ["Exclusive baseball cap"], img: `${GC}/hat.png`, kind: "png", caption: "“This hat changes everything”", alt: "Giving Circle baseball cap" },
  { name: "Partner", amount: 50, perks: ["T-shirt and tote bag"], img: `${GC}/tote.png`, kind: "png", caption: "“This bag changes everything”", alt: "Giving Circle tote bag" },
  { name: "Champion", amount: 100, perks: ["Framed artwork by a YAI artist"], img: `${GC}/artwork-lauren.jpg`, kind: "frame", caption: "Framed original art: Birds of NY by Lauren M.", alt: "Birds of NY by Lauren M.: twenty hand-drawn, labeled New York birds around the Empire State Building, dedicated to Flaco the Owl, shown framed" },
  { name: "Ambassador", amount: 250, perks: ["Invitations to YAI donor events", "Personalized video thank-you from leadership"], img: `${GC}/donor-event.jpg`, kind: "photo", caption: "Invitations to events like the Central Park Challenge", alt: "The YAI tent above a crowd at the Central Park Challenge" },
];

export function GcTiers() {
  const [t, setT] = useState(1);
  const tier = TIERS[t];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 items-stretch">
      {/* Stage */}
      <div className="relative rounded-lg border border-white/10 bg-gradient-to-b from-[#17171B] to-[#0F0F12] overflow-hidden min-h-[300px] flex items-center justify-center p-6">
        {TIERS.map((x, i) => (
          <div key={x.name} className="absolute inset-0 flex items-center justify-center p-8 transition-all duration-500" style={{ opacity: i === t ? 1 : 0, transform: i === t ? "none" : "translateY(8px) scale(0.98)" }} aria-hidden={i !== t}>
            {x.kind === "png" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={x.img} alt={x.alt} className="max-h-[250px] max-w-full w-auto object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.6)]" />
            )}
            {x.kind === "frame" && (
              <div className="p-3 rounded-sm bg-[#3A2A1E] shadow-[0_18px_30px_rgba(0,0,0,0.6)]">
                <div className="p-4 bg-[#F6F3EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={x.img} alt={x.alt} className="max-h-[190px] w-auto" />
                </div>
              </div>
            )}
            {x.kind === "photo" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={x.img} alt={x.alt} className="max-h-[230px] max-w-full w-auto rounded-lg shadow-[0_18px_30px_rgba(0,0,0,0.6)]" />
            )}
          </div>
        ))}
        <span className="absolute bottom-3 left-4 right-4 text-xs text-[#888890] text-center">{tier.caption}</span>
      </div>

      {/* Tier controls */}
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Giving levels">
          {TIERS.map((x, i) => (
            <button key={x.name} role="tab" aria-selected={i === t} type="button" onClick={() => setT(i)} className={"px-3 py-1.5 rounded-full text-sm border tabular-nums transition " + (i === t ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}>
              ${x.amount}
            </button>
          ))}
        </div>
        <div className="mt-5">
          <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent)]">{tier.name}</div>
          <div className="text-white text-3xl tracking-tight mt-1 tabular-nums">
            ${tier.amount}<span className="text-base text-[#888890]"> / month</span>
          </div>
          <div className="text-sm text-[#888890] mt-1 tabular-nums">${(tier.amount * 12).toLocaleString()} a year of steady support</div>
        </div>
        <ul className="mt-5 space-y-2">
          {TIERS.slice(0, t + 1).flatMap((x, i) =>
            x.perks.map((p) => (
              <li key={p} className={"flex items-start gap-2.5 text-sm transition-colors " + (i === t ? "text-white" : "text-[#888890]")}>
                <span className={"mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 " + (i === t ? "bg-[var(--accent)] text-[#0B0B0C]" : "border border-white/20")}>✓</span>
                {p}
                {i === t && i > 0 && <span className="text-[10px] font-mono text-[var(--accent)] mt-0.5">NEW</span>}
              </li>
            ))
          )}
        </ul>
        <p className="mt-auto pt-5 text-xs text-[#888890] leading-relaxed">Each level adds one tangible thank-you, so moving up always feels worthwhile. Gifts were mocked up and costed before launch.</p>
      </div>
    </div>
  );
}
