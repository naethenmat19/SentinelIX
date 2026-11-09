import { prisma } from '../lib/prisma.js';

export class IncidentService {
  // Retrieve all incidents
  public static async getAllIncidents() {
    return prisma.incident.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Retrieve a single incident by ID
  public static async getIncidentById(id: string) {
    return prisma.incident.findUnique({
      where: { id },
    });
  }

  // Create a new incident
  public static async createIncident(data: {
    title: string;
    description: string;
    severity: string;
    assignedTo?: string;
  }) {
    return prisma.incident.create({
      data,
    });
  }

  // Update an existing incident
  public static async updateIncident(
    id: string,
    data: {
      title?: string;
      description?: string;
      severity?: string;
      status?: string;
      assignedTo?: string | null;
    }
  ) {
    return prisma.incident.update({
      where: { id },
      data,
    });
  }

  // Delete an incident
  public static async deleteIncident(id: string) {
    return prisma.incident.delete({
      where: { id },
    });
  }
}