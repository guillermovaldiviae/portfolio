"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { listening, reading } from "../now";
import ArrowUpRight from "./ArrowUpRight";

const card =
  "group h-full flex flex-col min-[480px]:flex-row min-[480px]:items-center gap-6 p-5 sm:p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hl-group-frame";

/* ---------- Listening: spinning vinyl + sleeve ---------- */

function Sleeve({ size }: { size: number }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  const style = { width: size, height: size };
  if (listening.cover && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        ref={imgRef}
        src={listening.cover}
        alt={`${listening.title} cover art`}
        style={style}
        onError={() => setFailed(true)}
        className="relative z-10 rounded-[3px] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
      />
    );
  }
  // Typographic stand-in until a cover image is added in now.ts
  return (
    <div
      style={style}
      className="relative z-10 rounded-[3px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.5)] bg-[radial-gradient(circle_at_30%_25%,#E8A15B_0%,#B4533A_45%,#3A1E2A_100%)] p-3 flex flex-col justify-between"
      aria-label={`${listening.title} by ${listening.artist}`}
    >
      <span className="text-[9px] uppercase tracking-[0.2em] text-white/80">{listening.artist}</span>
      <span className="text-white text-sm leading-tight font-medium">{listening.title}</span>
    </div>
  );
}

function Vinyl({ size }: { size: number }) {
  return (
    <div
      className="vinyl absolute top-1/2 -translate-y-1/2 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
      style={{ width: size, height: size, left: 0 }}
      aria-hidden="true"
    >
      <div className="vinyl-spin absolute inset-0 rounded-full bg-[#0d0d0f] bg-[repeating-radial-gradient(circle_at_center,#141416_0px,#141416_1.5px,#0b0b0c_2px,#0b0b0c_3px)]">
        {/* sheen */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent_0deg,rgba(255,255,255,0.10)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.07)_220deg,transparent_260deg)]" />
        {/* label */}
        <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle_at_30%_25%,#E8A15B_0%,#B4533A_55%,#3A1E2A_100%)] overflow-hidden">
          {listening.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listening.cover} alt="" className="w-full h-full object-cover" />
          )}
          <div className="absolute left-1/2 top-1/2 w-[10%] h-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0B0B0C]" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Reading: tilted book cover ---------- */

function BookCover() {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  // Catch images that failed before the page became interactive
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  const cls =
    "absolute inset-0 w-full h-full rounded-[2px_4px_4px_2px] object-cover";
  return (
    <div className="[perspective:600px] shrink-0">
      <div className="relative w-[84px] h-[126px] transition-transform duration-500 [transform:rotateY(-22deg)] group-hover:[transform:rotateY(-6deg)] shadow-[8px_10px_22px_rgba(0,0,0,0.55)] rounded-[2px_4px_4px_2px]">
        {reading.cover && !failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imgRef} src={reading.cover} alt={`${reading.title} cover`} onError={() => setFailed(true)} className={cls} />
        ) : (
          <div className={cls + " bg-[#E9E1D0] p-2.5 flex flex-col justify-between"}>
            <span className="text-[#8C2F24] text-[11px] leading-tight font-semibold">{reading.title}</span>
            <span className="text-[#3A3A36] text-[9px] uppercase tracking-wider">{reading.author}</span>
          </div>
        )}
        {/* spine shading */}
        <div className="absolute inset-y-0 left-0 w-2.5 rounded-l-[2px] bg-gradient-to-r from-black/40 via-white/10 to-transparent" />
      </div>
    </div>
  );
}

/* ---------- Both cards, side by side on wide screens ---------- */

function Listening() {
  const S = 104; // sleeve size
  return (
    <a href={listening.href} target="_blank" rel="noreferrer" className={"accent-cyan " + card}>
      {/* record peeking out of its sleeve */}
      <div className="relative shrink-0" style={{ width: S * 1.55, height: S }}>
        <div className="absolute inset-y-0 transition-transform duration-500 group-hover:translate-x-3" style={{ left: S * 0.5, width: S }}>
          <Vinyl size={S * 0.96} />
        </div>
        <Sleeve size={S} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 text-xs text-[#888890]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          On rotation
        </div>
        <div className="font-medium text-white text-[17px]">{listening.title}</div>
        <p className="text-sm text-[#888890]">{listening.artist}</p>
        {listening.note && <p className="text-xs text-[#888890] pt-1">{listening.note}</p>}
      </div>
      <span className="text-xs text-[#888890] hl-group-text self-start">
        Listen<ArrowUpRight />
      </span>
    </a>
  );
}

function Reading() {
  return (
    <a href={reading.href} target="_blank" rel="noreferrer" className={"accent-magenta " + card}>
      <div className="pl-3 pr-5">
        <BookCover />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-xs text-[#888890]">Currently reading</div>
        <div className="font-medium text-white text-[17px] leading-snug">{reading.title}</div>
        <p className="text-sm text-[#888890]">{reading.author}</p>
        {reading.meta && <p className="text-xs text-[#888890] pt-1">{reading.meta}</p>}
      </div>
      <span className="text-xs text-[#888890] hl-group-text self-start">
        Details<ArrowUpRight />
      </span>
    </a>
  );
}

export default function NowCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="reveal"><Listening /></div>
      <div className="reveal" style={{ "--reveal-delay": "120ms" } as CSSProperties}><Reading /></div>
    </div>
  );
}
