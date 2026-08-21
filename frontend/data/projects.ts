export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: "Residential" | "Villa" | "Apartment" | "Commercial" | "Kitchen" | "Furniture";
  sizeSqft: string;
  year: string;
  heroImage: string;
  gallery: string[];
  concept: string;
  materials: string;
  designApproach: string;
  challenges: string;
  result: string;
  beforeImage?: string;
  afterImage?: string;
};

// NOTE: heroImage/gallery paths are structured placeholders.
// Replace with real YAVI photography at these paths — no component
// changes are needed elsewhere when you do.
export const projects: Project[] = [
  {
    id: "modern-villa",
    slug: "modern-villa-chennai",
    title: "Modern Villa",
    location: "Chennai",
    category: "Villa",
    sizeSqft: "1,850",
    year: "2026",
    heroImage: "/images/projects/modern-villa/hero.jpg",
    gallery: [
      "/images/projects/modern-villa/living.jpg",
      "/images/projects/modern-villa/kitchen.jpg",
      "/images/projects/modern-villa/bedroom.jpg",
      "/images/projects/modern-villa/details.jpg",
    ],
    concept: "A warm, material-led villa design built around natural light and quiet, considered spaces.",
    materials: "American oak, honed marble, brushed brass, linen upholstery.",
    designApproach: "Open-plan living anchored by a sculptural staircase, with zoned privacy for bedrooms.",
    challenges: "Integrating a double-height living space without losing the home's warmth.",
    result: "A calm, editorial family home that photographs like a magazine feature and lives like a home.",
  },
  {
    id: "apartment-transformation",
    slug: "contemporary-apartment-3bhk",
    title: "3BHK Apartment Transformation",
    location: "Chennai",
    category: "Apartment",
    sizeSqft: "1,400",
    year: "2026",
    heroImage: "/images/projects/apartment/hero.jpg",
    gallery: [
      "/images/projects/apartment/living.jpg",
      "/images/projects/apartment/dining.jpg",
      "/images/projects/apartment/bedroom.jpg",
    ],
    concept: "From an empty shell to a warm contemporary home for a young family.",
    materials: "Veneer, terrazzo, linen, matte-black hardware.",
    designApproach: "Zoned living and dining with custom modular furniture for a compact footprint.",
    challenges: "Maximizing storage without visual clutter in a mid-size apartment.",
    result: "A functional, light-filled apartment that never feels tight.",
    beforeImage: "/images/projects/apartment/before.jpg",
    afterImage: "/images/projects/apartment/after.jpg",
  },
  {
    id: "commercial-studio",
    slug: "boutique-office-fitout",
    title: "Boutique Office Fit-Out",
    location: "Chennai",
    category: "Commercial",
    sizeSqft: "3,200",
    year: "2025",
    heroImage: "/images/projects/office/hero.jpg",
    gallery: [
      "/images/projects/office/lounge.jpg",
      "/images/projects/office/meeting.jpg",
    ],
    concept: "A workspace designed to feel more like a considered residence than a corporate office.",
    materials: "Ash plywood, wool carpet, powder-coated steel.",
    designApproach: "Layered zones for focus work, collaboration, and informal meetings.",
    challenges: "Acoustic control in an open, exposed-ceiling shell.",
    result: "A workspace teams choose to come into.",
  },
  {
    id: "residential-residence",
    slug: "minimalist-residential-home",
    title: "Minimalist Residence",
    location: "Chennai",
    category: "Residential",
    sizeSqft: "2,200",
    year: "2026",
    heroImage: "/images/projects/residential/hero.jpg",
    gallery: [
      "/images/projects/residential/hero.jpg",
    ],
    concept: "An exercise in quiet luxury and structural alignment.",
    materials: "Travertine, raw concrete, oiled teak.",
    designApproach: "Strict linear flow opening out to a private courtyard.",
    challenges: "Achieving seamless flush junctions across multiple stone surfaces.",
    result: "A sanctuary of scale and silence.",
  },
  {
    id: "modular-kitchen-chennai",
    slug: "sleek-modular-kitchen",
    title: "Sleek Modular Kitchen",
    location: "Chennai",
    category: "Kitchen",
    sizeSqft: "380",
    year: "2026",
    heroImage: "/images/projects/kitchen/hero.jpg",
    gallery: [
      "/images/projects/kitchen/hero.jpg",
    ],
    concept: "A precise, line-led professional grade kitchen for modern cooking.",
    materials: "Fenix NTM, stainless steel, smoked glass.",
    designApproach: "Disappearing pocket door systems to conceal main work areas.",
    challenges: "Integrating dual-induction hobs within a custom cantilevered island.",
    result: "A kitchen that functions like a laboratory and feels like a gallery.",
  },
  {
    id: "bespoke-credenza",
    slug: "custom-wood-furniture",
    title: "Bespoke Walnut Credenza",
    location: "Chennai",
    category: "Furniture",
    sizeSqft: "12",
    year: "2025",
    heroImage: "/images/projects/furniture/hero.jpg",
    gallery: [
      "/images/projects/furniture/hero.jpg",
    ],
    concept: "A custom storage piece matching the geometry of the living space.",
    materials: "Solid American walnut, black steel frame.",
    designApproach: "Floating credenza mount with integrated media cooling ventilation.",
    challenges: "Ensuring zero deflection across a wide unsupported solid span.",
    result: "A tailored piece that grounds the entertainment wall.",
  },
];

export const projectCategories = [
  "All",
  "Residential",
  "Villa",
  "Apartment",
  "Commercial",
  "Kitchen",
  "Furniture",
] as const;
