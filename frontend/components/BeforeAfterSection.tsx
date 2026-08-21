import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import TextReveal from "@/components/animations/TextReveal";
import { projects } from "@/data/projects";

export default function BeforeAfterSection() {
  const project = projects.find((p) => p.beforeImage && p.afterImage) ?? projects[1];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <TextReveal className="eyebrow mb-10 text-bronze">Before / After</TextReveal>
      <BeforeAfterSlider
        beforeSrc={project.beforeImage || "/images/projects/apartment/before.jpg"}
        afterSrc={project.afterImage || "/images/projects/apartment/after.jpg"}
      />
      <TextReveal className="mt-8 max-w-lg">
        <h3 className="font-display text-2xl text-near-black">{project.title}</h3>
        <p className="mt-2 text-near-black/65">{project.concept}</p>
      </TextReveal>
    </section>
  );
}
