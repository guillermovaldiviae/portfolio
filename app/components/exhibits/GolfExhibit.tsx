"use client";

import { Bars, Count, Entrance, Figure, GoalRing, Island, NextCard, Room, Stepper, Tile, useSeen, reduced } from "./kit";

const KC = "/work/kevin-carey-legacy-golf-outing";

const REVIEW = [
  { what: "It leaned somber", why: "The logo sat over a dimmed, full-bleed photo. Dark and heavy for an event meant to celebrate a life’s work.", img: `${KC}/compare/hero-before.jpg`, alt: "Version 1 hero: the logo over a dimmed golf course photo" },
  { what: "The dinner was a line item", why: "Prices sat in grey rows, with the DSP Awards Dinner as one more line.", img: `${KC}/compare/tickets-before.jpg`, alt: "Version 1 tickets: grey rows of prices" },
  { what: "Sponsors got one sentence", why: "Sponsorship was tucked into one sentence with an underlined link. Easy for a partner to scroll past.", img: `${KC}/compare/sponsor-cta-v1.jpg`, alt: "Version 1 sponsor call to action: one sentence and a link" },
];

/** Fifteen squares, one per sponsor, that fill in when seen. */
function Sponsors() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className="sq15" aria-hidden="true">
      {Array.from({ length: 15 }).map((_, k) => (
        <i key={k} className={seen ? "on" : ""} style={{ transitionDelay: reduced() ? "0ms" : `${120 + k * 70}ms` }} />
      ))}
    </div>
  );
}

export default function GolfExhibit() {
  return (
    <>
      <Entrance
        eyebrow="Shipped · YAI · 2026 · Website redesign"
        title="Kevin Carey Legacy Golf Outing"
        lede="Leading the website, brand rollout, and sponsorships for a renamed charity golf outing, honoring Kevin Carey and the Direct Support Professionals he championed with an event that feels alive rather than like a memorial."
        meta={[["Role", "Web design, brand rollout across signage & print, sponsorships, event logistics"], ["Platform", "GoFundMe Pro (Classy)"], ["Team", "Graphic designer, Fundraising, MarComms, Executive leadership, golf course"], ["Timeline", "Design May–Sep 2026 · Fundraising Jul–Sep 2026"]]}
        cover={{ src: `${KC}/cover-key.jpg`, alt: "The YAI Kevin Carey Legacy Golf Outing logo surrounded by leaf-cropped photos of golfers on the course" }}
      />

      <Room id="r1" n={1} name="The problem" title="A legacy, not a memorial" how="Step through the review"
        intro={<>
          <p>YAI&apos;s golf tournament was renamed to honor its former CEO, who passed away in 2025. The event had to celebrate his legacy: warm, alive, and looking ahead.</p>
          <p>I launched a first version quickly so tickets and sponsorships could open on time. Then I reviewed it against the event&apos;s goals. It was accurate, but three things were off.</p>
        </>}>
        <Stepper items={REVIEW} />
      </Room>

      <Room id="r2" n={2} name="The redesign" title="Version 1 to version 2" how="Pick a section, then flip the switch to see what changed"
        intro={<p>The redesign kept what worked and rebuilt the rest around three questions: does it feel like a celebration, can each audience find their path in one click, and does every partner get real visibility?</p>}>
        <Island id="golf-compare" />
      </Room>

      <Room id="r3" n={3} name="The navigation" title="Three links, three audiences" how="Three links on desktop · tap the phone's menu"
        intro={<p>The navigation doubles as an audience map: Golf Outing, DSP Awards Dinner, and Sponsorships. On a phone the links fold into one &quot;Get Involved&quot; menu, so the call to action is the menu itself.</p>}>
        <Island id="golf-nav" />
      </Room>

      <Room id="r4" n={4} name="The identity" title="Green for life and growth" how="Click to enlarge"
        intro={<p>A professional graphic designer created the logo. My role was carrying it, and the green, everywhere the event lives: the website, on-course signage, and printed pieces. Bright photography in an organic leaf crop replaced the dark banner of the first version.</p>}>
        <Figure src={`${KC}/process-identity.jpg`} alt="Before and after of the event name, the new logo, the leaf-crop image treatment, colors, and web type" caption="Brand rollout & image treatment" />
      </Room>

      <Room id="r5" n={5} name="The impact" title="The results"
        intro={<p>Event-wide results from a team effort. I secured all 15 sponsorships and managed logistics with the golf course and internal teams.</p>}>
        <div className="impact">
          <Tile><GoalRing raised={131} goal={125} cap="Raised Jul–Sep 2026, beating the $125K goal" /></Tile>
          <Tile>
            <Count to={6.5} prefix="+" suffix="%" dec={1} />
            <Bars rows={[{ label: "2025", w: 94, value: "$123K" }, { label: "2026", w: 100, value: "$131K", now: true }]} />
            <div className="cap">Raised, year over year</div>
          </Tile>
          <Tile><Count to={15} /><Sponsors /><div className="cap">Corporate sponsors, each with an equal card on the sponsor wall</div></Tile>
          <Tile><Count to={100} /><div className="cap">Golfers on the course</div></Tile>
          <Tile><span className="num">150–200</span><div className="cap">Dinner guests celebrating Direct Support Professionals</div></Tile>
        </div>
      </Room>

      <Room id="r6" n={6} name="What's next" last>
        <NextCard title="Give the honorees a lasting home">
          <p>With more time, I&apos;d give each year&apos;s DSP honorees a lasting page beyond the event, add analytics to see how golfers, dinner guests, and sponsors move through the site, and turn the leaf-crop treatment and green palette into a reusable template.</p>
        </NextCard>
      </Room>
    </>
  );
}
