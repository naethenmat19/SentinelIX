
import { prisma } from '../lib/prisma.js';

export class SecurityEventService {
  // Retrieve all security events
  public static async getAllEvents() {
    return prisma.securityEvent.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  // Retrieve a single security event by ID
  public static async getEventById(id: string) {
    return prisma.securityEvent.findUnique({
      where: { id },
    });
  }

  // Create a new security event
  public static async createEvent(data: {
    eventType: string;
    sourceIp: string;
    destinationIp?: string;
    description: string;
    severity: string;
  }) {
    return prisma.securityEvent.create({
      data,
    });
  }
}
