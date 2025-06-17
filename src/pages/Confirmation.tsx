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
    <div className="bg-[#FFEDCD] flex items-center justify-center pt-20 h-[100vh] pb-10">
      <div className="w-full max-w-2xl space-y-8 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
          <img
            src="hug-fries.png"
            className="w-72 mx-auto mb-8"
            alt="fries hugging itself"
          />
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Commande ajoutée !</h1>
          <p className="text-gray-600 mb-2">Merci d'avoir commandé sur OnlyFries 😏</p>
          <p className="text-gray-600">
            La commande sera envoyée une fois que l'admin aura finalisé la commande groupée.
          </p>
          {isMainUser && (
            <div className="mt-8">
              <MainUserSessionDetails />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
