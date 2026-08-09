import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Process } from "@/components/sections/Process";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { getHeroContent } from "@/lib/queries/hero";
import { getAboutContent } from "@/lib/queries/about";
import { getServices } from "@/lib/queries/services";
import { getProjects } from "@/lib/queries/projects";
import { getTechCategories } from "@/lib/queries/tech-stack";
import { getTestimonials } from "@/lib/queries/testimonials";
import { getContactInfo } from "@/lib/queries/contact-info";
// process_steps and stats stay static/code-defined for now -- see Phase 2
// handoff notes: stats need a real GitHub API integration (Phase 3), and
// the "how I work" process steps rarely change, so neither warranted a
// full CMS domain in this phase.
import { processSteps, stats } from "@/lib/queries/static-content";

export const revalidate = 60;

export default async function HomePage() {
  const [heroContent, aboutContent, services, projects, techCategories, testimonials, contactInfo] =
    await Promise.all([
      getHeroContent(),
      getAboutContent(),
      getServices(),
      getProjects(),
      getTechCategories(),
      getTestimonials(),
      getContactInfo(),
    ]);

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
