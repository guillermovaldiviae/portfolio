"use client";
/* eslint-disable @next/next/no-img-element */

import { Fragment, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Bars, Count, Entrance, NextCard, Room, Seg, Stepper, Tile, Zoom, reduced, useEx, useSeen, type StepItem } from "./kit";

const GT = "/work/giving-tuesday";
const P = `${GT}/print`;

/* ================= 01 · Two donors ================= */

const JOURNEYS: Record<"long" | "young", StepItem[]> = {
  long: [
    { when: "Monday", what: "The letter arrives", why: "Connor on the cover, the line “Be the power behind possibility,” and the navy-and-orange rings.", img: `${P}/cover.jpg`, alt: "Cover of the printed appeal: Be the power behind possibility, with Connor holding his iPad at a grocery store" },
    { when: "Wednesday", what: "They scan the QR code", why: "The back panel asks “Be a part of the change” and sends them to yai.org/give2025.", img: `${P}/back.jpg`, alt: "Back panel of the printed appeal: Be a part of the change, make a gift today, with the yai.org/give2025 link and QR code" },
    { when: "Same day", what: "They recognize the page", why: "The same person, circle crop, rings and colors greet them online, so the page feels like the letter in their hand.", img: `${GT}/final-story-connor.jpg`, alt: "Connor’s story module on the donate page, with the same circle crop and orange ring as the mailer" },
  ],
  young: [
    { when: "Tuesday", what: "A digital appeal finds them", why: "Online outreach carries the same key visual and line as the mailer.", img: `${GT}/cover-key.jpg`, alt: "Give 2025 digital key visual: Be the power behind possibility, beside circle-framed photos" },
    { when: "A tap later", what: "The form is right there", why: "The donation card sits above the stories, with preset amounts and a monthly option. Giving takes seconds.", img: `${GT}/final-donation-form.jpg`, alt: "Donation card with give once and monthly options and preset amounts" },
    { when: "At the bottom", what: "A second chance to give", why: "After the stories, a closing ask with its own form means nobody has to scroll back up.", img: `${GT}/final-closing-ask.jpg`, alt: "Closing ask with a second donation form" },
  ],
};

function Journey() {
  const [donor, setDonor] = useState<"long" | "young">("long");
  return (
    <div className="journey">
      <Seg label="Choose a donor" value={donor} onChange={setDonor} items={[{ id: "long", label: "Longtime donor, holding the mailer" }, { id: "young", label: "Younger donor, on their phone" }]} />
      <Stepper items={JOURNEYS[donor]} />
    </div>
  );
}

/* ================= 02 · The plan ================= */

const NODES = [
  { no: "01 · Inputs", nm: "Donor data", more: "Giving history and segments pulled from GoFundMe Pro and Salesforce CRM, with Fundraising & Development, to decide who hears what, and what to ask for.", tag: "GoFundMe Pro · Salesforce CRM" },
  { no: "02 · Strategy", nm: "One core story", more: "Assistive technology as the path to independence, told through three real people: Suzy, Connor, and Leon.", tag: "Project lead" },
  { no: "03 · Direction", nm: "Creative & copy brief", more: "Direction to MarComms on messaging, visuals, and the “Be the power behind possibility” line, so every piece speaks with one voice.", tag: "MarComms" },
];
const CHANNELS = [
  { ic: "PRINT", b: "Printed appeal", s: "Mailed to donors, points to the page", note: "The mailer goes to longtime donors and points them to the page with a QR code." },
  { ic: "WEB", b: "Digital appeal", s: "Online outreach driving to the page", note: "Online outreach reaches younger donors and drives them straight to the page." },
  { ic: "SHARE", b: "Peer sharing", s: "Share button built into the page", note: "A share button on the page lets donors bring in their own friends and family." },
];

function Plan() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [open, setOpen] = useState<number[]>([]);
  const [chan, setChan] = useState<number | null>(null);
  const [pulse, setPulse] = useState(0);
  return (
    <div ref={ref} className={"flow-wrap" + (seen ? " show" : "")}>
      <div className={"flow" + (seen ? " show" : "")}>
        {NODES.map((n, i) => (
          <button key={n.nm} className="node" type="button" style={{ "--i": i } as CSSProperties} aria-expanded={open.includes(i)} onClick={() => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}>
            <span className="no">{n.no}</span><span className="nm">{n.nm}</span><span className="more">{n.more}</span><span className="tag">{n.tag}</span><span className="hint">Open +</span>
          </button>
        ))}
        <div className="chans" role="group" aria-label="Channels">
          {CHANNELS.map((c, i) => (
            <button key={c.b} className="chan" type="button" style={{ "--i": i + 3 } as CSSProperties} aria-pressed={chan === i} onClick={() => { setChan(i); setPulse((p) => p + 1); }}>
              <span className="ic">{c.ic}</span><b>{c.b}</b><span>{c.s}</span>
            </button>
          ))}
        </div>
      </div>
      <Dest pulse={pulse} />
      <div className="chan-note" aria-live="polite">{chan !== null && `${CHANNELS[chan].note} Every path ends at the same page.`}</div>
    </div>
  );
}

