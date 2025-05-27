import serverless from 'serverless-http';
import express from 'express';

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Import and register routes dynamically
let routesRegistered = false;

const setupApp = async () => {
  if (!routesRegistered) {
    try {
      // Import routes from the built server
      const { registerRoutes } = await import('../../server/routes.js');
      await registerRoutes(app);
      routesRegistered = true;
      console.log('Routes registered successfully');
    } catch (error) {
      console.error('Failed to register routes:', error);
      throw error;
    }
  }
  return app;
};

// Export the serverless handler
export const handler = async (event, context) => {
  try {
    // Ensure DATABASE_URL is set for Netlify deployment
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URL not found in environment, using fallback');
      process.env.DATABASE_URL = "postgresql://neondb_owner:npg_9nXlEqferJp3@ep-raspy-poetry-a8r13muz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
    }
    
    console.log('Database URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No');
    
    const app = await setupApp();
    const serverlessHandler = serverless(app);
    
    // Add CORS headers for cross-origin requests
    const result = await serverlessHandler(event, context);
    
    if (result && result.headers) {
      result.headers['Access-Control-Allow-Origin'] = '*';
      result.headers['Access-Control-Allow-Headers'] = 'Content-Type';
      result.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    }
    
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};