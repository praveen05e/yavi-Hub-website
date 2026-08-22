"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/data/siteConfig";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const panelRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [wordmarkRef, line1Ref, line2Ref, subRef, ctaRef, scrollRef].map((r) => r.current);

    if (prefersReduced) {
      gsap.set(panelRef.current, { scaleX: 0 });
      gsap.set(els, { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.set(imgRef.current, { scale: 1.08 })
      .to(panelRef.current, { scaleX: 0, duration: 1.1, ease: "power4.inOut", transformOrigin: "right" }, 0.1)
      .to(imgRef.current, { scale: 1, duration: 1.8, ease: "power2.out" }, 0.2)
      .fromTo(wordmarkRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
      .fromTo(line1Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.7)
      .fromTo(line2Ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0.85)
      .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.05)
      .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 1.3)
      .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.6);

    // Parallax Effect
    gsap.to(imgRef.current, {
      y: "25%",
      ease: "none",
      scrollTrigger: {
        trigger: panelRef.current, // Use parent container
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="relative flex min-h-screen items-center md:items-end overflow-hidden bg-charcoal">
      <div ref={imgRef} className="absolute inset-0">
        {/* Replace with real YAVI hero photography/video at this path */}
        <img
          src="/images/hero/hero-living-room.jpg"
          alt="A warm, sunlit contemporary living room designed by YAVI"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-near-black/70 via-near-black/10 to-transparent" />
      </div>
      <div ref={panelRef} className="absolute inset-0 z-10 bg-cream" style={{ transformOrigin: "left" }} />

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-24 pb-20 md:pt-0 lg:px-10 lg:pb-28">
        <div ref={wordmarkRef} className="eyebrow mb-6 text-ivory/80">
          {siteConfig.name}
        </div>
        <h1 className="max-w-3xl font-display text-5xl text-ivory sm:text-6xl lg:text-7xl">
          <div ref={line1Ref}>Spaces that</div>
          <div ref={line2Ref} className="italic">become stories.</div>
        </h1>
        <p ref={subRef} className="mt-6 max-w-md text-base text-ivory/80 lg:text-lg">
          {siteConfig.heroSupportingText}
        </p>
        <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
          <a
            href="/projects"
            data-cursor="explore"
            className="rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-near-black transition-transform duration-300 ease-out-expo hover:-translate-y-0.5"
          >
            Explore Our Work
          </a>
          <a
            href="/contact"
            data-cursor="explore"
            className="rounded-full border border-ivory/60 px-7 py-3.5 text-sm font-medium text-ivory transition-colors duration-300 hover:bg-ivory/10"
          >
            {siteConfig.primaryCta}
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="absolute bottom-8 right-6 z-20 hidden items-center gap-3 text-ivory/70 sm:flex lg:right-10">
        <span className="eyebrow text-[10px]">Scroll to explore</span>
        <span className="h-8 w-px animate-pulse bg-ivory/50" />
      </div>
    </section>
  );
}
