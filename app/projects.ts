import type { DemoId } from "./components/demos";

// Projects in "Selected Work". The landing list, the hover preview, the step bar
// color, the "Visit" link and the next-project link all read from this file.
// Each case study's walk-through (steps, copy, interactions) lives in
// app/components/exhibits/<Name>Exhibit.tsx.
// Anything in [square brackets] is a placeholder waiting for your real info.

export type Stat = {
  value: string;
  label: string;
  placeholder?: boolean; // shows a dashed outline so it's easy to spot before launch
};

// One image in a case study. Put files in /public/work/<project-slug>/
// and reference them like "/work/giving-tuesday/final-hero.jpg".
export type GalleryItem = {
  src: string;
  alt: string; // describe the image for screen readers
  caption: string; // shown under the image
};

// A labeled set of images, e.g. "Print" or "Wireframes".
export type GalleryGroup = {
  title: string;
  note?: string; // one line of context next to the title
  cols?: 1 | 2 | 3; // columns on desktop (default 2). Use 1 for big boards and wide pages.
  impact?: string; // for the graphic design collection: how the piece helped
  items?: GalleryItem[];
  demo?: DemoId; // show an interactive piece instead of images (see components/demos)
};

export type Project = {
  kind?: "case" | "collection"; // "collection" = a gallery of pieces from several projects
  group: string; // heading this project sits under in Selected Work (e.g. "Shipped at YAI")
  type: string; // what the work is, shown on the right of its row (e.g. "Event Platform")
  eyebrow: string; // small label above the title in the popup
  slug: string; // becomes the shareable link: yoursite.com/#slug
  accent?: string; // the project's brand color: hover color on the list and highlight color inside its case study
  title: string;
  summary: string; // one-liner shown on the landing list
  lede: string; // intro line under the title in the popup
  link?: { href: string; label: string };
  meta: { label: string; value: string }[];
  image?: GalleryItem; // cover image at the top of the case study
  background: string[];
  challenge?: string[];
  processIntro?: string[]; // optional paragraphs at the top of Process, above the demos
  findings?: { who: string; heard: string; changed: string }[]; // optional "what we heard → what we changed" table, under processIntro
  process?: GalleryGroup[]; // shown after Challenge: wireframes, flows, systems
  solution?: string[];
  workLabel?: string; // heading for the work section (default "Design Work")
  work?: GalleryGroup[]; // shown after Solution: the finished design work
  results?: string[]; // optional "Results" section, for work without hard numbers
  sources?: { label: string; href: string }[]; // optional citations, shown small at the end
  outcomes?: Stat[];
  outcomesNote?: string; // small line under the outcome cards
  next?: string[]; // optional "What's Next" section
};

// Small helper so image entries stay short.
const img = (src: string, alt: string, caption: string): GalleryItem => ({ src, alt, caption });

const CPC = "/work/central-park-challenge";
const KC = "/work/kevin-carey-legacy-golf-outing";
const GT = "/work/giving-tuesday";
const GC = "/work/giving-circle";
const GD = "/work/graphic-design";
const PP = "/work/painpal";

