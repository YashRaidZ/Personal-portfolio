import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
  tone?: "primary" | "secondary";
}

export function SectionWrapper({
  id,
  ariaLabel,
  children,
  className,
  tone = "primary",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "relative py-24",
        tone === "secondary" && "bg-bg-secondary/40",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6">{children}</div>
      <div className="absolute inset-x-0 bottom-0">
        <div className="horizon-divider" />
      </div>
    </section>
  );
}
