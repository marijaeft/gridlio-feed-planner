import type { FeedImage } from "~/lib/image-utils";
import type { FeedItemRow } from "~/lib/feed-items";
import { getSignedImageUrl } from "~/lib/storage";

export const rowsToFeedImages = async (
  rows: FeedItemRow[],
): Promise<FeedImage[]> => {
  return Promise.all(
    rows.map(async (row) => {
      const signedUrl = await getSignedImageUrl(row.storage_path);

      return {
        id: row.id,
        name: row.storage_path.split("/").pop() || "image",
        previewUrl: signedUrl,
        createdAt: new Date(row.created_at).getTime(),
        storagePath: row.storage_path,
      };
    }),
  );
};