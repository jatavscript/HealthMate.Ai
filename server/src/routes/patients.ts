import express from 'express';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';
import { getDatabase } from '../database/connection';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get all patients (doctors and admins only)
router.get('/', authenticateToken, authorizeRoles('doctor', 'admin'), (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    
    db.all(
      'SELECT p.*, u.firstName, u.lastName, u.email FROM patients p JOIN users u ON p.userId = u.id',
      (err, patients) => {
        if (err) return next(createError('Database error', 500));

        res.json({
          success: true,
          data: { patients }
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Get patient by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    db.get(
      'SELECT p.*, u.firstName, u.lastName, u.email FROM patients p JOIN users u ON p.userId = u.id WHERE p.id = ?',
      [id],
      (err, patient) => {
        if (err) return next(createError('Database error', 500));
        if (!patient) return next(createError('Patient not found', 404));

        res.json({
          success: true,
          data: { patient }
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

export default router;