import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import MaskReveal from "@/components/animations/MaskReveal";
import TextReveal from "@/components/animations/TextReveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.concept,
    openGraph: { title: project.title, description: project.concept, images: [project.heroImage] },
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) return notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="relative flex h-[80vh] min-h-[520px] items-end bg-charcoal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.heroImage} alt={project.title} className="absolute inset-0 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 via-near-black/10 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 text-ivory lg:px-10">
          <h1 className="font-display text-4xl sm:text-5xl">{project.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ivory/75">
            <span>{project.location}</span>
            <span>{project.category}</span>
            <span>{project.sizeSqft} sq.ft</span>
            <span>{project.year}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 lg:py-12">
        <TextReveal className="font-display text-2xl leading-snug text-near-black sm:text-3xl">
          {project.concept}
        </TextReveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          <div>
            <div className="eyebrow text-near-black/40">Materials</div>
            <p className="mt-2 text-near-black/75">{project.materials}</p>
          </div>
          <div>
            <div className="eyebrow text-near-black/40">Design Approach</div>
            <p className="mt-2 text-near-black/75">{project.designApproach}</p>
          </div>
          <div>
            <div className="eyebrow text-near-black/40">Challenges</div>
            <p className="mt-2 text-near-black/75">{project.challenges}</p>
          </div>
          <div>
            <div className="eyebrow text-near-black/40">Result</div>
            <p className="mt-2 text-near-black/75">{project.result}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {project.gallery.map((src, i) => (
            <MaskReveal
              key={src}
              src={src}
              alt={`${project.title} — image ${i + 1}`}
              className={`aspect-[4/5] ${i % 3 === 0 ? "sm:row-span-2 sm:aspect-auto" : ""}`}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-near-black/10 bg-cream py-12">
        <Link
          href={`/projects/${next.slug}`}
          data-cursor="view"
          className="group mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10"
        >
          <div>
            <div className="eyebrow text-near-black/40">Next Project</div>
            <div className="mt-2 font-display text-3xl text-near-black transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
              {next.title} →
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
