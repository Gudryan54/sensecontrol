import { Router } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { criarLeituraSchema, listarLeiturasQuerySchema } from '../validators/leituras.validator';
import { listarLeituras, registrarLeitura } from '../services/leituras.service';

export const leiturasRouter = Router();

// POST /leituras - Registrar uma nova leitura (usado pelo gateway
// IoT / simulador - seção 9). Também usável manualmente via
// curl/Postman nesta etapa, antes do simulador existir (Etapa 3).
leiturasRouter.post(
  '/leituras',
  asyncHandler(async (req, res) => {
    const dados = criarLeituraSchema.parse(req.body);
    const leitura = await registrarLeitura(dados);
    res.status(201).json(leitura);
  }),
);

// GET /leituras?sensor_id=&inicio=&fim= - Consultar leituras de um
// sensor em um período (seção 9)
leiturasRouter.get(
  '/leituras',
  asyncHandler(async (req, res) => {
    const filtro = listarLeiturasQuerySchema.parse(req.query);
    const leituras = await listarLeituras(filtro);
    res.status(200).json(leituras);
  }),
);
