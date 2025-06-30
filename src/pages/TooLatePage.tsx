import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui";

export const TooLatePage = () => {
  const { sessionCode } = useParams();

  return (
    <div className="bg-cream-300 min-h-screen relative">
      {/* Bouton retour */}
      <Link
        to={`/`}
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
        Retour à la page d'accueil
      </Link>

      {/* Contenu principal */}
      <div className="px-4 sm:px-6 lg:px-8 pt-[15vh] pb-8">
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
              src="/empty-order.png"
              className="w-48 mx-auto opacity-75"
              alt="Frites déçues"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-warning-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-brand-800">
                  Oups ! Trop tard...
                </h1>
              </div>
              <p className="text-lg text-brand-700 max-w-2xl mx-auto">
                La commande groupée a déjà été passée ! 😔 Il fallait être plus rapide pour rejoindre cette session de frites.
              </p>
            </motion.div>
          </div>

          {/* Message d'explication */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card 
              variant="elevated" 
              padding="lg" 
              className="bg-cream-200 backdrop-blur-sm border-none"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-brand-800">Que s'est-il passé ?</h3>
                </div>
                <div className="bg-cream-100 rounded-lg p-4 space-y-3">
                  <p className="text-brand-700">
                    L'administrateur de cette session a déjà confirmé et envoyé la commande groupée. 
                    Malheureusement, il n'est plus possible d'ajouter de nouveaux items.
                  </p>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <p className="text-brand-600 text-sm">
                      <strong>Conseil :</strong> Pour la prochaine fois, rejoignez la session plus tôt ! 
                      Les commandes groupées sur OnlyFries ferment dès que l'administrateur confirme.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 