import { supabase } from "./supabase";

export const getSessionUsers = async (sessionCode: string) => {
  const { data, error } = await supabase.functions.invoke("get_session_users", {
    body: { code: sessionCode },
  });

  if (error) {
    throw new Error(`Error fetching session users: ${error.message}`);
  }

  return data;
}; 