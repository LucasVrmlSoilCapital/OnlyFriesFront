import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner, Button } from "../ui";

interface SessionSummaryProps {
  grandTotal: number;
  orderCount: number;
  fritzyLink?: string;
  sessionCode?: string;
  // Props pour la confirmation de commande
  isMainUser?: boolean;
  orderingInProgress?: boolean;
  orderConfirmed?: boolean;
  markAsOrdered?: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  grandTotal,
  orderCount,
  fritzyLink,
  sessionCode,
  isMainUser = false,
  orderingInProgress = false,
  orderConfirmed = false,
  markAsOrdered,
}) => {
  const handleFinalize = async () => {
    await fetch("https://soilcap.app.n8n.cloud/webhook/finalize-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: sessionCode }),
    });
  };

  return (
    <div className="bg-gradient-to-br from-cream-100 to-secondary-100 p-6 rounded-lg shadow-md border border-cream-300">
      <h3 className="text-xl font-bold text-warm-800 mb-6 text-center">Résumé total</h3>
      
      {/* Montant total */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-warm-900 mb-2">
          {grandTotal.toFixed(2)}€
        </div>
        <div className="text-sm text-neutral-700">
          {orderCount} commande{orderCount > 1 ? "s" : ""}
        </div>
      </div>

      {/* Section de confirmation pour les main users */}
      {isMainUser && (
        <div className="mb-6">
          <AnimatePresence mode="wait">
            {!orderConfirmed ? (
              <motion.div
                key="button"
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Button
                  onClick={markAsOrdered}
                  loading={orderingInProgress}
                  disabled={orderCount === 0}
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-success-600 to-success-700 hover:from-success-700 hover:to-success-800 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderingInProgress ? (
                    <div className="flex items-center justify-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Confirmation en cours...</span>
                    </div>
                  ) : (
                    <span className="whitespace-nowrap">Confirmer la commande</span>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="text-center">
                      <p className="text-success-800 font-semibold text-lg">Commande confirmée !</p>
                    </div>
                  </div>
                  <p className="text-success-700 text-sm text-center">Tous les participants sont notifiés</p>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="text-xs text-neutral-600 text-center"
                >
                  🍟 La commande groupée a été envoyée avec succès
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Lien Fritzy - seulement si la commande n'est pas encore confirmée */}
      {fritzyLink && !orderConfirmed && (
        <a
          href={fritzyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          onClick={handleFinalize}
        >
          🍟 Commander sur Fritzy
        </a>
      )}
    </div>
  );
};
