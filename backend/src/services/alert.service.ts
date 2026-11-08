import { prisma } from '../lib/prisma.js';

export class AlertService {
  // Retrieve all alerts
  public static async getAllAlerts() {
    return prisma.alert.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Retrieve a single alert by ID
  public static async getAlertById(id: string) {
    return prisma.alert.findUnique({
      where: { id },
    });
  }

  // Create a new alert
  public static async createAlert(data: {
    title: string;
    description: string;
    severity: string;
    source: string;
  }) {
    return prisma.alert.create({
      data,
    });
  }

  // Update an existing alert
  public static async updateAlert(
    id: string,
    data: {
      title?: string;
      description?: string;
      severity?: string;
      status?: string;
      source?: string;
    }
  ) {
    return prisma.alert.update({
      where: { id },
      data,
    });
  }

  // Delete an alert
  public static async deleteAlert(id: string) {
    return prisma.alert.delete({
      where: { id },
    });
  }
}