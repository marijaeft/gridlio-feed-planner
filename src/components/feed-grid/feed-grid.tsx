import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  type QRL,
} from "@builder.io/qwik";
import SortableJS from "sortablejs";
import type { FeedImage } from "~/lib/image-utils";

interface FeedGridProps {
  images: FeedImage[];
  onReorder$: QRL<(oldIndex: number, newIndex: number) => void>;
  onRemove$: QRL<(id: string) => void>;
}

export const FeedGrid = component$<FeedGridProps>(
  ({ images, onReorder$, onRemove$ }) => {
    const gridRef = useSignal<HTMLElement | undefined>(undefined);

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup, track }) => {
      track(() => images.length);

      if (!gridRef.value) return;

      const sortable = SortableJS.create(gridRef.value, {
        animation: 180,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        onEnd: (evt: any) => {
          if (
            evt.oldIndex == null ||
            evt.newIndex == null ||
            evt.oldIndex === evt.newIndex
          ) {
            return;
          }

          onReorder$(evt.oldIndex, evt.newIndex);
        },
      });

      cleanup(() => {
        sortable.destroy();
      });
    });

    const remove$ = $((id: string) => {
      onRemove$(id);
    });

    return (
      <div class="mt-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-900">Uploaded images</h2>
          <p class="text-sm text-neutral-500">Drag and drop to reorder</p>
        </div>

        <div ref={gridRef} class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              class="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-200 shadow-sm"
            >
              <img
                src={image.previewUrl}
                alt={image.name}
                class="h-full w-full object-cover"
              />

              <button
                class="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
                onClick$={() => remove$(image.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  },
);