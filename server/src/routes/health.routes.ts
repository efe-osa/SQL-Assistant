import { Router } from 'express';
import { healthCheck } from '../services/health.service';

const router = Router();

router.get('/health', healthCheck);

export { router as healthRouter };