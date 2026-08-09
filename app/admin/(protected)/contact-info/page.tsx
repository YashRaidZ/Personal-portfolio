import { getContactInfo } from "@/lib/queries/contact-info";
import { ContactInfoForm } from "./ContactInfoForm";

export default async function AdminContactInfoPage() {
  const contactInfo = await getContactInfo();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Contact Info</h1>
      <p className="mt-1 text-sm text-text-muted">Shown in the Contact section of the public site.</p>
      <div className="mt-8">
        <ContactInfoForm initialData={contactInfo} />
      </div>
    </div>
  );
}
