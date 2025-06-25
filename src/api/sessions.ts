import { supabase } from './supabase';

/**
 * Crée une nouvelle session
 */
export const createSession = async (userId: string, iban: string) => {
  const { data, error } = await supabase.functions.invoke("create_session", {
    body: { name: "Functions", user_id: userId, iban: iban },
  });

  if (error) {
    throw new Error(`Error creating session: ${error.message}`);
  }

  return data;
};

/**
 * Rejoint une session existante
 */
export const joinSession = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("create_command", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error joining session: ${error.message}`);
  }

  return data;
};

/**
 * Récupère les informations d'une session
 */
export const getSessionInfos = async (userId: string, sessionCode: string) => {
  const ret = await supabase.functions.invoke("get_session_infos", {
    body: { user_id: userId, code: sessionCode },
  });
  return ret;
};

/**
 * Récupère les utilisateurs d'une session
 */
export const getSessionUsers = async (sessionCode: string) => {
  const { data, error } = await supabase.functions.invoke("get_session_users", {
    body: { code: sessionCode },
  });

  if (error) {
    throw new Error(`Error fetching session users: ${error.message}`);
  }

  return data;
};