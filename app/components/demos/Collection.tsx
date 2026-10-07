"use client";

import { useEffect, useState } from "react";

const GD = "/work/graphic-design";

/* ============ Sun: an I/DD artist's drawing → color → hat → worn in the park ============ */

const SUN_STEPS = [
  {
    label: "His drawing",
    who: "The artist",
    note: "Drawn by hand by an artist with I/DD from YAI Arts, YAI\u2019s studio for neurodiverse artists. Everything that makes the sun charming, the wobbly rays, the raised brows, the double smile, is his.",
  },
  {
    label: "Bringing it to life",
    who: "Me, working from his lines",
    note: "I kept his linework exactly as drawn and filled it with the event\u2019s orange and yellow, so the finished art still reads as his hand, not a redraw.",
  },
  {
    label: "Made to wear",
    who: "Me, with Spectrum Designs",
    note: "Produced with Spectrum Designs, an apparel company that employs people with autism and shares YAI\u2019s mission of more inclusive spaces. Adapted for embroidery: 3.5\u2033 on the front of a light blue dad hat, in three thread colors, orange, yellow, and black.",
  },
  {
    label: "Worn in the park",
    who: "The community",
    note: "Worn across Central Park by participants, putting his art on the heads of the people who came to celebrate his community.",
  },
];

const WORN = [
  { file: "worn-1", alt: "A young participant wearing the sun hat in Central Park" },
  { file: "worn-2", alt: "A crowd of participants, several wearing the sun hat" },
  { file: "worn-3", alt: "A speaker at the Central Park Challenge stage wearing the sun hat" },
];

export function SunStory() {
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState(0);
  const last = SUN_STEPS.length - 1;

  useEffect(() => {
    if (step !== 3) return;
    const id = setInterval(() => setPhoto((p) => (p + 1) % WORN.length), 2600);
    return () => clearInterval(id);
  }, [step]);

  const layer = (i: number, extra?: string) =>
    "absolute inset-0 flex items-center justify-center transition-all duration-700 " + (extra ?? "") + (step === i ? "" : " pointer-events-none");

  return (
    // Capped width so the photos don't take over the screen
    <div className="sun-story space-y-4 max-w-[720px]">
      {/* Stepper */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="From his drawing to the hat">
        {SUN_STEPS.map((s, i) => (
          <button
            key={s.label}
            role="tab"
            aria-selected={step === i}
            type="button"
            onClick={() => setStep(i)}
            className={"flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap " + (step === i ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}
          >
            <span className="font-mono text-[11px]">{i + 1}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Stage */}
      <div className="relative isolate rounded-lg overflow-hidden border border-white/10 bg-white aspect-[16/9]">
        {/* 1–2: his lines, then color filling in underneath them */}
        <div className={layer(0)} style={{ opacity: step <= 1 ? 1 : 0, transform: step <= 1 ? "none" : "scale(0.92)" }}>
          <div className="relative h-[80%] aspect-[1120/1140]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${GD}/sun/drawing-hd.png`} alt="The artist's original black-and-white sun drawing" className="absolute inset-0 w-full h-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${GD}/sun/colored.png`}
              alt={step === 1 ? "The same drawing, his lines kept, filled with orange rays and a yellow face" : ""}
              aria-hidden={step !== 1}
              className="absolute inset-0 w-full h-full"
              style={{ clipPath: step >= 1 ? "circle(75% at 50% 52%)" : "circle(0% at 50% 52%)", transition: "clip-path 1100ms cubic-bezier(.3,.7,.2,1)" }}
            />
          </div>
          <span
            className="absolute left-3 top-3 px-2 py-1 rounded font-mono text-[11px] tracking-wider bg-[#0B0B0C]/80 text-white transition-opacity"
            style={{ opacity: step <= 1 ? 1 : 0 }}
          >
            {step === 0 ? "Original · his lines" : "His lines · our color"}
          </span>
        </div>
        {/* 3 mockup */}
        <div className={layer(2, "p-[4%]")} style={{ opacity: step === 2 ? 1 : 0, transform: step === 2 ? "none" : step < 2 ? "scale(1.05)" : "scale(0.95)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${GD}/sun/mockup.jpg`} alt="Hat mockup: light blue dad hat with the colored sun embroidered, plus imprint specs" className="max-h-full w-auto" />
        </div>
        {/* 4 worn */}
        {WORN.map((w, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={w.file}
            src={`${GD}/sun/${w.file}.jpg`}
            alt={w.alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: step === 3 && photo === i ? 1 : 0 }}
          />
        ))}
        <button
          type="button"
          onClick={() => setStep((s) => (s === last ? 0 : s + 1))}
          className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-full text-sm bg-[#0B0B0C]/85 text-white border border-white/15 hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
        >
          {step === 0 ? "Bring it to life \u2192" : step < last ? "Next \u2192" : "\u21ba Start over"}
        </button>
      </div>

      {/* Caption */}
      <div className="min-h-[4.5em]" aria-live="polite">
        <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: "var(--accent)" }}>{SUN_STEPS[step].who}</div>
        <p className="text-sm text-[#d1d1d6] leading-relaxed mt-1 max-w-[680px]">{SUN_STEPS[step].note}</p>
      </div>
    </div>
  );
}

/* ============ On-site digital signage, looping like the real display ============ */

const SCREENS = [
  { src: `${GD}/screen-hero.jpg`, alt: "YAI 40th Central Park Challenge, presented by Waymo, over the crowd", note: "Opening slide" },
  { src: `${GD}/screen-advocacy.jpg`, alt: "Disability doesn't discriminate, but people do. Be part of the solution.", note: "Advocacy" },
  { src: `${GD}/screen-donate.jpg`, alt: "Inclusion starts here. Donate today QR code with a smiling young runner", note: "Donate QR" },
  { src: `${GD}/screen-together.jpg`, alt: "Stronger Together, with the community on stage", note: "Community" },
];

export function ScreenLoop() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % SCREENS.length), 3200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="space-y-3">
      {/* LED screen on a stage truss */}
      <div className="screen-frame mx-auto max-w-[1120px]">
        <div className="rounded-md bg-[#1A1A1D] p-2.5 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] border border-white/10">
          <div className="relative aspect-[1152/512] rounded-sm overflow-hidden bg-black">
            {SCREENS.map((s, k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.src} src={s.src} alt={k === i ? s.alt : ""} aria-hidden={k !== i} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0 }} />
            ))}
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.05)_0px,rgba(0,0,0,0.05)_1px,transparent_1px,transparent_3px)]" aria-hidden="true" />
          </div>
        </div>
        <div className="flex justify-between px-[18%]" aria-hidden="true">
          <i className="block w-2.5 h-8 bg-[#2A2A2E]" />
          <i className="block w-2.5 h-8 bg-[#2A2A2E]" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SCREENS.map((s, k) => (
          <button key={s.src} type="button" onClick={() => { setI(k); setPaused(true); }} aria-pressed={k === i} className={"px-3 py-1 rounded-full text-xs border transition " + (k === i ? "bg-white text-[#0B0B0C] border-white" : "border-white/15 text-[#b4b4bb] hover:border-[var(--accent)] hover:text-[var(--accent)]")}>
            {s.note}
          </button>
        ))}
        <button type="button" onClick={() => setPaused((p) => !p)} className="px-3 py-1 rounded-full text-xs font-mono text-[#888890] hl-text">
          {paused ? "▶ Play" : "❚❚ Pause"}
        </button>
      </div>
    </div>
  );
}
