import { Request, Response, NextFunction } from 'express';
import { IncidentService } from '../services/incident.service.js';

const validSeverities = ['critical', 'high', 'medium', 'low'];
const validStatuses = [
  'open',
  'investigating',
  'contained',
  'resolved',
  'closed',
];

export class IncidentController {
  // GET /api/incidents
  public static async getAllIncidents(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const incidents = await IncidentService.getAllIncidents();

      res.status(200).json({
        success: true,
        data: incidents,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/incidents/:id
  public static async getIncidentById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const incident = await IncidentService.getIncidentById(req.params.id);

      if (!incident) {
        res.status(404).json({
          success: false,
          message: 'Incident not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/incidents
  public static async createIncident(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, severity, assignedTo } = req.body;

      if (
        typeof title !== 'string' ||
        !title.trim() ||
        typeof description !== 'string' ||
        !description.trim() ||
        !validSeverities.includes(severity) ||
        (assignedTo !== undefined &&
          (typeof assignedTo !== 'string' || !assignedTo.trim()))
      ) {
        res.status(400).json({
          success: false,
          message: 'Invalid incident data or missing required fields',
        });
        return;
      }

      const incident = await IncidentService.createIncident({
        title: title.trim(),
        description: description.trim(),
        severity,
        ...(assignedTo !== undefined && {
          assignedTo: assignedTo.trim(),
        }),
      });

      res.status(201).json({
        success: true,
        message: 'Incident created successfully',
        data: incident,
      });
    } catch (error) {
      next(error);
    }
  }

  // PATCH /api/incidents/:id
  public static async updateIncident(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { title, description, severity, status, assignedTo } = req.body;

      const data: {
        title?: string;
        description?: string;
        severity?: string;
        status?: string;
        assignedTo?: string | null;
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

      if (assignedTo !== undefined) {
        if (
          assignedTo !== null &&
          (typeof assignedTo !== 'string' || !assignedTo.trim())
        ) {
          res.status(400).json({
            success: false,
            message: 'Assigned analyst must be a non-empty string or null',
          });
          return;
        }

        data.assignedTo =
          assignedTo === null ? null : assignedTo.trim();
      }

      if (Object.keys(data).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Provide at least one valid field to update',
        });
        return;
      }

      const incident = await IncidentService.updateIncident(
        req.params.id,
        data
      );

      res.status(200).json({
        success: true,
        message: 'Incident updated successfully',
        data: incident,
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/incidents/:id
  public static async deleteIncident(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await IncidentService.deleteIncident(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Incident deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}