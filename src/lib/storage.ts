import { supabase } from "~/lib/supabase";

const BUCKET = "feed-images";

export const uploadFeedImage = async (
  userId: string,
  file: File,
) => {
  const extension = file.name.split(".").pop() || "png";
  const fileName = `${crypto.randomUUID()}.${extension}`;
  const storagePath = `${userId}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      upsert: false,
    });

  if (error) throw error;

  return storagePath;
};

export const getSignedImageUrl = async (storagePath: string) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60);

  if (error) throw error;

  return data.signedUrl;
};

export const removeFeedImage = async (storagePath: string) => {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw error;
};