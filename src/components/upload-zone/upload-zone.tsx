import { component$, $, type QRL } from "@builder.io/qwik";
import { filesToFeedImages, type FeedImage } from "~/lib/image-utils";

interface UploadZoneProps {
  onImagesAdded$: QRL<(images: FeedImage[]) => void>;
}

export const UploadZone = component$<UploadZoneProps>(({ onImagesAdded$ }) => {
  const handleChange$ = $((event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const images = filesToFeedImages(input.files);
    onImagesAdded$(images);

    input.value = "";
  });

  const handleDrop$ = $((event: DragEvent) => {

    if (!event.dataTransfer?.files || event.dataTransfer.files.length === 0) {
      return;
    }

    const images = filesToFeedImages(event.dataTransfer.files);
    onImagesAdded$(images);
  });

  const handleDragOver$ = $(() => {});

  return (
    <label
      class="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center transition hover:border-neutral-500"
      preventdefault:drop
      preventdefault:dragover
      onDrop$={handleDrop$}
      onDragOver$={handleDragOver$}
    >
      <div class="space-y-3">
        <p class="text-lg font-semibold text-neutral-800">Add images</p>
        <p class="text-sm text-neutral-500">
          Drag and drop, click to browse, or paste from clipboard
        </p>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        onChange$={handleChange$}
      />
    </label>
  );
});