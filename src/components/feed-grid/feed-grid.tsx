import { component$, $, type QRL } from "@builder.io/qwik";
import type { FeedImage } from "~/lib/image-utils";

interface FeedGridProps {
  images: FeedImage[];
  onReorder$: QRL<(oldIndex: number, newIndex: number) => void>;
  onRemove$: QRL<(id: string) => void>;
}

export const FeedGrid = component$<FeedGridProps>(({ images, onRemove$ }) => {
  const remove$ = $((id: string) => {
    onRemove$(id);
  });

  return (
    <div class="mt-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-neutral-900">Uploaded images</h2>
        <p class="text-sm text-neutral-500">Newest images appear first</p>
      </div>

      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image) => {
          const id = image.id;
          const previewUrl = image.previewUrl;
          const name = image.name;

          return (
            <div
              key={id}
              class="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200 shadow-sm"
            >
              <img
                src={previewUrl}
                alt={name}
                width={300}
                height={400}
                class="h-full w-full object-cover object-center"
              />

              <button
                class="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                onClick$={() => remove$(id)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});