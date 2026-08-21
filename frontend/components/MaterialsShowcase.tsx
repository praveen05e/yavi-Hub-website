"use client";

import { useState } from "react";
import TextReveal from "@/components/animations/TextReveal";

const MATERIALS = [
  { id: "wood", name: "Wood", desc: "American oak and walnut veneers, warm and tactile.", image: "/images/materials/wood.jpg" },
  { id: "marble", name: "Marble", desc: "Honed and polished natural stone surfaces.", image: "/images/materials/marble.jpg" },
  { id: "stone", name: "Stone", desc: "Textured natural stone for grounded interiors.", image: "/images/materials/stone.jpg" },
  { id: "fabric", name: "Fabric", desc: "Linen, wool, and boucle upholstery.", image: "/images/materials/fabric.jpg" },
  { id: "metal", name: "Metal", desc: "Brushed brass and matte-black hardware.", image: "/images/materials/metal.jpg" },
  { id: "glass", name: "Glass", desc: "Fluted and reeded glass for soft division.", image: "/images/materials/glass.jpg" },
];

export default function MaterialsShowcase() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <TextReveal className="eyebrow mb-10 text-bronze">Materials & Craft</TextReveal>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {MATERIALS.map((m) => (
          <div
            key={m.id}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative aspect-square overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.image}
              alt={m.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-near-black/75 via-near-black/10 to-transparent p-4">
              <span className="font-display text-lg text-ivory">{m.name}</span>
              <p
                className={`text-xs text-ivory/80 transition-all duration-500 ease-out-expo ${
                  hovered === m.id ? "mt-1 max-h-10 opacity-100" : "max-h-0 overflow-hidden opacity-0"
                }`}
              >
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
