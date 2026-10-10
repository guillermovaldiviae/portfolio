"use client";

import { useState } from "react";

/* Central Park Challenge navigation, 2025 → 2026.
   Two bars of the same width, stacked. Click a link and a readout explains how it
   works and what the page holds. In 2026, Ways to Support expands the bar in place
   to show its five options. Colors follow the CPC brand guide. */

const NAVY = "#1B4472";
const AMBER = "#F7941D";
const SOFT = "#51606F";
const RULE = "#E3E8EF";
const MUL = { fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif" };

type Item = { k: string; label: string; how: string; strong: string; page: string[]; sub?: string; isNew?: boolean };

// 2025: one flat row, every link the same weight. Regional events had no link.
const NAV25: Item[] = [
  { k: "donate", label: "Donate", how: "The orange button, on every page.", strong: "Opens the donation form.", page: ["Gift amount", "Payment", "Confirmation"] },
  { k: "details", label: "Event Details", how: "A plain text link.", strong: "Goes to the main event page.", page: ["Date & location", "Schedule", "FAQ"] },
  { k: "register", label: "Register", how: "A separate link from Event Details.", strong: "Opens registration on its own page.", page: ["Choose a ticket", "Participant info", "Checkout"] },
  { k: "fundraise", label: "Fundraise", how: "A plain text link.", strong: "Goes to the fundraising campaign.", page: ["Start a personal page", "Join or create a team", "Leaderboard"] },
  { k: "sponsor", label: "Sponsorship Opportunities", how: "The longest label in the row.", strong: "Goes to the sponsorship campaign.", page: ["Sponsorship levels", "Benefits", "Contact"] },
  { k: "share", label: "Spread the Word", how: "A plain text link.", strong: "Goes to the sharing resources.", page: ["Social graphics", "Sample posts", "Flyers"] },
  { k: "volunteer", label: "Volunteer", how: "The last link, at the far end of the bar.", strong: "Goes to volunteer sign-up.", page: ["Roles", "Shifts", "Sign-up form"] },
];

// 2026: Donate, Event Info, and Ways to Support, which expands to five options.
const TOP26: Item[] = [
  { k: "donate", label: "Donate", how: "Unchanged on purpose: the one bright button, on every page.", strong: "Opens the donation form.", page: ["Gift amount", "Payment", "Confirmation"] },
  { k: "info", label: "Event Info", how: "One of three top-level choices.", strong: "Details and registration now live together on one page.", page: ["Date & location", "Activities", "Register"] },
  { k: "support", label: "Ways to Support", how: "", strong: "Expands the bar to show five ways to get involved, grouped in one place instead of spread across the row.", page: ["Fundraise", "Volunteer", "Sponsorships", "Regional Events", "Spread the Word"] },
];
const DROP26: Item[] = [
  { k: "fundraise", label: "Fundraise", sub: "Raise money with a personal or team page", how: "Ways to Support ▾ → Fundraise.", strong: "Goes to the fundraising campaign.", page: ["Start a personal page", "Join or create a team", "Leaderboard"] },
  { k: "volunteer", label: "Volunteer", sub: "Help out on event day", how: "Ways to Support ▾ → Volunteer.", strong: "Goes to volunteer sign-up.", page: ["Why volunteer", "Roles", "Sign Up"] },
  { k: "sponsor", label: "Sponsorships", sub: "Partner with the 40th", how: "Ways to Support ▾ → Sponsorships, now its own page.", strong: "Makes the sponsor case up front.", page: ["Why sponsor", "Sponsorship levels", "Contact"] },
  { k: "regional", label: "Regional Events", sub: "Celebrate closer to home", isNew: true, how: "A new path in 2026.", strong: "Links to the regional events that had no place in the 2025 nav.", page: ["Locations", "Dates", "Register"] },
  { k: "share", label: "Spread the Word", sub: "Share the event with your network", how: "Ways to Support ▾ → Spread the Word.", strong: "Goes to the sharing resources.", page: ["Social graphics", "Sample posts", "Flyers"] },
];

function Readout({ item }: { item: Item }) {
  return (
    <div key={item.k} className="mt-3.5 pt-3.5 grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-x-6 gap-y-3 items-start min-h-[84px]" style={{ borderTop: `1px solid ${RULE}` }} aria-live="polite">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: SOFT }}>How it works</div>
        <p className="text-[15px] leading-normal" style={{ color: "#1b2a3a" }}>
          {item.how && <>{item.how} </>}
          <b style={{ color: NAVY }}>{item.strong}</b>
        </p>
      </div>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: SOFT }}>On the page</div>
        <ol className="flex flex-wrap gap-1.5">
          {item.page.map((p, i) => (
            <li key={p} className="text-[12.5px] font-bold rounded-full px-2.5 py-1" style={{ color: NAVY, background: "#F3F6FA", border: `1px solid ${RULE}` }}>
              <span className="font-semibold mr-1" style={{ color: "#8A97A8" }}>{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function DonateButton({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="shrink-0 px-[18px] py-2 rounded-full text-[13px] font-extrabold text-white transition hover:brightness-105"
      style={{ background: AMBER, outline: on ? `3px solid ${NAVY}` : undefined, outlineOffset: 2 }}
    >
      Donate
    </button>
  );
}

const BAR = "rounded-lg bg-white shadow-[0_2px_10px_rgba(27,68,114,0.12)] px-3 sm:px-[18px] py-2.5 min-h-[52px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3";

export default function CpcSiteMap() {
  const [k25, setK25] = useState("details");
  const [k26, setK26] = useState("info");
  const [open, setOpen] = useState(false);

  const item25 = NAV25.find((n) => n.k === k25)!;
  const item26 = [...TOP26, ...DROP26].find((n) => n.k === k26)!;
  const inMenu = (k: string) => DROP26.some((d) => d.k === k);

  const pickTop = (k: string) => {
    setK26(k);
    setOpen(false);
  };
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !inMenu(k26)) setK26("support");
  };

  return (
    <div className="space-y-7" style={MUL}>
      {/* 2025 */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-3" style={{ fontFamily: "var(--sans)" }}>
          <b className="text-xs font-semibold uppercase tracking-[0.08em] text-[#888890]">2025</b>
          <span className="text-[13px] text-[#888890]">Seven links, all the same weight</span>
        </div>
        <div className="rounded-xl bg-white p-3 sm:p-[22px]">
          <div className={BAR}>
            <DonateButton on={k25 === "donate"} onClick={() => setK25("donate")} />
            <div className="flex flex-wrap justify-start sm:justify-end gap-x-1 sm:gap-x-3 gap-y-1">
              {NAV25.filter((n) => n.k !== "donate").map((n) => (
                <button
                  type="button"
                  key={n.k}
                  onClick={() => setK25(n.k)}
                  aria-pressed={k25 === n.k}
                  className="whitespace-nowrap rounded-md px-[7px] py-[5px] text-[13px] font-semibold transition-colors hover:bg-[#F3F5F8]"
                  style={k25 === n.k ? { background: "#FFF1DD", color: NAVY, fontWeight: 800 } : { color: "#333" }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <Readout item={item25} />
          <p className="mt-2.5 text-xs" style={{ color: "#8A97A8" }}>Not in the nav: Regional Events had no link in 2025.</p>
        </div>
      </div>

      {/* 2026 */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-3" style={{ fontFamily: "var(--sans)" }}>
          <b className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--accent)" }}>2026 redesign</b>
          <span className="text-[13px] text-[#888890]">Three choices, the rest grouped under one menu</span>
        </div>
        <div className="rounded-xl bg-white p-3 sm:p-[22px]">
          <div className={BAR}>
            <DonateButton on={k26 === "donate"} onClick={() => pickTop("donate")} />
            <div className="flex items-center gap-4 sm:gap-7 text-sm font-extrabold">
              <button
                type="button"
                onClick={() => pickTop("info")}
                aria-pressed={k26 === "info"}
                className="underline-offset-[5px] decoration-2 hover:underline"
                style={{ color: NAVY, textDecorationLine: k26 === "info" ? "underline" : undefined }}
              >
                Event Info
              </button>
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                aria-controls="cpc-support-menu"
                className="whitespace-nowrap inline-flex items-center gap-1.5 transition-colors"
                style={{ color: open ? AMBER : NAVY }}
              >
                Ways to Support <span className={"inline-block transition-transform duration-300 " + (open ? "rotate-180" : "")}>▾</span>
              </button>
            </div>
          </div>

          {/* The bar's own interaction area expands to hold the menu */}
          <div className="grid transition-[grid-template-rows] duration-[380ms] ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
            <div className="overflow-hidden">
              <div id="cpc-support-menu" className="mt-2.5 rounded-[10px] p-2.5 grid grid-cols-2 sm:grid-cols-5 gap-2" style={{ border: `1px solid ${RULE}` }}>
                <div className="col-span-full text-[11px] font-bold uppercase tracking-[0.08em] px-1 pb-1" style={{ color: SOFT }}>Ways to Support</div>
                {DROP26.map((d) => {
                  const on = k26 === d.k;
                  return (
                    <button
                      type="button"
                      key={d.k}
                      onClick={() => setK26(d.k)}
                      tabIndex={open ? 0 : -1}
                      aria-pressed={on}
                      className="relative min-w-0 text-left rounded-lg p-3 grid gap-1 transition-colors hover:border-[#b9c8da]"
                      style={{ border: `1px solid ${on ? NAVY : RULE}`, background: on ? "#EEF4FA" : "#fff", color: NAVY }}
                    >
                      {d.isNew && <span className="absolute top-2 right-2 text-[10px] font-extrabold tracking-[0.06em] text-white rounded px-1.5" style={{ background: AMBER }}>NEW</span>}
                      <b className="text-sm font-extrabold">{d.label}</b>
                      <small className="text-[11.5px] leading-snug" style={{ color: SOFT }}>{d.sub}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Readout item={item26} />
        </div>
      </div>
    </div>
  );
}
