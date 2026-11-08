
import { Request, Response } from 'express';
import { HealthService } from '../services/health.service.js';

export class HealthController {
  public static getHealth(_req: Request, res: Response): void {
    const healthData = HealthService.getHealth();

    res.status(200).json({
      success: true,
      data: healthData,
    });
  }

  public static async getDatabaseHealth(
    _req: Request,
    res: Response
  ): Promise<void> {
    const isConnected = await HealthService.getDatabaseHealth();

    res.status(isConnected ? 200 : 503).json({
      success: isConnected,
      data: {
        database: isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
