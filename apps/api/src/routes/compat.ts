import { Router } from 'express';
import { listCompatibility } from '../controllers/compat-controller';

const router = Router();

router.get('/', listCompatibility);

export default router;
