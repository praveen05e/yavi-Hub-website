import TextReveal from "@/components/animations/TextReveal";

export default function Introduction() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12 text-center lg:py-24">
      <TextReveal as="p" className="font-display text-3xl leading-snug text-near-black sm:text-4xl lg:text-5xl">
        We believe interiors should not simply look beautiful.
      </TextReveal>
      <TextReveal delay={0.15} as="p" className="mt-4 font-display text-3xl italic leading-snug text-bronze sm:text-4xl lg:text-5xl">
        They should feel like they belong to the people who live in them.
      </TextReveal>
    </section>
  );
}
