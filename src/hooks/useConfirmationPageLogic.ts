import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSessionInfos } from "../api/sessions";

export const useConfirmationPageLogic = (userId: any) => {
  const [isMainUser, setIsMainUser] = useState<boolean>(false);
  const [iban, setIban] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { sessionCode } = useParams();

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
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
    callGetIsMainUser();
  }, [userId.userId, sessionCode]);

  return {
    // State
    isMainUser,
    iban,
    email,
    amount,
    isLoading,
    sessionCode,
  };
}; 