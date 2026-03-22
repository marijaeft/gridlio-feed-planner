export type FeedImage = {
  id: string;
  name: string;
  previewUrl: string;
  createdAt: number;
  file?: File;
  storagePath?: string;
};

export const filesToFeedImages = (files: FileList | File[]): FeedImage[] => {
  return Array.from(files)
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      createdAt: Date.now(),
      file,
    }));
};

export const clipboardItemsToFeedImages = (
  items: DataTransferItemList,
): FeedImage[] => {
  const files: File[] = [];

  for (const item of Array.from(items)) {
    if (item.kind === "file") {
      const file = item.getAsFile();
      if (file && file.type.startsWith("image/")) {
        files.push(file);
      }
    }
  }

  return files.map((file, index) => ({
    id: crypto.randomUUID(),
    name: file.name || `pasted-image-${index + 1}.png`,
    previewUrl: URL.createObjectURL(file),
    createdAt: Date.now(),
    file,
  }));
};