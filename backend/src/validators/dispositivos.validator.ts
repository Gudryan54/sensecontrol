import { z } from 'zod';

export const criarDispositivoSchema = z.object({
  local_id: z.number().int().positive(),
  nome: z.string().trim().min(1).max(100),
  identificador_mac: z
    .string()
    .trim()
    .min(1, 'identificador_mac é obrigatório')
    .max(50),
});

export const listarDispositivosQuerySchema = z.object({
  local_id: z.coerce.number().int().positive('local_id é obrigatório e deve ser um número'),
});
