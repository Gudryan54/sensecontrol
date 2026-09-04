import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { criarSensorSchema, listarSensoresQuerySchema } from '../validators/sensores.validator';
import { criarSensor, listarSensoresPorDispositivo } from '../services/sensores.service';

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

// GET /sensores?dispositivo_id= - Listar sensores de um dispositivo.
// Não estava na tabela de rotas original (seção 9), mas segue o mesmo
// padrão de listagem já usado por /locais e /dispositivos, e é
// necessário para o dashboard (Etapa 4) descobrir quais sensores
// (água/energia) existem em um dispositivo sem precisar de IDs fixos.
sensoresRouter.get(
  '/sensores',
  asyncHandler(async (req, res) => {
    const { dispositivo_id } = listarSensoresQuerySchema.parse(req.query);
    const sensores = await listarSensoresPorDispositivo(dispositivo_id);
    res.status(200).json(sensores);
  }),
);
