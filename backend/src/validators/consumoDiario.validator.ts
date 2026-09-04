import { z } from 'zod';

/**
 * Filtro de GET /consumo-diario. "inicio"/"fim" usam data (YYYY-MM-DD),
 * não timestamp com hora, porque a coluna "data" de consumo_diario é
 * DATE (ver docs/BANCO_DE_DADOS.md) - diferente de /leituras, que
 * filtra por timestamp completo.
 */
export const listarConsumoDiarioQuerySchema = z
  .object({
    sensor_id: z.coerce.number().int().positive('sensor_id é obrigatório e deve ser um número'),
    inicio: z.string().date().optional(),
    fim: z.string().date().optional(),
  })
  .refine((data) => !data.inicio || !data.fim || data.inicio <= data.fim, {
    message: '"inicio" deve ser anterior ou igual a "fim"',
    path: ['inicio'],
  });
