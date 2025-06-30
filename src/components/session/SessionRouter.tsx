import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../../api/sessions';
import { LoadingSpinner } from '../ui';
import { OrderPage } from '../../pages/OrderPage';

interface SessionRouterProps {
  user: any;
}

export const SessionRouter: React.FC<SessionRouterProps> = ({ user }) => {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowOrderPage, setShouldShowOrderPage] = useState(false);

  useEffect(() => {
    const checkSessionStatus = async () => {
      if (!sessionCode || !user?.id) return;

      try {
        setIsLoading(true);
        
        const response = await getSession(sessionCode, user.id);
        const session = response.session;

        // Si la commande n'est pas encore passée, afficher la page de commande
        if (!session.is_ordered) {
          setShouldShowOrderPage(true);
          return;
        }

        // Si la commande est passée, vérifier si l'utilisateur a des items
        const userHasItems = session.user_command?.items && session.user_command.items.length > 0;

        if (userHasItems) {
          navigate(`/session/${sessionCode}/confirmation`, { replace: true });
        } else {
          navigate(`/session/${sessionCode}/too-late`, { replace: true });
        }

      } catch (error) {
        console.error("❌ Erreur lors de la vérification du statut:", error);
        // En cas d'erreur, afficher la page de commande par défaut
        setShouldShowOrderPage(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSessionStatus();
  }, [sessionCode, user?.id, navigate]);

  if (isLoading) {
    return (
      <div className="bg-cream-300 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="xl" />
          <p className="text-brand-600 font-medium">Vérification du statut de la session...</p>
        </div>
      </div>
    );
  }

  if (shouldShowOrderPage) {
    return <OrderPage user={user} />;
  }

  // Ce cas ne devrait pas arriver car on redirige, mais on retourne un loader au cas où
  return (
    <div className="bg-cream-300 min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  );
}; 