"use client";

import { useState } from "react";
import { Bars, Count, Entrance, GoalRing, Island, NextCard, Room, Seg, Tile, useEx } from "./kit";
import CpcTemplate from "../demos/CpcTemplate";

const CPC = "/work/central-park-challenge";

/* ================= 01 · What people told me ================= */

const FINDINGS = [
  {
    who: "People YAI supports",
    quote: "Can there be less words? The text is too hard to read.",
    changed: "Shorter sections in plain language, and seven equal links cut down to three clear choices.",
  },
  {
    who: "MarComms",
    quote: "Right now it’s just walls of text. It’s hard to tell what’s important vs. what’s just fluff.",
    changed: "Scannable sections that put what matters first, and alt text on every image.",
  },
  {
    who: "Advancement",
    quote: "Just stick to what’s important. If the rest of the page distracts from that, take it out. Make the sponsors more visible, show this is a high-visibility opportunity, otherwise we’re just throwing money out the window.",
    changed: "The presenting sponsor in the hero lockup, and Sponsorships as its own page in the nav.",
    payoff: true,
  },
];

function Heard() {
  const [f, setF] = useState(0);
  const { jump } = useEx();
  const x = FINDINGS[f];
  return (
    <div className="heard">
      <Seg label="Reviewers" items={FINDINGS.map((r, i) => ({ id: i, label: r.who }))} value={f} onChange={setF} />
      <div className="heard-card" aria-live="polite">
        <div><div className="lbl">What they said</div><p className="said">“{x.quote}”</p></div>
        <div className="heard-arrow" aria-hidden="true">→</div>
        <div>
          <div className="lbl" style={{ color: "var(--accent)" }}>What changed</div>
          <p>{x.changed}</p>
          {x.payoff && (
            <p className="fine" style={{ marginTop: 12 }}>
              <a href="#r-impact" className="jump" onClick={(e) => { e.preventDefault(); jump("r-impact"); }}>See the sponsorship results →</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= The exhibit ================= */

export default function CpcExhibit() {
  const { jump } = useEx();
  return (
    <>
      <Entrance
        eyebrow="Shipped · YAI · 2025–2026 · Website redesign"
        title="Central Park Challenge"
        lede="Leading the redesign of the website for NYC's largest I/DD celebration in its 40th year, from user reviews to the live build, inside a fundraising platform built from fixed page blocks."
        meta={[["Role", "Website lead (research, IA, design & build), partnerships support, print & signage direction"], ["Tools", "GoFundMe Pro (Classy), custom HTML & CSS"], ["Team", "Fundraising, MarComms, Executive leadership, designers"], ["Goal", "$625K for the 40th anniversary"]]}
        cover={{ src: `${CPC}/cover-key.jpg`, alt: "YAI 40th Central Park Challenge presented by Waymo: the event logo framed by photos of people at the event" }}
      />

      <Room id="r-problem" n={1} name="The problem" title="Too much, all at once" how="Pick a reviewer"
        intro={<>
          <p>The 40th anniversary came with a $625K goal, and the website is where people register, donate, fundraise, and sign up to volunteer. I inherited a 2025 site that worked but didn&apos;t inspire, and it had to serve sponsors, volunteers, fundraisers, families, and people with I/DD on one long page.</p>
          <p>Before designing anything, I ran reviews with three groups. Each saw it through a different lens, but they said the same thing: there was simply too much to read.</p>
          <p style={{ fontSize: 15, marginTop: 14 }}><a href="#r-impact" className="jump" onClick={(e) => { e.preventDefault(); jump("r-impact"); }}>Did the 40th hit its goal? Jump to 06 · The impact →</a></p>
        </>}>
        <Heard />
      </Room>

      <Room id="r-platform" n={2} name="The platform" title="Working within a fixed template" how="Switch on each layer of code · X-ray shows what's Classy and what's mine"
        intro={<>
          <p>GoFundMe Pro (Classy) builds every event page from the same set of blocks. I kept the built-in features that already did their job well: the fundraising thermometer, the top fundraiser leaderboards, the event map, and the footer.</p>
          <p>Classy has no built-in feature for the parts between them, only a plain text block that accepts HTML and CSS, the only code it allows. I used that block to fill the gaps: sections that make the page feel like a celebration and give visitors a smoother path from landing to taking part.</p>
        </>}>
        <div className="island"><CpcTemplate /></div>
      </Room>

      <Room id="r-structure" n={3} name="The structure" title="A nav organized by how people get involved" how="Click a link in each year"
        intro={<p>The 2025 nav gave every option the same weight, and regional events had no link at all. In 2026 I grouped it by intent: Donate stays one tap away, Event Info answers &quot;what is this?&quot;, and Ways to Support opens everything else.</p>}>
        <Island id="cpc-sitemap" />
      </Room>

      <Room id="r-redesign" n={4} name="The redesign" title="Section by section, 2025 to 2026" how="Flip to 2026, then step lo-fi → mid-fi → hi-fi"
        intro={<p>The reviews pointed to four sections that needed immediate focus. I worked through each from lo-fi wireframes to mid-fi mockups to the live build.</p>}>
        <Island id="cpc-redesign" />
      </Room>

      <Room id="r-library" n={5} name="The workaround" title="One image library for seven campaigns" how="Pick a photo · gallery → image address → live page"
        intro={<p>The event runs on seven separate campaigns, and the platform&apos;s blocks can&apos;t style images inside custom sections. So I turned an unlisted campaign into a shared image library that every page pulls from, which kept one look across all seven.</p>}>
        <Island id="cpc-gallery" />
      </Room>

      <Room id="r-impact" n={6} name="The impact" title="The 40th, by the numbers"
        intro={<p>Event-wide results from a team effort, 2025 compared with 2026.</p>}>
        <div className="impact">
          <Tile><GoalRing raised={610} goal={625} cap="Raised toward the $625K goal for the 40th" /></Tile>
          <Tile>
            <Count to={7.6} prefix="+" suffix="%" dec={1} />
            <Bars rows={[{ label: "2025", w: 93, value: "$567K" }, { label: "2026", w: 100, value: "$610K", now: true }]} />
            <div className="cap">Raised, year over year</div>
          </Tile>
          <Tile>
            <Count to={4424} />
            <Bars rows={[{ label: "2025", w: 89, value: "3,924" }, { label: "2026", w: 100, value: "4,424", now: true }]} />
            <div className="cap">Registrations, up 12.7%</div>
          </Tile>
          <Tile>
            <div className="lbl" style={{ color: "var(--accent)" }}>Back to 01 · the sponsors</div>
            <Count to={234} prefix="$" suffix="K" />
            <Bars rows={[{ label: "2025", w: 73, value: "$170K" }, { label: "2026", w: 100, value: "$234K", now: true }]} />
            <div className="cap">In sponsorships, up 38%, with Waymo as the first-ever presenting sponsor. I built the sponsor deck and gave sponsors visibility across the site.</div>
          </Tile>
          <Tile wide>
            <div className="cpc-pair">
              <Count to={4135} />
              <div className="cap" style={{ alignSelf: "end" }}>Donations and sponsorships made through the website, up from 4,067 in 2025</div>
            </div>
          </Tile>
        </div>
      </Room>

      <Room id="r-next" n={7} name="What's next" last>
        <NextCard title="Close the last 2% and test with the people it's for">
          <p>The 40th landed at 98% of its goal. Next year I&apos;d add page-by-page analytics to see which paths lead to registration and gifts, test the site with screen-reader users and self-advocates, and turn the in-code styles into a documented template so the next site starts from a base instead of a blank grey box.</p>
        </NextCard>
      </Room>
    </>
  );
}
