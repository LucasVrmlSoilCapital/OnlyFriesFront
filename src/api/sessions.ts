import { supabase } from './supabase';

/**
 * Endpoint unifié pour récupérer toutes les informations d'une session
 */
export const getSession = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("get_session", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error fetching session: ${error.message}`);
  }

  return data;
};

/**
 * Crée une nouvelle session
 */
export const createSession = async (userId: string, iban: string) => {
  const { data, error } = await supabase.functions.invoke("create_session", {
    body: { user_id: userId, iban: iban },
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
  const { data, error } = await supabase.functions.invoke("join_session", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error joining session: ${error.message}`);
  }

  return data;
};

/**
 * Récupère les informations d'une session
 * @deprecated Utiliser getSession à la place
 */
export const getSessionInfos = async (userId: string, sessionCode: string) => {
  const ret = await supabase.functions.invoke("get_session_infos", {
    body: { user_id: userId, code: sessionCode },
  });
  return ret;
};

/**
 * Récupère les utilisateurs d'une session
 * @deprecated Utiliser getSession à la place
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

/**
 * Marque une session comme commandée (pour les admins)
 */
export const setSessionIsOrdered = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("set_session_is_ordered", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error setting session as ordered: ${error.message}`);
  }

  return data;
};

/**
 * Vérifie si une session a été commandée
 * @deprecated Utiliser getSession à la place
 */
export const isSessionOrdered = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("is_session_ordered", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error checking if session is ordered: ${error.message}`);
  }

  return data;
};