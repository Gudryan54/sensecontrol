import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { listarConsumoDiarioQuerySchema } from '../validators/consumoDiario.validator';
import { listarConsumoDiario } from '../services/consumoDiario.service';

export const consumoDiarioRouter = Router();

// GET /consumo-diario?sensor_id=&inicio=&fim= - Consultar a agregação
// diária de consumo de um sensor. Não estava na tabela de rotas
// original (seção 9), mas expõe a tabela consumo_diario que já existe
// desde a Etapa 1 (seção 8) justamente para sustentar consultas como
// esta - necessário para o dashboard (Etapa 4) mostrar consumo de
// água/energia sem recalcular a partir de "leituras" a cada requisição.
consumoDiarioRouter.get(
  '/consumo-diario',
  asyncHandler(async (req, res) => {
    const filtro = listarConsumoDiarioQuerySchema.parse(req.query);
    const consumo = await listarConsumoDiario(filtro);
    res.status(200).json(consumo);
  }),
);
