import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getSession, setSessionIsOrdered } from "../api/sessions";
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

interface UserCommand {
  user_id: string;
  user_email: string;
  user_name: string;
  has_refund: boolean;
  items: Item[];
}

interface UserWithItems {
  user: {
    id: string;
    email: string;
    name: string;
  };
  items: Item[];
}

interface User {
  id: string;
  email: string;
  name: string;
  has_ordered: boolean;
  has_refund: boolean;
}

interface SessionData {
  code: string;
  is_ordered: boolean;
  owner_name: string;
  owner_iban: string;
  owner_email: string;
  user_command: UserCommand;
  users_command: UserCommand[];
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
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const markAsOrdered = useCallback(async () => {
    if (!sessionCode || !userId || !isMainUser) return;
    
    try {
      setOrderingInProgress(true);
      await setSessionIsOrdered(sessionCode, userId);
      setOrderConfirmed(true);
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

        // Récupérer toutes les données de session en une seule fois
        const response = await getSession(sessionCode as string, userId);
        const session: SessionData = response.session;
        setSessionData(session);

        // Déterminer si l'utilisateur est le main user
        // Si users_command contient des données, alors l'utilisateur est le owner
        const isUserMainUser = session.users_command && session.users_command.length > 0;
        setIsMainUser(isUserMainUser);
        setOrderConfirmed(session.is_ordered);

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

        // Traiter les données pour les composants existants
        if (isUserMainUser && session.users_command) {
          // Si c'est le main user, utiliser users_command pour afficher toutes les commandes
          const usersWithItemsData: UserWithItems[] = session.users_command
            .filter(userCmd => userCmd.items && userCmd.items.length > 0)
            .map(userCmd => ({
              user: {
                id: userCmd.user_id,
                email: userCmd.user_email,
                name: userCmd.user_name,
              },
              items: userCmd.items
            }));
          setUsersWithItems(usersWithItemsData);

          // Créer la liste de tous les utilisateurs pour les statuts
          const allUsersData: User[] = session.users_command.map(userCmd => ({
            id: userCmd.user_id,
            email: userCmd.user_email,
            name: userCmd.user_name,
            has_ordered: userCmd.items && userCmd.items.length > 0,
            has_refund: userCmd.has_refund
          }));
          setAllUsers(allUsersData);
        } else {
          // Si ce n'est pas le main user, afficher seulement sa propre commande
          if (session.user_command && session.user_command.items && session.user_command.items.length > 0) {
            const userWithItemsData: UserWithItems[] = [{
              user: {
                id: session.user_command.user_id,
                email: session.user_command.user_email,
                name: session.user_command.user_name,
              },
              items: session.user_command.items
            }];
            setUsersWithItems(userWithItemsData);
          } else {
            setUsersWithItems([]);
          }
          setAllUsers([]);
        }

        // Générer le lien Fritzy
        const usersForLink = isUserMainUser && session.users_command 
          ? session.users_command
              .filter(userCmd => userCmd.items && userCmd.items.length > 0)
              .map(userCmd => ({
                user: { 
                  id: userCmd.user_id, 
                  email: userCmd.user_email,
                  name: userCmd.user_name 
                },
                items: userCmd.items
              }))
          : (session.user_command && session.user_command.items && session.user_command.items.length > 0 
              ? [{
                  user: { 
                    id: session.user_command.user_id, 
                    email: session.user_command.user_email,
                    name: session.user_command.user_name 
                  },
                  items: session.user_command.items
                }]
              : []);

        const link = generateFritzyLink(usersForLink, currentMenuData);
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

  // Fonction pour rafraîchir les données de session
  const refreshSessionData = useCallback(async () => {
    if (!sessionCode || !userId) return;
    
    try {
      const response = await getSession(sessionCode, userId);
      const session: SessionData = response.session;
      setSessionData(session);
      setOrderConfirmed(session.is_ordered);

      // Mettre à jour les données selon le type d'utilisateur
      const isUserMainUser = session.users_command && session.users_command.length > 0;
      
      if (isUserMainUser && session.users_command) {
        // Mise à jour pour le main user
        const usersWithItemsData: UserWithItems[] = session.users_command
          .filter(userCmd => userCmd.items && userCmd.items.length > 0)
          .map(userCmd => ({
            user: {
              id: userCmd.user_id,
              email: userCmd.user_email,
              name: userCmd.user_name,
            },
            items: userCmd.items
          }));
        setUsersWithItems(usersWithItemsData);

        const allUsersData: User[] = session.users_command.map(userCmd => ({
          id: userCmd.user_id,
          email: userCmd.user_email,
          name: userCmd.user_name,
          has_ordered: userCmd.items && userCmd.items.length > 0,
          has_refund: userCmd.has_refund
        }));
        setAllUsers(allUsersData);
      } else {
        // Mise à jour pour les non-main users
        if (session.user_command && session.user_command.items && session.user_command.items.length > 0) {
          const userWithItemsData: UserWithItems[] = [{
            user: {
              id: session.user_command.user_id,
              email: session.user_command.user_email,
              name: session.user_command.user_name,
            },
            items: session.user_command.items
          }];
          setUsersWithItems(userWithItemsData);
        } else {
          setUsersWithItems([]);
        }
      }
      
    } catch (error) {
      console.error("❌ Erreur lors du rafraîchissement:", error);
    }
  }, [sessionCode, userId]);

  // Polling pour les main users (pour voir les nouvelles commandes)
  useEffect(() => {
    if (!isMainUser || !sessionCode || !userId) return;
    
    const interval = setInterval(async () => {
      await refreshSessionData();
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isMainUser, sessionCode, userId, refreshSessionData]);

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
  const refundedUsers = allUsers.filter((user) => user.has_refund);
  const notRefundedUsers = allUsers.filter((user) => !user.has_refund && user.id !== userId && user.has_ordered);

  return {
    usersWithItems,
    allUsers,
    orderedUsers,
    pendingUsers,
    refundedUsers,
    notRefundedUsers,
    isLoading,
    error,
    fritzyLink,
    grandTotal,
    menuData,
    sessionCode,
    sessionData,
    isMainUser,
    orderingInProgress,
    orderConfirmed,
    markAsOrdered,
  };
};
