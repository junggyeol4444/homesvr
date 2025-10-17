import { Router } from 'express';
import productsRouter from './products';
import specsRouter from './specs';
import pricesRouter from './prices';
import compareRouter from './compare';
import rankRouter from './rank';
import alertsRouter from './alerts';
import compatRouter from './compat';
import surveyRouter from './survey';
import categoriesRouter from './categories';

const router = Router();

router.use('/products', productsRouter);
router.use('/specs', specsRouter);
router.use('/prices', pricesRouter);
router.use('/compare', compareRouter);
router.use('/rank', rankRouter);
router.use('/alerts', alertsRouter);
router.use('/compat', compatRouter);
router.use('/survey', surveyRouter);
router.use('/categories', categoriesRouter);

export default router;
