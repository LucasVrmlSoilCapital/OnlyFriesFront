import { supabase } from "./supabase";

export const getAllItems = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("get_all_items", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }

  return data;
};