function Dest({ pulse }: { pulse: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!pulse) return;
    setOn(true);
    const t = setTimeout(() => setOn(false), 900);
    return () => clearTimeout(t);
  }, [pulse]);
  return (
    <div className={"dest" + (on ? " pulse" : "")}>
      <div><div className="no">05 · Destination</div><div className="nm">One landing page, one place to give</div></div>
      <div><Count to={270} prefix="$" suffix="K" className="big tab" /><div className="sm"><Count to={223} className="tab" /> gifts</div></div>
    </div>
  );
}

/* ================= 03 · The blueprint ================= */

/* Lo-fi wireframe blocks, one per numbered section of the donate page. */
const W: ReactNode[] = [
  <div key={1} className="two"><div className="lines"><div className="bar" style={{ width: "40%" }} /><div className="bar d" style={{ width: "85%", height: 14 }} /><div className="bar d" style={{ width: "70%", height: 14 }} /><div className="bar" style={{ width: "92%", height: 7, marginTop: 8, background: "#2b2b2b" }} /></div><div className="x" style={{ aspectRatio: "4/3" }} /></div>,
  <div key={2} className="card"><div className="bar d" style={{ width: "50%", justifySelf: "center" }} /><div className="tog"><i /><i /></div><div className="amts"><i /><i /><i /><i /><i /><i /></div><div className="cta" /></div>,
  <div key={3} className="lines"><div className="bar d" style={{ width: "80%", height: 12 }} /><div className="bar" style={{ width: "70%" }} /><div className="bar" style={{ width: "55%" }} /><div className="pill" style={{ marginTop: 6 }} /></div>,
  <div key={4} className="two"><div className="lines"><div className="bar d" style={{ width: "60%", height: 12 }} /><div className="bar" style={{ width: "90%" }} /><div className="bar m" style={{ width: "75%" }} /><div className="bar" style={{ width: "80%" }} /></div><div className="x c" style={{ width: 96, aspectRatio: "1", justifySelf: "center" }} /></div>,
  <div key={5} className="two rev"><div className="x c" style={{ width: 96, aspectRatio: "1", justifySelf: "center" }} /><div className="lines"><div className="bar d" style={{ width: "60%", height: 12 }} /><div className="bar" style={{ width: "90%" }} /><div className="bar m" style={{ width: "75%" }} /></div></div>,
  <div key={6} className="two"><div className="lines"><div className="bar" style={{ width: "60%", height: 12, background: "#fff", border: "1px solid var(--wf3)" }} /><div className="bar" style={{ width: "90%" }} /><div className="bar" style={{ width: "80%" }} /></div><div className="x c" style={{ width: 96, aspectRatio: "1", justifySelf: "center", opacity: 0.6 }} /></div>,
  <div key={7} className="two rev"><div className="x" style={{ width: 80, aspectRatio: "3/4", justifySelf: "center" }} /><div className="lines"><div className="bar" style={{ width: "90%" }} /><div className="bar" style={{ width: "85%" }} /><div className="bar" style={{ width: "70%" }} /><div className="bar m" style={{ width: "40%" }} /></div></div>,
  <div key={8} style={{ display: "grid", gap: 8 }}><div className="lines" style={{ justifyItems: "center" }}><div className="bar d" style={{ width: "60%", height: 12 }} /><div className="bar" style={{ width: "70%" }} /></div><div className="card"><div className="bar m" style={{ width: "60%" }} /><div className="amts" style={{ gridTemplateColumns: "repeat(4,1fr)" }}><i /><i /><i /><i /></div><div className="cta" /></div></div>,
  <div key={9} className="lines"><div className="bar d" style={{ width: "22%" }} /><div style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 8, alignItems: "center" }}><div className="x c" style={{ width: 16, height: 16 }} /><div className="bar m" style={{ width: "55%" }} /></div><div style={{ display: "grid", gridTemplateColumns: "16px 1fr", gap: 8, alignItems: "center" }}><div className="x c" style={{ width: 16, height: 16 }} /><div className="bar m" style={{ width: "45%" }} /></div></div>,
  <div key={10} className="card" style={{ width: "min(100%,360px)" }}><div className="bar d" style={{ width: "50%" }} /><div className="bar m" style={{ width: "70%" }} /><div className="bar m" style={{ width: "60%" }} /><div className="bar m" style={{ width: "65%" }} /></div>,
];

