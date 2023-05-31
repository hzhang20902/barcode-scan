import { Client } from 'pg';

const dbOptions = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

export async function query(text: string, params: any[]) {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    await client.end();
  }
}
