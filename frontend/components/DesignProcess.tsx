import TextReveal from "@/components/animations/TextReveal";

const STEPS = [
  { n: "01", title: "Discover", desc: "Understanding your space, your needs, and how you live." },
  { n: "02", title: "Consult", desc: "A detailed conversation on style, budget, and timeline." },
  { n: "03", title: "Concept", desc: "Mood boards, material palettes, and spatial direction." },
  { n: "04", title: "Design", desc: "Detailed drawings, 3D visualization, and material finalization." },
  { n: "05", title: "Execute", desc: "On-site execution managed end-to-end by our team." },
  { n: "06", title: "Deliver", desc: "A finished space, styled and ready to live in." },
];

export default function DesignProcess() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-12">
      <TextReveal className="eyebrow mb-10 text-bronze">Design Process</TextReveal>

      {/* Desktop: horizontal row */}
      <div className="hidden gap-px bg-near-black/10 lg:grid lg:grid-cols-6">
        {STEPS.map((step) => (
          <div key={step.n} className="bg-ivory px-5 py-8">
            <div className="font-display text-2xl text-bronze">{step.n}</div>
            <div className="mt-3 font-display text-xl text-near-black">{step.title}</div>
            <p className="mt-2 text-sm text-near-black/60">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="flex flex-col lg:hidden">
        {STEPS.map((step) => (
          <div key={step.n} className="flex gap-5 border-l border-near-black/15 py-6 pl-6 first:pt-0">
            <div className="-ml-[calc(1.5rem+5px)] mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-bronze" />
            <div>
              <div className="eyebrow text-near-black/40">{step.n}</div>
              <div className="mt-1 font-display text-xl text-near-black">{step.title}</div>
              <p className="mt-1 text-sm text-near-black/60">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
