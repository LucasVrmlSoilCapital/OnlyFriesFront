import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getAllItemsPerUser } from "../api/orders";
import { getSessionUsers, getSessionInfos, setSessionIsOrdered, isSessionOrdered } from "../api/sessions";
import { MenuItemT } from "../types/menu";
import { generateFritzyLink } from "../utils/fritzyLinkGenerator";

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

interface UserWithItems {
  user: {
    id: string;
    email: string;
  };
  items: Item[];
}

interface User {
  id: string;
  email: string;
  has_ordered: boolean;
}

export const useSessionDetails = (userId: string) => {
  const { sessionCode } = useParams();
  const [usersWithItems, setUsersWithItems] = useState<UserWithItems[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fritzyLink, setFritzyLink] = useState<string>("");
  const [menuData, setMenuData] = useState<MenuItemT[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMainUser, setIsMainUser] = useState<boolean>(false);
  const [orderingInProgress, setOrderingInProgress] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  const markAsOrdered = useCallback(async () => {
    if (!sessionCode || !userId || !isMainUser) return;
    
    try {
      console.log("🚀 Confirmation de commande en cours...");
      setOrderingInProgress(true);
      await setSessionIsOrdered(sessionCode, userId);
      setOrderConfirmed(true);
      console.log("✅ Commande confirmée avec succès");
    } catch (error) {
      console.error("❌ Erreur lors de la confirmation de commande:", error);
      setError("Erreur lors de la confirmation de commande");
    } finally {
      setOrderingInProgress(false);
    }
  }, [sessionCode, userId, isMainUser]);

  useEffect(() => {
    const callData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les informations de session pour déterminer si l'utilisateur est le main user
        const sessionInfos = await getSessionInfos(userId, sessionCode as string);
        const isUserMainUser = sessionInfos.data.owner_id === userId;
        setIsMainUser(isUserMainUser);

        // Si c'est le main user, vérifier si la commande a déjà été confirmée
        if (isUserMainUser) {
          try {
            const orderStatus = await isSessionOrdered(sessionCode as string, userId);
            setOrderConfirmed(orderStatus.data || false);
            console.log("📊 État de commande initial pour main user:", orderStatus.data);
          } catch (error) {
            console.log("❌ Erreur lors de la vérification du statut de commande:", error);
          }
        }

        // Récupérer les données du menu
        const menuResponse = await fetch(
          "https://api.fritzy.be/menu/b5ce1d14-b4b4-493c-846b-eaab8a464240"
        );
        if (!menuResponse.ok) {
          throw new Error("Erreur lors du chargement du menu");
        }
        const menuJson = await menuResponse.json();
        const currentMenuData = menuJson.data;
        setMenuData(currentMenuData);

        // Récupérer les données avec le nouveau format
        const itemsResponse = await getAllItemsPerUser(
          sessionCode as string,
          userId
        );
        const usersWithItemsData: UserWithItems[] = itemsResponse.users;

        // Récupérer tous les utilisateurs de la session
        const usersResponse = await getSessionUsers(sessionCode as string);
        setAllUsers(usersResponse.users);
        setUsersWithItems(usersWithItemsData);

        // Générer le lien Fritzy
        const link = generateFritzyLink(usersWithItemsData, currentMenuData);
        if (link) {
          setFritzyLink(link);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la récupération des données";
        setError(errorMessage);
        console.error("❌ Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionCode && userId) {
      callData();
    }
  }, [sessionCode, userId]);

  const grandTotal = usersWithItems.reduce((total, userWithItems) => {
    return (
      total +
      userWithItems.items.reduce((userTotal, item) => {
        return userTotal + item.price_total;
      }, 0)
    );
  }, 0);

  const orderedUsers = allUsers.filter((user) => user.has_ordered);
  const pendingUsers = allUsers.filter((user) => !user.has_ordered);

  return {
    usersWithItems,
    allUsers,
    orderedUsers,
    pendingUsers,
    isLoading,
    error,
    fritzyLink,
    grandTotal,
    menuData,
    sessionCode,
    isMainUser,
    orderingInProgress,
    orderConfirmed,
    markAsOrdered,
  };
};
