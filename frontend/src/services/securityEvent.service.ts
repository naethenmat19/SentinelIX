import apiRequest from './api';

export interface SecurityEvent {
  id: string;
  eventType: string;
  sourceIp: string;
  destinationIp?: string | null;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  createdAt: string;
}

export const getSecurityEvents = (): Promise<SecurityEvent[]> => {
  return apiRequest<SecurityEvent[]>('/security-events');
};