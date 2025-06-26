import React from "react";
import { useSessionDetails } from "../hooks/useSessionDetails";
import { SessionSummary } from "../components/session/SessionSummary";
import { UserStatusList } from "../components/session/UserStatusList";
import { UserOrderCard } from "../components/session/UserOrderCard";
import { LoadingSpinner } from "../components/ui";

interface SessionDetailsPageProps {
  userId: string;
}

export const SessionDetailsPage: React.FC<SessionDetailsPageProps> = ({
  userId,
}) => {
  const {
    usersWithItems,
    orderedUsers,
    pendingUsers,
    isLoading,
    error,
    fritzyLink,
    grandTotal,
    sessionCode,
  } = useSessionDetails(userId);

  if (isLoading) {
    return (
      <div className="p-4 bg-cream-300 h-screen flex justify-start items-center flex-col">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-neutral-600">
          Chargement des données de session...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-cream-300 h-screen flex justify-center items-center flex-col">
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-bold text-error-800 mb-2">Erreur</h3>
          <p className="text-error-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-300 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-warm-800">
          Récapitulatif de la session
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Colonne principale - Commandes par utilisateur */}
          <div className="lg:col-span-2 space-y-6">
            {usersWithItems.length === 0 ? (
              <div className="bg-cream-200 p-6 rounded-lg shadow border border-cream-400 text-center">
                <p className="text-neutral-800">
                  Aucune commande pour le moment
                </p>
              </div>
            ) : (
              usersWithItems.map((userWithItems) => (
                <UserOrderCard
                  key={userWithItems.user.id}
                  userEmail={userWithItems.user.email}
                  userId={userWithItems.user.id}
                  items={userWithItems.items}
                />
              ))
            )}
          </div>

          {/* Colonne latérale - Résumé et statuts */}
          <div className="space-y-6">
            <SessionSummary
              grandTotal={grandTotal}
              orderCount={usersWithItems.length}
              fritzyLink={fritzyLink}
              sessionCode={sessionCode}
            />

            <UserStatusList
              orderedUsers={orderedUsers}
              pendingUsers={pendingUsers}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
