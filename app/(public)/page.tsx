import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Process } from "@/components/sections/Process";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import {
  heroContent,
  aboutContent,
  services,
  projects,
  techCategories,
  processSteps,
  stats,
  testimonials,
  contactInfo,
} from "@/lib/queries/static-content";

export default function HomePage() {
  return (
    <>
      <Hero data={heroContent} />
      <About data={aboutContent} />
      <Services data={services} />
      <Projects data={projects} />
      <TechStack data={techCategories} />
      <Process data={processSteps} />
      <Stats data={stats} />
      <Testimonials data={testimonials} />
      <Contact data={contactInfo} />
    </>
  );
}
