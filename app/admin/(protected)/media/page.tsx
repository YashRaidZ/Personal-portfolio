import { getMediaLibrary } from "@/lib/queries/media";
import { MediaLibraryManager } from "./MediaLibraryManager";

export default async function AdminMediaPage() {
  const media = await getMediaLibrary();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-text-primary">Media Library</h1>
      <p className="mt-1 text-sm text-text-muted">
        Every upload is automatically compressed and converted to WebP (SVGs pass through untouched).
      </p>
      <div className="mt-8">
        <MediaLibraryManager initialMedia={media} />
      </div>
    </div>
  );
}
