export const siteConfig = {
  name: "YAVI",
  tagline: "Spaces that become stories.",
  supportingTagline: "Interior spaces, thoughtfully designed.",
  heroSupportingText:
    "Thoughtfully designed interiors shaped around the way you live.",
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  primaryCta: "Start Your Project",
  // Real business contact info must be supplied by YAVI before launch —
  // do not invent phone/email/address per project spec.
  contact: {
    phone: "080560 02400",
    email: "hello@yavi.studio",
    address: "Selaiyur, Chennai, Tiruvancheri, Tamil Nadu 600126",
    instagram: "https://www.instagram.com/yaviinteriorhub/",
    facebook: "https://www.facebook.com/yaviinteriorhub/",
    linkedin: "https://linkedin.com",
  },
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
};
