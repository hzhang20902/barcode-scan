import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, itemId } = req.body;

  try {
    await query(
      `
      INSERT INTO checkout_log (employee, radio_number)
      VALUES ($1, $2)
    `,
      [userId, itemId]
    );

    res.status(200).end();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
