"use client";

import { useEffect, useRef } from "react";

const NAME = ["Guillermo", "Valdivia"];
const ACCENTS = ["var(--cyan)", "var(--magenta)", "var(--yellow)"];

// The big name at the top. It sizes itself to fill the width it's given
// (one line across the whole screen on desktop, two lines on phones), and each letter flashes one of the
// site's accents as the cursor passes over it.
export default function NameLockup() {
  const boxRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const fitRef = useRef<HTMLSpanElement>(null);
  const colorIndex = useRef(0);

  useEffect(() => {
    const box = boxRef.current, h1 = h1Ref.current, fit = fitRef.current;
    if (!box || !h1 || !fit) return;
    const size = () => {
      h1.style.fontSize = "100px";
      const w = fit.getBoundingClientRect().width;
      if (!w) return;
      const px = Math.floor((100 * box.clientWidth) / w * 0.995);
      h1.style.fontSize = `${Math.max(32, Math.min(px, 480))}px`;
    };
    size();
    document.fonts?.ready.then(size);
    const ro = new ResizeObserver(size);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const onOver = (e: React.MouseEvent) => {
    const ch = (e.target as HTMLElement).closest<HTMLElement & { _t?: number }>(".name-ch");
    if (!ch) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearTimeout(ch._t);
    ch.classList.add("lit");
    ch.style.color = ACCENTS[colorIndex.current++ % ACCENTS.length];
    ch._t = window.setTimeout(() => { ch.classList.remove("lit"); ch.style.color = ""; }, 380);
  };

  return (
    <div ref={boxRef} className="w-full">
      <h1 ref={h1Ref} className="name-lockup m-0" aria-label={NAME.join(" ")}>
        <span ref={fitRef} className="name-fit" onMouseOver={onOver}>
          {NAME.map((word) => (
            <span key={word} aria-hidden="true">
              {word.split("").map((c, i) => (
                <span key={i} className="name-ch">{c}</span>
              ))}
            </span>
          ))}
        </span>
      </h1>
    </div>
  );
}
