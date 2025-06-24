import { supabase } from "./supabase";


export const getAllItemsPerUser = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("get_all_items", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error fetching items per user: ${error.message}`);
  }

  return data;
};
