import { useState, useEffect, useCallback } from 'react';
import { getSessionUsers } from '../api/sessions';

interface SessionUser {
  id: string;
  email: string;
  has_ordered: boolean;
}

interface SessionData {
  users: SessionUser[];
  orderedUsers: SessionUser[];
  pendingUsers: SessionUser[];
}

export const useSession = (sessionCode?: string) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    users: [],
    orderedUsers: [],
    pendingUsers: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionData = useCallback(async () => {
    if (!sessionCode) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getSessionUsers(sessionCode);
      const users = response.users;
      
      setSessionData({
        users,
               orderedUsers: users.filter((user: SessionUser) => user.has_ordered),
       pendingUsers: users.filter((user: SessionUser) => !user.has_ordered)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la session');
      console.error('Erreur lors de la récupération des données de session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sessionCode]);

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
    pendingCount: sessionData.pendingUsers.length
  };
}; 