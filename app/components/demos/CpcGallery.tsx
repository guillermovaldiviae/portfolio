"use client";

import { useState } from "react";

/* How images reached the custom-coded pages: an unlisted campaign doubled as an
   image host, and custom HTML blocks pulled each photo in by its image address. */

const NAVY = "#1B4472";
const ORANGE = "#F26322";
const MUL = { fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif" };
const G = "/work/central-park-challenge/gallery";
const R = "/work/central-park-challenge/redesign";

type Shot = {
  id: string;
  file: string;
  alt: string;
  cls: string; // CSS class used in the custom block
  page: string; // where it lands
  color: string;
  section: string; // screenshot of the live section
  w: number;
  h: number;
  box: [number, number, number, number]; // image location in the section, px
  round?: boolean;
};

const SHOTS: Shot[] = [
  { id: "crowd", file: "crowd", alt: "Crowd walking through Central Park", cls: "cpc-hero-bg", page: "Hero", color: NAVY, section: `${R}/hero-2026.jpg`, w: 1600, h: 704, box: [0, 168, 1600, 704] },
  { id: "walker", file: "walker", alt: "A young walker laughing at the finish", cls: "cpc-slant", page: "The ask", color: "#F7941D", section: `${R}/ask-2026.jpg`, w: 1600, h: 557, box: [1220, 0, 1600, 557] },
  { id: "face-paint", file: "face-paint", alt: "Volunteer face painting at the Challenge", cls: "cpc-circle", page: "Volunteers", color: "#00A1D0", section: `${R}/volunteers-2026.jpg`, w: 1600, h: 633, box: [368, 209, 686, 527], round: true },
  { id: "runners", file: "runners", alt: "Runners in event T-shirts", cls: "cpc-circle-sm", page: "Volunteers", color: "#00A1D0", section: `${R}/volunteers-2026.jpg`, w: 1600, h: 633, box: [268, 101, 446, 279], round: true },
];

function Step({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-2.5">
      <div className="flex items-center gap-2 text-sm text-white">
        <span className="w-5 h-5 rounded-full border border-white/25 text-[11px] font-mono flex items-center justify-center">{n}</span>
        {title}
      </div>
      <p className="text-xs text-[#888890] mt-1 pl-7">{sub}</p>
    </div>
  );
}

export default function CpcGallery() {
  const [sel, setSel] = useState(2);
  const s = SHOTS[sel];
  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div className="space-y-5">
      <p className="text-sm text-[#b4b4bb]">Pick a photo and follow it from the gallery to the live page. One library feeds every campaign in the nav.</p>

      <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1fr_1.25fr] gap-4 md:gap-3 items-start">
        {/* 1 · Gallery campaign */}
        <div>
          <Step n={1} title="Upload to a hidden campaign" sub="An unlisted campaign page used as the image library" />
          <div className="rounded-lg overflow-hidden bg-white border border-white/10" style={MUL}>
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-black/10">
              <span className="text-[11px] font-bold truncate" style={{ color: NAVY }}>
                CPC 2026 · Image Gallery
              </span>
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EEF1F5] text-[#5B6B80]">Unlisted</span>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-1.5 p-2" role="radiogroup" aria-label="Gallery photos">
              {SHOTS.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={sel === i}
                  aria-label={x.alt}
                  onClick={() => setSel(i)}
                  className="relative aspect-square rounded overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F26322]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${G}/${x.file}.jpg`} alt="" className={"w-full h-full object-cover transition " + (sel === i ? "" : "opacity-70 hover:opacity-100")} />
                  <span className="absolute inset-0 rounded transition" style={{ boxShadow: sel === i ? `inset 0 0 0 3px ${ORANGE}` : "none" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2 · Image address → custom block */}
        <div>
          <Step n={2} title="Copy the image address" sub="Paste it into a custom HTML block" />
          <pre
            key={s.id}
            className="cs-fade rounded-lg border border-white/10 bg-[#111114] p-3 text-[11px] leading-relaxed font-mono text-[#b4b4bb] whitespace-pre-wrap break-all"
          >
            <span className="text-[#6b6b73]">{"<!-- custom block -->"}</span>
            {"\n<img\n  src=\""}
            <span className="rounded px-0.5" style={{ color: "#0B0B0C", background: "#F7CB2D" }}>
              {`https://…/cpc-2026/${s.file}.jpg`}
            </span>
            {"\"\n  alt=\""}
            <span className="text-white">{s.alt}</span>
            {"\"\n  class=\""}
            <span style={{ color: "#58C4E6" }}>{s.cls}</span>
            {"\" />"}
          </pre>
          <p className="text-xs text-[#888890] mt-2 leading-relaxed">The photo stays on the platform&rsquo;s own servers, so no outside host, and every page pulls from one source.</p>
        </div>

        {/* 3 · Live page */}
        <div>
          <Step n={3} title="It lands on the live page" sub="Styled by the custom code, not a stock block" />
          <div className="relative isolate rounded-lg overflow-hidden border border-white/10 bg-white" style={{ aspectRatio: `${s.w} / ${s.h}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={s.section} src={s.section} alt={`Live ${s.page} section using the photo`} className="cs-fade absolute inset-0 w-full h-full object-cover" />
            <span
              key={s.id}
              className="cs-fade absolute pointer-events-none"
              style={{
                left: pct(s.box[0], s.w),
                top: pct(s.box[1], s.h),
                width: pct(s.box[2] - s.box[0], s.w),
                height: pct(s.box[3] - s.box[1], s.h),
                borderRadius: s.round ? "9999px" : 4,
                boxShadow: `0 0 0 3px #F7CB2D, 0 0 0 9999px rgba(11,11,12,0.45)`,
              }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#b4b4bb]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            Event page · {s.page}
          </div>
        </div>
      </div>
    </div>
  );
}
