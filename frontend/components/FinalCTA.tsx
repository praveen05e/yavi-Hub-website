"use client";

import TextReveal from "@/components/animations/TextReveal";
import { siteConfig } from "@/data/siteConfig";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-12 lg:py-36">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/cta/final-cta.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <TextReveal>
          <h2 className="font-display text-4xl text-ivory sm:text-5xl">Let&rsquo;s design your next space.</h2>
          <p className="mx-auto mt-5 max-w-lg text-ivory/75">
            Tell us about your space, your ideas, and the way you want it to feel.
          </p>
        </TextReveal>
        <TextReveal delay={0.15} className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            data-cursor="explore"
            className="rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-near-black transition-transform duration-300 ease-out-expo hover:-translate-y-0.5"
          >
            {siteConfig.primaryCta}
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("yavi:open-chat"))}
            data-cursor="explore"
            className="rounded-full border border-ivory/50 px-7 py-3.5 text-sm font-medium text-ivory transition-colors duration-300 hover:bg-ivory/10"
          >
            Talk to YAVI
          </button>
        </TextReveal>
      </div>
    </section>
  );
}
