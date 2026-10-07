"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

/* Central Park Challenge navigation, 2025 → 2026.
   Pick how you want to get involved; the nav shows the path in either year and
   draws a line to the campaign page it leads to. Colors follow the CPC brand guide. */

const NAVY = "#1B4472";
const AMBER = "#F7941D";
const MUL = { fontFamily: "Mulish, ui-sans-serif, system-ui, sans-serif" };

type PageId = "donate" | "info" | "fundraise" | "volunteer" | "sponsor" | "regional" | "share";
const PAGES: { id: PageId; label: string; color: string }[] = [
  { id: "donate", label: "Donate", color: AMBER },
  { id: "info", label: "Event Info", color: NAVY },
  { id: "fundraise", label: "Fundraise", color: "#009245" },
  { id: "volunteer", label: "Volunteer", color: "#00A1D0" },
  { id: "sponsor", label: "Sponsorships", color: "#F26322" },
  { id: "regional", label: "Regional Events", color: "#F7CB2D" },
  { id: "share", label: "Spread the Word", color: "#58C4E6" },
];

// 2025: one flat row, every link the same weight. Regional events had no link.
const NAV25: { key: string; label: string; page: PageId }[] = [
  { key: "details", label: "Event Details", page: "info" },
  { key: "register", label: "Register", page: "info" },
  { key: "fundraise", label: "Fundraise", page: "fundraise" },
  { key: "sponsor", label: "Sponsorship Opportunities", page: "sponsor" },
  { key: "share", label: "Spread the Word", page: "share" },
  { key: "volunteer", label: "Volunteer", page: "volunteer" },
];
// 2026: Donate, Event Info, and a dropdown grouped by how people want to help.
const DROP26: { key: string; label: string; page: PageId }[] = [
  { key: "fundraise", label: "Fundraise", page: "fundraise" },
  { key: "volunteer", label: "Volunteer", page: "volunteer" },
  { key: "sponsor", label: "Sponsorships", page: "sponsor" },
  { key: "regional", label: "Regional Events", page: "regional" },
  { key: "share", label: "Spread the Word", page: "share" },
];

type Goal = { id: string; label: string; page: PageId; k25: string | null; k26: string; p25: string; p26: string };
const GOALS: Goal[] = [
  { id: "learn", label: "Learn about the event", page: "info", k25: "details", k26: "info", p25: "Find “Event Details” among seven equal links.", p26: "Event Info, one of three top-level choices." },
  { id: "walk", label: "Sign up to walk", page: "info", k25: "register", k26: "info", p25: "“Register” sits beside “Event Details” as a separate link.", p26: "Event Info: the details and registration live together on one page." },
  { id: "give", label: "Donate", page: "donate", k25: "donate", k26: "donate", p25: "The orange Donate button, already the clearest action.", p26: "Unchanged on purpose: the one bright button, on every page." },
  { id: "fundraise", label: "Fundraise", page: "fundraise", k25: "fundraise", k26: "fundraise", p25: "Scan seven equal links for “Fundraise.”", p26: "Ways to Support ▾ → Fundraise." },
  { id: "volunteer", label: "Volunteer", page: "volunteer", k25: "volunteer", k26: "volunteer", p25: "The last of seven links, at the far end of the bar.", p26: "Ways to Support ▾ → Volunteer." },
  { id: "sponsor", label: "Sponsor", page: "sponsor", k25: "sponsor", k26: "sponsor", p25: "“Sponsorship Opportunities,” the longest label in a crowded row.", p26: "Ways to Support ▾ → Sponsorships." },
  { id: "regional", label: "Attend a regional event", page: "regional", k25: null, k26: "regional", p25: "No link at all. Regional events weren't in the 2025 nav.", p26: "Ways to Support ▾ → Regional Events, a new path." },
  { id: "share", label: "Spread the word", page: "share", k25: "share", k26: "share", p25: "Scan seven equal links for “Spread the Word.”", p26: "Ways to Support ▾ → Spread the Word." },
];

