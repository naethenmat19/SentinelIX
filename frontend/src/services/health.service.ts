import apiRequest from './api';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
}

export interface DatabaseHealth {
  database: 'connected' | 'disconnected';
  timestamp: string;
}

export const getSystemHealth = (): Promise<SystemHealth> => {
  return apiRequest<SystemHealth>('/health');
};

export const getDatabaseHealth = (): Promise<DatabaseHealth> => {
  return apiRequest<DatabaseHealth>('/health/database');
};