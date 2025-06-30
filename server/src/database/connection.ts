import sqlite3 from 'sqlite3';
import { logger } from '../utils/logger';
import { config } from '../config/config';

let db: sqlite3.Database;

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(config.databaseUrl, (err) => {
      if (err) {
        logger.error('Error opening database:', err);
        reject(err);
      } else {
        logger.info('Connected to SQLite database');
        
        // Create messages table if it doesn't exist
        const createMessagesTable = `
          CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            sender_id TEXT NOT NULL,
            recipient_id TEXT NOT NULL,
            content TEXT NOT NULL,
            type TEXT NOT NULL DEFAULT 'text',
            thread_id TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE
          )
        `;
        
        db.run(createMessagesTable, (err) => {
          if (err) {
            logger.error('Error creating messages table:', err);
            reject(err);
          } else {
            logger.info('Messages table created or already exists');
            
            // Create users table if it doesn't exist (fallback for demo)
            const createUsersTable = `
              CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'patient',
                createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
              )
            `;
            
            db.run(createUsersTable, (err) => {
              if (err) {
                logger.error('Error creating users table:', err);
                reject(err);
              } else {
                logger.info('Users table created or already exists');
                
                // Create medications table if it doesn't exist (fallback for demo)
                const createMedicationsTable = `
                  CREATE TABLE IF NOT EXISTS medications (
                    id TEXT PRIMARY KEY,
                    userId TEXT NOT NULL,
                    name TEXT NOT NULL,
                    dosage TEXT NOT NULL,
                    frequency TEXT NOT NULL,
                    notes TEXT,
                    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
                  )
                `;
                
                db.run(createMedicationsTable, (err) => {
                  if (err) {
                    logger.error('Error creating medications table:', err);
                    reject(err);
                  } else {
                    logger.info('Medications table created or already exists');
                    resolve();
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};

export const getDatabase = (): sqlite3.Database => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
};

export const closeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          logger.error('Error closing database:', err);
          reject(err);
        } else {
          logger.info('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};