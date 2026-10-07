"use client";

import { useState } from "react";

/* Give 2025 printed appeal as a real trifold you can open, plus a print ↔ web pairing
   that shows how the same images, rings, and colors carried over to the donate page. */

const P = "/work/giving-tuesday/print";
const W = "/work/giving-tuesday";

// Each panel: front = inside of the sheet, back = outside of the sheet.
const PANELS = {
  left: { front: { src: `${P}/suzy.jpg`, alt: "Inside panel: Suzy McCabe and her Meta glasses, with a stat on digital device use" }, back: { src: `${P}/cover.jpg`, alt: "Cover: Be the power behind possibility, with Connor holding his iPad at a grocery store" } },
  mid: { front: { src: `${P}/connor.jpg`, alt: "Inside panel: Connor Shea's story of shopping with a video visual scene display" }, back: { src: `${P}/back.jpg`, alt: "Back panel: Be a part of the change, make a gift today, with the yai.org/give2025 link and QR code" } },
  right: { front: { src: `${P}/leon.jpg`, alt: "Inside panel: Leon Owens and the PillDrill medication system, with a stat on access to assistive products" }, back: { src: `${P}/letter.jpg`, alt: "Inside flap: a letter from YAI's acting CEO and a quote from a parent" } },
};

type Step = 0 | 1 | 2 | 3;
const STEPS: { label: string; note: string }[] = [
  { label: "Cover", note: "The appeal arrives folded, with Connor on the cover." },
  { label: "Open the cover", note: "Opening the cover reveals the letter from leadership." },
  { label: "Unfold", note: "Inside, three stories side by side: Suzy, Connor, and Leon." },
  { label: "Flip to the back", note: "The outside: letter flap, the ask with a QR code to the donate page, and the cover." },
];

function Face({ src, alt, back, hidden }: { src: string; alt: string; back?: boolean; hidden: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={hidden ? "" : alt}
      aria-hidden={hidden}
      draggable={false}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined }}
    />
  );
}

/* ---------- Print ↔ web pairs ---------- */
const PAIRS = [
  { id: "hero", label: "Cover → hero", print: `${P}/cover.jpg`, web: `${W}/cover-key.jpg`, webW: 1920, webH: 1080, note: "The same headline, the same people, and the same ring motif open both the mailer and the campaign's digital key visual." },
  { id: "story", label: "Story → story module", print: `${P}/connor.jpg`, web: `${W}/final-story-connor.jpg`, webW: 2000, webH: 667, note: "Connor's story keeps its circle crop, orange ring, and pull quote online, so a donor who read the letter recognizes him on the page." },
  { id: "ask", label: "Ask → donation card", print: `${P}/back.jpg`, web: `${W}/final-donation-form.jpg`, webW: 2000, webH: 994, note: "Both lead with the same line, \"Be a part of the change.\" In print, a QR code sends readers to yai.org/give2025; online, that ask becomes a donation card with preset amounts and a monthly option, placed above the stories." },
  { id: "close", label: "Letter → closing ask", print: `${P}/letter.jpg`, web: `${W}/final-closing-ask.jpg`, webW: 2000, webH: 782, note: "The letter closes with a personal ask; the page closes the same way, with a second donation form so no one has to scroll back up." },
];

