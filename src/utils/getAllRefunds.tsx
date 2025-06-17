import { supabase } from "./supabase";

export const getAllRefunds = async (userId: string, code: string) => {
  const { data, error } = await supabase.functions.invoke("get_all_refunds", {
    body: { name: "Functions", user_id: userId, code: code },
  });

  if (error) {
    throw new Error(`Error creating session: ${error.message}`);
  }

  return data;
};
