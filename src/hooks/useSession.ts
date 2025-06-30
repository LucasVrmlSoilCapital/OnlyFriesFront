import { useState, useEffect, useCallback } from 'react';
import { getSession } from '../api/sessions';

interface UserCommand {
  user_id: string;
  user_email: string;
  user_name: string;
  has_refund: boolean;
  items: any[];
}

interface SessionUser {
  id: string;
  email: string;
  name: string;
  has_ordered: boolean;
  has_refund: boolean;
}

interface SessionData {
  users: SessionUser[];
  orderedUsers: SessionUser[];
  pendingUsers: SessionUser[];
  refundedUsers: SessionUser[];
}

export const useSession = (sessionCode?: string, userId?: string) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    users: [],
    orderedUsers: [],
    pendingUsers: [],
    refundedUsers: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionData = useCallback(async () => {
    if (!sessionCode || !userId) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getSession(sessionCode, userId);
      const session = response.session;
      
      // Si l'utilisateur est owner, on peut voir tous les utilisateurs via users_command
      if (session.users_command && session.users_command.length > 0) {
        const users: SessionUser[] = session.users_command.map((userCmd: UserCommand) => ({
          id: userCmd.user_id,
          email: userCmd.user_email,
          name: userCmd.user_name,
          has_ordered: userCmd.items && userCmd.items.length > 0,
          has_refund: userCmd.has_refund
        }));
        
        setSessionData({
          users,
          orderedUsers: users.filter((user: SessionUser) => user.has_ordered),
          pendingUsers: users.filter((user: SessionUser) => !user.has_ordered),
          refundedUsers: users.filter((user: SessionUser) => user.has_refund)
        });
      } else {
        // Si ce n'est pas l'owner, on ne voit que sa propre commande
        const currentUser: SessionUser = {
          id: session.user_command.user_id,
          email: session.user_command.user_email,
          name: session.user_command.user_name,
          has_ordered: session.user_command.items && session.user_command.items.length > 0,
          has_refund: session.user_command.has_refund
        };
        
        setSessionData({
          users: [currentUser],
          orderedUsers: currentUser.has_ordered ? [currentUser] : [],
          pendingUsers: !currentUser.has_ordered ? [currentUser] : [],
          refundedUsers: currentUser.has_refund ? [currentUser] : []
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la session');
      console.error('Erreur lors de la récupération des données de session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionCode, userId]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  const refreshSession = useCallback(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  return {
    sessionData,
    isLoading,
    error,
    refreshSession,
    userCount: sessionData.users.length,
    orderedCount: sessionData.orderedUsers.length,
    pendingCount: sessionData.pendingUsers.length,
    refundedCount: sessionData.refundedUsers.length
  };
}; 