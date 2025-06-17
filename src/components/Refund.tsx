import { SepaQr } from './SepaQr';
import { getAllRefunds } from '../utils/getAllRefunds';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

export default function Refund() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const { sessionCode } = useParams<{ sessionCode: string }>();

  const fetchRefunds = async () => {
    try {
      setError(null);
      
      const userId = user?.id;
      const code = sessionCode;

      if (!userId || !code) {
        throw new Error('User ID or session ID is undefined');
      }
      
      const data = await getAllRefunds(userId, code);
      setRefunds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des remboursements');
    }
  };

  useEffect(() => {
    if (user && sessionCode) {
      fetchRefunds();
    }
  }, [user, sessionCode]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Remboursement</h1>

      {/* Section des remboursements récupérés */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Historique des remboursements</h2>
        
        {loading && (
          <p className="text-blue-600">Chargement des remboursements...</p>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700">Erreur : {error}</p>
            <button 
              onClick={fetchRefunds}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        )}
        
        {!loading && !error && refunds.length === 0 && (
          <p className="text-gray-500">Aucun remboursement trouvé.</p>
        )}
        
        {!loading && !error && refunds.length > 0 && (
          <div className="space-y-2">
            {refunds.map((refund, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(refund, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section QR Code existante */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-medium mb-4">Nouveau remboursement</h2>
        <SepaQr
          iban="BE76363066256595"
          name="ACME SA"
          amount={1}
          className="mx-auto"
        />
        <p>Scannez ce QR Code avec votre app bancaire pour initier le virement.</p>
      </div>
    </div>
  );
}
