import Link from "next/link";
import MaskReveal from "@/components/animations/MaskReveal";
import TextReveal from "@/components/animations/TextReveal";
import { projects } from "@/data/projects";

export default function FeaturedProject() {
  const project = projects[0];
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <TextReveal className="eyebrow mb-6 text-bronze">01 — Featured Project</TextReveal>
      <Link href={`/projects/${project.slug}`} data-cursor="view" className="group block">
        <MaskReveal
          src={project.heroImage}
          alt={project.title}
          className="aspect-[16/9] w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.01] lg:aspect-[21/9]"
        />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-display text-3xl text-near-black sm:text-4xl">{project.title}</h3>
          <div className="text-sm text-near-black/60">
            {project.location} · {project.category} Interior
          </div>
        </div>
      </Link>
    </section>
  );
}
