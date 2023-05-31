import { useState, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';

export default function BarcodeScanner() {
  const [inventoryBarcode, setInventoryBarcode] = useState('');
  const [userBarcode, setUserBarcode] = useState('');

  const handleBarcodeScan = (barcodeData: string) => {
    if (!userBarcode) {
      setUserBarcode(barcodeData);
    } else {
      setInventoryBarcode(barcodeData);
      handleScanComplete();
    }
  };

  const handleScanComplete = async () => {
    if (inventoryBarcode && userBarcode) {
      try {
        if (!userBarcode.startsWith('ID')) {
          await axios.post('/api/checkout', {
            userId: userBarcode,
            itemId: inventoryBarcode,
          });
        } else {
          await axios.post('/api/return', {
            userId: userBarcode,
            itemId: inventoryBarcode,
          });
        }
        setInventoryBarcode('');
        setUserBarcode('');
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const barcodeData = event.currentTarget.value.trim();
      handleBarcodeScan(barcodeData);
      event.currentTarget.value = '';
    };

    const barcodeInput = document.getElementById('barcodeInput') as HTMLInputElement;
    barcodeInput.addEventListener('keydown', handleKeyDown);

    return () => {
      barcodeInput.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <input type="text" id="barcodeInput" autoFocus />
    </div>
  );
}
