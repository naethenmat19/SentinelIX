export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
}

export class HealthService {
  public static getHealth(): SystemHealth {
    return {
      status: 'healthy',
      service: 'SentinelX SOC Backend API',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
