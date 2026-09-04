import { NextFunction, Request, Response } from 'express';

/**
 * Envolve um route handler assíncrono para que qualquer erro
 * lançado (ou promise rejeitada) seja encaminhado ao middleware de
 * erro central via next(err), em vez de derrubar o processo ou
 * travar a requisição sem resposta. O Express, por padrão, só faz
 * isso automaticamente para código síncrono.
 */
type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}
