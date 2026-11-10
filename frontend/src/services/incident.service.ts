
import apiRequest from './api';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentData {
  title: string;
  description: string;
  severity: Incident['severity'];
  assignedTo?: string;
}

export interface UpdateIncidentData {
  title?: string;
  description?: string;
  severity?: Incident['severity'];
  status?: Incident['status'];
  assignedTo?: string | null;
}

export const getIncidents = (): Promise<Incident[]> => {
  return apiRequest<Incident[]>('/incidents');
};

export const createIncident = (
  data: CreateIncidentData
): Promise<Incident> => {
  return apiRequest<Incident>('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateIncident = (
  id: string,
  data: UpdateIncidentData
): Promise<Incident> => {
  return apiRequest<Incident>(`/incidents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
