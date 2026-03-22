import {
  component$,
  useSignal,
  useVisibleTask$,
  type QRL,
} from "@builder.io/qwik";
import SortableJS from "sortablejs";
import type { FeedImage } from "~/lib/image-utils";

type DeviceMode = "mobile" | "tablet" | "desktop";

interface SortablePreviewProps {
  images: FeedImage[];
  device: DeviceMode;
  onReorder$: QRL<(oldIndex: number, newIndex: number) => void>;
}

export const SortablePreview = component$<SortablePreviewProps>(
  ({ images, device, onReorder$ }) => {
    const gridRef = useSignal<HTMLElement | undefined>(undefined);
    const imageCount = images.length;

    const totalCells = Math.max(9, Math.ceil(imageCount / 3) * 3);
    const emptyCellsCount = totalCells - imageCount;

    const grid = (
      <div ref={gridRef} class="grid grid-cols-3 gap-px bg-white">
        {images.map((image) => {
          const id = image.id;
          const previewUrl = image.previewUrl;
          const name = image.name;

          return (
            <div
              key={id}
              class="aspect-[3/4] overflow-hidden bg-neutral-100"
              data-id={id}
              data-sortable-item="true"
            >
              <img
                src={previewUrl}
                alt={name}
                width={300}
                height={400}
                class="h-full w-full object-cover object-center"
                draggable={false}
              />
            </div>
          );
        })}

        {Array.from({ length: emptyCellsCount }).map((_, i) => (
          <div
            key={`empty-${i}`}
            class="aspect-[3/4] bg-neutral-100"
            data-sortable-item="false"
          />
        ))}
      </div>
    );

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup, track }) => {
      track(() => imageCount);
      track(() => device);

      if (!gridRef.value) return;

      const sortable = SortableJS.create(gridRef.value, {
        animation: 180,
        forceFallback: true,
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        draggable: '[data-sortable-item="true"]',
        onEnd: (evt: any) => {
          const oldIndex = evt.oldDraggableIndex;
          const newIndex = evt.newDraggableIndex;

          if (
            oldIndex == null ||
            newIndex == null ||
            oldIndex === newIndex
          ) {
            return;
          }

          onReorder$(oldIndex, newIndex);
        },
      });

      cleanup(() => sortable.destroy());
    });

    if (device === "mobile") {
      return (
        <div class="mx-auto w-full max-w-[360px]">
          <div class="rounded-[2.8rem] bg-black p-3 shadow-2xl">
            <div class="mx-auto mb-3 h-6 w-32 rounded-full bg-neutral-900" />

            <div class="overflow-hidden rounded-[2.1rem] bg-white">
              <div class="border-b border-neutral-200 px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-neutral-200" />
                  <div class="h-3 w-24 rounded bg-neutral-200" />
                </div>
              </div>

              <div class="max-h-[620px] overflow-y-auto bg-white">{grid}</div>
            </div>

            <div class="mx-auto mt-4 h-1.5 w-32 rounded-full bg-neutral-700" />
          </div>
        </div>
      );
    }

    if (device === "tablet") {
      return (
        <div class="mx-auto w-full max-w-[520px]">
          <div class="rounded-[2.4rem] bg-neutral-900 p-4 shadow-2xl">
            <div class="overflow-hidden rounded-[1.6rem] bg-white">
              <div class="border-b border-neutral-200 px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-full bg-neutral-200" />
                  <div class="h-3.5 w-28 rounded bg-neutral-200" />
                </div>
              </div>

              <div class="max-h-[700px] overflow-y-auto bg-white">{grid}</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class="mx-auto w-full max-w-[920px]">
        <div class="overflow-hidden rounded-[1.25rem] bg-neutral-900 shadow-2xl">
          <div class="flex items-center gap-2 border-b border-neutral-700 px-4 py-3">
            <span class="h-3 w-3 rounded-full bg-neutral-600" />
            <span class="h-3 w-3 rounded-full bg-neutral-600" />
            <span class="h-3 w-3 rounded-full bg-neutral-600" />
            <div class="ml-4 h-8 flex-1 rounded-full bg-neutral-800" />
          </div>

          <div class="bg-neutral-100 p-6">
            <div class="mx-auto max-w-[430px] overflow-hidden rounded-[0.75rem] bg-white shadow-sm">
              <div class="border-b border-neutral-200 px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-neutral-200" />
                  <div class="h-3 w-24 rounded bg-neutral-200" />
                </div>
              </div>

              <div class="max-h-[640px] overflow-y-auto bg-white">{grid}</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);