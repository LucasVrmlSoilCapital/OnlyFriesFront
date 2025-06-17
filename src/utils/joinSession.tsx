import { supabase } from "./supabase";

export const joinSession = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("create_command", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error joining session: ${error.message}`);
  }

  return data;
};
