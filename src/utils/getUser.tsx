import { supabase } from "./supabase";

export const getUser = async () => {
  return await supabase.auth.getUser();
};

export const createSession = async (userId: string, iban: string) => {
  const { data, error } = await supabase.functions.invoke("create_session", {
    body: { name: "Functions", user_id: userId, iban: iban },
  });

  if (error) {
    throw new Error(`Error creating session: ${error.message}`);
  }

  return data;
};

export const joinSession = async (sessionId: string) => {
  const { data, error } = await supabase.functions.invoke("join_session", {
    body: { session_id: sessionId },
  });

  if (error) {
    throw new Error(`Error joining session: ${error.message}`);
  }

  return data;
};
