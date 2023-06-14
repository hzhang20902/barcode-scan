import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { employeeId, radioId } = req.body;

  try {
    await query(
      `
      UPDATE checkout_log
      SET return_time = now() - interval '4' hour
      WHERE employee_id = $1 AND radio_number = $2
      UPDATE radios SET status ='Available' where radio_number = $2;
    `,
      [employeeId, radioId]
    );

    res.status(200).end();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
