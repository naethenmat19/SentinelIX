import apiRequest from './api';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  source: string;
  createdAt: string;
  updatedAt: string;
}


export const getAlerts = (): Promise<Alert[]> => {
  return apiRequest<Alert[]>('/alerts');
};