import React from 'react';
import { useSepaQrLogic } from '../../hooks';

export interface SepaQrProps {
  iban: string;          // IBAN du bénéficiaire
  name: string;          // Nom (70 car. max)
  amount: number;        // Montant en euros (ex : 12.34)
  bic?: string;          // BIC (facultatif)
  remittance?: string;   // Texte libre (facultatif)
  className?: string;    // Pour votre CSS / Tailwind
}

/**
 * Composant React qui affiche un QR Code SEPA "SCT".
 */
export const SepaQr: React.FC<SepaQrProps> = ({
  iban,
  name,
  amount,
  bic = '',
  remittance = '',
  className = '',
}) => {
  const { dataUrl } = useSepaQrLogic({ iban, name, amount, bic, remittance });

  if (!dataUrl) {
    return <span>Génération du QR…</span>;
  }

  return <img src={dataUrl} alt="QR Code SEPA" className={className} />;
}; 