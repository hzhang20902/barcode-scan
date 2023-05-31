import { NextApiRequest, NextApiResponse } from 'next';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

const createTableQuery = `CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  inventory_id VARCHAR(6) NOT NULL,
  user_id VARCHAR(7) NOT NULL,
  checkout_time TIMESTAMP,
  return_time TIMESTAMP
);`;

pool.query(createTableQuery, (error, result) => {
  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('Table created successfully');
  }
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { inventoryBarcode, userBarcode, isReturn } = req.body;

    if (isReturn) {
      const updateScanQuery = 'UPDATE scans SET return_time = NOW() WHERE inventory_id = $1';

      pool.query(updateScanQuery, [inventoryBarcode], (error, result) => {
        if (error) {
          console.error('Error updating scan:', error);
          res.status(500).send('Internal Server Error');
        } else if (result.rowCount === 0) {
          console.error('Error: Item not checked out by the specified ID');
          res.status(400).send('Item not checked out by the specified ID');
        } else {
          res.status(200).send('Return Successful');
        }
      });
    } else {
      const insertScanQuery = 'INSERT INTO scans (inventory_id, user_id, checkout_time) VALUES ($1, $2, NOW())';

      pool.query(insertScanQuery, [inventoryBarcode, userBarcode], (error, result) => {
        if (error) {
          console.error('Error inserting scan into database:', error);
          res.status(500).send('Internal Server Error');
        } else {
          res.status(200).send('Checkout Successful');
        }
      });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
