export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export const services: Service[] = [
  { id: "residential-interiors", title: "Residential Interiors", image: "/images/services/residential.jpg",
    description: "Full-home interiors shaped around how you actually live, not a showroom template." },
  { id: "villa-interiors", title: "Villa Interiors", image: "/images/services/villa.jpg",
    description: "Large-format spatial design for independent homes, indoors and out." },
  { id: "apartment-interiors", title: "Apartment Interiors", image: "/images/services/apartment.jpg",
    description: "Space-efficient, editorial apartment design that never feels compromised." },
  { id: "modular-kitchens", title: "Modular Kitchens", image: "/images/services/kitchen.jpg",
    description: "Custom kitchen systems engineered for daily use and built to last." },
  { id: "custom-furniture", title: "Custom Furniture", image: "/images/services/furniture.jpg",
    description: "Bespoke furniture pieces designed and built specifically for your space." },
  { id: "commercial-interiors", title: "Commercial Interiors", image: "/images/services/commercial.jpg",
    description: "Interiors for retail and hospitality spaces that hold a brand's attention." },
  { id: "office-interiors", title: "Office Interiors", image: "/images/services/office.jpg",
    description: "Workspaces designed for focus, culture, and everyday comfort." },
  { id: "turnkey-solutions", title: "Turnkey Interior Solutions", image: "/images/services/turnkey.jpg",
    description: "End-to-end execution from concept to handover, managed by one team." },
];
