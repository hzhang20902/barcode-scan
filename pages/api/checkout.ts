import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { employeeId, radioId } = req.body;

  try {
    await query(
      `
      INSERT INTO checkout_log
      VALUES (DEFAULT, $1, $2, now() - interval '4' hour)
      UPDATE radios SET status ='Checked out' where radio_number = $2;
    `,
      [employeeId, radioId]
    );

    res.status(200).end();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
