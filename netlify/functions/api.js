import serverless from 'serverless-http';
import express from 'express';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import and register routes dynamically
let routesRegistered = false;

const setupApp = async () => {
  if (!routesRegistered) {
    const { registerRoutes } = await import('../../server/routes.js');
    await registerRoutes(app);
    routesRegistered = true;
  }
  return app;
};

// Export the serverless handler
export const handler = async (event, context) => {
  const app = await setupApp();
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};