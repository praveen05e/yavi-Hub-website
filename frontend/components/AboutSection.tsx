import MaskReveal from "@/components/animations/MaskReveal";
import TextReveal from "@/components/animations/TextReveal";

export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-12">
        <TextReveal>
          <span className="eyebrow text-bronze">About YAVI</span>
          <h2 className="mt-5 font-display text-4xl leading-tight text-near-black lg:text-5xl">
            Design led by material honesty and everyday living.
          </h2>
        </TextReveal>
        <TextReveal delay={0.15} className="flex flex-col justify-center gap-5 text-near-black/75">
          <p>
            YAVI is an interior design studio working across residential and commercial spaces,
            grounded in a simple idea: a space should reflect the people who live in it, not a trend.
          </p>
          <p>
            Every project is shaped by close collaboration, honest material choices, and craftsmanship
            that holds up to daily life — not just a photograph.
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <li className="border-t border-near-black/10 pt-3">Design Philosophy</li>
            <li className="border-t border-near-black/10 pt-3">Personalization</li>
            <li className="border-t border-near-black/10 pt-3">Craftsmanship</li>
            <li className="border-t border-near-black/10 pt-3">Considered Materials</li>
          </ul>
        </TextReveal>
      </div>
      <MaskReveal
        src="/images/about/studio-detail.jpg"
        alt="Architectural detail from a YAVI project"
        className="mt-12 aspect-[16/7] w-full"
      />
    </section>
  );
}
