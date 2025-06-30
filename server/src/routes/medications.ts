import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { getDatabase } from '../database/connection';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get user's medications
router.get('/', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    
    db.all(
      'SELECT * FROM medications WHERE userId = ? ORDER BY createdAt DESC',
      [req.user?.id],
      (err, medications) => {
        if (err) return next(createError('Database error', 500));

        res.json({
          success: true,
          data: { medications }
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Add new medication
router.post('/', authenticateToken, [
  body('name').notEmpty().trim(),
  body('dosage').notEmpty().trim(),
  body('frequency').notEmpty().trim(),
  validateRequest
], (req: AuthRequest, res, next) => {
  try {
    const { name, dosage, frequency, notes } = req.body;
    const db = getDatabase();

    db.run(
      'INSERT INTO medications (userId, name, dosage, frequency, notes) VALUES (?, ?, ?, ?, ?)',
      [req.user?.id, name, dosage, frequency, notes || ''],
      function(err) {
        if (err) return next(createError('Failed to add medication', 500));

        res.status(201).json({
          success: true,
          data: {
            medication: {
              id: this.lastID,
              name,
              dosage,
              frequency,
              notes
            }
          }
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

export default router;