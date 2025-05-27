import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Always use the external Neon.tech database
const NEON_DATABASE_URL = "postgresql://neondb_owner:npg_9nXlEqferJp3@ep-raspy-poetry-a8r13muz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require";
const DATABASE_URL = process.env.DATABASE_URL || NEON_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Log which database is being used for verification
console.log('Database Connection:', DATABASE_URL.includes('neon.tech') ? 'Using Neon.tech external database' : 'Using other database');

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });