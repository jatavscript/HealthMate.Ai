import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getDatabase } from '../database/connection';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    
    db.get(
      'SELECT id, email, firstName, lastName, role, createdAt FROM users WHERE id = ?',
      [req.user?.id],
      (err, user) => {
        if (err) return next(createError('Database error', 500));
        if (!user) return next(createError('User not found', 404));

        res.json({
          success: true,
          data: { user }
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const { firstName, lastName } = req.body;
    const db = getDatabase();

    db.run(
      'UPDATE users SET firstName = ?, lastName = ? WHERE id = ?',
      [firstName, lastName, req.user?.id],
      function(err) {
        if (err) return next(createError('Failed to update profile', 500));

        res.json({
          success: true,
          message: 'Profile updated successfully'
        });
      }
    );
  } catch (error) {
    next(error);
  }
});

export default router;