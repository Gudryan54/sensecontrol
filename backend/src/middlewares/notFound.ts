import { Request, Response } from 'express';

/** Handler para qualquer rota que não bateu com nenhuma definida. */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.path}` });
}
