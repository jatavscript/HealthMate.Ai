import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { getDatabase } from '../database/connection';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// Get user's messages/conversations
router.get('/', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const db = getDatabase();
    
    // Get all conversations for the user
    const query = `
      SELECT DISTINCT 
        CASE 
          WHEN sender_id = ? THEN recipient_id 
          ELSE sender_id 
        END as contact_id,
        (SELECT content FROM messages m2 
         WHERE (m2.sender_id = ? AND m2.recipient_id = contact_id) 
            OR (m2.recipient_id = ? AND m2.sender_id = contact_id)
         ORDER BY m2.created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages m3 
         WHERE (m3.sender_id = ? AND m3.recipient_id = contact_id) 
            OR (m3.recipient_id = ? AND m3.sender_id = contact_id)
         ORDER BY m3.created_at DESC LIMIT 1) as last_message_time
      FROM messages 
      WHERE sender_id = ? OR recipient_id = ?
      ORDER BY last_message_time DESC
    `;
    
    db.all(query, [
      req.user?.id, req.user?.id, req.user?.id, 
      req.user?.id, req.user?.id, req.user?.id, req.user?.id
    ], (err, conversations) => {
      if (err) return next(createError('Database error', 500));

      res.json({
        success: true,
        data: { conversations }
      });
    });
  } catch (error) {
    next(error);
  }
});

// Get messages with a specific user
router.get('/conversation/:userId', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const { userId } = req.params;
    const db = getDatabase();
    
    const query = `
      SELECT * FROM messages 
      WHERE (sender_id = ? AND recipient_id = ?) 
         OR (sender_id = ? AND recipient_id = ?)
      ORDER BY created_at ASC
    `;
    
    db.all(query, [req.user?.id, userId, userId, req.user?.id], (err, messages) => {
      if (err) return next(createError('Database error', 500));

      res.json({
        success: true,
        data: { messages }
      });
    });
  } catch (error) {
    next(error);
  }
});

// Send a new message
router.post('/', authenticateToken, [
  body('recipientId').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('type').optional().isIn(['text', 'image', 'file']),
  validateRequest
], (req: AuthRequest, res, next) => {
  try {
    const { recipientId, content, type = 'text', threadId } = req.body;
    const db = getDatabase();
    
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO messages (id, sender_id, recipient_id, content, type, thread_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [messageId, req.user?.id, recipientId, content, type, threadId || null], function(err) {
      if (err) return next(createError('Failed to send message', 500));

      // Get the created message
      db.get('SELECT * FROM messages WHERE id = ?', [messageId], (err, message) => {
        if (err) return next(createError('Message sent but failed to retrieve', 500));

        res.status(201).json({
          success: true,
          data: { message }
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

// Mark messages as read
router.put('/read/:conversationUserId', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const { conversationUserId } = req.params;
    const db = getDatabase();
    
    // Add read_at column if it doesn't exist
    db.run('ALTER TABLE messages ADD COLUMN read_at TEXT', () => {
      // Update messages to mark as read (ignore error if column already exists)
      const query = `
        UPDATE messages 
        SET read_at = CURRENT_TIMESTAMP 
        WHERE sender_id = ? AND recipient_id = ? AND read_at IS NULL
      `;
      
      db.run(query, [conversationUserId, req.user?.id], function(err) {
        if (err) return next(createError('Failed to mark messages as read', 500));

        res.json({
          success: true,
          data: { markedAsRead: this.changes }
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

// Delete a message
router.delete('/:messageId', authenticateToken, (req: AuthRequest, res, next) => {
  try {
    const { messageId } = req.params;
    const db = getDatabase();
    
    // Only allow deletion of own messages
    const query = 'DELETE FROM messages WHERE id = ? AND sender_id = ?';
    
    db.run(query, [messageId, req.user?.id], function(err) {
      if (err) return next(createError('Failed to delete message', 500));
      
      if (this.changes === 0) {
        return next(createError('Message not found or not authorized', 404));
      }

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    });
  } catch (error) {
    next(error);
  }
});

export default router;