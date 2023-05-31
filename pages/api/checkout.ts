import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, itemId } = req.body;
  const currentTime = new Date().toISOString();

  try {
    await query(
      `
      INSERT INTO checkout (user_id, item_id, checkout_time)
      VALUES ($1, $2, $3)
    `,
      [userId, itemId, currentTime]
    );

    res.status(200).end();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
