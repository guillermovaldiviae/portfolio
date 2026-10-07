"use client";

import { useState } from "react";

const GREEN = "#1A431D";
const ACTION = "#68A64E";
const font = { fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif" };
const M = "/work/kevin-carey-legacy-golf-outing/mobile";
const D = "/work/kevin-carey-legacy-golf-outing/desktop";

const LINKS = [
  { desk: "Golf Outing", mobile: "Play Golf", who: "Golfers", detail: "Foursome $3,750 · Single Golfer $950 · brunch, 18 holes, and the celebration after", img: `${M}/golf-play.jpg`, closed: `${M}/golf-play-closed.jpg`, section: `${D}/golf.jpg`, sectionAlt: "More Than a Day of Golf section: two golfers celebrating beside copy about brunch, 18 holes and the celebration after" },
  { desk: "DSP Awards Dinner", mobile: "DSP Awards Dinner", who: "Dinner guests", detail: "A $100 dinner ticket honoring Direct Support Professionals, with its own page", img: `${M}/dsp.jpg`, closed: `${M}/dsp-closed.jpg`, section: `${D}/dsp.jpg`, sectionAlt: "DSP Champion Awards Dinner section: three photos of Direct Support Professionals above the date, time and location" },
  { desk: "Sponsorships", mobile: "Sponsor", who: "Corporate partners", detail: "The presenting sponsor's story, packages, and the sponsor wall", img: `${M}/sponsor.jpg`, closed: `${M}/sponsor-closed.jpg`, section: `${D}/sponsor.jpg`, sectionAlt: "Partner With Purpose section: four golfers on the green beside sponsorship copy and a View Sponsorship Deck button" },
];

// Menu item centers in the 490px-wide mobile screenshots
const ITEM_Y = [83, 133, 182];
const SHOT_W = 490;
const PHONE_W = 256;
const SCALE = PHONE_W / SHOT_W;
const PHONE_H = 360;
// Dropdown panel (incl. shadow) in screenshot space
const MENU = { top: 42, bottom: 224, left: 104, right: 396 };

/**
 * Kevin Carey Legacy Golf Outing navigation. Three links on desktop fold into one
 * "Get Involved" dropdown on mobile (Play Golf · DSP Awards Dinner · Sponsor).
 * The phone uses real screenshots: tap "Get Involved" to drop the menu down,
 * then tap a page. Picking a page closes the menu, like the live site.
 */
export default function GolfNavDemo() {
  const [picked, setPicked] = useState(0);
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const pick = (i: number) => {
    setPicked(i);
    setOpen(false);
  };
  const toggle = () => {
    setOpen((o) => !o);
    setTouched(true);
  };
  // clip-path that reveals the menu from its top edge downward
  const menuClip = (shown: boolean) => {
    const t = MENU.top * SCALE;
    const l = MENU.left * SCALE;
    const r = PHONE_W - MENU.right * SCALE;
    // Bottom edge measured from the image's own top, so shorter screenshots (like the
    // DSP page) don't clip the last menu item.
    const bottom = shown ? MENU.bottom * SCALE : t;
    return `inset(${t}px ${r}px calc(100% - ${bottom}px) ${l}px)`;
  };
  const cur = LINKS[picked];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Desktop */}
        <div>
          <div className="text-xs font-mono text-[#888890] mb-2">Desktop · three links</div>
          <div className="rounded-lg overflow-hidden border border-white/10 bg-white" style={font}>
            <div className="px-5 pt-4 pb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/work/kevin-carey-legacy-golf-outing/logo.png" alt="The YAI Kevin Carey Legacy Golf Outing" className="h-9 w-auto" />
            </div>
            <nav className="flex justify-center gap-5 sm:gap-8 px-4 py-3 border-b border-black/10" aria-label="Demo desktop navigation">
              {LINKS.map((l, i) => (
                <button
                  key={l.desk}
                  type="button"
                  onClick={() => pick(i)}
                  className="text-[13px] sm:text-[15px] font-bold underline-offset-[6px] decoration-2 hover:underline"
                  style={{ color: GREEN, textDecorationColor: ACTION, textDecorationLine: picked === i ? "underline" : undefined }}
                >
                  {l.desk}
                </button>
              ))}
            </nav>
            <div className="relative aspect-[1300/560] bg-white">
              {LINKS.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={l.section}
                  src={l.section}
                  alt={i === picked ? l.sectionAlt : ""}
                  aria-hidden={i !== picked}
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                  style={{ opacity: i === picked ? 1 : 0 }}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 min-h-[76px]" aria-live="polite">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--accent)" }}>{cur.who}</span>
              <span className="text-sm text-[#d1d1d6]">
                <span className="text-white">{cur.desk}</span> on desktop, <span className="text-white">“{cur.mobile}”</span> on mobile → {cur.detail}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile, real screenshots */}
        <div>
          <div className="text-xs font-mono text-[#888890] mb-2">Mobile · one “Get Involved” menu</div>
          <div className="mx-auto rounded-[34px] border-[8px] border-[#1C1C1E] bg-white overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]" style={{ width: PHONE_W + 16 }}>
            <div className="h-6 flex justify-center items-center bg-white" aria-hidden="true">
              <div className="w-20 h-4 rounded-full bg-[#1C1C1E]" />
            </div>
            <div className="relative overflow-hidden" style={{ width: PHONE_W, height: PHONE_H }}>
              {/* Page, menu closed */}
              {LINKS.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={l.closed}
                  src={l.closed}
                  alt={i === picked ? `Mobile ${l.mobile} page` : ""}
                  className="absolute top-0 left-0 w-full transition-opacity duration-300"
                  style={{ opacity: i === picked ? 1 : 0 }}
                  aria-hidden={i !== picked}
                />
              ))}
              {/* The dropdown, revealed from the header down */}
              {LINKS.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={l.img}
                  src={l.img}
                  alt=""
                  aria-hidden="true"
                  className="absolute top-0 left-0 w-full"
                  style={{
                    opacity: i === picked ? 1 : 0,
                    clipPath: menuClip(open && i === picked),
                    transition: "clip-path 280ms cubic-bezier(.2,.8,.2,1), opacity 200ms",
                  }}
                />
              ))}
              {/* "Get Involved ▾" toggle */}
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-label="Get Involved menu"
                className="absolute rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#68A64E]"
                style={{ left: 160 * SCALE, width: 180 * SCALE, top: 2 * SCALE, height: 44 * SCALE }}
              />
              {/* Tap targets over the real menu items */}
              {open &&
                LINKS.map((l, i) => (
                  <button
                    key={l.mobile}
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={`Go to ${l.mobile}`}
                    aria-current={picked === i ? "page" : undefined}
                    className="absolute rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#68A64E]"
                    style={{ left: 118 * SCALE, width: 260 * SCALE, top: (ITEM_Y[i] - 22) * SCALE, height: 44 * SCALE }}
                  />
                ))}
              {!touched && (
                <span
                  className="absolute rounded-lg border-2 border-[var(--accent)] pointer-events-none gn-pulse"
                  style={{ left: 164 * SCALE, width: 172 * SCALE, top: 4 * SCALE, height: 40 * SCALE }}
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
          <p className="text-xs text-[#888890] text-center mt-3" aria-live="polite">{open ? "Pick a page." : "Tap “Get Involved ▾” on the phone."}</p>
        </div>
      </div>
    </div>
  );
}
