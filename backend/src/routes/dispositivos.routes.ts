import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import {
  criarDispositivoSchema,
  listarDispositivosQuerySchema,
} from '../validators/dispositivos.validator';
import { criarDispositivo, listarDispositivosPorLocal } from '../services/dispositivos.service';

export const dispositivosRouter = Router();

// POST /dispositivos - Cadastrar um novo dispositivo (seção 9)
dispositivosRouter.post(
  '/dispositivos',
  asyncHandler(async (req, res) => {
    const dados = criarDispositivoSchema.parse(req.body);
    const dispositivo = await criarDispositivo(dados);
    res.status(201).json(dispositivo);
  }),
);

// GET /dispositivos?local_id= - Listar dispositivos de um local (seção 9)
dispositivosRouter.get(
  '/dispositivos',
  asyncHandler(async (req, res) => {
    const { local_id } = listarDispositivosQuerySchema.parse(req.query);
    const dispositivos = await listarDispositivosPorLocal(local_id);
    res.status(200).json(dispositivos);
  }),
);
