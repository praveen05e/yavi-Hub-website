"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import TextReveal from "@/components/animations/TextReveal";

export default function ServicesList() {
  const [active, setActive] = useState<string | null>(null);
  const activeService = services.find((s) => s.id === active);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <TextReveal className="eyebrow mb-10 text-bronze">Services</TextReveal>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <ul>
          {services.map((service, i) => (
            <li
              key={service.id}
              onMouseEnter={() => setActive(service.id)}
              onMouseLeave={() => setActive(null)}
              className="group relative border-b border-near-black/10 py-6 transition-colors duration-500 ease-out-expo first:border-t hover:pl-3"
            >
              <button
                onClick={() => setActive(active === service.id ? null : service.id)}
                className="w-full flex flex-col text-left focus:outline-none"
              >
                <div className="flex w-full items-center justify-between gap-6">
                  <span className="flex items-baseline gap-6">
                    <span className="font-body text-xs text-near-black/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-display text-2xl text-near-black transition-transform duration-500 ease-out-expo group-hover:translate-x-1 sm:text-3xl">
                      {service.title}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={`shrink-0 text-near-black/50 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-bronze ${
                      active === service.id ? "rotate-45 text-bronze" : ""
                    }`}
                    size={22}
                  />
                </div>
                
                {/* Mobile Accordion Panel */}
                <div
                  className={`w-full overflow-hidden transition-all duration-500 ease-out-expo lg:hidden ${
                    active === service.id ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="text-sm text-near-black/70 mb-4">{service.description}</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="aspect-[16/10] w-full rounded-sm object-cover shadow-sm"
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden aspect-[4/5] overflow-hidden bg-cream lg:block">
          {activeService ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeService.image} alt={activeService.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center text-sm text-near-black/40">
              Hover a service to preview
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
