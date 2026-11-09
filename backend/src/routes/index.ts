import { Router } from 'express';
import healthRoutes from './health.routes.js';
import alertRoutes from './alert.routes.js';
import incidentRoutes from './incident.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/alerts', alertRoutes);
apiRouter.use('/incidents', incidentRoutes);

export default apiRouter;