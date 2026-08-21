import type { Metadata } from "next";
import ProjectGallery from "@/components/ProjectGallery";
import TextReveal from "@/components/animations/TextReveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "A selection of interior design projects by YAVI across residential and commercial spaces.",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-40 text-center lg:pt-48">
        <TextReveal className="eyebrow text-bronze">Projects</TextReveal>
        <TextReveal delay={0.1} as="h1" className="mt-5 font-display text-4xl text-near-black sm:text-5xl">
          A selection of spaces we&rsquo;ve shaped.
        </TextReveal>
      </section>
      <ProjectGallery />
    </>
  );
}
