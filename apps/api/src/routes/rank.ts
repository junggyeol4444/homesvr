import { Router } from 'express';
import { rankProductsController } from '../controllers/product-controller';

const router = Router();

router.get('/', rankProductsController);

export default router;
