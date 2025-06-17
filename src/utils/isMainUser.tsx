import { supabase } from "./supabase";

export const getIsMainUser = async (userId: string, sessionCode: string) => {
  const ret = await supabase.functions.invoke("is_main_user", {
    body: { user_id: userId, code: sessionCode },
  });
  return ret;
};
