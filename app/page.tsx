import SelectedWork from "./components/SelectedWork";
import LocalInfo from "./components/LocalInfo";
import NowCards from "./components/NowCards";
import ArrowUpRight from "./components/ArrowUpRight";
import NameLockup from "./components/NameLockup";
import PhotoCollage from "./components/PhotoCollage";
import { ScrollReveal, ScrollWords, Words } from "./components/ScrollEffects";

// The landing page uses the whole screen on a 12-column grid: section labels sit in the
// first two columns, content in the rest. Layout classes (.home-*) live in globals.css.
const pill = "hl-outline group inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#EDEDEF] font-sans overflow-x-clip">
      <ScrollReveal />

      {/* Header Bar */}
      <header className="home-bar">
        <div className="home-wrap home-bar-in">
          <LocalInfo />
          <nav>
            <a href="#about" className="accent-cyan hl-pill text-[#888890]">About</a>
            <a href="#projects" className="accent-magenta hl-pill text-[#888890]">Work</a>
            <a href="#connect" className="accent-yellow hl-pill text-[#888890]">Connect</a>
          </nav>
        </div>
      </header>

      {/* Name — fills the width of the screen; hover it for the accent colors (components/NameLockup.tsx) */}
      <section id="top" className="home-wrap home-hero">
        <NameLockup />
      </section>
      <div className="home-wrap">
        <div className="home-grid home-sub">
          <p className="reveal">A little about me + what I do</p>
        </div>
      </div>

      {/* Photo collage — photos are listed in app/collage.ts */}
      <section className="home-wrap">
        <PhotoCollage />
      </section>

      {/* About — the text brightens word by word as you scroll */}
      <section id="about" className="home-wrap home-sec">
        <div className="home-grid">
          <div className="home-lbl reveal">About</div>
          <ScrollWords className="home-about">
            <p className="reveal">
              <Words>
                {"I was born in New York City, but grew up all over the country. After hopping around the southwest, I came back to the city to study Psychology. I loved it, though I spent much time outside the classroom scratching a creative itch, landing freelance design gigs across the five boroughs. Following graduation, I headed overseas for a stint in London to complete research in Human-Computer Interaction."}
              </Words>
            </p>
            <p className="reveal">
              <Words>{"Today, I’m an Advancement Associate at YAI in "}</Words>
              <strong><Words>Brooklyn</Words></strong>
              <Words>{", where I design and build our fundraising websites, campaigns, and donate pages to secure resources for children and adults with intellectual and developmental disabilities."}</Words>
            </p>
            <p className="reveal">
              <Words>{"In all my projects, I look to craft digital spaces that facilitate discovery and bring people closer together."}</Words>
            </p>
          </ScrollWords>
        </div>
      </section>

      {/* Selected Work — list + case studies live in components/SelectedWork.tsx */}
      <SelectedWork />

      {/* Listening & Reading — edit what's shown in app/now.ts */}
      <section className="home-wrap home-sec">
        <div className="home-grid">
          <div className="home-lbl reveal">Listening &amp; Reading</div>
          <div className="home-main"><NowCards /></div>
        </div>
      </section>

      {/* Footer / Connect */}
      <footer id="connect" className="home-wrap home-foot">
        <div className="home-grid">
          <div className="home-lbl reveal">Connect</div>
          <div className="home-main reveal flex flex-wrap gap-3">
            <a href="mailto:guillermodvaldivia@gmail.com" className={"accent-cyan " + pill}>
              guillermodvaldivia@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/guillermovaldiviae" target="_blank" rel="noreferrer" className={"accent-magenta " + pill}>
              LinkedIn<ArrowUpRight />
            </a>
            <a href="https://github.com/guillermovaldiviae" target="_blank" rel="noreferrer" className={"accent-yellow " + pill}>
              GitHub<ArrowUpRight />
            </a>
          </div>
        </div>
        <div className="home-fine">
          <p>hecho con cariño</p>
          <p>Brooklyn, New York City · 2026</p>
        </div>
      </footer>
    </main>
  );
}
