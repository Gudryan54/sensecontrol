import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Middleware de erro central. Todo erro da aplicação (validação,
 * regra de negócio, banco de dados, ou um bug inesperado) passa por
 * aqui antes de virar uma resposta HTTP. Isso garante um formato de
 * erro consistente para o cliente da API e evita vazar detalhes
 * internos (stack trace, mensagem crua do driver do Postgres) numa
 * resposta 500.
 *
 * Precisa ter exatamente 4 parâmetros (err, req, res, next) para o
 * Express reconhecer como error handler.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error(err.message, { path: req.path, method: req.method, details: err.details });
    }
    res.status(err.statusCode).json({
      erro: err.message,
      detalhes: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      erro: 'Dados de entrada inválidos.',
      detalhes: err.issues.map((issue) => ({
        campo: issue.path.join('.'),
        problema: issue.message,
      })),
    });
    return;
  }

  // Erro não previsto: logamos o detalhe completo no servidor, mas
  // devolvemos uma mensagem genérica ao cliente.
  const message = err instanceof Error ? err.message : 'Erro desconhecido';
  logger.error('Erro não tratado', {
    path: req.path,
    method: req.method,
    error: message,
    stack: err instanceof Error ? err.stack : undefined,
  });
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}
