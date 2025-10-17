import { Router } from 'express';
import { listPrices } from '../controllers/price-controller';
import { refreshPrices } from '../controllers/price-sync-controller';

const router = Router();

router.get('/', listPrices);
router.post('/refresh', refreshPrices);

export default router;
