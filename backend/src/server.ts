import { createApp } from './app';
import { env } from './config/env';
import { checkDatabaseConnection, pool } from './config/db';
import { logger } from './utils/logger';

async function start(): Promise<void> {
  // Falha rápido e com uma mensagem clara se o banco não estiver
  // acessível, em vez de subir a API "funcionando" e só quebrar na
  // primeira requisição que tocar o banco.
  try {
    await checkDatabaseConnection();
  } catch (err) {
    logger.error('Não foi possível conectar ao banco de dados na inicialização.', {
      error: err instanceof Error ? err.message : String(err),
      dica: 'Confira se "docker compose up -d" está rodando e se backend/.env aponta para o host/porta corretos.',
    });
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info(`SenseControl backend rodando na porta ${env.port}`, { nodeEnv: env.nodeEnv });
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Recebido ${signal}, encerrando graciosamente...`);
    server.close(() => {
      pool.end().finally(() => process.exit(0));
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

void start();
