import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { atualizarUsuarioSchema, usuarioIdParamSchema } from '../validators/usuarios.validator';
import { atualizarUsuario, buscarUsuarioPorId } from '../services/usuarios.service';

export const usuariosRouter = Router();

// GET /usuarios/:id - Consultar dados de um usuário (seção 9)
usuariosRouter.get(
  '/usuarios/:id',
  asyncHandler(async (req, res) => {
    const { id } = usuarioIdParamSchema.parse(req.params);
    const usuario = await buscarUsuarioPorId(id);
    res.status(200).json(usuario);
  }),
);

// PUT /usuarios/:id - Atualizar dados de um usuário (seção 9)
usuariosRouter.put(
  '/usuarios/:id',
  asyncHandler(async (req, res) => {
    const { id } = usuarioIdParamSchema.parse(req.params);
    const dados = atualizarUsuarioSchema.parse(req.body);
    const usuario = await atualizarUsuario(id, dados);
    res.status(200).json(usuario);
  }),
);
