import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../../server/routes.js';

const app = express();

// Set up your Express app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register your API routes
await registerRoutes(app);

// Export the serverless handler
export const handler = serverless(app);