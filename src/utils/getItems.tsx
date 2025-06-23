import { supabase } from "./supabase";

export const getItems = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("get_items", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }

  return data;
}; 