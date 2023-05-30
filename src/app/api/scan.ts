import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD,
    host: process.env.PGSQL_HOST,
    port: Number(process.env.PGSQL_PORT),
    database: process.env.PGSQL_DATABASE,
  ssl: { rejectUnauthorized: false }
});

const createTableQuery = `CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  inventory_id VARCHAR(6) NOT NULL,
  user_id VARCHAR(7) NOT NULL,
  checkout_time TIMESTAMP NOT NULL
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
    const { inventoryBarcode, userBarcode } = req.body;

    const insertScanQuery = 'INSERT INTO scans (inventory_id, user_id, checkout_time) VALUES ($1, $2, NOW())';

    pool.query(insertScanQuery, [inventoryBarcode, userBarcode], (error, result) => {
      if (error) {
        console.error('Error inserting scan into database:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Scan Successful');
      }
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
