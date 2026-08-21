"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReduced) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let x = 0, y = 0, tx = 0, ty = 0;
    const speed = 0.18;

    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const raf = () => {
      x += (tx - x) * speed;
      y += (ty - y) * speed;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(raf);
    };

    const setLabelFor = (el: Element | null) => {
      if (!el) return setLabel("");
      if (el.closest("[data-cursor='view']")) return setLabel("VIEW");
      if (el.closest("[data-cursor='explore']")) return setLabel("EXPLORE →");
      setLabel("");
    };

    const over = (e: MouseEvent) => setLabelFor(e.target as Element);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    requestAnimationFrame(raf);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border border-near-black/70 bg-ivory/70 backdrop-blur-sm transition-[width,height] duration-200 ease-out-expo"
      style={{ width: label ? 64 : 10, height: label ? 64 : 10 }}
    >
      {label && (
        <span className="text-[10px] font-body font-medium tracking-widest2 text-near-black">
          {label}
        </span>
      )}
    </div>
  );
}
