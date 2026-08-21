import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";
import DesignProcess from "@/components/DesignProcess";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import TextReveal from "@/components/animations/TextReveal";

export const metadata: Metadata = {
  title: "About",
  description: "YAVI is an interior design studio grounded in material honesty and everyday living.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-40 text-center lg:pt-48">
        <TextReveal className="eyebrow text-bronze">About YAVI</TextReveal>
        <TextReveal delay={0.1} as="h1" className="mt-5 font-display text-4xl text-near-black sm:text-5xl">
          Interior spaces, thoughtfully designed.
        </TextReveal>
      </section>
      <AboutSection />
      <DesignProcess />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
