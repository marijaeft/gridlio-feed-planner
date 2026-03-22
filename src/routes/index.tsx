import {
  component$,
  useSignal,
  $,
  useOnDocument,
  useVisibleTask$,
  type QRL,
} from "@builder.io/qwik";
import { UploadZone } from "~/components/upload-zone/upload-zone";
import { FeedGrid } from "~/components/feed-grid/feed-grid";
import { SortablePreview } from "~/components/feed-grid/sortable-preview";
import { AuthPanel } from "~/components/auth/auth-panel";
import { AuthStatus } from "~/components/auth/auth-status";
import {
  clipboardItemsToFeedImages,
  type FeedImage,
} from "~/lib/image-utils";
import { getCurrentUser } from "~/lib/auth";
import {
  listFeedItems,
  createFeedItem,
  deleteFeedItem,
  updateAllFeedItemOrders,
} from "~/lib/feed-items";
import { rowsToFeedImages } from "~/lib/feed-mappers";
import {
  uploadFeedImage,
  getSignedImageUrl,
  removeFeedImage,
} from "~/lib/storage";
import { supabase } from "~/lib/supabase";
import logoDark from "~/assets/gridlio-logo-darkmode.webp";

type DeviceMode = "mobile" | "tablet" | "desktop";

export default component$(() => {
  const images = useSignal<FeedImage[]>([]);
  const device = useSignal<DeviceMode>("mobile");
  const loadingSavedImages = useSignal(true);
  const isLoggedIn = useSignal(false);
  const saving = useSignal(false);

  const loadImagesForCurrentUser$ = $(async () => {
    loadingSavedImages.value = true;

    try {
      const user = await getCurrentUser();

      if (!user) {
        isLoggedIn.value = false;
        images.value = [];
        return;
      }

      isLoggedIn.value = true;

      const rows = await listFeedItems(user.id);
      const savedImages = await rowsToFeedImages(rows);

      images.value = savedImages;
    } catch (error) {
      console.error("Failed to load saved images", error);
      isLoggedIn.value = false;
      images.value = [];
    } finally {
      loadingSavedImages.value = false;
    }
  });

  const clearUiImages$ = $(() => {
    for (const image of images.value) {
      if (image.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(image.previewUrl);
      }
    }
    images.value = [];
  });

  const persistNewImages$ = $(async (newImages: FeedImage[]) => {
    if (newImages.length === 0) return;

    const user = await getCurrentUser();
    if (!user) {
      alert("Please log in first.");
      return;
    }

    saving.value = true;

    try {
      const savedItems: FeedImage[] = [];

      for (const image of newImages) {
        if (!image.file) continue;

        const storagePath = await uploadFeedImage(user.id, image.file);

        const row = await createFeedItem(user.id, storagePath, 0);
        const signedUrl = await getSignedImageUrl(storagePath);

        savedItems.push({
          id: row.id,
          name: image.name,
          previewUrl: signedUrl,
          createdAt: new Date(row.created_at).getTime(),
          storagePath,
        });

        if (image.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(image.previewUrl);
        }
      }

      const nextImages = [...savedItems, ...images.value];
      images.value = nextImages;

      await updateAllFeedItemOrders(
        nextImages.map((image, index) => ({
          id: image.id,
          sort_order: index,
        })),
      );
    } catch (error) {
      console.error("Failed to save images", error);
      alert("Failed to save images.");
    } finally {
      saving.value = false;
    }
  });

  const addImages$: QRL<(newImages: FeedImage[]) => void> = $(async (newImages) => {
    await persistNewImages$(newImages);
  });

  const removeImage$: QRL<(id: string) => void> = $(async (id: string) => {
    const imageToRemove = images.value.find((image) => image.id === id);
    if (!imageToRemove) return;

    try {
      await deleteFeedItem(id);

      if (imageToRemove.storagePath) {
        await removeFeedImage(imageToRemove.storagePath);
      }

      images.value = images.value.filter((image) => image.id !== id);

      await updateAllFeedItemOrders(
        images.value.map((image, index) => ({
          id: image.id,
          sort_order: index,
        })),
      );
    } catch (error) {
      console.error("Failed to remove image", error);
      alert("Failed to remove image.");
    }
  });

  const reorderImages$: QRL<(oldIndex: number, newIndex: number) => void> = $(
    async (oldIndex: number, newIndex: number) => {
      const next = [...images.value];
      const [moved] = next.splice(oldIndex, 1);

      if (!moved) return;

      next.splice(newIndex, 0, moved);
      images.value = next;

      try {
        await updateAllFeedItemOrders(
          next.map((image, index) => ({
            id: image.id,
            sort_order: index,
          })),
        );
      } catch (error) {
        console.error("Failed to reorder images", error);
        alert("Failed to save new order.");
      }
    },
  );

  const clearAll$ = $(async () => {
    const current = [...images.value];

    try {
      for (const image of current) {
        await deleteFeedItem(image.id);

        if (image.storagePath) {
          await removeFeedImage(image.storagePath);
        }

        if (image.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(image.previewUrl);
        }
      }

      images.value = [];
    } catch (error) {
      console.error("Failed to clear images", error);
      alert("Failed to clear all images.");
    }
  });

  useOnDocument(
    "paste",
    $((event: ClipboardEvent) => {
      if (!event.clipboardData?.items) return;

      const pastedImages = clipboardItemsToFeedImages(event.clipboardData.items);
      if (pastedImages.length === 0) return;

      persistNewImages$(pastedImages);
    }),
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    await loadImagesForCurrentUser$();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        isLoggedIn.value = false;
        await clearUiImages$();
        loadingSavedImages.value = false;
        return;
      }

      if (
        event === "SIGNED_IN" ||
        event === "INITIAL_SESSION" ||
        event === "TOKEN_REFRESHED"
      ) {
        isLoggedIn.value = true;
        await loadImagesForCurrentUser$();
      }
    });

    cleanup(() => {
      subscription.unsubscribe();
    });
  });

  if (!isLoggedIn.value && !loadingSavedImages.value) {
    return <AuthPanel />;
  }

  return (
    <main class="min-h-screen bg-neutral-100">
      <header class="sticky top-0 z-20 border-b border-white/10 bg-black text-white">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div class="flex flex-col">
            <img
              src={logoDark}
              alt="Gridlio"
              class="w-[150px] max-w-none opacity-95"
              width={150}
              height={36}
            />
            <div class="hidden sm:block">
              <p class="text-xs uppercase tracking-[0.16em] text-white/70">
                Personal Workspace
              </p>
            </div>
          </div>

          <AuthStatus />
        </div>
      </header>

      <div class="mx-auto max-w-7xl px-6 py-8">
        <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 class="text-4xl font-bold tracking-tight text-neutral-900">
              Plan your next posts visually
            </h2>
            <p class="mt-3 max-w-2xl text-neutral-600">
              Upload, paste, and reorder images directly in the preview to find
              the best layout before posting.
            </p>
          </div>

          {images.value.length > 0 && (
            <button
              class="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              onClick$={clearAll$}
            >
              Clear all
            </button>
          )}
        </div>

        {(saving.value || (loadingSavedImages.value && images.value.length === 0)) && (
          <div class="mb-6 rounded-2xl bg-white p-4 text-sm text-neutral-500 shadow-sm">
            {saving.value ? "Saving images..." : "Loading saved images..."}
          </div>
        )}

        <div class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section class="rounded-3xl bg-white p-6 shadow-sm">
            <UploadZone onImagesAdded$={addImages$} />

            {images.value.length > 0 ? (
              <FeedGrid
                images={images.value}
                onReorder$={reorderImages$}
                onRemove$={removeImage$}
              />
            ) : (
              <div class="mt-6 rounded-2xl bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                No images yet. Upload, drag in files, or paste a screenshot.
              </div>
            )}
          </section>

          <aside class="rounded-3xl bg-white p-6 shadow-sm">
            <div class="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 class="text-lg font-semibold text-neutral-900">Preview</h2>

              <div class="inline-flex rounded-2xl bg-neutral-100 p-1">
                <button
                  class={[
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    device.value === "mobile"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500",
                  ]}
                  onClick$={() => (device.value = "mobile")}
                >
                  Mobile
                </button>

                <button
                  class={[
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    device.value === "tablet"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500",
                  ]}
                  onClick$={() => (device.value = "tablet")}
                >
                  Tablet
                </button>

                <button
                  class={[
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    device.value === "desktop"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500",
                  ]}
                  onClick$={() => (device.value = "desktop")}
                >
                  Desktop
                </button>
              </div>
            </div>

            <SortablePreview
              images={images.value}
              device={device.value}
              onReorder$={reorderImages$}
            />

            <p class="mt-4 text-center text-sm text-neutral-500">
              Rearrange your feed visually by dragging images.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
});