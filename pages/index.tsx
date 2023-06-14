import { useState, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';
import { query } from '../lib/db';

export default function BarcodeScanner() {
  const [empBarcode, setEmpBarcode] = useState('');
  const [inventoryBarcode, setInventoryBarcode] = useState('');
  const [getLog, setGetLog] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleBarcodeScan = (barcodeData: string) => {
    if (!empBarcode) {
      setEmpBarcode(barcodeData);
    } else {
      setInventoryBarcode(barcodeData);
      handleScanComplete(); 
    }
  };

  const handleScanComplete = async () => {
    if (empBarcode && inventoryBarcode) {
      console.log(empBarcode)
      try {
        if (empBarcode.startsWith('8')) {
          await axios.post('/api/checkout', {
            employeeId: empBarcode,
            radioId: inventoryBarcode,
          });
        } else {
          await axios.post('/api/return', {
            employeeId: empBarcode,
            radioId: inventoryBarcode,
          });
        }
        setInventoryBarcode('');
        setEmpBarcode('');
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    



    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement> | Event): void => {
      if (event instanceof KeyboardEvent) {
        const barcodeData = (event as unknown as KeyboardEvent<HTMLInputElement>).currentTarget.value;
        handleBarcodeScan(barcodeData);
        (event as unknown as KeyboardEvent<HTMLInputElement>).currentTarget.value = '';
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
  }, [handleBarcodeScan]);

  return (
    <div>
      {empBarcode? (<h1>Radio Number</h1>) : (<h1>Employee ID</h1>)}
      <input type="text" id="barcodeInput" autoFocus />
    </div>
  );
}
