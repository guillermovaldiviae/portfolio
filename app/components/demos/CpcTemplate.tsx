"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, type ReactNode } from "react";
import "./cpc-template.css";

// CPC 02 · The platform: Classy's plain text block, built up layer by layer
// into the live "Celebrating 40 Years of Impact" section.
// The code snippets are illustrative; swap in your real class names if you like.

const IMG = "/work/central-park-challenge/platform";

type Layer = { k: "brand" | "card" | "type" | "photo"; name: string; file: string; sub: string; cap: ReactNode; code: ReactNode };

const C = ({ children }: { children: ReactNode }) => <span className="c">{children}</span>;
const K = ({ children }: { children: ReactNode }) => <span className="k">{children}</span>;
const S = ({ children }: { children: ReactNode }) => <span className="s">{children}</span>;

const LAYERS: Layer[] = [
  {
    k: "brand", name: "Brand color & type", file: "colors · fonts",
    sub: "The 40th's sky blue and orange, and Mulish in place of the platform font.",
    cap: <><b>Brand color and type.</b> The white block takes the 40th&apos;s sky blue, and the default font gives way to the campaign&apos;s Mulish.</>,
    code: <><C>{"/* custom CSS, scoped to the block */"}</C>{"\n"}<K>.cpc-about</K>{" {\n  background: "}<S>#479FCC</S>{";      "}<C>{"/* 40th sky */"}</C>{"\n  font-family: "}<S>&quot;Mulish&quot;</S>{", sans-serif;\n}\n"}<K>.cpc-btn</K>{" {\n  background: "}<S>#EB9C3F</S>{";      "}<C>{"/* 40th orange */"}</C>{"\n  border-radius: "}<S>999px</S>{";\n}"}</>,
  },
  {
    k: "card", name: "Info card", file: "layout",
    sub: "Date, time, and location pulled out of the paragraph into a card you can scan.",
    cap: <><b>Info card.</b> The when and where come out of the paragraph and sit at the top of a white card, so nobody has to read to find them.</>,
    code: <>{"<div class="}<S>&quot;cpc-card&quot;</S>{">\n  <dl class="}<S>&quot;cpc-facts&quot;</S>{">\n    <dt>Date</dt><dd>Saturday, May 30</dd> …\n  </dl>\n</div>\n\n"}<K>.cpc-card</K>{" {\n  border: "}<S>5px solid #EB9C3F</S>{";\n  border-radius: "}<S>26px</S>{";\n}\n"}<K>.cpc-facts</K>{" {\n  display: "}<S>grid</S>{";\n  grid-template-columns: "}<S>repeat(3, 1fr)</S>{";\n}"}</>,
  },
  {
    k: "type", name: "Reading order", file: "type scale",
    sub: "One big headline, a divider, a bold summary, then the detail.",
    cap: <><b>Reading order.</b> The platform sets every line at the same weight. Now the headline leads, the summary follows, and the detail comes last.</>,
    code: <><K>.cpc-card h2</K>{" {\n  font: "}<S>900 40px/1.08 &quot;Mulish&quot;</S>{";\n  color: "}<S>#479FCC</S>{";\n}\n"}<K>.cpc-card hr</K>{" { border-top: "}<S>3px solid #DDE3EA</S>{"; }\n"}<K>.cpc-lead</K>{"  { font-weight: "}<S>800</S>{"; font-size: "}<S>20px</S>{"; }\n"}<K>.cpc-body</K>{"  { font-weight: "}<S>500</S>{"; line-height: "}<S>1.75</S>{"; }"}</>,
  },
  {
    k: "photo", name: "Photo frames", file: "images",
    sub: "Event photos in the circle-and-ring style from the posters and signage.",
    cap: <><b>Photo frames.</b> The circles and rings from the print campaign, so the site reads as the same event as the posters in the park.</>,
    code: <>{"<img class="}<S>&quot;cpc-circle cpc-ring--white&quot;</S>{"\n     src="}<S>&quot;…/image-library/crowd.jpg&quot;</S>{"\n     alt="}<S>&quot;Friends at the 40th, one holding a dog&quot;</S>{">\n\n"}<K>.cpc-circle</K>{" {\n  border-radius: "}<S>50%</S>{";\n  aspect-ratio: "}<S>1</S>{";\n  object-fit: "}<S>cover</S>{";\n}\n"}<K>.cpc-ring--white</K>{" { box-shadow: "}<S>0 0 0 6px #fff</S>{"; }"}</>,
  },
];

const BASE = <><b>Classy&apos;s text block.</b> Where Classy has no built-in feature, this is what you get: centered paragraphs in one font at one weight, plus a blue button.</>;
const ALL = <><b>All four layers, as it&apos;s live today.</b> The block itself never moved. Turn on X-ray to see the line between Classy and my code.</>;