export default function GiveTrifold() {
  const [step, setStep] = useState<Step>(0);
  const [prev, setPrev] = useState<Step>(0);
  const [pair, setPair] = useState(0);

  const go = (s: Step) => {
    setPrev(step);
    setStep(s);
  };

  const opening = step > prev;
  const leftAngle = step === 0 ? 180 : 0;
  const rightAngle = step <= 1 ? -180 : 0;
  const flipped = step === 3;
  const pr = PAIRS[pair];

  return (
    <div className="space-y-10">
      {/* Trifold */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Printed appeal">
          {STEPS.map((s, i) => (
            <button
              key={s.label}
              role="tab"
              type="button"
              aria-selected={step === i}
              onClick={() => go(i as Step)}
              className={"flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap " + (step === i ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}
            >
              <span className="font-mono text-[11px]">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative isolate rounded-lg border border-white/10 bg-gradient-to-b from-[#17171B] to-[#0F0F12] px-[4%] pt-[5%] pb-14 sm:py-[5%] overflow-hidden">
          <div className="mx-auto w-full max-w-[720px]" style={{ perspective: "2200px" }}>
            {/* sheet: 3 panels wide */}
            <div
              className="relative mx-auto"
              style={{
                width: "100%",
                aspectRatio: "2142 / 1000",
                transformStyle: "preserve-3d",
                transform: `rotateY(${flipped ? 180 : 0}deg)`,
                transition: "transform 900ms cubic-bezier(.3,.7,.2,1)",
              }}
            >
              {/* middle panel (fixed) */}
              <div className="absolute top-0 h-full shadow-[0_18px_40px_rgba(0,0,0,0.5)]" style={{ left: "33.333%", width: "33.334%", transformStyle: "preserve-3d" }}>
                <Face src={PANELS.mid.front.src} alt={PANELS.mid.front.alt} hidden={flipped} />
                <Face src={PANELS.mid.back.src} alt={PANELS.mid.back.alt} back hidden={!flipped} />
              </div>
              {/* right panel: hinged on its left edge, folds in first */}
              <div
                className="absolute top-0 h-full"
                style={{
                  left: "66.666%",
                  width: "33.334%",
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                  transform: `translateZ(1px) rotateY(${rightAngle}deg)`,
                  transition: `transform 800ms cubic-bezier(.3,.7,.2,1) ${opening ? 350 : 0}ms`,
                }}
              >
                <Face src={PANELS.right.front.src} alt={PANELS.right.front.alt} hidden={step < 2 || flipped} />
                <Face src={PANELS.right.back.src} alt={PANELS.right.back.alt} back hidden={step !== 1 && !flipped} />
              </div>
              {/* left panel: hinged on its right edge, folds over last (the cover) */}
              <div
                className="absolute top-0 h-full"
                style={{
                  left: 0,
                  width: "33.334%",
                  transformStyle: "preserve-3d",
                  transformOrigin: "right center",
                  transform: `translateZ(2px) rotateY(${leftAngle}deg)`,
                  transition: `transform 800ms cubic-bezier(.3,.7,.2,1) ${opening ? 0 : 350}ms`,
                }}
              >
                <Face src={PANELS.left.front.src} alt={PANELS.left.front.alt} hidden={step === 0 || flipped} />
                <Face src={PANELS.left.back.src} alt={PANELS.left.back.alt} back hidden={step !== 0 && !flipped} />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => go(((step + 1) % 4) as Step)}
            className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full text-sm bg-[#0B0B0C]/85 text-white border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
          >
            {step < 3 ? "Next →" : "↺ Fold it up"}
          </button>
        </div>
        <p className="text-sm text-[#b4b4bb] min-h-[1.5em]" aria-live="polite">{STEPS[step].note}</p>
      </div>

      {/* Print ↔ web */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h5 className="text-white text-base font-normal">Same story, print to screen</h5>
          <p className="text-xs text-[#888890] font-mono">Pick a pair</p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Print and web pairs">
          {PAIRS.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              type="button"
              aria-selected={pair === i}
              onClick={() => setPair(i)}
              className={"px-3 py-1.5 rounded-full text-sm border transition " + (pair === i ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div key={pr.id} className="cs-fade grid grid-cols-[0.42fr_1fr] gap-3 sm:gap-5 items-center">
          <figure className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pr.print} alt="" className="w-full h-auto rounded-sm shadow-[0_10px_24px_rgba(0,0,0,0.5)]" />
            <figcaption className="text-[11px] font-mono uppercase tracking-wider text-[#888890]">Print</figcaption>
          </figure>
          <figure className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pr.web} alt="" className="w-full h-auto rounded-md border border-white/10" style={{ aspectRatio: `${pr.webW} / ${pr.webH}` }} />
            <figcaption className="text-[11px] font-mono uppercase tracking-wider text-[#888890]">Web</figcaption>
          </figure>
        </div>
        <p className="text-sm text-[#d1d1d6] leading-relaxed max-w-[680px]" aria-live="polite">{pr.note}</p>
      </div>
    </div>
  );
}
