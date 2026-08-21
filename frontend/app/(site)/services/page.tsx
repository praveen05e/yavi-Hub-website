import type { Metadata } from "next";
import ServicesList from "@/components/ServicesList";
import FinalCTA from "@/components/FinalCTA";
import TextReveal from "@/components/animations/TextReveal";

export const metadata: Metadata = {
  title: "Services",
  description: "Residential, villa, apartment, and commercial interior design services from YAVI.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-40 text-center lg:pt-48">
        <TextReveal className="eyebrow text-bronze">Services</TextReveal>
        <TextReveal delay={0.1} as="h1" className="mt-5 font-display text-4xl text-near-black sm:text-5xl">
          Design services shaped around your space.
        </TextReveal>
      </section>
      <ServicesList />
      <FinalCTA />
    </>
  );
}
