"use client";

import { Entrance, Island, Zoom } from "./kit";

const GD = "/work/graphic-design";

function Piece({ title, note, impact, children }: { title: string; note: string; impact: string; children: React.ReactNode }) {
  return (
    <div className="gd-group">
      <div className="gd-title"><h4>{title}</h4><span>{note}</span></div>
      <p className="gd-impact">{impact}</p>
      {children}
    </div>
  );
}

/* The graphic design collection keeps its original layout, with no step rail. */
export default function CollectionExhibit() {
  return (
    <>
      <Entrance
        eyebrow="Collection · 2023–2026"
        title="Print, Signage & Graphic Design"
        lede="The offline half of the work, led by a hat: a sun drawn by an artist with I/DD, brought to life as merchandise and worn across Central Park."
        meta={[["Role", "Design, creative & copy direction"], ["Collaborators", "YAI Arts artists, graphic designers, MarComms"], ["Formats", "Merchandise, print, wayfinding, on-screen"], ["Years", "2023–2026"]]}
      />
      <section className="wall col">
        <div className="wall-no" style={{ paddingTop: 6 }}>Background</div>
        <div>
          <p>YAI exists to support people with intellectual and developmental disabilities, so the strongest design move is often to step back and let their work lead. The sun hat does exactly that. The rest of the pieces apply the same thinking as the websites: know who&apos;s looking, give them one clear thing to do, and keep everything in the same visual language.</p>
        </div>
      </section>
      <section className="gd-pieces">
        <div className="gd-head col"><div className="wall-no">Selected Pieces</div><span className="gd-rule" /></div>
        <Piece title="The sun hat" note="Central Park Challenge · 2023" impact="People with I/DD are too often overlooked. In my time at YAI, I've seen so much talent go unnoticed simply because someone is neurodiverse or communicates differently. This sun was drawn by an artist with I/DD from YAI Arts, YAI's studio for neurodiverse artists, and the hat was a way to put that talent on display. It was always there; I just helped bring it into the spotlight, keeping his linework, adding color from the event palette, and adapting it for embroidery. To produce the hats, I worked with Spectrum Designs, a custom apparel company that employs people with autism and shares our mission of building more inclusive spaces, so the hat was made by our community as well as for it. Worn across Central Park by participants, it put his art on the heads of the people who came to celebrate his community.">
          <Island id="sun-story" />
        </Piece>
        <Piece title="Poster & wayfinding" note="Central Park Challenge · 2026" impact="The poster puts the date, the place, and one call to action (free registration) on a single page, promoting a year with 4,424 registrants, up 12.7%. On the day, the booth map and directory groups 49 numbered locations into color-coded themes, with a QR code to download a copy, so attendees could find activities, restrooms, and the accessible ramp on their own.">
          <div className="pair2">
            <figure className="clean"><Zoom src={`${GD}/poster-2026.jpg`} alt="2026 Central Park Challenge 40th anniversary poster: Walk. Play. Dance." /><figcaption>40th anniversary poster</figcaption></figure>
            <figure className="clean"><Zoom src={`${GD}/booth-map.jpg`} alt="Booth map and directory with 49 numbered locations grouped by theme" /><figcaption>Booth map &amp; directory</figcaption></figure>
          </div>
        </Piece>
        <Piece title="On-site digital signage" note="Central Park Challenge · 2026" impact="Looping on 10-foot-plus screens around the event, these designs carried the day's advocacy message and a donate QR code, so event-day attention could turn into gifts.">
          <Island id="cpc-screens" />
        </Piece>
      </section>
    </>
  );
}
