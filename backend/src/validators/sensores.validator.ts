import { z } from 'zod';

/**
 * A combinação tipo/unidade_medida não é livre: um sensor de água
 * sempre mede em litros, um de energia sempre em kWh (mesma regra já
 * expressa como CHECK constraints em database/004_create_sensores.sql).
 * Validar isso aqui, antes de chegar no banco, permite devolver uma
 * mensagem de erro clara (400) em vez de um erro genérico de
 * constraint violation do Postgres.
 */
const UNIDADE_POR_TIPO: Record<string, string> = {
  agua: 'litros',
  energia: 'kWh',
};

export const criarSensorSchema = z
  .object({
    dispositivo_id: z.number().int().positive(),
    tipo: z.enum(['agua', 'energia']),
    unidade_medida: z.enum(['litros', 'kWh']),
  })
  .refine((data) => UNIDADE_POR_TIPO[data.tipo] === data.unidade_medida, {
    message:
      'unidade_medida incompatível com tipo: sensores de "agua" usam "litros", sensores de "energia" usam "kWh".',
    path: ['unidade_medida'],
  });

export const listarSensoresQuerySchema = z.object({
  dispositivo_id: z.coerce.number().int().positive('dispositivo_id é obrigatório e deve ser um número'),
});
