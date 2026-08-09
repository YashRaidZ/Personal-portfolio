import { getAllTestimonialsAdmin } from "@/lib/queries/testimonials";
import { TestimonialsManager } from "./TestimonialsManager";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Testimonials</h1>
      <p className="mt-1 text-sm text-text-muted">
        The Testimonials section hides itself automatically when there are none published.
      </p>
      <div className="mt-8">
        <TestimonialsManager initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
