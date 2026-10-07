"use client";

// Interactive pieces used inside case studies. Reference one from projects.ts
// with a gallery group like: { title: "...", demo: "cpc-redesign" }.

import CompareSwitch, { type ComparePair } from "./CompareSwitch";
import CpcRedesign from "./CpcRedesign";
import CpcSiteMap from "./CpcSiteMap";
import CpcGallery from "./CpcGallery";
import GiveTrifold from "./GiveTrifold";
import PainPalIdentity from "./PainPalIdentity";
import GolfNavDemo from "./GolfNavDemo";
import PainPalPrototype from "./PainPalPrototype";
import { PpProblem, PpResearch, PpFeatures, PpOnboarding } from "./PainPalStory";
import { GcGrowth, GcTiers } from "./GivingCircle";
import { SunStory, ScreenLoop } from "./Collection";

const KC = "/work/kevin-carey-legacy-golf-outing/compare";

const golfPairs: ComparePair[] = [
  {
    id: "hero",
    label: "Hero",
    title: "From somber to celebratory",
    before: "v1 set the logo over a dimmed, full-bleed photo. Dark and heavy, it leaned somber for an event meant to celebrate a life's work.",
    after: "v2 opens up into a bright collage in the signature leaf crop, framed in green. It honors Kevin and celebrates his legacy without feeling like a memorial.",
    beforeImg: `${KC}/hero-before.jpg`,
    afterImg: `${KC}/hero-after.jpg`,
    w: 1600,
    h: 990,
  },
  {
    id: "tickets",
    label: "Tickets",
    title: "Giving DSPs a seat at the table",
    before: "v1 listed prices in grey rows, with the DSP Awards Dinner as one more line item.",
    after: "v2 gives each ticket a photo card and a reason to come. The DSP Awards Dinner stands as an equal, first-class ticket, because the people it honors are the reason the day exists.",
    beforeImg: `${KC}/tickets-before.jpg`,
    afterImg: `${KC}/tickets-after.jpg`,
    w: 1600,
    h: 868,
  },
  {
    id: "sponsors",
    label: "Sponsors",
    title: "From a text link to a real invitation",
    before: "v1 tucked sponsorship into one sentence with an underlined link, above a photo on a solid green band. Easy for a partner to scroll past.",
    after: "v2 gives partners their own section: a leaf-cropped photo, a clear heading, a short case for why to sponsor, one Explore Sponsorships button, and a direct contact.",
    beforeImg: `${KC}/sponsor-cta-v1.jpg`,
    afterImg: `${KC}/sponsor-cta-v2.jpg`,
    w: 1600,
    h: 800,
  },
];

export const DEMO_IDS = ["cpc-redesign", "cpc-sitemap", "cpc-gallery", "golf-compare", "golf-nav", "painpal", "gc-growth", "gc-tiers", "sun-story", "cpc-screens", "give-trifold", "pp-identity", "pp-problem", "pp-research", "pp-features", "pp-onboarding"] as const;
export type DemoId = (typeof DEMO_IDS)[number];

export default function Demo({ id }: { id: DemoId }) {
  switch (id) {
    case "cpc-redesign":
      return <CpcRedesign />;
    case "cpc-sitemap":
      return <CpcSiteMap />;
    case "cpc-gallery":
      return <CpcGallery />;
    case "golf-compare":
      return <CompareSwitch pairs={golfPairs} beforeLabel="V1" afterLabel="V2 redesign" />;
    case "golf-nav":
      return <GolfNavDemo />;
    case "painpal":
      return <PainPalPrototype />;
    case "gc-growth":
      return <GcGrowth />;
    case "gc-tiers":
      return <GcTiers />;
    case "sun-story":
      return <SunStory />;
    case "cpc-screens":
      return <ScreenLoop />;
    case "give-trifold":
      return <GiveTrifold />;
    case "pp-identity":
      return <PainPalIdentity />;
    case "pp-problem":
      return <PpProblem />;
    case "pp-research":
      return <PpResearch />;
    case "pp-features":
      return <PpFeatures />;
    case "pp-onboarding":
      return <PpOnboarding />;
  }
}
