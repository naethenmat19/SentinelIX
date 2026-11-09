import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller.js';

const router = Router();

router.get('/', IncidentController.getAllIncidents);
router.get('/:id', IncidentController.getIncidentById);
router.post('/', IncidentController.createIncident);
router.patch('/:id', IncidentController.updateIncident);
router.delete('/:id', IncidentController.deleteIncident);

export default router;