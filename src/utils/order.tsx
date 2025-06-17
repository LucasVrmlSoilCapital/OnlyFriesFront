import { supabase } from "./supabase";

export const setItems = async (
  code: string,
  user: any,
  items: any,
  onSuccess?: (data: any) => void
) => {
  const { data, error } = await supabase.functions.invoke("set_items", {
    body: { code: code, items: items, user_id: user.id },
  });

  if (error) {
    throw new Error(`Error setting items: ${error.message}`);
  }

  if (onSuccess) {
    onSuccess(data);
  }

  return data;
};
