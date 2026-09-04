import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { criarSensorSchema } from '../validators/sensores.validator';
import { criarSensor } from '../services/sensores.service';

export const sensoresRouter = Router();

// POST /sensores - Cadastrar um sensor em um dispositivo (seção 9)
sensoresRouter.post(
  '/sensores',
  asyncHandler(async (req, res) => {
    const dados = criarSensorSchema.parse(req.body);
    const sensor = await criarSensor(dados);
    res.status(201).json(sensor);
  }),
);
