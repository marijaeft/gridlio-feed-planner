import { component$ } from "@builder.io/qwik";
import type { FeedImage } from "~/lib/image-utils";

type DeviceMode = "mobile" | "tablet" | "desktop";

interface DevicePreviewProps {
  images: FeedImage[];
  device: DeviceMode;
}

export const DevicePreview = component$<DevicePreviewProps>(
  ({ images, device }) => {
    const totalCells = Math.max(9, Math.ceil(images.length / 3) * 3);
    const emptyCellsCount = totalCells - images.length;

    const cells = [
      ...images.map((image) => (
        <div key={image.id} class="aspect-square overflow-hidden bg-neutral-100">
          <img
            src={image.previewUrl}
            alt={image.name}
            class="h-full w-full object-cover"
            draggable={false}
            width={300}
            height={400}
          />
        </div>
      )),
      ...Array.from({ length: emptyCellsCount }).map((_, i) => (
        <div key={`empty-${i}`} class="aspect-square bg-neutral-100" />
      )),
    ];

    const grid = (
      <div class="grid grid-cols-3 gap-[2px] bg-neutral-200 p-[2px]">
        {cells}
      </div>
    );

    if (device === "mobile") {
      return (
        <div class="mx-auto w-full max-w-[320px]">
          <div class="rounded-[2.6rem] bg-neutral-900 p-3 shadow-2xl">
            <div class="mb-3 flex justify-center">
              <div class="h-1.5 w-24 rounded-full bg-neutral-700" />
            </div>

            <div class="overflow-hidden rounded-[2rem] bg-white">
              {grid}
            </div>

            <div class="pt-3" />
          </div>
        </div>
      );
    }

    if (device === "tablet") {
      return (
        <div class="mx-auto w-full max-w-[520px]">
          <div class="rounded-[2.2rem] bg-neutral-900 p-4 shadow-2xl">
            <div class="overflow-hidden rounded-[1.4rem] bg-white">
              {grid}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div class="mx-auto w-full max-w-[820px]">
        <div class="rounded-[1.4rem] bg-neutral-900 p-3 shadow-2xl">
          <div class="rounded-[0.9rem] bg-neutral-800 p-2">
            <div class="mb-2 flex items-center gap-2 px-2">
              <span class="h-3 w-3 rounded-full bg-neutral-600" />
              <span class="h-3 w-3 rounded-full bg-neutral-600" />
              <span class="h-3 w-3 rounded-full bg-neutral-600" />
            </div>

            <div class="overflow-hidden rounded-[0.5rem] bg-white">
              {grid}
            </div>
          </div>

          <div class="mx-auto mt-3 h-3 w-28 rounded-b-full bg-neutral-700" />
        </div>
      </div>
    );
  },
);