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
        if (typeof(userBarcode)!='string') {
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
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement> | Event): void => {
      if (event instanceof KeyboardEvent) {
        const barcodeData = (event as KeyboardEvent<HTMLInputElement>).currentTarget.value.trim();
        handleBarcodeScan(barcodeData);
        (event as KeyboardEvent<HTMLInputElement>).currentTarget.value = '';
      }
    };
  
    const barcodeInput = document.getElementById('barcodeInput') as HTMLInputElement;
    if (barcodeInput) {
      barcodeInput.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      if (barcodeInput) {
        barcodeInput.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  return (
    <div>
      <input type="text" id="barcodeInput" autoFocus />
    </div>
  );
}
