import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { HeroIllustration } from "@/components/hero/HeroIllustration";
import { HeroContent } from "@/components/hero/HeroContent";
import type { HeroContentData } from "@/types/content";

interface HeroProps {
  data: HeroContentData;
}

export function Hero({ data }: HeroProps) {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-screen w-full items-end overflow-hidden bg-bg-primary"
    >
      <HeroCanvas />

      {/* Readability overlay -- opacity is theme-configurable in Phase 2 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,15,20,0.35) 0%, rgba(11,15,20,0.25) 40%, rgba(11,15,20,0.85) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-end gap-10 px-6 pb-24 pt-40 md:grid-cols-2 md:pb-32">
        <HeroContent data={data} />
        <div className="hidden justify-self-end md:block">
          <HeroIllustration />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="horizon-divider" />
      </div>
    </section>
  );
}
