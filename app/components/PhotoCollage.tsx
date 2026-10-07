"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { collage } from "../collage";

const ratio = (i: number) => collage[i].width / collage[i].height;

// Splits the photos into rows. Each row is then stretched to the full width (in CSS:
// flex-grow = the photo's aspect ratio), so every photo in a row ends up the same height
// and nothing is cropped. A short last row is folded into the one before it.
function makeRows(width: number): number[][] {
  const gap = width < 700 ? 8 : 12;
  const target = width < 700 ? 150 : width < 1060 ? 240 : 320; // ideal row height
  const rows: number[][] = [];
  let row: number[] = [], sum = 0;
  collage.forEach((_, i) => {
    row.push(i); sum += ratio(i);
    if (sum * target + gap * (row.length - 1) >= width) { rows.push(row); row = []; sum = 0; }
  });
  if (row.length) {
    const lastW = row.reduce((a, i) => a + ratio(i), 0) * target;
    if ((lastW < width * 0.6 || row.length === 1) && rows.length) rows[rows.length - 1].push(...row);
    else rows.push(row);
  }
  return rows;
}

export default function PhotoCollage() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(() => makeRows(1360));
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTile = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const ro = new ResizeObserver(() => {
      const next = makeRows(box.clientWidth);
      setRows((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  const n = collage.length;
  const show = useCallback((i: number) => setOpen(((i % n) + n) % n), [n]);
  const close = useCallback(() => {
    setOpen(null);
    lastTile.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % n));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, close, n]);

  const photo = open === null ? null : collage[open];

  return (
    <>
      {/* One flat list (so tiles keep their state when the rows change), with a break after each row */}
      <div ref={boxRef} className="collage" aria-label="Photos of Guillermo">
        {rows.flatMap((r, ri) => [
          ...r.map((i, k) => {
            const p = collage[i];
            return (
              <button
                key={p.src}
                type="button"
                className="collage-tile reveal"
                style={{ flexGrow: ratio(i), aspectRatio: `${p.width} / ${p.height}`, "--reveal-delay": `${k * 90}ms` } as CSSProperties}
                aria-label={`Enlarge photo: ${p.caption}`}
                onClick={(e) => { lastTile.current = e.currentTarget; show(i); }}
              >
                <Image src={p.src} alt={p.alt} fill sizes="(max-width: 760px) 60vw, 34vw" priority={ri === 0} />
                <span className="collage-cap">{p.caption}</span>
              </button>
            );
          }),
          ri < rows.length - 1 ? <span key={`break-${ri}`} className="collage-break" aria-hidden="true" /> : null,
        ])}
      </div>

      {photo && open !== null && (
        <div className="collage-lb cs-fade" role="dialog" aria-modal="true" aria-label={photo.caption}>
          <div className="collage-lb-bar">
            <span>{open + 1} / {n}</span>
            <button ref={closeRef} type="button" onClick={close}>Close ✕</button>
          </div>
          <div className="collage-lb-body" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} alt={photo.alt} />
          </div>
          <div className="collage-lb-bar">
            <button type="button" onClick={() => show(open - 1)}>← Prev</button>
            <span>{photo.caption}</span>
            <button type="button" onClick={() => show(open + 1)}>Next →</button>
          </div>
        </div>
      )}
    </>
  );
}