/* The live pieces each section became. */
function HeroTry() {
  const [run, setRun] = useState(0);
  const [w, setW] = useState(0);
  const [v, setV] = useState(0);
  useEffect(() => {
    setW(0);
    const t = setTimeout(() => setW(90), 30);
    let raf = 0, t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = reduced() ? 1 : Math.min(1, (t - t0) / 1600);
      setV(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [run]);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div className="obj navy">
        <div className="sm" style={{ letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.8 }}>Give 2025</div>
        <div className="h">Be the <span className="or">power</span> behind possibility</div>
        <div className="prog"><i style={{ width: `${w}%` }} /></div>
        <div className="sm"><b className="tab">${Math.round(270000 * v).toLocaleString("en-US")}</b> raised of $300,000 · <b className="tab">{Math.round(223 * v)}</b> gifts</div>
      </div>
      <div className="illus">Where it ended. Press replay to watch it fill.</div>
      <button className="share" type="button" onClick={() => setRun((r) => r + 1)}>Replay</button>
    </div>
  );
}

function DonationTry() {
  const [f, setF] = useState("one-time");
  const [a, setA] = useState("100");
  const [done, setDone] = useState(false);
  return (
    <div className="dcard">
      <div className="ttl">Be a part of the change.</div>
      <div className="dtog">
        {[["one-time", "Give once"], ["monthly", "Monthly ♥"]].map(([k, l]) => <button key={k} type="button" aria-pressed={f === k} onClick={() => { setF(k); setDone(false); }}>{l}</button>)}
      </div>
      <div className="damts">
        {["100", "200", "300", "500", "750", "1,000"].map((x, i) => (
          <button key={x} type="button" aria-pressed={a === x} onClick={() => { setA(x); setDone(false); }}>${x}{i === 0 && <span className="sug">♥ SUGGESTED</span>}</button>
        ))}
      </div>
      <button className={"dbtn" + (done ? " done" : "")} type="button" onClick={() => setDone(true)}>{done ? "Thank you ♥" : `Give $${a} ${f}`}</button>
      <div className="dnote">Demo only. Nothing is charged.</div>
    </div>
  );
}

function CaseTry() {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div className="obj">
        <div className="h" style={{ color: "var(--navy)" }}>Independence isn’t just a goal. It’s a right.</div>
        <div className="sm">Meet Suzy, Connor, and Leon, and the tools that help them live more independently.</div>
        <button className={"share" + (copied ? " done" : "")} type="button" onClick={() => { navigator.clipboard?.writeText("https://give.yai.org/campaign/736849/donate").catch(() => {}); setCopied(true); }}>{copied ? "LINK COPIED ✓" : "SHARE"}</button>
      </div>
      <div className="illus">Wording drawn from the appeal letter.</div>
    </div>
  );
}

const STORIES = [
  { img: `${GT}/story-suzy.jpg`, cap: "Suzy · orange band, text left, image right (story module spec)", alt: "Story module for Suzy McCabe on an orange band, with her Meta Glasses story, pull quote, circle portrait and stat" },
  { img: `${GT}/final-story-connor.jpg`, cap: "Connor · white band, image left (final donate page)", alt: "Final story module for Connor Shea on a white band, with his circle portrait on the left and pull quote" },
  { img: `${P}/leon.jpg`, cap: "Leon · navy band (his panel in the printed appeal)", alt: "Printed appeal panel for Leon Owens on navy, with his PillDrill story and stat" },
];
function StoryTry({ i, go }: { i: number; go: (n: number) => void }) {
  const s = STORIES[i];
  return (
    <div>
      <figure style={{ margin: 0, display: "grid", gap: 8 }}>
        <Zoom src={s.img} alt={s.alt} className="final" style={i === 2 ? { maxWidth: 220, justifySelf: "center" } : undefined} />
        <figcaption className="illus">{s.cap}</figcaption>
      </figure>
      <div className="band-dots" style={{ marginTop: 10 }} role="group" aria-label="Stories">
        {["Suzy", "Connor", "Leon"].map((nm, k) => <button key={nm} type="button" aria-pressed={k === i} onClick={() => go(4 + k)}>{nm}</button>)}
      </div>
    </div>
  );
}

