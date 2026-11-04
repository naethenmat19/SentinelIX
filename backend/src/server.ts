import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[SentinelX Backend] Server is running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`[SentinelX Backend] Health endpoint: http://localhost:${config.port}/api/health`);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\n[SentinelX Backend] Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log('[SentinelX Backend] Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
