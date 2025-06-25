import React from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/auth";
import { createSession, joinSession } from "../api/sessions";

export const useStartPageLogic = (userId: any) => {
  const [sessionCode, setSessionCode] = React.useState<string>("");
  const [iban, setIban] = React.useState<string>("");
  const [isCreatingSession, setIsCreatingSession] = React.useState<boolean>(false);
  const [isJoiningSession, setIsJoiningSession] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleCreateSession = async () => {
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
      console.log("userId", userId);
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
    setIban,
    isCreatingSession,
    isJoiningSession,
    
    // Actions
    handleCreateSession,
    handleJoinSession,
  };
}; 