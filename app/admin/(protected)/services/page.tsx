import { getAllServicesAdmin } from "@/lib/queries/services";
import { ServicesManager } from "./ServicesManager";

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Services</h1>
      <p className="mt-1 text-sm text-text-muted">Drag to reorder. Unpublished services are hidden from the public site.</p>
      <div className="mt-8">
        <ServicesManager initialServices={services} />
      </div>
    </div>
  );
}
