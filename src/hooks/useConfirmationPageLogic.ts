import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getSession } from "../api/sessions";
import { setRefund } from "../api/orders";
import { useAuth } from "../contexts/AuthContext";

interface Item {
  id: number;
  uuid_fritzy: string;
  name: string;
  price: number;
  number: number;
  comment: string;
  price_total: number;
  extras: ItemExtra[];
}

interface ItemExtra {
  group_uuid: string;
  group_name: { [lang: string]: string };
  option_uuid: string;
  selection_id: number;
  choice_name: { [lang: string]: string };
  qty: number;
  price_unit: number;
  price_total: number;
}

interface SessionData {
  code: string;
  is_ordered: boolean;
  owner_name: string;
  owner_iban: string;
  owner_email: string;
  user_command: {
    user_id: string;
    user_email: string;
    user_name: string;
    has_refund: boolean;
    items: Item[];
  };
  users_command: Array<{
    user_id: string;
    user_email: string;
    user_name: string;
    has_refund: boolean;
    items: Item[];
  }>;
}

export const useConfirmationPageLogic = (userId: any) => {
  const [isMainUser, setIsMainUser] = useState<boolean>(false);
  const [iban, setIban] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userTotal, setUserTotal] = useState<number>(0);
  const [hasRefunded, setHasRefunded] = useState<boolean>(false);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState<boolean>(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const { sessionCode } = useParams();
  const { user } = useAuth();

  const markAsRefunded = useCallback(async () => {
    if (!sessionCode || !userId?.userId || isSubmittingRefund) return;
    
    try {
      setIsSubmittingRefund(true);
      await setRefund(sessionCode, userId.userId);
      setHasRefunded(true);
    } catch (error) {
      console.error("❌ Erreur lors du marquage du remboursement:", error);
    } finally {
      setIsSubmittingRefund(false);
    }
  }, [sessionCode, userId?.userId, isSubmittingRefund]);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer toutes les données de session en une seule fois
        const response = await getSession(sessionCode as string, userId.userId);
        const session: SessionData = response.session;
        setSessionData(session);

        // Déterminer si l'utilisateur est le main user
        const isUserMainUser = session.users_command && session.users_command.length > 0;
        setIsMainUser(isUserMainUser);
        
        // Récupérer les informations du propriétaire
        setIban(session.owner_iban);
        setEmail(session.owner_email);
        
        // Récupérer le statut de commande
        setIsOrdered(session.is_ordered);
        
        // Récupérer les items de l'utilisateur et son statut de remboursement
        if (session.user_command) {
          const items = session.user_command.items || [];
          setUserItems(items);
          setHasRefunded(session.user_command.has_refund);
          
          // Calculer le total à partir des items
          const total = items.reduce((sum: number, item: Item) => sum + item.price_total, 0);
          setUserTotal(total);
          setAmount(total); // Utiliser le total calculé comme montant à payer
        } else {
          setUserItems([]);
          setUserTotal(0);
          setAmount(0);
          setHasRefunded(false);
        }

        setInitialLoadDone(true);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionCode && userId?.userId) {
      loadSessionData();
    }
  }, [userId?.userId, sessionCode]);

  // Fonction pour vérifier le statut de commande (pour non-main-users)
  const checkOrderStatus = useCallback(async () => {
    if (!sessionCode || !userId?.userId) return false;
    
    try {
      const response = await getSession(sessionCode, userId.userId);
      const session: SessionData = response.session;
      const ordered = session.is_ordered || false;
      setIsOrdered(ordered);
      return ordered;
    } catch (error) {
      console.error("❌ Erreur lors de la vérification du statut de commande:", error);
      return false;
    }
  }, [sessionCode, userId?.userId]);

  // Polling pour les non-main-users quand la commande n'est pas encore passée
  useEffect(() => {
    // Condition pour démarrer le polling pour non-main-users seulement (s'arrête quand ordered)
    const shouldStartPollingForUser = initialLoadDone && !isMainUser && !isOrdered && sessionCode && userId?.userId && !isLoading;

    if (shouldStartPollingForUser) {
      const interval = setInterval(async () => {
        const ordered = await checkOrderStatus();
        if (ordered) {
          // Le polling s'arrêtera automatiquement car isOrdered va changer
        }
      }, 5000); // 5 secondes
      
      return () => {
        clearInterval(interval);
      };
    }
  }, [initialLoadDone, isMainUser, isOrdered, sessionCode, userId?.userId, isLoading, checkOrderStatus]);

  return {
    isMainUser,
    iban,
    email,
    amount,
    isLoading,
    sessionCode,
    isOrdered,
    initialLoadDone,
    userItems,
    userTotal,
    hasRefunded,
    isSubmittingRefund,
    markAsRefunded,
    sessionData,
  };
}; 