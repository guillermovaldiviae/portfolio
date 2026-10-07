"use client";

import { Entrance, Figure, Island, NextCard, Room } from "./kit";

const PP = "/work/painpal";

export default function PainPalExhibit() {
  return (
    <>
      <Entrance
        eyebrow="Concept · Academic project · Mobile app"
        title="PainPal"
        lede="Turning the day-to-day work of managing chronic pain into something simple, insightful, and easier to share with a doctor."
        meta={[["Role", "Pain tracking & personalized insights, low-fi prototypes, final UI"], ["Type", "Academic team project"], ["Methods", "Personas, Crazy 8s, think-aloud testing, GP review"], ["Platform", "iOS mobile app"]]}
        cover={{ src: `${PP}/hero-screens.jpg`, alt: "Five PainPal screens: body map, pain diary, home dashboard, describe your pain, and chats" }}
      />

      <Room id="r1" n={1} name="The problem" title="Every extra tap is a cost" how="Pick a requirement"
        intro={<p>Chronic pain affects roughly one in five people worldwide. Apps exist to help, but they&apos;re often expensive and vary widely. People living with it are often tired, hurting, and short on patience, so logging had to be fast enough to do in the moment.</p>}>
        <Island id="pp-problem" />
      </Room>

      <Room id="r2" n={2} name="The research" title="Meet Ollie" how="Open each part of Ollie's profile"
        intro={<p>After reviewing medical journals, case studies, and patient experiences shared on health forums, we built personas. Ollie Jones, a 25-year-old student with chronic back pain, became the person we designed for.</p>}>
        <Island id="pp-research" />
      </Room>

      <Room id="r3" n={3} name="The features" title="Dozens of ideas, three features" how="Flip the switches, then try each feature"
        intro={<p>Crazy 8s and a feasibility-relevance matrix narrowed dozens of ideas to three core features. I focused on tracking and insights, built the low-fidelity prototypes, and designed the final UI for tracking and insights.</p>}>
        <Island id="pp-features" />
        <div style={{ marginTop: 28 }}>
          <Figure src={`${PP}/wireframes.jpg`} alt="Board of low- and mid-fidelity wireframes, pain scale explorations, icon samples, app icons, and body diagrams" caption="Wireframes & prototypes, low to mid fidelity · click to enlarge" />
        </div>
      </Room>

      <Room id="r4" n={4} name="The onboarding" title="One question per screen" how="Tap Get Started"
        intro={<p>Eight short steps, each asking one thing, with &quot;Skip&quot; and contextual hints throughout so logging stays quick even on a bad day. Tap Get Started and go through it yourself, or jump to any screen.</p>}>
        <Island id="pp-onboarding" />
      </Room>

      <Room id="r5" n={5} name="The prototype" title="Tap through the app" how="Report pain, then tap the body"
        intro={<p>Press + to report pain. On the body map, every area can be selected on its own, front and back: each shoulder, arm, hand, thigh, knee, shin and foot. Hover the figure to see them all, then tap the ones that hurt.</p>}>
        <Island id="painpal" />
      </Room>

      <Room id="r6" n={6} name="The identity" title="Friendly on a bad day" how="App icon, icons, color & type · tap the icon"
        intro={<p>The app icon, icons, color and type were chosen to feel calm and approachable, so opening the app never feels clinical.</p>}>
        <Island id="pp-identity" />
      </Room>

      <Room id="r7" n={7} name="Testing & result" last>
        <NextCard title="Think-aloud, then a doctor's eye">
          <p>We ran usability tests using a think-aloud protocol, covering onboarding, recording pain, and exploring insights. A general practitioner then reviewed the prototype and highlighted its potential to help recognize pain patterns, support earlier intervention through detailed logs, and reduce stigma with a friendly, privacy-conscious design. They suggested integration with healthcare systems and expanding to other conditions.</p>
          <p>The result: one friendly place to track, understand, and act on pain, refined around three priorities: simplicity, personalization, and data privacy.</p>
          <p className="fine" style={{ marginTop: 6 }}>
            Sources:{" "}
            <a className="jump" href="https://bmcpublichealth.biomedcentral.com/articles/10.1186/1471-2458-11-770" target="_blank" rel="noreferrer">Goldberg &amp; McGee (2011), BMC Public Health</a>
            {" · "}
            <a className="jump" href="https://pubmed.ncbi.nlm.nih.gov/27418853/" target="_blank" rel="noreferrer">Economic and social burden of chronic pain (PubMed)</a>
          </p>
        </NextCard>
      </Room>
    </>
  );
}
