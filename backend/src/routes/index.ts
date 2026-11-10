
import { Router } from 'express';
import healthRoutes from './health.routes.js';
import alertRoutes from './alert.routes.js';
import incidentRoutes from './incident.routes.js';
import securityEventRoutes from './securityEvent.routes.js';
import userRoutes from './user.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/alerts', alertRoutes);
apiRouter.use('/incidents', incidentRoutes);
apiRouter.use('/security-events', securityEventRoutes);
apiRouter.use('/users', userRoutes);

export default apiRouter;
