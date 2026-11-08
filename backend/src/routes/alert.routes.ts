import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller.js';

const router = Router();

router.get('/', AlertController.getAllAlerts);
router.get('/:id', AlertController.getAlertById);
router.post('/', AlertController.createAlert);
router.patch('/:id', AlertController.updateAlert);
router.delete('/:id', AlertController.deleteAlert);

export default router;