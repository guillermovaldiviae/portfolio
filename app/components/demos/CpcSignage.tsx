"use client";

import { useEffect, useState } from "react";
import "./cpc-signage.css";
import { SG, bannerFiles, bannerWire, towerFiles, towerWire } from "./cpcSignageArt";

/* Large-format signage: 01 Planning → 02 Design files → 03 Day of */

type Sign = "tower" | "banner";

const DATA: Record<Sign, { keys: [string, string][]; notes: string[]; photos: [string, string][] }> = {
  tower: {
    keys: [
      ["40th lockup up top", "Sits above head height so it reads over a crowd."],
      ["Presenting sponsor line", "Waymo, the event's first presenting sponsor."],
      ["Participant photo in a circle", "Four towers, four different participants."],
      ["Rings & dots", "The campaign shapes break the photo edge."],
      ["Advocacy side", "Red panel: Celebrating people of all abilities."],
    ],
    notes: [
      "Each tower face is a 3 × 6 ft panel. Before any artwork, I mapped what it had to carry from across a lawn: the anniversary lockup and presenting sponsor at the top, one participant photo in the campaign circle, and the advocacy message on the side.",
      "The print files the designer built from those zones: four 3 × 6 ft photo panels, each with a different participant, under the same lockup.",
      "Event day in Central Park: the towers framed the cheer squads, the runners, and the crowd gathering at the start.",
    ],
    photos: [
      ["day-crowd", "Tower at the start area, red advocacy side facing the crowd"],
      ["day-cheer", "A participant passes her own photo on the tower"],
      ["day-pyramid", "Tower beside the cheer squad's pyramid"],
    ],
  },
  banner: {
    keys: [
      ["Event lockup on the center panel", "The one thing to read first."],
      ["Sponsors in two columns", "Alphabetical, seven a side, equal weight."],
      ["Participant photos as bookends", "People at both ends of a list of companies."],
      ["Rings & dots", "Ties the banner back to the towers and site."],
    ],
    notes: [
      "The banner ran 15 ft across the bandshell in five 3 × 3 ft panels, and it had to thank every event sponsor without turning into a wall of names. I put the lockup on the center panel, split the sponsors into two alphabetical columns, and bookended them with participant photos.",
      "The print file across all five panels. The first round listed names only; the final added participant photos at both ends. Switch between the two rounds below.",
      "Event day: the banner at the bandshell behind the brass band.",
    ],
    photos: [["day-band", "Sponsor banner at the bandshell behind the brass band"]],
  },
};

const STEPS = [
  { n: "01", label: "Planning", sub: "Dimensions & content", badge: "Planning" },
  { n: "02", label: "Design files", sub: "Print-ready artwork", badge: "Design files" },
  { n: "03", label: "Day of", sub: "Central Park", badge: "Day of · Central Park" },
];

export default function CpcSignage() {
  const [sign, setSign] = useState<Sign>("tower");
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(1);
  const [photo, setPhoto] = useState(0);
  const [hi, setHi] = useState<number | null>(null);
  const d = DATA[sign];
  const ph = d.photos[photo % d.photos.length];

  useEffect(() => {
    if (step !== 2 || d.photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setPhoto((p) => (p + 1) % d.photos.length), 2600);
    return () => clearInterval(id);
  }, [step, d.photos.length]);

  const go = (n: number) => setStep(Math.max(0, Math.min(2, n)));
  const pick = (s: Sign) => { setSign(s); setPhoto(0); setHi(null); };

  return (
    <div className="sg">
      <div className="seg" role="group" aria-label="Sign">
        <button type="button" aria-pressed={sign === "tower"} onClick={() => pick("tower")}>Photo towers</button>
        <button type="button" aria-pressed={sign === "banner"} onClick={() => pick("banner")}>Bandshell banner</button>
      </div>

      <nav className="sg-steps" aria-label="Stages">
        {STEPS.map((s, i) => (
          <button key={s.n} type="button" aria-current={step === i ? "step" : undefined} className={i < step ? "done" : ""} onClick={() => go(i)}>
            <b>{s.n}</b>{s.label}<small>{s.sub}</small>
          </button>
        ))}
      </nav>

      <div className="sg-stage" aria-live="polite">
        <span className="sg-badge">{STEPS[step].badge}</span>
        <div className={step === 0 ? "" : "off"} data-hi={hi ?? undefined}
          dangerouslySetInnerHTML={{ __html: sign === "tower" ? towerWire() : bannerWire() }} />
        <div className={step === 1 ? "" : "off"}
          dangerouslySetInnerHTML={{ __html: sign === "tower" ? towerFiles() : bannerFiles(round) }} />
        <div className={"sg-day" + (step === 2 ? "" : " off")}>
          {d.photos.map(([f, alt], i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={f} src={`${SG}/${f}.jpg`} alt={alt} loading="lazy" style={{ opacity: i === photo % d.photos.length ? 1 : 0 }} />
          ))}
        </div>
        {step > 0 && <button type="button" className="sg-nav prev" onClick={() => go(step - 1)}>← Back</button>}
        {step < 2 && <button type="button" className="sg-nav next" onClick={() => go(step + 1)}>Next →</button>}
      </div>

      <div className="sg-below">
        <p className="sg-note"><b>{STEPS[step].badge}</b>{d.notes[step]}</p>
        <div className="sg-aux">
          {step === 0 && (
            <ul className="sg-keys">
              {d.keys.map(([t, s], i) => (
                <li key={t} className={hi === i + 1 ? "hi" : ""} onMouseEnter={() => setHi(i + 1)} onMouseLeave={() => setHi(null)}>
                  <i>{i + 1}</i><span><b>{t}</b>{s}</span>
                </li>
              ))}
            </ul>
          )}
          {step === 1 && sign === "banner" && (
            <>
              <div className="lbl">Design rounds</div>
              <div className="seg" role="group" aria-label="Design round">
                <button type="button" aria-pressed={round === 0} onClick={() => setRound(0)}>Round 1 · names only</button>
                <button type="button" aria-pressed={round === 1} onClick={() => setRound(1)}>Final · photos added</button>
              </div>
            </>
          )}
          {step === 1 && sign === "tower" && <p className="sg-cap">Four panels, designed at full size (36 × 72 in), one participant on each.</p>}
          {step === 2 && <p className="sg-cap">{ph[1]}</p>}
        </div>
      </div>

      <div className="sg-ad">
        <div className="lbl">Art direction</div>
        <div className="sg-ad-row">
          <div className="sg-sw" aria-hidden="true">
            <i style={{ background: "var(--navy)" }} /><i style={{ background: "var(--orange)" }} /><i style={{ background: "var(--gold)" }} /><i style={{ background: "var(--sky)" }} /><i style={{ background: "#c8402f" }} />
            <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="13" fill="none" stroke="var(--sky)" strokeWidth="4" /></svg>
            <svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14" fill="var(--orange)" /></svg>
          </div>
          <p>Working with a graphic designer, we built the signs from the 40th&apos;s visual identity: the campaign palette with red for the advocacy message, photos in circles broken by rings and dots, and real participants caught mid-celebration.</p>
        </div>
      </div>
    </div>
  );
}
