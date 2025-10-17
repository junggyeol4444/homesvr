import { Router } from 'express';
import { compareProductsController } from '../controllers/product-controller';

const router = Router();

router.post('/', compareProductsController);

export default router;