const QUOTE = "“Knowing that he has a safe home and the opportunity to continue building his skills through supported programs means everything to me. Supporting YAI truly changes lives, not just for people like Michael, but for their families too.”";

function CloseTry() {
  const [v, setV] = useState("50");
  const [done, setDone] = useState(false);
  return (
    <div className="cl">
      <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}><span style={{ color: "var(--orange)" }}>The Power of Connection</span> <span style={{ color: "var(--navy)" }}>Starts With You</span></div>
      <div className="amt"><sup>$</sup>{v === "Other" ? "__" : v}</div>
      <div className="seg2">
        {["50", "25", "10", "Other"].map((x) => <button key={x} type="button" aria-pressed={v === x} onClick={() => setV(x)}>{x === "Other" ? x : `$${x}`}</button>)}
      </div>
      <select aria-label="Frequency"><option>One-time</option><option>Monthly</option></select>
      <button className={"dbtn" + (done ? " done" : "")} type="button" onClick={() => setDone(true)}>{done ? "Thank you ♥" : "Donate"}</button>
      <div className="dnote">Demo only. Nothing is charged.</div>
    </div>
  );
}

const FEED: [string, string, string][] = [["A", "A donor gave $100", "Monthly"], ["M", "A donor gave $50", "In honor of a friend"], ["J", "A donor gave $250", ""], ["R", "A donor gave $25", "Shared the page"], ["S", "A donor gave $500", ""]];
function FeedTry() {
  const [items, setItems] = useState<{ k: number; f: [string, string, string] }[]>([{ k: 1, f: FEED[1] }, { k: 0, f: FEED[0] }]);
  const n = useRef(2);
  useEffect(() => {
    if (reduced()) return;
    const id = setInterval(() => {
      const k = n.current++;
      setItems((s) => [{ k, f: FEED[k % FEED.length] }, ...s].slice(0, 4));
    }, 1700);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div className="obj">
        <div style={{ fontWeight: 800, fontSize: 14 }}>Recent activity</div>
        <div className="feed">
          {items.map(({ k, f }) => (
            <div key={k} className="it"><i>{f[0]}</i><div><span>{f[1]}</span><small>{f[2] ? `${f[2]} · ` : ""}just now</small></div></div>
          ))}
        </div>
      </div>
      <div className="illus">Illustration. These are not real donors.</div>
    </div>
  );
}

const FAQ = [
  ["Is my gift tax-deductible?", "YAI is a 501(c)3 tax-exempt organization, and your donation is tax deductible within the guidelines of U.S. law."],
  ["Can I give every month?", "Yes. Choose Monthly in the donation card at the top of the page."],
  ["Who does my gift help?", "People with intellectual and developmental disabilities, through assistive technology like smart glasses, visual communication apps, and medication management devices."],
];
function FaqTry() {
  const [open, setOpen] = useState<number[]>([]);
  return (
    <div className="faq">
      {FAQ.map(([q, a], i) => (
        <Fragment key={q}>
          <button type="button" aria-expanded={open.includes(i)} onClick={() => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}>{q}<span>▾</span></button>
          <div className={open.includes(i) ? "open" : ""}><p>{a}</p></div>
        </Fragment>
      ))}
    </div>
  );
}

type Pin = { t: string; d: string; p?: string; fin?: string; story?: number; Try?: () => ReactNode };
const PINS: Pin[] = [
  { t: "Hero + live progress", d: "Campaign name and a one-line promise. The progress bar toward the $300K goal and the gift count build momentum before any ask.", p: "Lead with progress", Try: () => <HeroTry /> },
  { t: "Donation card, above the story", d: "A give once / monthly toggle, preset amounts with one suggested, and a custom field. One primary action.", p: "Ask early, ask again", fin: `${GT}/final-donation-form.jpg`, Try: () => <DonationTry /> },
  { t: "The case in one sentence", d: "Independence framed as a right. It introduces the three people the page follows, with a share button for peer reach.", Try: () => <CaseTry /> },
  { t: "Story module: Suzy", d: "Headline, short story, a pull quote in the person’s own words, and a supporting stat. Circle portrait with ring accents.", p: "Stories carry the case", story: 0 },
  { t: "Story module: Connor", d: "The image side alternates, and so does the color band (orange, white, navy). That rhythm keeps a long scroll from feeling repetitive.", p: "Stories carry the case", story: 1 },
  { t: "Story module: Leon", d: "Ends the story arc on a personal goal: “one day, I hope to have my own place.”", p: "Stories carry the case", story: 2 },
  { t: "Family voice", d: "A parent testimonial widens the impact from the individual to the family.", Try: () => <div className="quote">{QUOTE}<cite>Bernice Polinsky, Michael’s mother</cite></div> },
  { t: "Closing ask", d: "Restates the promise, names the three people, and offers a second form so nobody has to scroll back up.", p: "Ask early, ask again", fin: `${GT}/final-closing-ask.jpg`, Try: () => <CloseTry /> },
  { t: "Activity feed", d: "Recent gifts and donor messages as live social proof.", Try: () => <FeedTry /> },
  { t: "FAQ + About", d: "Answers tax-deductibility, recurring gifts, and who benefits, removing the last hesitations.", Try: () => <FaqTry /> },
];
const PRINCIPLES = [
  { label: "Lead with progress", pins: [1] },
  { label: "Ask early, ask again", pins: [2, 8] },
  { label: "Stories carry the case", pins: [4, 5, 6] },
];

function PinPanel({ n, go, drawer }: { n: number; go: (n: number) => void; drawer: boolean }) {
  const p = PINS[n - 1];
  const [view, setView] = useState<"try" | "final">("try");
  useEffect(() => setView("try"), [n]);
  return (
    <aside className={"panel" + (drawer ? " drawer" : "")} aria-live="polite">
      <div className="pn"><span>{n}</span><b>{p.t}</b></div>
      {p.p && <div className="pp">Principle · {p.p}</div>}
      <p className="pd">{p.d}</p>
      <div className="stage-tabs" role="group" aria-label="View">
        <button type="button" aria-pressed={view === "try"} onClick={() => setView("try")}>Try it</button>
        {p.fin && <button type="button" aria-pressed={view === "final"} onClick={() => setView("final")}>See the final design</button>}
      </div>
      <div className="stage">
        {view === "final" && p.fin ? <Zoom src={p.fin} alt={`Final design: ${p.t}`} className="final" /> : p.story !== undefined ? <StoryTry i={p.story} go={go} /> : p.Try?.()}
      </div>
      <div className="navs">
        <button type="button" onClick={() => go(n === 1 ? 10 : n - 1)}>← Previous</button>
        <button type="button" onClick={() => go(n === 10 ? 1 : n + 1)}>Next →</button>
      </div>
    </aside>
  );
}

function Blueprint() {
  const [sel, setSel] = useState(0);
  const [principle, setPrinciple] = useState<number | null>(null);
  const [phone, setPhone] = useState(false);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const hi = principle === null ? [] : PRINCIPLES[principle].pins;
  const panel = sel ? <PinPanel n={sel} go={setSel} drawer={narrow} /> : null;

  return (
    <div className="bp">
      <div className="bp-tools">
        <div className="principles" role="group" aria-label="Design principles">
          {PRINCIPLES.map((pr, i) => (
            <button key={pr.label} type="button" aria-pressed={principle === i} onClick={() => { const on = principle !== i; setPrinciple(on ? i : null); if (on) setSel(pr.pins[0]); }}>{pr.label}</button>
          ))}
        </div>
        <Seg label="Screen size" value={phone ? "phone" : "desk"} onChange={(v) => setPhone(v === "phone")} items={[{ id: "desk", label: "Desktop" }, { id: "phone", label: "Phone" }]} />
      </div>
      <div className={"browser" + (phone ? " phone" : "")}>
        <div className="chrome"><i /><i /><i /><span /></div>
        <div className={"wf" + (sel ? "" : " idle") + (hi.length ? " dim" : "")}>
          {W.map((block, i) => (
            <Fragment key={i}>
              <button type="button" className={"blk" + (sel === i + 1 ? " sel" : "") + (hi.includes(i + 1) ? " hi" : "")} style={{ "--d": i } as CSSProperties} aria-label={`Section ${i + 1}: ${PINS[i].t}`} onClick={() => setSel(i + 1)}>
                <span className="pin" aria-hidden="true">{i + 1}</span>
                {block}
              </button>
              {narrow && sel === i + 1 && panel}
            </Fragment>
          ))}
        </div>
      </div>
      {!narrow && (panel ?? <aside className="panel"><div className="empty">Press a number on the wireframe. Each one opens what that section was meant to do, and lets you try it.</div></aside>)}
    </div>
  );
}

/* ================= 04 · The system ================= */

const SWATCHES = [
  { k: "navy", name: "Navy", hex: "#1A4472", note: "Navy anchors trust: the hero, headlines on white bands, and the selected state in the donation card." },
  { k: "orange", name: "Orange", hex: "#E16C38", note: "Orange carries emphasis: the word “power”, the progress bar, and the story bands." },
  { k: "gold", name: "Gold", hex: "#EB9D3F", note: "Gold sets the pull quotes on white bands, so a person’s own words stand out." },
  { k: "sky", name: "Sky", hex: "#48A0CA", note: "Sky is one of the ring accents around the circle portraits." },
  { k: "tint", name: "Tint", hex: "#C7E4FD", note: "Tint is the soft track behind the amount picker in the closing ask." },
  { k: "action", name: "Action", hex: "#000000", note: "Black is reserved for the donate action, so it always stands out." },
];
const SYS_DEFAULT = "Navy anchors trust. Orange carries emphasis (“Be the power”), the progress bar, and story bands. Black is reserved for the donate action, so it always stands out.";

function System() {
  const [k, setK] = useState<string | null>(null);
  const c = (key: string) => (k === key ? "lit" : "");
  const sw = SWATCHES.find((x) => x.k === k);
  return (
    <div className="sys">
      <div className="sw" role="group" aria-label="Campaign colors">
        {SWATCHES.map((s) => (
          <button key={s.k} type="button" className="swb" aria-pressed={k === s.k} onClick={() => setK(k === s.k ? null : s.k)}>
            <i style={{ background: s.hex }} /><div><b>{s.name}</b><span className="tab">{s.hex}</span></div>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <div className={"mock" + (k ? " focus" : "")}>
          <div className={"m-hero " + c("navy")} data-c="navy">
            <div style={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.8 }}>Give 2025</div>
            <div className="h">Be the <em className={c("orange")} data-c="orange">power</em> behind possibility</div>
            <div className={"m-prog " + c("orange")} data-c="orange"><i /></div>
          </div>
          <div className="m-row">
            <div className={"m-band " + c("orange")} data-c="orange">Navigating Life with Meta Glasses<div className="q">“Hey Meta, take me to The Village Bookstore in Pleasantville.”</div></div>
            <div className={"m-white " + c("paper")} data-c="paper">Building Confidence with Visual Supports<div className={"q " + c("gold")} data-c="gold">“It helped me with the tools to shop and I felt more confident.”</div><div className={"m-ring " + c("sky")} data-c="sky" /></div>
          </div>
          <div className="m-ask">
            <div className={"m-tint " + c("tint")} data-c="tint"><i className={c("navy")} data-c="navy" /></div>
            <div className={"m-btn " + c("action")} data-c="action">Donate</div>
          </div>
        </div>
        <p className="sys-note" aria-live="polite">{sw ? sw.note : SYS_DEFAULT}</p>
      </div>
    </div>
  );
}

/* ================= 05 · The mailer ================= */

const FOLD_NOTES = ["The appeal arrives folded, with Connor on the cover.", "Opening the cover reveals the letter from leadership.", "Inside, three stories side by side: Suzy, Connor, and Leon.", "The outside: letter flap, the ask with a QR code to the donate page, and the cover."];
const PAIRS = [
  { label: "Cover → hero", p: `${P}/cover.jpg`, w: `${GT}/cover-key.jpg`, n: "The same headline, the same people, and the same ring motif open both the mailer and the campaign’s digital key visual." },
  { label: "Story → story module", p: `${P}/connor.jpg`, w: `${GT}/final-story-connor.jpg`, n: "Connor’s story keeps its circle crop, orange ring, and pull quote online, so a donor who read the letter recognizes him on the page." },
  { label: "Ask → donation card", p: `${P}/back.jpg`, w: `${GT}/final-donation-form.jpg`, n: "Both lead with the same line, “Be a part of the change.” In print, a QR code sends readers to yai.org/give2025; online, that ask becomes a donation card with preset amounts and a monthly option, placed above the stories." },
  { label: "Letter → closing ask", p: `${P}/letter.jpg`, w: `${GT}/final-closing-ask.jpg`, n: "The letter closes with a personal ask; the page closes the same way, with a second donation form so no one has to scroll back up." },
];

function Mailer() {
  const [st, setSt] = useState(0);
  const [prev, setPrev] = useState(0);
  const [pair, setPair] = useState(0);
  const go = (s: number) => { setPrev(st); setSt(s); };
  const opening = st > prev;
  const ease = "transform 800ms cubic-bezier(.3,.7,.2,1)";
  const pr = PAIRS[pair];
  return (
    <div className="tri">
      <Seg label="Printed appeal" value={st} onChange={go} items={["1 · Cover", "2 · Open the cover", "3 · Unfold", "4 · Flip to the back"].map((l, i) => ({ id: i, label: l }))} />
      <div className="tri-stage">
        <div className="tri-persp">
          <div className="sheet" style={{ transform: `rotateY(${st === 3 ? 180 : 0}deg)` }}>
            <div className="pnl mid">
              <img className="f" src={`${P}/connor.jpg`} alt={st === 3 ? "" : "Inside panel: Connor Shea's story of shopping with a video visual scene display"} />
              <img className="b" src={`${P}/back.jpg`} alt={st === 3 ? "Back panel: Be a part of the change, make a gift today, with the yai.org/give2025 link and QR code" : ""} />
            </div>
            <div className="pnl right" style={{ transform: `translateZ(1px) rotateY(${st <= 1 ? -180 : 0}deg)`, transition: `${ease} ${opening ? 350 : 0}ms` }}>
              <img className="f" src={`${P}/leon.jpg`} alt="Inside panel: Leon Owens and the PillDrill medication system" />
              <img className="b" src={`${P}/letter.jpg`} alt="Inside flap: a letter from YAI's acting CEO and a quote from a parent" />
            </div>
            <div className="pnl left" style={{ transform: `translateZ(2px) rotateY(${st === 0 ? 180 : 0}deg)`, transition: `${ease} ${opening ? 0 : 350}ms` }}>
              <img className="f" src={`${P}/suzy.jpg`} alt="Inside panel: Suzy McCabe and her Meta glasses" />
              <img className="b" src={`${P}/cover.jpg`} alt="Cover: Be the power behind possibility, with Connor holding his iPad at a grocery store" />
            </div>
          </div>
        </div>
        <button type="button" className="tri-next" onClick={() => go((st + 1) % 4)}>{st < 3 ? "Next →" : "↺ Fold it up"}</button>
      </div>
      <p className="tri-note" aria-live="polite">{FOLD_NOTES[st]}</p>

      <div className="pairs">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}><b style={{ fontWeight: 500 }}>Same story, print to screen</b><span className="fine">Pick a pair</span></div>
        <Seg label="Print and web pairs" value={pair} onChange={setPair} items={PAIRS.map((x, i) => ({ id: i, label: x.label }))} />
        <div className="ps">
          <figure><Zoom src={pr.p} alt="Printed appeal panel" className="print" /><figcaption>Print</figcaption></figure>
          <figure><Zoom src={pr.w} alt="Matching section of the donate page" className="web" /><figcaption>Web</figcaption></figure>
        </div>
        <p className="ps-note" aria-live="polite">{pr.n}</p>
      </div>
    </div>
  );
}

/* ================= 06 · The impact ================= */

function Impact() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const [pct, setPct] = useState(0);
  const [gifts, setGifts] = useState(0);
  const [young, setYoung] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduced()) { setPct(90); setGifts(223); setYoung(100); return; }
    let raf = 0, t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / 1800), e = 1 - Math.pow(1 - p, 3);
      setPct(Math.round(90 * e));
      setGifts(Math.min(223, Math.floor((t - t0) / 22) * 6));
      setYoung(Math.min(100, Math.floor(((t - t0) - 300) / 18)));
      if (p < 1 || (t - t0) < 2200) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen]);
  const C = 2 * Math.PI * 62;
  return (
    <div ref={ref} className="impact" id="impact">
      <Tile>
        <div className="ex-ringwrap">
          <svg className="ex-ring" viewBox="0 0 150 150" role="img" aria-label="90 percent of the 300 thousand dollar goal">
            <circle className="trk" cx="75" cy="75" r="62" />
            <circle className="val" cx="75" cy="75" r="62" style={{ strokeDasharray: C, strokeDashoffset: seen ? C * 0.1 : C }} />
            <text x="75" y="80" textAnchor="middle" className="tab">{pct}%</text>
            <text x="75" y="98" textAnchor="middle" className="rs">of goal</text>
          </svg>
          <div style={{ display: "grid", gap: 6 }}>
            <Count to={270} prefix="$" suffix="K" />
            <div className="cap">Raised toward a $300K goal</div>
          </div>
        </div>
      </Tile>
      <Tile>
        <Count to={7.6} prefix="+" suffix="%" dec={1} />
        <Bars rows={[{ label: "2024", w: 93, value: "$251K" }, { label: "2025", w: 100, value: "$270K", now: true }]} />
        <div className="cap">Year over year</div>
      </Tile>
      <Tile wide>
        <div className="young-top">
          <div style={{ display: "grid", gap: 6 }}>
            <div className="lbl" style={{ color: "var(--accent)" }}>Back to 01 · younger donors</div>
            <Count to={16.4} suffix="%" dec={1} />
          </div>
          <p className="young-text">16.4% of donors were young donors, in the 30–39 age bracket or younger. There&apos;s still a ways to go in reaching younger donors, but it&apos;s a first baseline to build from.</p>
        </div>
        <div className="dots young-dots" aria-hidden="true">
          {Array.from({ length: 100 }).map((_, i) => <i key={i} className={i >= young ? "" : i < 16 ? "y" : i === 16 ? "yp" : "on"} />)}
        </div>
        <div className="cap"><span className="key"><i />39 or younger</span><span className="key"><i className="o" />40 and older</span> · each square is 1% of donors</div>
      </Tile>
      <Tile wide>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <Count to={223} />
          <div className="cap">Gifts across print and digital. Each dot is one gift.</div>
        </div>
        <div className="dots" aria-hidden="true">
          {Array.from({ length: 223 }).map((_, i) => <i key={i} className={i < gifts ? "on" : ""} />)}
        </div>
      </Tile>
    </div>
  );
}

