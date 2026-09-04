import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Loga toda requisição recebida e o status/tempo da resposta.
 * Requisito de segurança/observabilidade da documentação técnica
 * (seção 13): registrar eventos relevantes sem incluir dados
 * sensíveis (aqui só method/path/status/duração - nunca corpo da
 * requisição, que poderia conter senha em rotas futuras de login).
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.info('requisicao', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
    });
  });
  next();
}
