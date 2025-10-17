import { Router } from 'express';
import { listSpecs } from '../controllers/spec-controller';

const router = Router();

router.get('/', listSpecs);

export default router;
