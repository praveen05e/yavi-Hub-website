"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MaskReveal({
  src,
  alt,
  className = "",
  panelColor = "var(--cream)",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  panelColor?: string;
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current, panel = panelRef.current, img = imgRef.current;
    if (!wrap || !panel || !img) return;
    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(panel, { scaleX: 0 });
      gsap.set(img, { scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: "top 80%", once: true },
      });
      tl.set(img, { scale: 1.15 })
        .to(panel, { scaleX: 0, duration: 1.0, ease: "power4.inOut", transformOrigin: "right" })
        .to(img, { scale: 1, duration: 1.2, ease: "power3.out" }, "-=0.7");
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover"
      />
      <div
        ref={panelRef}
        className="absolute inset-0"
        style={{ backgroundColor: panelColor, transformOrigin: "left" }}
      />
    </div>
  );
}
