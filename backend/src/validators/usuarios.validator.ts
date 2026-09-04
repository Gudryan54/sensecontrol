import { z } from 'zod';

/** Corpo de PUT /usuarios/:id - pelo menos um campo deve ser enviado. */
export const atualizarUsuarioSchema = z
  .object({
    nome: z.string().trim().min(1, 'nome não pode ser vazio').max(150).optional(),
    email: z.string().trim().email('email inválido').max(150).optional(),
  })
  .refine((data) => data.nome !== undefined || data.email !== undefined, {
    message: 'Informe ao menos um campo (nome ou email) para atualizar.',
  });

export const usuarioIdParamSchema = z.object({
  id: z.coerce.number().int().positive('id deve ser um número inteiro positivo'),
});
