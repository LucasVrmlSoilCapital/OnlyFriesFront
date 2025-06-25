import { useEffect, useState } from 'react';
import { toDataURL } from 'qrcode';

interface SepaQrLogicProps {
  iban: string;
  amount: number;
  name: string;
  bic?: string;
  remittance?: string;
}

export const useSepaQrLogic = ({ iban, amount, name, bic = '', remittance = '' }: SepaQrLogicProps) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Construction de la payload EPC (11 lignes)
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

        // Génération du QR en base 64
        const url = await toDataURL(payload, {
          errorCorrectionLevel: 'M',
          type: 'image/png',
          margin: 0,
          scale: 6,          // ≈ 174 px
        });
        
        setDataUrl(url);
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
      }
    };

    if (iban && amount && name) {
      generateQR();
    }
  }, [iban, amount, name, bic, remittance]);

  return {
    dataUrl,
  };
}; 