"use client";

import { useState } from "react";
import { testimonials } from "@/data/testimonials";
import TextReveal from "@/components/animations/TextReveal";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = testimonials[index];

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 text-center lg:py-12">
      <TextReveal className="eyebrow mb-10 text-bronze">Testimonials</TextReveal>
      <TextReveal key={t.id} className="min-h-[9rem]">
        <p className="font-display text-2xl leading-snug text-near-black sm:text-3xl">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="mt-6 text-sm text-near-black/55">
          {t.name} — {t.projectType}
        </div>
      </TextReveal>
      <div className="mt-8 flex justify-center gap-2">
        {testimonials.map((item, i) => (
          <button
            key={item.id}
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-bronze" : "w-1.5 bg-near-black/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
