
import { Request, Response, NextFunction } from 'express';
import { SecurityEventService } from '../services/securityEvent.service.js';

const validSeverities = ['critical', 'high', 'medium', 'low'];

export class SecurityEventController {
  // Retrieve all security events
  public static async getAllEvents(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const events = await SecurityEventService.getAllEvents();

      res.status(200).json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  // Retrieve a single security event
  public static async getEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const event = await SecurityEventService.getEventById(req.params.id);

      if (!event) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Security event not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create a new security event
  public static async createEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        eventType,
        sourceIp,
        destinationIp,
        description,
        severity,
      } = req.body;

      // Validate required fields
      if (
        !eventType ||
        !sourceIp ||
        !description ||
        !severity
      ) {
        res.status(400).json({
          success: false,
          error: {
            message:
              'eventType, sourceIp, description, and severity are required',
          },
        });
        return;
      }

      // Validate field types
      if (
        typeof eventType !== 'string' ||
        typeof sourceIp !== 'string' ||
        typeof description !== 'string' ||
        (destinationIp !== undefined &&
          typeof destinationIp !== 'string')
      ) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid field types',
          },
        });
        return;
      }

      // Validate severity
      if (!validSeverities.includes(severity)) {
        res.status(400).json({
          success: false,
          error: {
            message:
              'Invalid severity. Must be critical, high, medium, or low',
          },
        });
        return;
      }

      const event = await SecurityEventService.createEvent({
        eventType: eventType.trim(),
        sourceIp: sourceIp.trim(),
        destinationIp: destinationIp?.trim(),
        description: description.trim(),
        severity,
      });

      res.status(201).json({
        success: true,
        message: 'Security event created successfully',
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }
}