/* ================= The exhibit ================= */

export default function GiveExhibit() {
  const { jump } = useEx();
  return (
    <>
      <Entrance
        eyebrow="Shipped · YAI · 2025 · Campaign & donate page"
        title="Give 2025"
        lede="Managing YAI's end-of-year appeal across data, creative, print, and web so it told one story everywhere."
        meta={[["Role", "Project manager, creative & copy direction, donate page"], ["Channels", "Digital & printed appeal, donate page"], ["Team", "Fundraising & Development, MarComms"], ["Timeline", "Aug–Dec 2025 production · Oct 2025–Jan 2026 giving"]]}
        cover={{ src: `${GT}/cover-key.jpg`, alt: "YAI Give 2025: Be the power behind possibility, beside circle-framed photos of people YAI supports" }}
      />

      <Room id="r-problem" n={1} name="The problem" title="One appeal, two very different donors" how="Switch donors"
        intro={<>
          <p>The appeal had always leaned on an older donor base, so the printed mailer took the front seat. In 2025, growing a younger donor base became a goal, which meant digital could no longer be an afterthought.</p>
          <p>A younger donor expects a modern page and a quick way to give. A longtime donor holding the mailer should recognize the same campaign when they scan the QR code. Pick a donor, then step through their week.</p>
          <p style={{ fontSize: 15, marginTop: 14 }}><a href="#r-impact" className="jump" onClick={(e) => { e.preventDefault(); jump("r-impact"); }}>Did it reach younger donors? Jump to 06 · The impact →</a></p>
        </>}>
        <Journey />
      </Room>

      <Room id="r-plan" n={2} name="The plan" title="One story, every channel" how="Open each step · pick a channel to follow it"
        intro={<p>As project manager, I pulled donor data from GoFundMe Pro and our Salesforce CRM with the fundraising and development teams, shaped it into one story, and turned that into direction a creative team could act on. Every channel then pointed to a single place to give.</p>}>
        <Plan />
      </Room>

      <Room id="r-blueprint" n={3} name="The blueprint" title="A long page with two chances to give" how="Press any number"
        intro={<p>This is the wireframe I planned the donate page from. Each numbered section had a job. Press a number to read what it was for, then try the feature it became.</p>}>
        <Blueprint />
      </Room>

      <Room id="r-system" n={4} name="The system" title="Every color has one job" how="Pick a color to see where it works"
        intro={<p>The same palette ran through the mailer and the page. Navy anchors trust, orange carries emphasis, and black is saved for the donate button so it always stands out.</p>}>
        <System />
      </Room>

      <Room id="r-print" n={5} name="Print to screen" title="Open the mailer" how="Unfold it"
        intro={<p>For longtime donors, the printed trifold was the front door. Unfold it, flip it over, then compare it with the page: same people, same circle crops, same rings, same line, so each piece reinforces the last instead of competing with it.</p>}>
        <Mailer />
      </Room>

      <Room id="r-impact" n={6} name="The impact" title="What the appeal raised"
        intro={<p>Campaign-wide results from a team effort across print and digital, October 2025 to January 2026, plus a first look at who gave.</p>}>
        <Impact />
      </Room>

      <Room id="r-next" n={7} name="What's next" last>
        <NextCard title="Keep building the younger donor base">
          <p>16.4% of donors being 39 or younger is a start, not the finish line. Next time I&apos;d track first-time online donors, and gifts through the page versus the reply card, from day one, to see which channel brings younger donors in and keep investing there.</p>
        </NextCard>
      </Room>
    </>
  );
}
