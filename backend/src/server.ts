
import { createApp } from './app.js';
import { config } from './config/index.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const startServer = async () => {
  try {
    // Connect to the database before starting the server
    await prisma.$connect();
    console.log('[SentinelX Backend] Database connected successfully.');

    const server = app.listen(config.port, () => {
      console.log(
        `[SentinelX Backend] Server is running in ${config.nodeEnv} mode on port ${config.port}`
      );
      console.log(
        `[SentinelX Backend] Health endpoint: http://localhost:${config.port}/api/health`
      );
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(
        `\n[SentinelX Backend] Received ${signal}, shutting down gracefully...`
      );

      server.close(async () => {
        await prisma.$disconnect();
        console.log('[SentinelX Backend] Database disconnected.');
        console.log('[SentinelX Backend] Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[SentinelX Backend] Failed to start:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
