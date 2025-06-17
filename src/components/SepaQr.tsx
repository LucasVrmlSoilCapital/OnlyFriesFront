// SepaQr.tsx
import React, { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';

export interface SepaQrProps {
  iban: string;          // IBAN du bénéficiaire
  name: string;          // Nom (70 car. max)
  amount: number;        // Montant en euros (ex : 12.34)
  bic?: string;          // BIC (facultatif)
  remittance?: string;   // Texte libre (facultatif)
  className?: string;    // Pour votre CSS / Tailwind
}

/**
 * Composant React qui affiche un QR Code SEPA “SCT”.
 */
export const SepaQr: React.FC<SepaQrProps> = ({
  iban,
  name,
  amount,
  bic = '',
  remittance = '',
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1) Construction de la payload EPC (11 lignes)
    const payload = [
      'BCD',
      '002',
      '1',
      'SCT',
      bic,
      name.toUpperCase().slice(0, 70),
      iban.replace(/\s+/g, ''),
      `EUR${amount.toFixed(2)}`,
      '',        // Purpose
      '',        // Référence structurée
      remittance // Texte libre
    ].join('\n');

    // 2) Génération du QR en base 64
    toDataURL(payload, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 0,
      scale: 6,          // ≈ 174 px
    })
      .then(setDataUrl)
      .catch(console.error);
  }, [iban, name, amount, bic, remittance]);

  if (!dataUrl) {
    return <span>Génération du QR…</span>;
  }

  return <img src={dataUrl} alt="QR Code SEPA" className={className} />;
};
