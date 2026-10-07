# guillermovaldivia.com

Personal portfolio of Guillermo Valdivia. Built with Next.js and Tailwind CSS, hosted on Vercel.

## Run it locally

```bash
npm install     # first time only
npm run dev     # then open http://localhost:3000
```

Save a file and the browser updates automatically.

## Where things live

| To change… | Edit |
|---|---|
| Project list: titles, summaries, groups, links, cover images, brand colors | `app/projects.ts` |
| Each case study's steps, copy and interactions | `app/components/exhibits/` (one file per project, listed in `registry.tsx`) |
| Case study pages (`/work/give-2025` etc.) | `app/work/[slug]/page.tsx` |
| Case study layout and styles | `app/components/exhibits/CaseStudyPage.tsx`, `app/exhibit.css` (the "Full-page case study" section) |
| Song and book on the landing page | `app/now.ts` |
| Landing page (intro, about, work, connect) | `app/page.tsx` |
| Full-width grid, collage and Selected Work row styles | `app/globals.css` (the "Landing page layout" section) |
| Collage photos and captions | `app/collage.ts` (images in `public/about/collage/`), `app/components/PhotoCollage.tsx` |
| Listening & Reading cards | `app/components/NowCards.tsx` |
| Big name and its hover colors | `app/components/NameLockup.tsx` |
| Scroll fade-in and word-by-word text | `app/components/ScrollEffects.tsx`, `app/globals.css` |
| Selected Work list and hover preview | `app/components/SelectedWork.tsx` |
| Interactive demos (sliders, nav demos, PainPal prototype) | `app/components/demos/` |
| Top bar time & weather | `app/components/LocalInfo.tsx` |
| Hover colors and animations | `app/globals.css` |
| Page title, description, link preview | `app/layout.tsx`, `app/opengraph-image.jpg` |
| Favicon | `app/icon.png`, `app/favicon.ico`, `app/apple-icon.png` |
| Images | `public/work/…`, `public/about/…`, `public/now/…` |

## Publish

Commit and push to GitHub. Vercel redeploys automatically. See `DEPLOY.md`.
