import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/auth";
import { createSession, joinSession } from "../api/sessions";

// Fonction pour valider un IBAN belge ou français
const validateIban = (iban: string): { isValid: boolean; error?: string } => {
  if (!iban || iban.trim() === '') {
    return { isValid: false, error: "L'IBAN est requis" };
  }

  // Supprimer les espaces et convertir en majuscules
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();

  // Vérifier si c'est un IBAN belge ou français
  if (!cleanIban.startsWith('BE') && !cleanIban.startsWith('FR')) {
    return { isValid: false, error: "Seuls les IBAN belges (BE) et français (FR) sont acceptés" };
  }

  // Vérifier la longueur
  if (cleanIban.startsWith('BE') && cleanIban.length !== 16) {
    return { isValid: false, error: "Un IBAN belge doit contenir 16 caractères" };
  }
  if (cleanIban.startsWith('FR') && cleanIban.length !== 27) {
    return { isValid: false, error: "Un IBAN français doit contenir 27 caractères" };
  }

  // Vérifier que les caractères après le code pays sont alphanumériques
  const ibanBody = cleanIban.slice(2);
  if (!/^[A-Z0-9]+$/.test(ibanBody)) {
    return { isValid: false, error: "L'IBAN contient des caractères invalides" };
  }

  // Vérification de la somme de contrôle (algorithme IBAN mod-97)
  const rearrangedIban = cleanIban.slice(4) + cleanIban.slice(0, 4);
  const numericString = rearrangedIban.replace(/[A-Z]/g, (letter) => {
    return (letter.charCodeAt(0) - 55).toString();
  });

  // Calcul mod 97 pour les grands nombres
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }

  if (remainder !== 1) {
    return { isValid: false, error: "L'IBAN est invalide (somme de contrôle incorrecte)" };
  }

  return { isValid: true };
};

export const useStartPageLogic = (userId: any) => {
  const [sessionCode, setSessionCode] = React.useState<string>("");
  const [iban, setIban] = React.useState<string>("");
  const [ibanError, setIbanError] = React.useState<string>("");
  const [isCreatingSession, setIsCreatingSession] = React.useState<boolean>(false);
  const [isJoiningSession, setIsJoiningSession] = React.useState<boolean>(false);

  const navigate = useNavigate();

  // Valider l'IBAN en temps réel
  const handleIbanChange = (value: string) => {
    setIban(value);
    if (value.trim() === '') {
      setIbanError('');
      return;
    }
    
    const validation = validateIban(value);
    setIbanError(validation.isValid ? '' : validation.error || '');
  };

  const handleCreateSession = async () => {
    // Valider l'IBAN avant de créer la session
    const validation = validateIban(iban);
    if (!validation.isValid) {
      setIbanError(validation.error || "IBAN invalide");
      return;
    }

    setIsCreatingSession(true);
    try {
      const user = await getUser();
      if (!user.data.user?.id) {
        throw new Error("User ID is undefined");
      }
      const session = await createSession(user.data.user.id, iban);

      if (session.data.code) {
        navigate(`/session/${session.data.code}`);
      } else {
        alert("Erreur lors de la création de la session.");
      }
    } catch (error) {
      alert("Erreur lors de la création de la session.");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionCode) {
      alert("Veuillez entrer un ID de session valide.");
      return;
    }

    setIsJoiningSession(true);
    try {
      const { data } = await joinSession(sessionCode, userId.userId);
      if (data) {
        navigate(`/session/${sessionCode}`);
      } else {
        alert("Erreur lors de la connexion à la session.");
      }
    } catch (error) {
      alert("Erreur lors de la connexion à la session.");
    } finally {
      setIsJoiningSession(false);
    }
  };

  return {
    // State
    sessionCode,
    setSessionCode,
    iban,
    setIban: handleIbanChange,
    ibanError,
    isCreatingSession,
    isJoiningSession,
    
    // Actions
    handleCreateSession,
    handleJoinSession,
  };
}; 