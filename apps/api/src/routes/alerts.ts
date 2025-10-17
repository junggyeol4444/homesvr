import { Router } from 'express';
import { cancelPriceAlert, createPriceAlert } from '../controllers/alert-controller';

const router = Router();

router.post('/', createPriceAlert);
router.delete('/:id', cancelPriceAlert);

export default router;