export const projects: Project[] = [
  {
    slug: "central-park-challenge",
    accent: "#00A1D0",
    group: "Shipped at YAI",
    type: "Website Redesign",
    eyebrow: "Shipped · YAI · 2025–2026",
    title: "Central Park Challenge",
    summary:
      "Redesign of the event website for New York City's largest celebration of people with intellectual and developmental disabilities (I/DD).",
    lede: "Leading the redesign of the website for NYC's largest I/DD celebration in its 40th year, from user reviews to the live build, inside a fundraising platform built from fixed page blocks.",
    link: {
      href: "https://give.yai.org/event/2026-yai-central-park-challenge/e725682",
      label: "Visit Central Park Challenge",
    },
    meta: [
      { label: "Role", value: "Website lead (research, IA, design & build), partnerships support, print & signage direction" },
      { label: "Tools", value: "GoFundMe Pro (Classy), custom HTML & CSS" },
      { label: "Team", value: "Fundraising, MarComms, Executive leadership, designers" },
      { label: "Year", value: "2025–2026" },
    ],
    image: img(`${CPC}/cover-key.jpg`, "YAI 40th Central Park Challenge presented by Waymo: the event logo framed by photos of a smiling runner, a walker holding an I support people with disabilities sign, and friends with a dog at the event", "Event identity"),
    background: [
      "The Central Park Challenge is YAI's flagship event and New York City's largest celebration of people with intellectual and developmental disabilities. In 2026 it turned 40, drawing thousands to Central Park. The website is where nearly all of it begins, for audiences from corporate sponsors to first-time volunteers to the people YAI supports.",
      "I led the site redesign end to end: running reviews, restructuring the content, designing each section, and building it in custom HTML and CSS, while also supporting the event's corporate partnerships.",
    ],
    challenge: [
      "I inherited a 2025 site that worked but didn't inspire: a washed-out hero, seven equal links, a wall-of-text list of accessible activities, and generic boilerplate.",
      "The platform made it harder. GoFundMe Pro builds pages from fixed, modular blocks, so content stacks up section after section, and every audience's needs land on the same long page. The site had to serve sponsors, volunteers, fundraisers, families, and people with I/DD, with no site builder, no web team, and a date that couldn't move: the 40th anniversary.",
    ],
    processIntro: [
      "Before designing anything, I ran reviews of the existing site with three groups: people YAI supports, members of our MarComms team, and a member of executive leadership. Each saw it through a different lens, but the first reaction was the same: there was simply too much information.",
      "The feedback pointed to five areas that needed immediate focus: the information itself, the hero and navigation, the donation bar, the accessible activities, and the volunteer portal. Beyond those fixes, the project became about reorganizing, cataloging, and simplifying everything the site had to say. I set one test for every decision: could the site hold a single look across every page, serve every audience, and still celebrate the 40th?",
      "From there I worked section by section, from lo-fi wireframes to mid-fi mockups to the live build.",
    ],
    findings: [
      { who: "People YAI supports", heard: "Too much to take in; hard to find the one thing they came for.", changed: "Seven equal links became three choices, with support options grouped in one dropdown." },
      { who: "MarComms", heard: "Pages were walls of text and not very accessible.", changed: "Scannable sections and alt text on every image." },
      { who: "Executive leadership", heard: "Sponsors needed to be more visible.", changed: "The presenting sponsor in the hero lockup, and Sponsorships as its own page in the nav." },
    ],
    process: [
      {
        title: "A nav organized by how people get involved",
        note: "Click the nav · flip between 2025 and 2026",
        demo: "cpc-sitemap",
      },
      {
        title: "Redesign, section by section",
        note: "Flip to 2026, then step lo-fi → mid-fi → hi-fi",
        demo: "cpc-redesign",
      },
      {
        title: "Working within the platform",
        note: "Pick a photo · gallery → image address → live page",
        demo: "cpc-gallery",
      },
    ],
    solution: [
      "I started with the content. I cataloged everything the site said, cut what was repeated or outdated, and regrouped the rest by who needed it. The 2025 nav gave every option the same weight, a row of equal links where Register and Event Details competed with Sponsorship Opportunities and Spread the Word, and regional events had no link at all. In 2026 I grouped the nav by how someone wants to get involved: Donate stays one tap away, Event Info answers \"what is this?\", and Ways to Support opens a dropdown for fundraising, volunteering, sponsoring, regional events, and spreading the word. Each visitor gets a clear direction based on their relationship to the event, and the first view stays calm, especially for the people we support with I/DD.",
      "Then I redesigned the focus areas: a hero that leads with the 40th, a donation bar with one clear action, an activities list you can scan instead of read, framed in the same ring photo collage used across the site for a consistent experience, and a volunteer section that leads with people.",
      "To hold one look across seven separate campaigns, I carried the CPC brand into custom HTML and CSS (colors, type, and buttons) and rebuilt the nav that ties the campaigns into one site. The custom sections needed images the platform's own blocks couldn't style, so I turned an unlisted campaign into a shared image library that every page pulls from, letting the site read as one event instead of seven campaigns.",
      "The website was one part of my role. With no web team, I owned the site from first review to launch. Alongside it, I supported corporate partnerships: I built the sponsorship deck and was in the room with our Director of Advancement, who led the conversations, as we brought on Waymo, the event's first-ever presenting sponsor. I also led creative direction for the event's print pieces and on-site digital signage, working with our designers (see Beyond the Screen).",
    ],
    outcomes: [
      { value: "$610K", label: "Raised, 98% of the $625K goal and up 7.6% from $567K in 2025" },
      { value: "4,424", label: "Registrations, up 12.7% from 3,924 in 2025" },
      { value: "4,135", label: "Donations and sponsorships made through the website, up from 4,067" },
      { value: "$234K", label: "In sponsorships, up from $170K in 2025" },
    ],
    outcomesNote: "Event-wide results from a team effort. The website is where registration, giving, and volunteering happened.",
    next: [
      "With more time, I'd test the site with screen-reader users and self-advocates, add page-by-page analytics to see which paths lead to registration and gifts, and turn the in-code styles into a documented template so next year's site starts from a base instead of from scratch.",
    ],
  },
  {
    slug: "kevin-carey-legacy-golf-outing",
    accent: "#5DBB63",
    group: "Shipped at YAI",
    type: "Website Redesign",
    eyebrow: "Shipped · YAI · 2026",
    title: "Kevin Carey Legacy Golf Outing",
    summary: "Website redesign and brand rollout for a charity golf tournament renamed to honor a beloved CEO: a legacy, not a memorial.",
    lede: "Leading the website, brand rollout, and sponsorships for a renamed charity golf outing, honoring Kevin Carey and the Direct Support Professionals he championed with an event that feels alive rather than like a memorial.",
    link: {
      href: "https://give.yai.org/event/2026-yai-golf-outing/e753946",
      label: "Visit Kevin Carey Legacy Golf Outing",
    },
    meta: [
      { label: "Role", value: "Web design, brand rollout across signage & print, sponsorships, event logistics" },
      { label: "Platform", value: "GoFundMe Pro (Classy)" },
      { label: "Team", value: "Graphic designer, Fundraising, MarComms, Executive leadership, golf course" },
      { label: "Timeline", value: "Design & production May–Sep 2026 · Fundraising Jul–Sep 2026" },
    ],
    image: img(`${KC}/cover-key.jpg`, "The YAI Kevin Carey Legacy Golf Outing logo surrounded by leaf-cropped photos of golfers on the course", "Event identity"),
    background: [
      "YAI's annual golf tournament was renamed the Kevin Carey Legacy Golf Outing to honor the organization's former CEO, who passed away from cancer in 2025. Beyond building a positive work culture, Kevin made YAI a loving, caring force in the I/DD sector.",
      "Central to that was his push to recognize Direct Support Professionals (DSPs). They are the heart of YAI, on the front line of a demanding job, and have historically gone unnoticed, underappreciated, and underpaid. Kevin wanted to change that. The DSP Champion Awards Dinner, held after 18 holes at North Shore Country Club, is YAI's way of making them feel seen.",
      "I led the event's digital and brand work end to end: launching the site under the new name, redesigning it, carrying the new identity across signage and print, and managing every sponsorship and the day-of logistics.",
    ],
    challenge: [
      "The event had to honor Kevin without becoming a memorial. The tone needed to celebrate his legacy: warm, alive, and looking ahead.",
      "It also had to stand next to any corporate outing, since most guests are sponsors, executives, and partners, while still feeling like YAI. And it had to serve three audiences at once, golfers, dinner guests, and sponsors, without letting the DSPs Kevin championed become a footnote.",
      "And it all ran on the same constraints as YAI's other events: GoFundMe Pro's fixed page blocks, no site builder, and no web team. Anything beyond the stock layout, I designed myself.",
    ],
    processIntro: [
      "I shipped the site in two rounds. The first version launched quickly under the new name, so tickets and sponsorships could open on time. Once it was live, I reviewed it against the event's goals: it was accurate, but it leaned somber, buried the dinner, and treated sponsors as a logo strip.",
      "The redesign kept what worked and rebuilt the rest around three questions: does it feel like a celebration, can each audience find their path in one click, and does every partner get real visibility?",
      "Alongside the site, I rolled the new identity out to everything a guest would touch on the day.",
    ],
    process: [
      {
        title: "Iterating: v1 → v2",
        note: "Pick a section, then flip the switch to see what changed",
        demo: "golf-compare",
      },
      {
        title: "Navigation as audience map",
        note: "Three links on desktop · tap the phone's menu",
        demo: "golf-nav",
      },
      {
        title: "Identity & image treatment",
        note: "Logo by a graphic designer; I carried it, and the green, across web and print",
        cols: 1,
        items: [img(`${KC}/process-identity.jpg`, "Before and after of the event name, the new logo, the leaf-crop image treatment, colors, and web type", "Brand rollout & image treatment")],
      },
    ],
    solution: [
      "Every design decision started from one idea: a legacy, not a memorial. Green leads the palette to signal life, growth, and a legacy of care that carries Kevin's work forward, and it fits naturally with a day on the course. Bright photography in an organic \"leaf\" crop with offset green shapes replaced the dark banner of the first version, so the site reads as a celebration.",
      "The DSP Awards Dinner got the same weight as golf: its own nav link, its own page, and its own ticket card instead of a line item. Making DSPs visible on the site was part of making them feel seen.",
      "A professional graphic designer created the Kevin Carey Legacy logo. My role was carrying it, and the green, everywhere the event lives: the website, on-course signage, and printed pieces like the lawn signs and event program.",
      "The navigation doubles as an audience map: Golf Outing, DSP Awards Dinner, and Sponsorships. On mobile, the links fold into one \"Get Involved\" dropdown (Play Golf, DSP Awards Dinner, Sponsor), so the call to action is the menu itself. A new sponsor wall gives every partner an equal, spacious card.",
      "The website was one part of my role. I did the outreach and secured all 15 sponsorships, then managed each partner through to recognition on the site and the course, and managed logistics for 100 golfers and 150 to 200 dinner guests with the golf course and our internal teams, so the day ran as smoothly as the site read.",
    ],
    work: [
      {
        title: "Key sections",
        note: "Tickets and partners",
        cols: 1,
        items: [
          img(`${KC}/v2-tickets.jpg`, "Ticket cards for Foursome, Single Golfer, and DSP Awards Dinner, each with a photo, price, and description", "Ticket cards"),
          img(`${KC}/v2-sponsor-wall.jpg`, "Sponsor wall: fifteen partner logos on equal cards", "Sponsor wall"),
        ],
      },
    ],
    outcomes: [
      { value: "100", label: "Golfers" },
      { value: "150–200", label: "Dinner guests celebrating Direct Support Professionals" },
      { value: "$131K", label: "Raised Jul–Sep 2026, beating the $125K goal and up from $123K in 2025 (+6.5%)" },
      { value: "15", label: "Corporate sponsors on the wall" },
    ],
    outcomesNote: "Event-wide results from a team effort. The website is where tickets, sponsorships, and dinner registrations happened.",
    next: [
      "With more time, I'd give each year's DSP honorees a lasting page beyond the event, add analytics to see how golfers, dinner guests, and sponsors move through the site, and turn the leaf-crop treatment and green palette into a reusable template so next year's outing starts from a base instead of from scratch.",
    ],
  },
  {
    slug: "give-2025",
    accent: "#E8743B",
    group: "Shipped at YAI",
    type: "Campaign & Donate Page",
    eyebrow: "Shipped · YAI · 2025",
    title: "Give 2025",
    summary: "Campaign direction and donate page design for YAI's end-of-year appeal, which raised $270K.",
    lede: "Managing YAI's end-of-year appeal across data, creative, print, and web so it told one story everywhere.",
    link: {
      href: "https://give.yai.org/campaign/736849/donate",
      label: "Visit Give 2025",
    },
    meta: [
      { label: "Role", value: "Project manager, creative & copy direction, donate page" },
      { label: "Channels", value: "Digital & printed appeal, donate page" },
      { label: "Team", value: "Fundraising & Development, MarComms" },
      { label: "Timeline", value: "Design & production Aug–Dec 2025 · Fundraising Oct 2025–Jan 2026" },
    ],
    image: img(`${GT}/cover-key.jpg`, "YAI Give 2025: Be the power behind possibility, beside circle-framed photos of people YAI supports", "Campaign key visual"),
    background: [
      "Give 2025 was YAI's end-of-year appeal, running through the most important fundraising window of the year. Giving Tuesday was one moment inside it, not the whole campaign. Design and production ran from August to December 2025, and gifts came in from October 2025 through January 2026.",
      "Historically, the appeal leaned on an older donor base, so the printed mailer took the front seat. For 2025, growing a younger donor base was a goal of the campaign, which meant putting real effort into reaching people online.",
      "Give 2025 focused on assistive technology and how tools like smart glasses, visual communication apps, and medication management devices help people with I/DD live more independently.",
    ],
    challenge: [
      "The digital side had to stop being an afterthought without leaving loyal print donors behind. A younger donor expects a modern page and a quick way to give; a longtime donor holding the mailer should recognize the same campaign when they scan the QR code.",
      "End-of-year appeals arrive through several channels at once. A donor might get a printed letter, see a digital appeal, and visit a donate page in the same week, and every piece needed to feel like part of the same story.",
      "That meant pulling together donor data from fundraising and development teams, turning it into direction a creative team could act on, and delivering everything on a fixed seasonal deadline.",
    ],
    process: [
      {
        title: "One look, print to screen",
        note: "Unfold the printed appeal · then compare it with the page",
        demo: "give-trifold",
      },
      {
        title: "Campaign flow",
        note: "From donor data to one place to give",
        cols: 1,
        items: [img(`${GT}/process-channels.jpg`, "Flow from donor data to story, creative brief, channels, and the donate page", "One story, every channel")],
      },
      {
        title: "Page structure",
        note: "Annotated wireframe, desktop + mobile",
        cols: 1,
        items: [img(`${GT}/process-wireframe.jpg`, "Annotated desktop and mobile wireframe of the Give 2025 donate page", "Annotated wireframe")],
      },
      {
        title: "Visual system",
        note: "Color, type, and the story module",
        cols: 1,
        items: [img(`${GT}/process-visual-system.jpg`, "Color palette, type scale, and an annotated story module", "Visual system & story module")],
      },
    ],
    solution: [
      "As project manager, I gathered and coordinated data from the fundraising and development teams to shape who we were speaking to and what we asked for.",
      "To reach younger donors, I built a modernized digital landing page for the campaign: the donation form up front so giving takes seconds, and a live thermometer showing how much had been raised and how close we were to the goal. I kept the image treatment consistent with the printed trifold, with the same people, circle crops, color rings, and navy-and-orange palette, so print and digital read as one campaign.",
      "I gave creative and copy direction to MarComms for a combined digital and printed appeal, built around three real people using assistive technology: Suzy, Connor, and Leon. I also designed and built the campaign's donate page. It shows live progress toward the goal and puts the donation form above the stories. Each story gets its own alternating color band, and a second ask at the end means nobody has to scroll back up.",
    ],
    work: [
      {
        title: "Final donate page",
        note: "Selected sections",
        cols: 1,
        items: [
          img(`${GT}/final-donation-form.jpg`, "Donation card with give once and monthly options and preset amounts", "Donation card, above the stories"),
          img(`${GT}/final-story-connor.jpg`, "Story module: Connor and visual supports", "Story module"),
          img(`${GT}/final-closing-ask.jpg`, "Closing ask with a second donation form", "Closing ask"),
        ],
      },
    ],
    outcomes: [
      { value: "$270K", label: "Raised Oct 2025 – Jan 2026, 90% of a $300K goal" },
      { value: "+7.6%", label: "Up from $251K in 2024" },
      { value: "223", label: "Gifts across print and digital" },
    ],
    outcomesNote: "Campaign-wide results from a team effort across print and digital.",
    next: [
      "We set out to grow a younger donor base but didn't segment gifts by age or channel this year, so I can't yet say how much of the growth came from new, younger donors. Next time I'd track first-time online donors and gifts made through the page versus the reply card from day one.",
    ],
  },
  {
    slug: "giving-circle",
    accent: "#F5A623",
    group: "Shipped at YAI",
    type: "Program Launch",
    eyebrow: "Shipped · YAI · 2026",
    title: "Giving Circle",
    summary:
      "A new monthly giving program building a steady, year-round base of support. Early days, big room to grow.",
    lede: "Pitching and launching a recurring giving program, and laying the groundwork for it to scale.",
    link: {
      href: "https://give.yai.org/campaign/755393/donate",
      label: "Visit Giving Circle",
    },
    meta: [
      { label: "Role", value: "Program strategy, incentive & merch design, pitch" },
      { label: "Platform", value: "GoFundMe Pro (Classy)" },
      { label: "Stage", value: "New initiative, launched Feb 2026" },
      { label: "Goal", value: "50–100 monthly donors by Feb 2027" },
    ],
    image: img(`${GC}/cover-key.jpg`, "Giving Circle, a monthly giving program: a supporter takes a selfie with her dog at a YAI event, framed in an orange circle", "Program key visual"),
    background: [
      "The Giving Circle is YAI's new monthly giving program, built to grow the organization's base of recurring donors. Most of YAI's fundraising happens in big moments: a signature event, a year-end appeal. The Giving Circle complements them with something steadier, supporting the more than 20,000 people YAI serves all year round.",
      "Before launch, only 7 people were giving monthly, contributing $864 a month. Recurring gifts are some of the most valuable support a nonprofit can have. They're predictable, they compound over time, and monthly donors tend to stay connected far longer than one-time givers.",
    ],
    challenge: [
      "Monthly programs often work like subscriptions and memberships: they lean on a \"set and forget\" attitude, counting on people to sign up, stop thinking about it, and keep getting charged. I didn't want the Giving Circle to work that way.",
      "Revenue mattered, but we saw the program as a bigger opportunity: a way to expand YAI's reach, show more people what we do, and grow our community. That meant giving members reasons to stay engaged rather than reasons to forget, while making a monthly commitment feel easy for people who mostly gave once a year. And it had to be a foundation the organization could keep promoting, not a one-off campaign page.",
    ],
    process: [
      {
        title: "Tiers & thank-you gifts",
        note: "Pick a level to see what it unlocks",
        demo: "gc-tiers",
      },
    ],
    solution: [
      "The program is organized into five clear tiers, from $10 to $250 a month, and every thank-you keeps members connected to the work: postcards featuring art by YAI artists like Jimmy Tucker, a cap and tote to wear to our events, framed originals like Lauren M.'s Birds of NY, and invitations to donor events where they can see the impact in person. Each level adds one gift, so moving up always feels worthwhile, and each gift was mocked up and costed so the incentives stay sustainable.",
      "The growth plan ties recruitment to the moments when supporters are already paying attention: the Central Park Challenge and the end-of-year campaign. The giving page links each gift to concrete impact and includes an FAQ covering receipts, privacy, and tax-deductibility, removing friction right at the moment of decision.",
    ],
    outcomes: [
      { value: "+71%", label: "Recurring donors, from 7 at launch to 12" },
      { value: "+15%", label: "Monthly recurring revenue, from $864 to $993" },
      { value: "$11.9K", label: "Annual recurring revenue (ARR)" },
      { value: "$82.78", label: "Average monthly gift" },
    ],
    outcomesNote: "Early numbers from a program still in its first year.",
    next: [
      "It's early, and 12 donors is a small sample, but one signal is encouraging: the average monthly gift of $82.78 is well above the $10 entry tier, which suggests donors are choosing higher levels rather than the minimum.",
      "The goal is 50 to 100 monthly donors by February 2027. The next stage is reach: bringing the Giving Circle to the donors who already give through the Central Park Challenge and year-end appeals, and inviting one-time donors to become monthly ones. At the current average gift, every 10 new members adds roughly $10K a year in predictable support.",
    ],
  },
  {
    slug: "painpal",
    accent: "#4A94DB",
    group: "Concept",
    type: "Mobile App",
    eyebrow: "Concept · Academic Project",
    title: "PainPal",
    summary: "Academic team project: a mobile app that helps people with chronic pain track symptoms, spot triggers, and share clear records with their doctors.",
    lede: "Turning the day-to-day work of managing chronic pain into something simple, insightful, and easier to share with a doctor.",
    meta: [
      { label: "Role", value: "Pain tracking & personalized insights, low-fi prototypes, final UI" },
      { label: "Type", value: "Academic team project" },
      { label: "Methods", value: "Personas, Crazy 8s, think-aloud testing, GP review" },
      { label: "Platform", value: "iOS mobile app" },
    ],
    image: img(`${PP}/hero-screens.jpg`, "Five PainPal screens: body map, pain diary, home dashboard, describe your pain, and chats", "Final app screens"),
    background: [
      "Chronic pain affects roughly one in five people worldwide, lowering quality of life and carrying real economic and social costs. Apps exist to help, but they're often expensive and vary widely in both features and experience.",
      "Our team set out to design a mobile app that turns managing chronic pain into a manageable, insightful routine, helping people take back control. My focus was pain tracking and personalized insights. I built the low-fidelity prototypes and designed the final UI for tracking and insights.",
    ],
    challenge: [
      "People living with chronic pain are often tired, hurting, and short on patience, so every extra tap is a cost. The app had to make logging fast enough to do in the moment, then turn those logs into something useful: patterns, triggers, and a record a doctor can actually use.",
      "After reviewing medical journals, case studies, and patient experiences shared on health forums, we built personas and set three requirements: a simple, accessible design with intuitive navigation; personalized tracking that surfaces triggers and tailored insights; and support for managing pain, like sharing data with care providers and finding help.",
    ],
    process: [
      {
        title: "Research",
        note: "Persona built from patient forums and literature",
        cols: 1,
        items: [img(`${PP}/persona.jpg`, "Persona card for Ollie Jones, a 25-year-old student with chronic back pain: bio, symptoms, goals, motivations, and pain points", "Persona: Ollie Jones")],
      },
      {
        title: "Ideation & wireframes",
        note: "Crazy 8s, feasibility-relevance matrix, low to mid fidelity",
        cols: 1,
        items: [img(`${PP}/wireframes.jpg`, "Board of low- and mid-fidelity wireframes, pain scale explorations, icon samples, app icons, and body diagrams", "Wireframes & prototypes")],
      },
      {
        title: "Onboarding flow",
        note: "Eight short steps, each one question",
        cols: 1,
        items: [img(`${PP}/onboarding.jpg`, "Eight onboarding screens: welcome, body map, pain intensity, triggers, timing, medications, alert contacts, and notes", "Onboarding for first-time users")],
      },
    ],
    solution: [
      "Brainstorming with Crazy 8s and a feasibility-relevance matrix narrowed dozens of ideas to three core features. Pain tracking: simple tools for logging where it hurts, how much, what triggered it, and what medication was taken. Personalized insights: daily reminders and alerts, like a heads-up before rainy weather. Management support: sharing pain logs with healthcare providers and access to physician-guided advice.",
      "Onboarding asks one question per screen, with a tappable body map, a five-point color scale, and checkbox triggers instead of free text, plus \"Skip\" and contextual hints throughout, so logging stays quick even on a bad day. The pain diary color-codes each day by intensity, so patterns show up at a glance.",
      "We ran usability tests using a think-aloud protocol, covering onboarding, recording pain, and exploring insights. A general practitioner also reviewed the prototype and highlighted its potential to help recognize pain patterns, support earlier intervention through detailed logs, and reduce stigma with a friendly, privacy-conscious design. The GP suggested exploring integration with healthcare systems and expanding to other conditions.",
    ],
    work: [
      {
        title: "Interactive prototype",
        note: "Tap through the app",
        demo: "painpal",
      },
      {
        title: "Key features",
        cols: 3,
        items: [
          img(`${PP}/feature-logging.jpg`, "Pain logging: tap-to-record from the home dashboard", "Pain logging"),
          img(`${PP}/feature-reminders.jpg`, "Reminders: a lock-screen notification warning of rain and possible increased discomfort", "Personalized reminders"),
          img(`${PP}/feature-sharing.jpg`, "Safe sharing: choose a date range and which details to send to a provider", "Safe sharing"),
        ],
      },
      {
        title: "Identity",
        note: "App icon, icons, color & type · tap the icon",
        demo: "pp-identity",
      },
    ],
    results: [
      "PainPal brings chronic pain management into one friendly place, giving people tools to track, understand, and act on their pain data. Through iterative design and user feedback, we refined the prototype around three priorities: simplicity, personalization, and data privacy.",
    ],
    sources: [
      { label: "Goldberg & McGee (2011), Pain as a global public health priority, BMC Public Health", href: "https://bmcpublichealth.biomedcentral.com/articles/10.1186/1471-2458-11-770" },
      { label: "On the economic and social burden of chronic pain (PubMed)", href: "https://pubmed.ncbi.nlm.nih.gov/27418853/" },
    ],
  },
  {
    kind: "collection",
    slug: "print-signage-graphic-design",
    accent: "#F2C230",
    group: "Beyond the Screen",
    type: "View Collection",
    eyebrow: "Collection · 2023–2026",
    title: "Print, Signage & Graphic Design",
    summary: "An I/DD artist's drawing turned into merch worn across Central Park, plus the posters, wayfinding, and on-site digital signage for the events above.",
    lede: "The offline half of the work, led by a hat: a sun drawn by an artist with I/DD, brought to life as merchandise and worn across Central Park.",
    meta: [
      { label: "Role", value: "Design, creative & copy direction" },
      { label: "Collaborators", value: "YAI Arts artists, graphic designers, MarComms" },
      { label: "Formats", value: "Merchandise, print, wayfinding, on-screen" },
      { label: "Years", value: "2023–2026" },
    ],
    background: [
      "YAI exists to support people with intellectual and developmental disabilities, so the strongest design move is often to step back and let their work lead. The sun hat does exactly that. The rest of the pieces apply the same thinking as the websites: know who's looking, give them one clear thing to do, and keep everything in the same visual language.",
    ],
    workLabel: "Selected Pieces",
    work: [
      {
        title: "The sun hat",
        note: "Central Park Challenge · 2023",
        cols: 1,
        impact: "People with I/DD are too often overlooked. In my time at YAI, I've seen so much talent go unnoticed simply because someone is neurodiverse or communicates differently. This sun was drawn by an artist with I/DD from YAI Arts, YAI's studio for neurodiverse artists, and the hat was a way to put that talent on display. It was always there; I just helped bring it into the spotlight, keeping his linework, adding color from the event palette, and adapting it for embroidery. To produce the hats, I worked with Spectrum Designs, a custom apparel company that employs people with autism and shares our mission of building more inclusive spaces, so the hat was made by our community as well as for it. Worn across Central Park by participants, it put his art on the heads of the people who came to celebrate his community.",
        demo: "sun-story",
      },
      {
        title: "Poster & wayfinding",
        note: "Central Park Challenge · 2026",
        cols: 2,
        impact: "The poster puts the date, the place, and one call to action (free registration) on a single page, promoting a year with 4,424 registrants, up 12.7%. On the day, the booth map and directory groups 49 numbered locations into color-coded themes, with a QR code to download a copy, so attendees could find activities, restrooms, and the accessible ramp on their own.",
        items: [
          img(`${GD}/poster-2026.jpg`, "2026 Central Park Challenge 40th anniversary poster: Walk. Play. Dance.", "40th anniversary poster"),
          img(`${GD}/booth-map.jpg`, "Booth map and directory with 49 numbered locations grouped by theme", "Booth map & directory"),
        ],
      },
      {
        title: "On-site digital signage",
        note: "Central Park Challenge · 2026",
        cols: 1,
        impact: "Looping on 10-foot-plus screens around the event, these designs carried the day's advocacy message and a donate QR code, so event-day attention could turn into gifts.",
        demo: "cpc-screens",
      },
    ],
  },
];
