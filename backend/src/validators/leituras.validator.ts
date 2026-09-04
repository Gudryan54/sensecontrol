import { z } from 'zod';
import { env } from '../config/env';

/**
 * Corpo de POST /leituras. "timestamp" é opcional: quando o
 * simulador/gateway IoT (Etapa 3) não enviar um, o backend usa o
 * horário de recebimento (NOW() no banco).
 *
 * "valor" precisa ser não-negativo e abaixo de um teto plausível
 * (seção 9 da documentação técnica: "valor dentro de uma faixa
 * plausível") - o teto é configurável via LEITURA_VALOR_MAXIMO no
 * .env, para o grupo poder ajustar sem recompilar o código.
 */
export const criarLeituraSchema = z.object({
  sensor_id: z.number().int().positive(),
  valor: z
    .number()
    .nonnegative('valor não pode ser negativo')
    .max(
      env.leituraValorMaximo,
      `valor acima do limite plausível configurado (${env.leituraValorMaximo})`,
    ),
  timestamp: z.string().datetime({ offset: true }).optional(),
});

export const listarLeiturasQuerySchema = z
  .object({
    sensor_id: z.coerce.number().int().positive('sensor_id é obrigatório e deve ser um número'),
    inicio: z.string().datetime({ offset: true }).optional(),
    fim: z.string().datetime({ offset: true }).optional(),
  })
  .refine((data) => !data.inicio || !data.fim || data.inicio <= data.fim, {
    message: '"inicio" deve ser anterior ou igual a "fim"',
    path: ['inicio'],
  });
