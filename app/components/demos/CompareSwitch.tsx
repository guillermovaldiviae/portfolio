"use client";

import { useState } from "react";

export type ComparePair = {
  id: string;
  label: string; // tab label, e.g. "Hero"
  title: string; // e.g. "From dark banner to open collage"
  before: string; // what the first version did
  after: string; // what the redesign does, and why
  beforeImg: string;
  afterImg: string;
  w: number; // image width (both images share the same size)
  h: number;
};

/**
 * Before/after with a flip switch. Tabs pick a section; the switch swaps the
 * first version for the redesign, and the note under it explains the change.
 */
export default function CompareSwitch({
  pairs,
  beforeLabel,
  afterLabel,
}: {
  pairs: ComparePair[];
  beforeLabel: string;
  afterLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [on, setOn] = useState(false);
  const pair = pairs[index];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Section tabs */}
        <div role="tablist" aria-label="Redesigned sections" className="flex flex-wrap gap-2">
          {pairs.map((p, i) => (
            <button
              key={p.id}
              role="tab"
              type="button"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={
                "px-3.5 py-1.5 rounded-full text-sm border transition " +
                (i === index
                  ? "bg-white text-[#0B0B0C] border-white"
                  : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Flip switch */}
        <button type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className="flex items-center gap-3 text-sm">
          <span className={"font-mono text-xs " + (on ? "text-[#888890]" : "text-white")}>{beforeLabel}</span>
          <span className={"relative w-14 h-8 rounded-full transition-colors " + (on ? "bg-[var(--accent)]" : "bg-white/15")}>
            <span className={"absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 " + (on ? "translate-x-6" : "")} />
          </span>
          <span className={"font-mono text-xs " + (on ? "text-white" : "text-[#888890]")}>{afterLabel}</span>
        </button>
      </div>

      {/* Stage */}
      <div className="relative isolate w-full overflow-hidden rounded-lg border border-white/10 bg-white" style={{ aspectRatio: `${pair.w} / ${pair.h}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.beforeImg}
          alt={on ? "" : `${beforeLabel}: ${pair.label}`}
          aria-hidden={on}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: on ? 0 : 1 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pair.afterImg}
          alt={on ? `${afterLabel}: ${pair.label}` : ""}
          aria-hidden={!on}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: on ? 1 : 0 }}
        />
        <span
          className={
            "absolute bottom-3 right-3 px-2 py-1 rounded font-mono text-[11px] tracking-wider transition-colors " +
            (on ? "bg-[var(--accent)] text-[#0B0B0C]" : "bg-black/70 text-white")
          }
        >
          {on ? afterLabel : beforeLabel}
        </span>
      </div>

      {/* What changed */}
      <div aria-live="polite">
        <div className="text-white text-base">{pair.title}</div>
        <p className="text-sm text-[#888890] leading-relaxed mt-1 max-w-[680px]">{on ? pair.after : pair.before}</p>
      </div>
    </div>
  );
}
