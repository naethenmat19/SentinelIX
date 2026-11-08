import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service.js';

const validSeverities = ['critical', 'high', 'medium', 'low'];
const validStatuses = ['open', 'investigating', 'resolved'];

export class AlertController {
  // GET /api/alerts
  public static async getAllAlerts(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const alerts = await AlertService.getAllAlerts();

      res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/alerts/:id
  public static async getAlertById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const alert = await AlertService.getAlertById(req.params.id);

      if (!alert) {
        res.status(404).json({
          success: false,
          message: 'Alert not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/alerts
  public static async createAlert(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, severity, source } = req.body;

      if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof description !== 'string' ||
        !description.trim() ||
        typeof source !== 'string' ||
        !source.trim() ||
        !validSeverities.includes(severity)
      ) {
        res.status(400).json({
          success: false,
          message: 'Invalid alert data or missing required fields',
        });
        return;
      }

      const alert = await AlertService.createAlert({
        title: title.trim(),
        description: description.trim(),
        severity,
        source: source.trim(),
      });

      res.status(201).json({
        success: true,
        message: 'Alert created successfully',
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/alerts/:id
  public static async updateAlert(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, severity, status, source } = req.body;

      const data: {
        title?: string;
        description?: string;
        severity?: string;
        status?: string;
        source?: string;
      } = {};

      if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
          res.status(400).json({
            success: false,
            message: 'Title must be a non-empty string',
          });
          return;
        }
        data.title = title.trim();
      }

      if (description !== undefined) {
        if (typeof description !== 'string' || !description.trim()) {
          res.status(400).json({
            success: false,
            message: 'Description must be a non-empty string',
          });
          return;
        }
        data.description = description.trim();
      }

      if (source !== undefined) {
        if (typeof source !== 'string' || !source.trim()) {
          res.status(400).json({
            success: false,
            message: 'Source must be a non-empty string',
          });
          return;
        }
        data.source = source.trim();
      }

      if (severity !== undefined) {
        if (!validSeverities.includes(severity)) {
          res.status(400).json({
            success: false,
            message: 'Invalid severity value',
          });
          return;
        }
        data.severity = severity;
      }

      if (status !== undefined) {
        if (!validStatuses.includes(status)) {
          res.status(400).json({
            success: false,
            message: 'Invalid status value',
          });
          return;
        }
        data.status = status;
      }

      if (Object.keys(data).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Provide at least one valid field to update',
        });
        return;
      }

      const alert = await AlertService.updateAlert(req.params.id, data);

      res.status(200).json({
        success: true,
        message: 'Alert updated successfully',
        data: alert,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/alerts/:id
  public static async deleteAlert(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await AlertService.deleteAlert(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Alert deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}