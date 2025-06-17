import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIsMainUser } from "../utils/isMainUser";
import { MainUserSessionDetails } from "../components/MainUserSessionDetails";
import { SepaQr } from "../components/SepaQr";
import { motion } from "framer-motion";

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
    <div className="bg-[#FFEDCD] min-h-screen flex items-center justify-center py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl space-y-8 bg-[#FFE4B5] rounded-2xl shadow-xl p-8"
      >
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          src="../hug-fries.png"
          className="w-64 mx-auto mb-8 hover:scale-105 transition-transform duration-300"
          alt="fries hugging itself"
        />
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-3xl font-bold text-amber-950 mb-4"
        >
          Commande ajoutée !
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-4"
        >
          <p className="text-lg text-amber-950 mb-2">Merci d'avoir commandé sur OnlyFries 😏</p>
          <p className="text-amber-950/80">
            La commande sera envoyée une fois que l'admin aura finalisé la commande groupée.
          </p>
        </motion.div>
        {isMainUser && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8"
          >
            <MainUserSessionDetails />
          </motion.div>
        )}
        {!isMainUser && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8"
          >
            <div className="border-t border-amber-200 pt-6">
              <h2 className="text-xl font-semibold mb-6 text-amber-950">Votre remboursement</h2>
              <div className="bg-[#FFEDCD] p-6 rounded-xl shadow-md">
                <SepaQr
                  iban="BE76363066256595"
                  name="ACME SA"
                  amount={1}
                  className="mx-auto mb-4"
                />
                <p className="text-amber-950/80 text-sm">Scannez ce QR Code avec votre app bancaire pour initier le virement.</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
