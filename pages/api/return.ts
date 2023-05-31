import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, itemId } = req.body;
  const currentTime = new Date().toISOString();

  try {
    await query(
      `
      UPDATE checkout
      SET return_time = $1
      WHERE user_id = $2 AND item_id = $3
    `,
      [currentTime, userId, itemId]
    );

    res.status(200).end();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
