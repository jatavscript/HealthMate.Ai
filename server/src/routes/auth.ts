import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { config } from '../config/config';
import { getDatabase } from '../database/connection';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  validateRequest
], async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role = 'patient' } = req.body;
    const db = getDatabase();

    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) return next(createError('Database error', 500));
      if (row) return next(createError('User already exists', 400));

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert user
      db.run(
        'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, role],
        function(err) {
          if (err) return next(createError('Failed to create user', 500));

          const token = jwt.sign(
            { id: this.lastID, email, role },
            config.jwtSecret,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            success: true,
            data: {
              token,
              user: { id: this.lastID, email, firstName, lastName, role }
            }
          });
        }
      );
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest
], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const db = getDatabase();

    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (err, user: any) => {
        if (err) return next(createError('Database error', 500));
        if (!user) return next(createError('Invalid credentials', 401));

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return next(createError('Invalid credentials', 401));

        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          config.jwtSecret,
          { expiresIn: '24h' }
        );

        res.json({
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role
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