export default function CpcSiteMap() {
  const [is26, setIs26] = useState(false); // open on the problem; one flip shows the fix
  const [goalId, setGoalId] = useState("volunteer");
  const [open, setOpen] = useState(true); // 2026 dropdown
  const [touched, setTouched] = useState(false);
  const goal = GOALS.find((g) => g.id === goalId)!;
  const inGroup = DROP26.some((d) => d.key === goal.k26);
  const inDrop = is26 && open && inGroup;
  // where the line starts: the clicked link, or "Ways to Support" when its menu is closed
  const key = is26 ? (inGroup && !open ? "support" : goal.k26) : goal.k25;

  const pick25 = (k: string) => {
    setTouched(true);
    setGoalId(GOALS.find((g) => g.k25 === k)!.id);
  };
  const pick26 = (k: string) => {
    setTouched(true);
    setGoalId(GOALS.find((g) => g.k26 === k)!.id);
    if (!DROP26.some((d) => d.key === k)) setOpen(false);
  };
  const toggleMenu = () => {
    setTouched(true);
    setOpen((o) => !o);
  };
  const page = PAGES.find((p) => p.id === goal.page)!;

  const wrap = useRef<HTMLDivElement>(null);
  const from = useRef<Record<string, HTMLElement | null>>({});
  const to = useRef<Record<string, HTMLElement | null>>({});
  const [line, setLine] = useState<string | null>(null);

  const measure = useCallback(() => {
    const box = wrap.current?.getBoundingClientRect();
    const a = key ? from.current[`${is26 ? "26" : "25"}-${key}`]?.getBoundingClientRect() : undefined;
    const b = to.current[goal.page]?.getBoundingClientRect();
    if (!box || !a || !b) return setLine(null);
    const x2 = b.left + b.width / 2 - box.left, y2 = b.top - box.top - 4;
    if (inDrop) {
      // leave the dropdown item from its left edge, then curve down to the page
      const x1 = a.left - box.left - 4, y1 = a.top + a.height / 2 - box.top;
      if (x2 > x1 - 20) {
        // page sits under the dropdown: drop straight down past the panel
        const xL = x1 - 28;
        return setLine(`M${x1},${y1} C${xL},${y1} ${xL},${y1} ${xL},${y1 + 30} L${xL},${y2 - 34} C${xL},${y2 - 12} ${x2},${y2 - 26} ${x2},${y2}`);
      }
      return setLine(`M${x1},${y1} C${x2},${y1} ${x2},${y1} ${x2},${y2}`);
    }
    const x1 = a.left + a.width / 2 - box.left, y1 = a.bottom - box.top + 3;
    const my = (y1 + y2) / 2;
    setLine(`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`);
  }, [key, is26, goal.page, inDrop]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [measure]);

  const ref = (id: string) => (el: HTMLElement | null) => {
    from.current[id] = el;
  };
  const hl = (k: string) => k === key;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#b4b4bb]">Click the nav like a visitor would. Each link leads to a separate campaign page.</p>
        <button type="button" role="switch" aria-checked={is26} onClick={() => setIs26((v) => !v)} className="flex items-center gap-3">
          <span className={"font-mono text-xs " + (is26 ? "text-[#888890]" : "text-white")}>2025</span>
          <span className={"relative w-14 h-8 rounded-full transition-colors " + (is26 ? "bg-[var(--accent)]" : "bg-white/15")}>
            <span className={"absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-300 " + (is26 ? "translate-x-6" : "")} />
          </span>
          <span className={"font-mono text-xs " + (is26 ? "text-white" : "text-[#888890]")}>2026 redesign</span>
        </button>
      </div>
      {/* Stage */}
      <div ref={wrap} className="relative isolate rounded-lg bg-white p-3 sm:p-6" style={MUL}>
        {/* Nav bar */}
        <div className="relative z-10 rounded-md bg-white shadow-[0_2px_10px_rgba(27,68,114,0.12)] px-3 sm:px-5 py-2.5 flex items-center justify-between gap-3">
          <button
            type="button"
            ref={ref(is26 ? "26-donate" : "25-donate")}
            onClick={() => (is26 ? pick26("donate") : pick25("donate"))}
            aria-pressed={hl("donate")}
            className="shrink-0 px-4 py-1.5 rounded-full text-[13px] font-extrabold text-white transition hover:brightness-105"
            style={{ background: AMBER, outline: hl("donate") ? `3px solid ${NAVY}` : undefined, outlineOffset: 2 }}
          >
            Donate
          </button>
          {is26 ? (
            <div className="flex items-center gap-4 sm:gap-7 text-[13px] sm:text-sm font-extrabold">
              <button type="button" ref={ref("26-info")} onClick={() => pick26("info")} aria-pressed={hl("info")} className="underline-offset-4 decoration-2 hover:underline" style={{ color: NAVY, textDecorationLine: hl("info") ? "underline" : undefined }}>
                Event Info
              </button>
              <button
                type="button"
                ref={ref("26-support")}
                onClick={toggleMenu}
                aria-expanded={open}
                aria-haspopup="true"
                className={"relative whitespace-nowrap transition-colors rounded-md " + (!touched ? "nav-hint px-1 -mx-1" : "")}
                style={{ color: open || hl("support") ? AMBER : NAVY }}
              >
                Ways to Support <span className={"inline-block transition-transform " + (open ? "rotate-180" : "")}>▾</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-x-3 sm:gap-x-5 gap-y-1 text-[11px] sm:text-[13px]" style={{ color: "#333" }}>
              {NAV25.map((n) => (
                <button
                  type="button"
                  key={n.key}
                  ref={ref(`25-${n.key}`)}
                  onClick={() => pick25(n.key)}
                  aria-pressed={hl(n.key)}
                  className="whitespace-nowrap rounded px-1 transition-colors hover:bg-[#F3F5F8]"
                  style={hl(n.key) ? { background: "#FFF1DD", color: NAVY, fontWeight: 800 } : undefined}
                >
                  {n.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dropdown area (reserved height so the layout doesn't jump between years) */}
        <div className={"relative sm:h-[212px] " + (is26 ? "h-[176px]" : "h-12")}>
          <div
            className="absolute right-1 sm:right-3 top-2 z-10 w-[170px] sm:w-[190px] rounded-xl bg-white shadow-[0_8px_24px_rgba(27,68,114,0.16)] border border-[#EEF1F5] py-2 transition-all duration-300"
            style={{ opacity: is26 && open ? 1 : 0, transform: is26 && open ? "none" : "translateY(-6px)", pointerEvents: is26 && open ? "auto" : "none" }}
            aria-hidden={!(is26 && open)}
          >
            {DROP26.map((d) => (
              <button
                type="button"
                key={d.key}
                ref={ref(`26-${d.key}`)}
                onClick={() => pick26(d.key)}
                tabIndex={is26 && open ? 0 : -1}
                aria-pressed={hl(d.key)}
                className="block w-[calc(100%-16px)] text-left mx-2 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-colors hover:bg-[#F3F6FA]"
                style={{ color: NAVY, background: hl(d.key) ? "#EEF4FA" : undefined }}
              >
                {d.label}
              </button>
            ))}
          </div>
          {!is26 && (
            <div className="absolute left-1 top-4 text-[11px] font-mono" style={{ color: "#8A97A8" }}>
              No grouping: every link is the same weight
            </div>
          )}
        </div>

        {/* Connector */}
        <svg className="hidden sm:block absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {line && <path d={line} fill="none" stroke={page.color} strokeWidth={3} strokeDasharray="6 6" className="sm-flow" />}
        </svg>

        {/* Campaign pages */}
        <div className="flex flex-wrap gap-2">
          {PAGES.map((p) => {
            const on = p.id === goal.page && !!key;
            const missing = p.id === "regional" && !is26;
            return (
              <div
                key={p.id}
                ref={(el) => {
                  to.current[p.id] = el;
                }}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:text-[12px] font-bold transition-all duration-200"
                style={{
                  color: on ? (p.id === "regional" ? NAVY : "#fff") : NAVY,
                  background: on ? p.color : "#fff",
                  borderColor: on ? p.color : "#DCE3EC",
                  borderStyle: missing ? "dashed" : "solid",
                  opacity: missing ? 0.4 : on ? 1 : 0.85,
                  transform: on ? "translateY(-2px)" : undefined,
                  boxShadow: on ? "0 6px 14px rgba(27,68,114,0.18)" : undefined,
                }}
                title={missing ? "No nav link in 2025" : undefined}
              >
                <i className="w-2 h-2 rounded-full" style={{ background: on ? "rgba(255,255,255,0.85)" : p.color }} />
                {p.label}
                {missing && <span className="font-mono font-normal text-[10px]">· no link</span>}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] font-mono" style={{ color: "#51606F" }}>
          GoFundMe Pro · 7 separate campaigns · one custom HTML/CSS nav repeated on each
        </p>
      </div>

      {/* Readout */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-live="polite">
        {[
          { yr: "2025", text: goal.p25, on: !is26 },
          { yr: "2026", text: goal.p26, on: is26 },
        ].map((r) => (
          <div key={r.yr} className={"transition-opacity " + (r.on ? "opacity-100" : "opacity-45")}>
            <div className="text-[11px] font-mono uppercase tracking-wider" style={{ color: r.on ? "var(--accent)" : "#888890" }}>
              {r.yr}
            </div>
            <p className="text-sm text-[#d1d1d6] mt-1">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
