
import api from './api';

export interface Analyst {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const getUsers = async (): Promise<Analyst[]> => {
  return api<Analyst[]>('/users');
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<Analyst> => {
  return api<Analyst>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
