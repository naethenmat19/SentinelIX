import { Router } from 'express';
import { HealthController } from '../controllers/health.controller.js';

const router = Router();

// Application health check
router.get('/', HealthController.getHealth);

// Database health check
router.get('/database', HealthController.getDatabaseHealth);

export default router;