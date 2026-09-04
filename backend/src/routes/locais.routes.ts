import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { criarLocalSchema, listarLocaisQuerySchema } from '../validators/locais.validator';
import { criarLocal, listarLocaisPorUsuario } from '../services/locais.service';

export const locaisRouter = Router();

// POST /locais - Cadastrar um novo local (extensão necessária, ver
// validators/locais.validator.ts para a justificativa)
locaisRouter.post(
  '/locais',
  asyncHandler(async (req, res) => {
    const dados = criarLocalSchema.parse(req.body);
    const local = await criarLocal(dados);
    res.status(201).json(local);
  }),
);

// GET /locais?usuario_id= - Listar locais de um usuário
locaisRouter.get(
  '/locais',
  asyncHandler(async (req, res) => {
    const { usuario_id } = listarLocaisQuerySchema.parse(req.query);
    const locais = await listarLocaisPorUsuario(usuario_id);
    res.status(200).json(locais);
  }),
);
