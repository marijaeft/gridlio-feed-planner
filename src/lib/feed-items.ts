import { supabase } from "~/lib/supabase";

export type FeedItemRow = {
  id: string;
  user_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
};

export const listFeedItems = async (userId: string) => {
  const { data, error } = await supabase
    .from("feed_items")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FeedItemRow[];
};

export const createFeedItem = async (
  userId: string,
  storagePath: string,
  sortOrder: number,
) => {
  const { data, error } = await supabase
    .from("feed_items")
    .insert({
      user_id: userId,
      storage_path: storagePath,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return data as FeedItemRow;
};

export const updateFeedItemOrder = async (
  id: string,
  sortOrder: number,
) => {
  const { error } = await supabase
    .from("feed_items")
    .update({ sort_order: sortOrder })
    .eq("id", id);

  if (error) throw error;
};

export const updateAllFeedItemOrders = async (
  items: { id: string; sort_order: number }[],
) => {
  for (const item of items) {
    const { error } = await supabase
      .from("feed_items")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id);

    if (error) throw error;
  }
};

export const deleteFeedItem = async (id: string) => {
  const { error } = await supabase
    .from("feed_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
};