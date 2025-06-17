import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIsMainUser } from "../utils/isMainUser";
import { MainUserSessionDetails } from "../components/MainUserSessionDetails";

export const Confirmation = (userId: any) => {
  const [isMainUser, setIsMainUser] = useState<boolean>(false);

  const { sessionCode } = useParams();

  useEffect(() => {
    const callGetIsMainUser = async () => {
      const data = await getIsMainUser(userId.userId, sessionCode as string);
      console.log("data", data);
      setIsMainUser(data.data.ok);
    };
    callGetIsMainUser();
  }, [userId.userId, sessionCode]);

  return (
    <div className="pt-20 bg-[#FFEDCD] h-[100vh]">
      <img
        src="./hug-fries.png"
        className="w-72 mx-auto mb-8"
        alt="fries hugging itself"
      />
      <h1 className="text-xl text-amber-950 pb-4">Commande ajoutée !</h1>
      <p className="text-amber-950">Merci d'avoir commandé sur OnlyFries 😏</p>
      <p className="text-amber-950">
        La commande sera envoyée une fois que l'admin auras finalisé la commande
        groupée.
      </p>
      {isMainUser && <MainUserSessionDetails />}
    </div>
  );
};
