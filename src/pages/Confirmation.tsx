import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSessionInfos } from "../utils/isMainUser";
import { MainUserSessionDetails } from "../components/MainUserSessionDetails";
import { SepaQr } from "../components/SepaQr";
import { motion } from "framer-motion";

export const Confirmation = (userId: any) => {
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

  if (isLoading) {
    return (
      <div className="bg-[#FFEDCD] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-950"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFEDCD] min-h-screen relative py-12 px-4 sm:px-6 lg:px-8">
      <Link
        to={`/${sessionCode}`}
        className="absolute top-[12vh] left-10 flex items-center text-amber-900 hover:text-amber-950 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour au menu
      </Link>
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl space-y-8 p-8"
        >
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            src="/hug-fries.png"
            className="w-48 mx-auto mb-6"
            alt="fries hugging itself"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            {isMainUser ? (
              <>
                <h1 className="text-4xl font-extrabold text-amber-950">
                  Vous êtes l'admin de cette session
                </h1>
                <p className="mt-4 text-lg text-amber-900">
                  Attendez que tout le monde ait commandé avant de finaliser la
                  commande groupée.
                </p>
                <p className="mt-2 text-amber-800/80">
                  Votre commande a bien été ajoutée.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-extrabold text-amber-950">
                  Commande ajoutée !
                </h1>
                <p className="mt-4 text-lg text-amber-900">
                  Merci d'avoir commandé sur OnlyFries 😏
                </p>
                <p className="mt-2 text-amber-800/80">
                  La commande sera envoyée une fois que l'admin aura finalisé la
                  commande groupée.
                </p>
              </>
            )}
          </motion.div>
          {isMainUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-8"
            >
              <MainUserSessionDetails userId={userId.userId} />
            </motion.div>
          )}
          {!isMainUser && amount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-8"
            >
              <div className="border-t border-amber-200/60 pt-6">
                <h2 className="text-2xl font-bold mb-4 text-center text-amber-950">
                  Remboursement
                </h2>
                <div className="bg-[#FFF5E6] p-6 rounded-xl shadow-inner border border-amber-200/60 text-center">
                  <p className="mb-4 text-amber-900">
                    Scannez ce QR Code avec votre application bancaire pour payer
                    <strong> {amount.toFixed(2)}€</strong> à <strong>{email}</strong>.
                  </p>
                  <SepaQr
                    iban={iban}
                    name={email}
                    amount={amount}
                    className="mx-auto"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
