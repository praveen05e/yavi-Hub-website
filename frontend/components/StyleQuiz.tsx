"use client";

import { useState } from "react";
import TextReveal from "@/components/animations/TextReveal";

const STYLES = [
  { id: "minimal", label: "Minimal", image: "/images/styles/minimal.jpg" },
  { id: "modern", label: "Modern", image: "/images/styles/modern.jpg" },
  { id: "luxury", label: "Luxury", image: "/images/styles/luxury.jpg" },
  { id: "contemporary", label: "Contemporary", image: "/images/styles/contemporary.jpg" },
  { id: "warm", label: "Warm", image: "/images/styles/warm.jpg" },
  { id: "traditional", label: "Traditional", image: "/images/styles/traditional.jpg" },
  { id: "industrial", label: "Industrial", image: "/images/styles/industrial.jpg" },
  { id: "natural", label: "Natural", image: "/images/styles/natural.jpg" },
];

export default function StyleQuiz() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const direction =
    selected.length === 0
      ? null
      : selected
          .map((id) => STYLES.find((s) => s.id === id)?.label)
          .filter(Boolean)
          .join(" ");

  const openConcierge = () => {
    window.dispatchEvent(
      new CustomEvent("yavi:open-chat", { detail: { context: { design_style: direction } } })
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <TextReveal className="text-center">
        <span className="eyebrow text-bronze">Find Your Style</span>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl text-near-black sm:text-4xl">
          What does your dream space feel like?
        </h2>
      </TextReveal>

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STYLES.map((style) => {
          const isSelected = selected.includes(style.id);
          return (
            <button
              key={style.id}
              onClick={() => toggle(style.id)}
              aria-pressed={isSelected}
              className={`group relative aspect-[4/5] overflow-hidden rounded-sm transition-all duration-500 ease-out-expo ${
                isSelected ? "ring-2 ring-bronze ring-offset-2 ring-offset-ivory" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={style.image}
                alt={style.label}
                className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 flex items-end justify-center pb-4 transition-colors duration-500 ${
                  isSelected ? "bg-near-black/45" : "bg-near-black/20 group-hover:bg-near-black/35"
                }`}
              >
                <span className="text-sm font-medium text-ivory">{style.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {direction && (
        <div className="mt-12 text-center">
          <span className="eyebrow text-near-black/50">Your design direction</span>
          <p className="mt-2 font-display text-3xl italic text-bronze">{direction}</p>
          <button
            onClick={openConcierge}
            className="mt-6 rounded-full bg-charcoal px-7 py-3.5 text-sm font-medium text-ivory transition-colors hover:bg-near-black"
          >
            Discuss My Space
          </button>
        </div>
      )}
    </section>
  );
}
