"use client";

import { useState } from "react";
import { Bars, Count, Entrance, NextCard, Room, Tile, Zoom, reduced } from "./kit";

const GC = "/work/giving-circle";

const TIERS = [
  { name: "Friend", amount: 10, perks: ["Welcome email", "Digital impact report", "Postcards featuring YAI artists’ work"], img: `${GC}/postcard.png`, cap: "Postcards featuring art by Jimmy Tucker", alt: "Postcard mockup with Jimmy Tucker’s painting on the front and a Giving Circle thank-you on the back" },
  { name: "Supporter", amount: 25, perks: ["Exclusive baseball cap"], img: `${GC}/hat.png`, cap: "“This hat changes everything”", alt: "Giving Circle baseball cap" },
  { name: "Partner", amount: 50, perks: ["T-shirt and tote bag"], img: `${GC}/tote.png`, cap: "“This bag changes everything”", alt: "Giving Circle tote bag" },
  { name: "Champion", amount: 100, perks: ["Framed artwork by a YAI artist"], img: `${GC}/artwork-lauren.jpg`, cap: "Framed original art: Birds of NY by Lauren M.", alt: "Birds of NY by Lauren M.: hand-drawn New York birds around the Empire State Building" },
  { name: "Ambassador", amount: 250, perks: ["Invitations to YAI donor events", "Personalized video thank-you from leadership"], img: `${GC}/donor-event.jpg`, cap: "Invitations to events like the Central Park Challenge", alt: "The YAI tent above a crowd at the Central Park Challenge" },
];

function Tiers() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const [fade, setFade] = useState(false);
  const pick = (k: number) => {
    setI(k);
    if (reduced()) { setShown(k); return; }
    setFade(true);
    setTimeout(() => { setShown(k); setFade(false); }, 180);
  };
  const t = TIERS[i], img = TIERS[shown];
  return (
    <div className="tiers">
      <div className="tier-row" role="group" aria-label="Giving levels">
        {TIERS.map((x, k) => (
          <button key={x.name} type="button" aria-pressed={k === i} className={k < i ? "inc" : ""} onClick={() => pick(k)}>
            <b className="tab">${x.amount}</b><span>{x.name}</span>
          </button>
        ))}
      </div>
      <div className="tier-stage">
        <div className="tier-img"><Zoom src={img.img} alt={img.alt} className={fade ? "swap" : ""} /></div>
        <div className="tier-info">
          <div className="lbl">{t.name}</div>
          <div className="tier-amt tab">${t.amount} <small>a month</small></div>
          <ul>
            {TIERS.slice(0, i + 1).flatMap((x, k) => x.perks.map((p) => <li key={p} className={k === i ? "new" : ""}>{p}</li>))}
          </ul>
          <p className="fine" style={{ marginTop: 12 }}>{t.cap}</p>
        </div>
      </div>
    </div>
  );
}

export default function GivingCircleExhibit() {
  return (
    <>
      <Entrance
        eyebrow="Shipped · YAI · 2026 · Program launch"
        title="Giving Circle"
        lede="Pitching and launching a recurring giving program, and laying the groundwork for it to scale."
        meta={[["Role", "Program strategy, incentive & merch design, pitch"], ["Platform", "GoFundMe Pro (Classy)"], ["Stage", "New initiative, launched Feb 2026"], ["Goal", "50–100 monthly donors by Feb 2027"]]}
        cover={{ src: `${GC}/cover-key.jpg`, alt: "Giving Circle, a monthly giving program: a supporter takes a selfie with her dog at a YAI event, framed in an orange circle" }}
      />

      <Room id="r1" n={1} name="The problem" title="Not another subscription"
        intro={<>
          <p>Most of YAI&apos;s fundraising happens in big moments: a signature event, a year-end appeal. Recurring gifts are steadier and compound over time, but before launch only a handful of people gave monthly.</p>
          <p>Monthly programs often count on people signing up and forgetting. I wanted the opposite: a program that gives members reasons to stay engaged and shows more people what YAI does.</p>
        </>}>
        <div className="impact">
          <Tile><div className="lbl">Before launch</div><Count to={7} /><div className="cap">People giving monthly</div></Tile>
          <Tile><div className="lbl">Before launch</div><Count to={864} prefix="$" /><div className="cap">Given each month, in total</div></Tile>
        </div>
      </Room>

      <Room id="r2" n={2} name="The tiers" title="Every level adds one gift" how="Pick a level to see what it unlocks"
        intro={<p>Five clear tiers, from $10 to $250 a month. Every thank-you keeps members connected to the work, and each level adds one gift, so moving up always feels worthwhile. Each gift was mocked up and costed so the incentives stay sustainable.</p>}>
        <Tiers />
      </Room>

      <Room id="r3" n={3} name="The impact" title="Early days, encouraging signs"
        intro={<p>Early numbers from a program still in its first year.</p>}>
        <div className="impact">
          <Tile>
            <Count to={71} prefix="+" suffix="%" />
            <Bars rows={[{ label: "Launch", w: 58, value: "7" }, { label: "Now", w: 100, value: "12", now: true }]} />
            <div className="cap">Recurring donors</div>
          </Tile>
          <Tile>
            <Count to={15} prefix="+" suffix="%" />
            <Bars rows={[{ label: "Launch", w: 87, value: "$864" }, { label: "Now", w: 100, value: "$993", now: true }]} />
            <div className="cap">Monthly recurring revenue</div>
          </Tile>
          <Tile><Count to={11.9} prefix="$" suffix="K" dec={1} /><div className="cap">Annual recurring revenue</div></Tile>
          <Tile>
            <Count to={82.78} prefix="$" dec={2} />
            <Bars rows={[{ label: "Entry", w: 12, value: "$10" }, { label: "Average", w: 100, value: "$82.78", now: true }]} />
            <div className="cap">Average monthly gift, well above the $10 entry tier</div>
          </Tile>
        </div>
      </Room>

      <Room id="r4" n={4} name="What's next" last>
        <NextCard title="Bring it to the donors who already show up">
          <p>12 donors is a small sample, but the average gift suggests donors are choosing higher levels rather than the minimum. The next stage is reach: bringing the Giving Circle to Central Park Challenge and year-end donors, and inviting one-time donors to become monthly ones. At today&apos;s average gift, every 10 new members adds roughly $10K a year.</p>
        </NextCard>
      </Room>
    </>
  );
}
