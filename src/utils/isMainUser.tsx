import { supabase } from "./supabase";

export const getSessionInfos = async (userId: string, sessionCode: string) => {
  const ret = await supabase.functions.invoke("get_session_infos", {
    body: { user_id: userId, code: sessionCode },
  });
  return ret;
};
