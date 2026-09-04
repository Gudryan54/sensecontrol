import { z } from 'zod';

/**
 * Corpo de POST /locais.
 * Endpoint não estava explícito na tabela de rotas da seção 9 da
 * documentação técnica, mas a entidade "locais" (seção 8) exige um
 * jeito de cadastrá-la - sem isso, não é possível cadastrar um
 * dispositivo (que depende de local_id). Ver docs/DECISOES_DE_TECNOLOGIA.md
 * / commit desta etapa para a justificativa completa.
 */
export const criarLocalSchema = z.object({
  usuario_id: z.number().int().positive(),
  nome: z.string().trim().min(1).max(100),
  endereco: z.string().trim().max(255).optional(),
});

export const listarLocaisQuerySchema = z.object({
  usuario_id: z.coerce.number().int().positive('usuario_id é obrigatório e deve ser um número'),
});
