import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usuariosRouter } from './usuarios.routes';
import { locaisRouter } from './locais.routes';
import { dispositivosRouter } from './dispositivos.routes';
import { sensoresRouter } from './sensores.routes';
import { leiturasRouter } from './leituras.routes';

export const router = Router();

router.use(healthRouter);
router.use(usuariosRouter);
router.use(locaisRouter);
router.use(dispositivosRouter);
router.use(sensoresRouter);
router.use(leiturasRouter);
