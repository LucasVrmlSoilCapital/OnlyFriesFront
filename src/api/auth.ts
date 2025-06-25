import { supabase } from './supabase';

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getUser = async () => {
  return await supabase.auth.getUser();
}; 