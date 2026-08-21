import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import FeaturedProject from "@/components/FeaturedProject";
import AboutSection from "@/components/AboutSection";
import ServicesList from "@/components/ServicesList";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import StyleQuiz from "@/components/StyleQuiz";
import DesignProcess from "@/components/DesignProcess";
import ProjectGallery from "@/components/ProjectGallery";
import MaterialsShowcase from "@/components/MaterialsShowcase";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Introduction />
      <FeaturedProject />
      <AboutSection />
      <ServicesList />
      <BeforeAfterSection />
      <StyleQuiz />
      <DesignProcess />
      <ProjectGallery />
      <MaterialsShowcase />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
