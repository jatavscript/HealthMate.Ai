import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { getDatabase } from '../database/connection';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  initialize(): void {
    this.io.use(this.authenticateSocket.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));
    logger.info('Socket.IO service initialized');
  }

  private async authenticateSocket(socket: AuthenticatedSocket, next: (err?: Error) => void): Promise<void> {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      // Verify user exists and is active
      const db = getDatabase();
      const user = await db('users')
        .select('id', 'role', 'status')
        .where('id', decoded.userId)
        .first();

      if (!user || user.status !== 'active') {
        return next(new Error('Invalid user or inactive account'));
      }

      socket.userId = user.id;
      socket.userRole = user.role;
      next();
    } catch (error) {
      logger.warn('Socket authentication failed:', error);
      next(new Error('Authentication failed'));
    }
  }

  private handleConnection(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    const userRole = socket.userRole!;
    
    logger.info('User connected via WebSocket:', { userId, userRole, socketId: socket.id });
    
    // Store connection
    this.connectedUsers.set(userId, socket.id);
    
    // Join user-specific room
    socket.join(`user:${userId}`);
    
    // Join role-specific rooms
    socket.join(`role:${userRole}`);
    
    // If doctor, join doctor-specific room
    if (userRole === 'doctor') {
      socket.join('doctors');
    }
    
    // If admin, join admin room
    if (userRole === 'admin') {
      socket.join('admins');
    }

    // Handle events
    this.setupEventHandlers(socket);

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info('User disconnected:', { userId, socketId: socket.id });
      this.connectedUsers.delete(userId);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to HealthMate.AI real-time service',
      userId,
      timestamp: new Date().toISOString()
    });
  }

  private setupEventHandlers(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    const userRole = socket.userRole!;

    // Medication adherence tracking
    socket.on('medication:taken', async (data) => {
      try {
        await this.handleMedicationTaken(userId, data);
        socket.emit('medication:confirmed', { success: true, timestamp: new Date().toISOString() });
        
        // Notify assigned doctor if patient
        if (userRole === 'patient') {
          await this.notifyAssignedDoctor(userId, 'medication:taken', data);
        }
      } catch (error) {
        logger.error('Error handling medication taken event:', error);
        socket.emit('medication:error', { error: 'Failed to record medication intake' });
      }
    });

    // Real-time vital signs (if applicable)
    socket.on('vitals:update', async (data) => {
      try {
        await this.handleVitalsUpdate(userId, data);
        
        // Notify healthcare team if critical values
        if (this.isCriticalVital(data)) {
          await this.notifyHealthcareTeam(userId, 'vitals:critical', data);
        }
      } catch (error) {
        logger.error('Error handling vitals update:', error);
        socket.emit('vitals:error', { error: 'Failed to update vitals' });
      }
    });

    // Chat/messaging
    socket.on('message:send', async (data) => {
      try {
        await this.handleMessage(userId, userRole, data);
      } catch (error) {
        logger.error('Error handling message:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Emergency alerts
    socket.on('emergency:alert', async (data) => {
      try {
        await this.handleEmergencyAlert(userId, data);
      } catch (error) {
        logger.error('Error handling emergency alert:', error);
      }
    });

    // Heartbeat for connection monitoring
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });
  }

  private async handleMedicationTaken(userId: string, data: any): Promise<void> {
    const db = getDatabase();
    
    // Record medication intake
    await db('medication_logs').insert({
      medication_id: data.medicationId,
      patient_id: userId,
      scheduled_time: data.scheduledTime,
      taken: true,
      taken_time: new Date(),
      status: 'taken',
      notes: data.notes
    });

    logger.info('Medication intake recorded via WebSocket:', {
      userId,
      medicationId: data.medicationId
    });
  }

  private async handleVitalsUpdate(userId: string, data: any): Promise<void> {
    const db = getDatabase();
    
    // Store vital signs
    await db('vital_signs').insert({
      patient_id: userId,
      type: data.type,
      value: data.value,
      unit: data.unit,
      recorded_at: new Date(),
      device_id: data.deviceId
    });

    // Emit to user's room
    this.io.to(`user:${userId}`).emit('vitals:updated', {
      type: data.type,
      value: data.value,
      timestamp: new Date().toISOString()
    });
  }

  private isCriticalVital(data: any): boolean {
    // Define critical thresholds
    const criticalThresholds: { [key: string]: { min?: number; max?: number } } = {
      'heart_rate': { min: 50, max: 120 },
      'blood_pressure_systolic': { min: 90, max: 180 },
      'blood_pressure_diastolic': { min: 60, max: 110 },
      'temperature': { min: 96, max: 102 },
      'oxygen_saturation': { min: 90, max: 100 }
    };

    const threshold = criticalThresholds[data.type];
    if (!threshold) return false;

    const value = parseFloat(data.value);
    return (threshold.min && value < threshold.min) || (threshold.max && value > threshold.max);
  }

  private async notifyAssignedDoctor(patientId: string, event: string, data: any): Promise<void> {
    const db = getDatabase();
    
    // Get assigned doctor
    const patient = await db('patients')
      .select('assigned_doctor_id')
      .where('user_id', patientId)
      .first();

    if (patient?.assigned_doctor_id) {
      const doctorSocketId = this.connectedUsers.get(patient.assigned_doctor_id);
      if (doctorSocketId) {
        this.io.to(doctorSocketId).emit('patient:update', {
          patientId,
          event,
          data,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  private async notifyHealthcareTeam(patientId: string, event: string, data: any): Promise<void> {
    // Notify all connected doctors and admins
    this.io.to('doctors').to('admins').emit('patient:critical', {
      patientId,
      event,
      data,
      timestamp: new Date().toISOString()
    });
  }

  private async handleMessage(senderId: string, senderRole: string, data: any): Promise<void> {
    const db = getDatabase();
    
    // Store message
    const [message] = await db('messages').insert({
      sender_id: senderId,
      recipient_id: data.recipientId,
      content: data.content,
      type: data.type || 'text',
      thread_id: data.threadId
    }).returning('*');

    // Send to recipient if online
    const recipientSocketId = this.connectedUsers.get(data.recipientId);
    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit('message:received', {
        id: message.id,
        senderId,
        content: data.content,
        type: data.type,
        timestamp: message.created_at
      });
    }

    // Confirm to sender
    const senderSocketId = this.connectedUsers.get(senderId);
    if (senderSocketId) {
      this.io.to(senderSocketId).emit('message:sent', {
        id: message.id,
        timestamp: message.created_at
      });
    }
  }

  private async handleEmergencyAlert(userId: string, data: any): Promise<void> {
    logger.warn('Emergency alert received:', { userId, data });
    
    // Immediately notify all healthcare providers
    this.io.to('doctors').to('admins').emit('emergency:alert', {
      patientId: userId,
      type: data.type,
      message: data.message,
      location: data.location,
      timestamp: new Date().toISOString(),
      severity: 'critical'
    });

    // Store emergency record
    const db = getDatabase();
    await db('emergency_alerts').insert({
      patient_id: userId,
      type: data.type,
      message: data.message,
      location: data.location,
      severity: 'critical',
      status: 'active'
    });
  }

  // Public methods for external services to emit events
  public emitToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  public emitToRole(role: string, event: string, data: any): void {
    this.io.to(`role:${role}`).emit(event, data);
  }

  public emitToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }

  public isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  public getConnectedUsersByRole(role: string): string[] {
    // This would require tracking user roles, simplified for now
    return Array.from(this.connectedUsers.keys());
  }
}