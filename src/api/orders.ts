import { supabase } from './supabase';

/**
 * Récupère les articles d'un utilisateur dans une session
 */
export const getItems = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("get_items", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error fetching items: ${error.message}`);
  }

  return data;
};

/**
 * Définit les articles d'un utilisateur dans une session
 */
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

/**
 * Récupère tous les articles de tous les utilisateurs dans une session
 */
export const getAllItemsPerUser = async (sessionCode: string, userId: string) => {
  const { data, error } = await supabase.functions.invoke("get_all_items", {
    body: { code: sessionCode, user_id: userId },
  });

  if (error) {
    throw new Error(`Error fetching items per user: ${error.message}`);
  }

  return data;
};

/**
 * Récupère toutes les commandes d'une session
 */
export const getAllCommands = async (sessionCode: string) => {
  const { data, error } = await supabase.functions.invoke("get_all_commands", {
    body: { code: sessionCode, name: "Functions" },
  });

  if (error) {
    throw new Error(`Error fetching commands: ${error.message}`);
  }
  
  return data;
};

/**
 * Récupère tous les remboursements
 */
export const getAllRefunds = async (userId: string, code: string) => {
  const { data, error } = await supabase.functions.invoke("get_all_refunds", {
    body: { name: "Functions", user_id: userId, code: code },
  });

  if (error) {
    throw new Error(`Error fetching refunds: ${error.message}`);
  }

  return data;
}; 