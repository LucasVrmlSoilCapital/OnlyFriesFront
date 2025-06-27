import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getSessionInfos, isSessionOrdered } from "../api/sessions";
import { getItems } from "../api/orders";
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

export const useConfirmationPageLogic = (userId: any) => {
  const [isMainUser, setIsMainUser] = useState<boolean>(false);
  const [iban, setIban] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOrdered, setIsOrdered] = useState<boolean>(false);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  const [userItems, setUserItems] = useState<Item[]>([]);

  const { sessionCode } = useParams();
  const { user } = useAuth();

  const checkOrderStatus = useCallback(async () => {
    if (!sessionCode || !userId?.userId) return;
    
    try {
      console.log("🔍 Vérification du statut de commande...");
      const response = await isSessionOrdered(sessionCode, userId.userId);
      console.log("📊 Réponse statut de commande:", response);
      const ordered = response.data || false;
      setIsOrdered(ordered);
      console.log(`✅ isOrdered mis à jour: ${ordered}`);
      return ordered;
    } catch (error) {
      console.error("❌ Erreur lors de la vérification du statut de commande:", error);
      return false;
    }
  }, [sessionCode, userId?.userId]);

  useEffect(() => {
    const callGetIsMainUser = async () => {
      try {
        setIsLoading(true);
        const data = await getSessionInfos(
          userId.userId,
          sessionCode as string
        );
        setIsMainUser(data.data.owner_id === userId.userId);
        setIban(data.data.iban);
        setEmail(data.data.owner_email);
        setAmount(data.data.price_to_pay);
        
        // Récupérer les items de l'utilisateur pour le récapitulatif
        try {
          const itemsResponse = await getItems(sessionCode as string, userId.userId);
          setUserItems(itemsResponse.data || []);
          console.log("📋 Items utilisateur récupérés:", itemsResponse.data);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des items:", error);
          setUserItems([]);
        }
        
        // Vérifier le statut de commande
        await checkOrderStatus();
        setInitialLoadDone(true);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    callGetIsMainUser();
  }, [userId.userId, sessionCode, checkOrderStatus]);

  // Polling pour les non-main-users quand la commande n'est pas encore passée
  useEffect(() => {
    console.log("🔄 Configuration du polling ConfirmationPage:", { 
      initialLoadDone, 
      isMainUser, 
      isOrdered, 
      sessionCode: !!sessionCode, 
      userId: !!userId?.userId, 
      isLoading 
    });

    // Condition pour démarrer le polling
    const shouldStartPolling = initialLoadDone && !isMainUser && !isOrdered && sessionCode && userId?.userId && !isLoading;

    if (shouldStartPolling) {
      console.log("🚀 DÉMARRAGE DU POLLING toutes les 5 secondes pour non-main-user dans ConfirmationPage");
      
      const interval = setInterval(async () => {
        console.log("⏰ Polling en cours...", new Date().toLocaleTimeString());
        const ordered = await checkOrderStatus();
        if (ordered) {
          console.log("🎉 Commande détectée comme confirmée, le polling va s'arrêter automatiquement");
          // Le polling s'arrêtera automatiquement car isOrdered va changer et déclencher un nouveau useEffect
        }
      }, 5000); // 5 secondes
      
      return () => {
        console.log("🛑 Arrêt du polling ConfirmationPage");
        clearInterval(interval);
      };
    } else {
      if (isOrdered) {
        console.log("✅ Polling arrêté car la commande est confirmée");
      } else {
        console.log("❌ Polling non démarré dans ConfirmationPage:", {
          raison: !initialLoadDone ? "initialLoadDone=false" : 
                  isMainUser ? "isMainUser=true" : 
                  !sessionCode ? "pas de sessionCode" : 
                  !userId?.userId ? "pas de userId" : 
                  isLoading ? "isLoading=true" : "unknown"
        });
      }
    }
  }, [initialLoadDone, isMainUser, isOrdered, sessionCode, userId?.userId, isLoading, checkOrderStatus]);

  return {
    // State
    isMainUser,
    iban,
    email,
    amount,
    isLoading,
    sessionCode,
    isOrdered,
    initialLoadDone,
    userItems,
    userEmail: user?.email || "", // Email de l'utilisateur connecté
  };
}; 