import { Pool } from 'pg';
import { env } from './env';
import { logger } from '../utils/logger';

/**
 * Pool de conexões com o PostgreSQL, compartilhado por toda a
 * aplicação. Um pool (em vez de uma conexão só) permite atender
 * várias requisições em paralelo sem que uma espere a outra liberar
 * a conexão com o banco.
 */
export const pool = new Pool({
  connectionString: env.databaseUrl,
});

pool.on('error', (err) => {
  // Erro em uma conexão ociosa do pool (ex.: banco caiu). Isso não é
  // um erro de uma requisição específica, por isso só logamos - não
  // derrubamos o processo.
  logger.error('Erro inesperado em uma conexão ociosa do pool do PostgreSQL', {
    error: err.message,
  });
});

export async function checkDatabaseConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
