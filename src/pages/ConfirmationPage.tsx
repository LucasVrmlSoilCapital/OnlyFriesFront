import { Link } from "react-router-dom";
import { SessionDetailsPage } from "./SessionDetailsPage";
import { SepaQr } from "../components/payment";
import { motion } from "framer-motion";
import { LoadingSpinner, Card } from "../components/ui";
import { useConfirmationPageLogic } from "../hooks";

export const ConfirmationPage = (userId: any) => {
  const {
    isMainUser,
    iban,
    email,
    amount,
    isLoading,
    sessionCode,
  } = useConfirmationPageLogic(userId);

  if (isLoading) {
    return (
      <div className="bg-cream-300 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-brand-600 font-medium">Chargement des détails de la session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-300 min-h-screen relative">
      {/* Bouton retour repositionné */}
      <Link
        to={`/session/${sessionCode}`}
        className="absolute top-[10vh] left-8 z-10 inline-flex items-center gap-2 px-4 py-2 text-brand-700 hover:text-brand-800 hover:bg-cream-400/60 rounded-xl transition-all duration-200 backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Hero Section avec image et message principal */}
          <div className="text-center space-y-6">
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              src="/hug-fries.png"
              className="w-48 mx-auto"
              alt="Frites qui se font un câlin"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              {isMainUser ? (
                <>
                  <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-brand-800">
                      Commande ajoutée !
                    </h1>
                  </div>
                  <p className="text-lg text-brand-700 max-w-2xl mx-auto">
                    Parfait ! Vous êtes maintenant l'administrateur de cette session. Votre commande a été ajoutée avec succès.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-brand-800">
                      Commande ajoutée !
                    </h1>
                  </div>
                  <p className="text-lg text-brand-700 max-w-2xl mx-auto">
                    Merci d'avoir commandé sur OnlyFries ! 🍟 Votre commande a été ajoutée à la session.
                  </p>
                </>
              )}
            </motion.div>
          </div>

          {/* Section d'information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card 
              variant="elevated" 
              padding="lg" 
              className="bg-cream-200 backdrop-blur-sm border-none"
            >
              {isMainUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-cream-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-brand-800">Instructions pour l'administrateur</h3>
                  </div>
                  <div className="bg-cream-200 rounded-lg p-4">
                    <p className="text-brand-700">
                      Attendez que tous les participants aient passé leur commande avant de finaliser la commande groupée. 
                      Vous pourrez voir le récapitulatif complet en bas de page.
                    </p>
                  </div>
                </div>
                              ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-cream-200 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-brand-800">En attente de finalisation</h3>
                    </div>
                    <div className="bg-cream-200 rounded-lg p-4">
                      <p className="text-warning-700">
                        La commande sera envoyée une fois que l'administrateur aura finalisé la commande groupée. 
                        Vous recevrez une confirmation par la suite.
                      </p>
                    </div>
                  </div>
                )}
            </Card>
          </motion.div>

          {isMainUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <SessionDetailsPage userId={userId.userId} />
            </motion.div>
          )}
          
          {!isMainUser && amount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Card 
                variant="elevated" 
                padding="lg" 
                className="bg-cream-200 backdrop-blur-sm border-none"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cream-300 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-brand-800">
                      Paiement requis
                    </h2>
                  </div>
                  
                  <div className="bg-cream-100 rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <p className="text-brand-700 text-base">
                        Scannez ce QR Code avec votre application bancaire pour payer{' '}
                        <span className="font-bold text-brand-800 text-lg">{amount.toFixed(2)}€</span> à{' '}
                        <span className="font-semibold text-brand-800">{email}</span>
                      </p>
                      <div className="flex justify-center">
                        <SepaQr
                          iban={iban}
                          name={email}
                          amount={amount}
                          className="mx-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}; 