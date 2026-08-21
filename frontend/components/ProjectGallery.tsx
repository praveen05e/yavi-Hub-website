"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, projectCategories } from "@/data/projects";
import TextReveal from "@/components/animations/TextReveal";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectGallery() {
  const [category, setCategory] = useState<(typeof projectCategories)[number]>("All");
  const galleryRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (category === "All" ? projects : projects.filter((p) => p.category === category)),
    [category]
  );

  useEffect(() => {
    if (!galleryRef.current) return;
    
    const elements = galleryRef.current.children;
    
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 80%",
        },
      }
    );
  }, [filtered]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
        <TextReveal className="eyebrow text-bronze">Project Showcase</TextReveal>
        <div className="flex flex-wrap gap-2">
          {projectCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors duration-300 ${
                category === cat
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-near-black/20 text-near-black/70 hover:border-near-black/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div ref={galleryRef} className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        {filtered.map((project, i) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            data-cursor="view"
            className={`group relative block overflow-hidden ${
              i % 5 === 0 ? "sm:col-span-4 sm:aspect-[16/9]" : "sm:col-span-2 sm:aspect-[3/4]"
            } aspect-[4/3]`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.heroImage}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 translate-y-2 p-5 text-ivory opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
              <div className="font-display text-xl">{project.title}</div>
              <div className="text-xs text-ivory/75">{project.location} · {project.category}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
