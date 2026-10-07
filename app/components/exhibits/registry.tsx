import type { ReactNode } from "react";
import CpcExhibit from "./CpcExhibit";
import GolfExhibit from "./GolfExhibit";
import GiveExhibit from "./GiveExhibit";
import GivingCircleExhibit from "./GivingCircleExhibit";
import PainPalExhibit from "./PainPalExhibit";
import CollectionExhibit from "./CollectionExhibit";

/* Which exhibit each project opens. Add a new case study here. */
export const EXHIBITS: Record<string, () => ReactNode> = {
  "central-park-challenge": () => <CpcExhibit />,
  "kevin-carey-legacy-golf-outing": () => <GolfExhibit />,
  "give-2025": () => <GiveExhibit />,
  "giving-circle": () => <GivingCircleExhibit />,
  painpal: () => <PainPalExhibit />,
  "print-signage-graphic-design": () => <CollectionExhibit />,
};
