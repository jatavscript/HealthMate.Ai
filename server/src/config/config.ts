import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || './database.sqlite',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';