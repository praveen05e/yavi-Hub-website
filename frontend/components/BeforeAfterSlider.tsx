"use client";

import { useCallback, useRef, useState } from "react";

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 3));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 3));
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full select-none overflow-hidden bg-cream touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* After — full-size base layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={afterSrc} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="absolute bottom-4 right-4 z-10 rounded-full bg-near-black/60 px-3 py-1 text-xs text-ivory">
        {afterLabel}
      </span>

      {/* Before — same full-size image, clipped from the right */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <span className="absolute bottom-4 left-4 rounded-full bg-near-black/60 px-3 py-1 text-xs text-ivory">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison position"
        aria-valuenow={Math.round(pos)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={onKeyDown}
        className="absolute top-0 z-20 flex h-full -translate-x-1/2 cursor-ew-resize flex-col items-center justify-center"
        style={{ left: `${pos}%` }}
      >
        <div className="h-full w-px bg-ivory" />
        <div className="absolute flex h-11 w-11 items-center justify-center rounded-full border border-ivory bg-near-black/70 text-ivory shadow-lg transition-transform duration-200 ease-out-expo hover:scale-105">
          <span className="text-xs">↔</span>
        </div>
      </div>
    </div>
  );
}
