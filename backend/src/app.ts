import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { requestLogger } from './middlewares/requestLogger';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

export function createApp(): Application {
  const app = express();

  // helmet: cabeçalhos HTTP de segurança básicos (seção 13 da
  // documentação técnica). cors: liberado para qualquer origem nesta
  // etapa - o frontend (Etapa 4) ainda não existe, e restringir a
  // origem certa antes de ela existir só atrapalharia o
  // desenvolvimento; reavaliar quando o domínio do frontend for
  // definido.
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use(router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