export default function CpcTemplate() {
  const [on, setOn] = useState<Set<Layer["k"]>>(new Set());
  const [sel, setSel] = useState<Layer["k"]>("brand");
  const [last, setLast] = useState<Layer["k"] | null>(null);
  const [xray, setXray] = useState(false);

  const full = on.size === LAYERS.length;
  const toggle = (k: Layer["k"], checked: boolean) => {
    const next = new Set(on);
    if (checked) { next.add(k); setLast(k); } else { next.delete(k); setLast([...next].pop() ?? null); }
    setOn(next);
    setSel(k);
  };
  const showAll = () => {
    if (full) { setOn(new Set()); setSel("brand"); setLast(null); }
    else { setOn(new Set(LAYERS.map((l) => l.k))); setSel("photo"); setLast("photo"); }
  };

  const pgClass = ["cpt-pg", ...LAYERS.filter((l) => on.has(l.k)).map((l) => "L-" + l.k), on.size === 0 ? "L-none" : "", xray ? "xr" : ""].join(" ");
  const selected = LAYERS.find((l) => l.k === sel)!;
  const caption = on.size === 0 ? BASE : full ? ALL : LAYERS.find((l) => l.k === last)?.cap ?? BASE;

  return (
    <div className="cpt">
      <div className="cpt-stage">
        <div className="cpt-top">
          <span>Event page · the “Celebrating 40 Years” block</span>
          <span className="cpt-btns">
            <button type="button" className="cpt-pill" onClick={showAll}>{full ? "Back to the platform default" : "Show my build"}</button>
            <button type="button" className="cpt-pill" aria-pressed={xray} onClick={() => setXray(!xray)}><i />X-ray</button>
          </span>
        </div>

        <div className="cpt-browser">
          <div className="cpt-chrome"><span /><span /><span /><em>give.yai.org/event/2026-yai-central-park-challenge</em></div>
          <div className={pgClass}>
            <div className="cpt-nav">
              <span className="don">Donate</span>
              <span className="lk"><span>Event Info</span><span>Ways to Support ▾</span></span>
              <span className="cpt-tag mine t-nav">my HTML + CSS · nav</span>
            </div>
            <div className="cpt-blk">
              <span className="cpt-tag lock t-blk">Classy · text block (fixed width and order)</span>
              <span className="cpt-tag mine t-mine">my HTML + CSS</span>
              <div className="cpt-sec">
                <div className="cpt-grid">
                  <div className="cpt-art">
                    <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
                    <img className="shot big" src={`${IMG}/info-friends.jpg`} alt="Friends at the 40th, one holding a dog" />
                    <img className="shot small" src={`${IMG}/info-runner.jpg`} alt="A runner wearing bib 501" />
                  </div>
                  <div className="cpt-card">
                    <dl className="facts">
                      <div><dt>Date</dt><dd>Saturday,<br /> May 30, 2026</dd></div>
                      <div><dt>Time</dt><dd>8 AM - 12 PM</dd></div>
                      <div><dt>Location</dt><dd>Naumburg Bandshell,<br /> Central Park</dd></div>
                    </dl>
                    <h4 className="h">Celebrating 40 Years of Impact</h4>
                    <span className="hr" />
                    <p className="lead">YAI&apos;s Central Park Challenge is one of New York&apos;s largest celebrations of people with intellectual and developmental disabilities (I/DD).</p>
                    <p className="body">Each year, the event raises crucial funds to help people with I/DD to live, love, work, and learn in their communities.</p>
                    <span className="cpt-cta">Learn more</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="cpt-cap" aria-live="polite">{caption}</p>
      </div>

      <div className="cpt-bench">
        <div className="cpt-panel">
          <div className="cpt-ph">Layers of custom code</div>
          <ul className="cpt-layers">
            {LAYERS.map((l) => (
              <li key={l.k}>
                <label className={"cpt-layer" + (sel === l.k ? " sel" : "")} htmlFor={"cpt-" + l.k}>
                  <input type="checkbox" id={"cpt-" + l.k} checked={on.has(l.k)} onChange={(e) => toggle(l.k, e.target.checked)} />
                  <span className="cpt-sw" aria-hidden="true" />
                  <span><strong>{l.name}<span>{l.file}</span></strong><small>{l.sub}</small></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="cpt-panel">
          <div className="cpt-ph">The code · {selected.name}</div>
          <pre className="cpt-code">{selected.code}</pre>
        </div>
      </div>

      <div className="cpt-ledger">
        <div className="cpt-col locked">
          <h4><i />Built-in Classy features I kept</h4>
          <ul>
            <li>The fundraising thermometer</li>
            <li>Top fundraiser leaderboards</li>
            <li>The event map</li>
            <li>The footer</li>
          </ul>
        </div>
        <div className="cpt-col mine">
          <h4><i />Gaps I filled with HTML &amp; CSS</h4>
          <ul>
            <li>The nav: Donate, Event Info, and Ways to Support</li>
            <li>The hero, with the 40th lockup and presenting sponsor</li>
            <li>Event info: date, time, and place at a glance</li>
            <li>More Ways to Celebrate &amp; Get Involved</li>
            <li>About YAI</li>
            <li>The sponsor wall</li>
          </ul>
        </div>
      </div>

      <p className="cpt-foot">The same layers carried into every custom section on all seven campaign pages, from the hero to the sponsor wall, so the built-in features and my sections read as one page. <b>04</b> shows how each section changed for the people using it. <b>05</b> shows how I got photos into custom sections when the platform couldn&apos;t style them.</p>
    </div>
  );
}
