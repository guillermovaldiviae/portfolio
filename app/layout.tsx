import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// One typeface for the whole site. --font-sans and --font-mono both point here (see globals.css).
// Inter Tight, self-hosted from app/fonts (SIL Open Font License, see InterTight-OFL.txt).
const interTight = localFont({
  src: "./fonts/InterTight-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter-tight",
  display: "swap",
});

// Open Sans, self-hosted (SIL Open Font License). Used only inside the recreated YAI page pieces in the case studies.
const openSans = localFont({
  src: "./fonts/OpenSans-Variable.woff2",
  weight: "300 800",
  style: "normal",
  variable: "--font-open-sans",
  display: "swap",
});

// Runs before the page paints: turns on the scroll-in animations only when
// JavaScript is running and the visitor hasn't asked for reduced motion.
// If the page's scripts never start, the fallback turns them off so nothing stays hidden.
const motionFlag = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&"IntersectionObserver" in window){document.documentElement.classList.add("motion");window.__revealFallback=setTimeout(function(){document.documentElement.classList.remove("motion")},6000)}}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://guillermovaldivia.com"),
  title: "Guillermo Valdivia — Design & Digital Fundraising",
  description:
    "Brooklyn-based designer crafting meaningful, accessible digital experiences. Selected work in web design, donor experience, and digital fundraising.",
  openGraph: {
    title: "Guillermo Valdivia — Design & Digital Fundraising",
    description: "Brooklyn-based designer crafting meaningful, accessible digital experiences.",
    url: "https://guillermovaldivia.com",
    siteName: "Guillermo Valdivia",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${openSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
