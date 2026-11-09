
import { Router } from 'express';
import { SecurityEventController } from '../controllers/securityEvent.controller.js';

const router = Router();

// Retrieve all security events
router.get('/', SecurityEventController.getAllEvents);

// Retrieve a specific security event
router.get('/:id', SecurityEventController.getEventById);

// Create a new security event
router.post('/', SecurityEventController.createEvent);

export default router;
