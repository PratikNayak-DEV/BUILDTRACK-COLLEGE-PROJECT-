const app = require('./app');
const env = require('./config/env');
const connectDatabase = require('./config/database');

async function bootstrap() {
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.log(`🚀 Server listening on port ${env.port}`);
  });

  const shutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down server...`);
    server.close(() => {
      console.log('✅ HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});
