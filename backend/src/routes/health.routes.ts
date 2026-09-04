import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { checkDatabaseConnection } from '../config/db';

export const healthRouter = Router();

/**
 * GET /health - não faz parte da tabela de endpoints da seção 9 da
 * documentação técnica; é uma rota puramente operacional (confirma
 * que a API subiu e consegue falar com o banco), útil para conferir
 * rapidamente que o backend está no ar durante o desenvolvimento e a
 * demonstração. Não é uma funcionalidade de produto.
 */
healthRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    await checkDatabaseConnection();
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }),
);
