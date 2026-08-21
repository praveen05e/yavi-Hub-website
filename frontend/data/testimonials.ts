export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  projectType: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "The team transformed our house into a space that genuinely feels like us.",
    name: "Residential Client",
    projectType: "Villa Interior, Chennai",
  },
  {
    id: "t2",
    quote: "Every material choice had a reason. Nothing felt decorative for its own sake.",
    name: "Residential Client",
    projectType: "3BHK Apartment, Chennai",
  },
  {
    id: "t3",
    quote: "They understood our brand before they drew a single wall.",
    name: "Commercial Client",
    projectType: "Office Fit-Out, Chennai",
  },
];
