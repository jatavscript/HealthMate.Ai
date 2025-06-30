import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { getDatabase } from '../database/connection';

export interface NotificationData {
  userId: string;
  type: 'medication' | 'appointment' | 'meal' | 'exercise' | 'system' | 'alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  channels: ('push' | 'email' | 'sms')[];
  data?: any;
  scheduledFor?: Date;
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SMSData {
  to: string;
  message: string;
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: any = null;

  constructor() {
    this.initializeEmailService();
    this.initializeSMSService();
  }

  private initializeEmailService(): void {
    if (config.email.auth.user && config.email.auth.pass) {
      this.emailTransporter = nodemailer.createTransporter({
        service: config.email.service,
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.auth.user,
          pass: config.email.auth.pass
        }
      });

      logger.info('Email service initialized');
    } else {
      logger.warn('Email service not configured - missing credentials');
    }
  }

  private initializeSMSService(): void {
    if (config.sms.accountSid && config.sms.authToken) {
      this.twilioClient = twilio(config.sms.accountSid, config.sms.authToken);
      logger.info('SMS service initialized');
    } else {
      logger.warn('SMS service not configured - missing Twilio credentials');
    }
  }

  async sendNotification(notification: NotificationData): Promise<void> {
    try {
      const db = getDatabase();
      
      // Get user preferences and contact info
      const user = await db('users')
        .select('email', 'phone', 'preferences')
        .where('id', notification.userId)
        .first();

      if (!user) {
        throw new Error(`User not found: ${notification.userId}`);
      }

      const preferences = user.preferences ? JSON.parse(user.preferences) : {};
      
      // Store notification in database
      await this.storeNotification(notification);

      // Send via requested channels
      const promises: Promise<any>[] = [];

      if (notification.channels.includes('email') && this.shouldSendEmail(preferences, notification.type)) {
        promises.push(this.sendEmail({
          to: user.email,
          subject: notification.title,
          html: this.generateEmailHTML(notification),
          text: notification.message
        }));
      }

      if (notification.channels.includes('sms') && this.shouldSendSMS(preferences, notification.type) && user.phone) {
        promises.push(this.sendSMS({
          to: user.phone,
          message: `${notification.title}\n\n${notification.message}`
        }));
      }

      if (notification.channels.includes('push')) {
        promises.push(this.sendPushNotification(notification));
      }

      await Promise.allSettled(promises);
      
      logger.info('Notification sent successfully:', {
        userId: notification.userId,
        type: notification.type,
        channels: notification.channels
      });
    } catch (error) {
      logger.error('Failed to send notification:', error);
      throw error;
    }
  }

  private async storeNotification(notification: NotificationData): Promise<void> {
    const db = getDatabase();
    
    await db('notifications').insert({
      user_id: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      data: notification.data ? JSON.stringify(notification.data) : null,
      scheduled_for: notification.scheduledFor || new Date(),
      status: 'sent'
    });
  }

  private shouldSendEmail(preferences: any, type: string): boolean {
    const emailPrefs = preferences.notifications?.email || {};
    return emailPrefs.enabled !== false && emailPrefs[type] !== false;
  }

  private shouldSendSMS(preferences: any, type: string): boolean {
    const smsPrefs = preferences.notifications?.sms || {};
    return smsPrefs.enabled === true && smsPrefs[type] === true;
  }

  private async sendEmail(emailData: EmailData): Promise<void> {
    if (!this.emailTransporter) {
      logger.warn('Email service not available');
      return;
    }

    try {
      await this.emailTransporter.sendMail({
        from: `"HealthMate.AI" <${config.email.auth.user}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      });

      logger.info('Email sent successfully:', { to: emailData.to });
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  private async sendSMS(smsData: SMSData): Promise<void> {
    if (!this.twilioClient) {
      logger.warn('SMS service not available');
      return;
    }

    try {
      await this.twilioClient.messages.create({
        body: smsData.message,
        from: config.sms.fromNumber,
        to: smsData.to
      });

      logger.info('SMS sent successfully:', { to: smsData.to });
    } catch (error) {
      logger.error('Failed to send SMS:', error);
      throw error;
    }
  }

  private async sendPushNotification(notification: NotificationData): Promise<void> {
    // TODO: Implement push notification service (Firebase, OneSignal, etc.)
    logger.info('Push notification would be sent:', {
      userId: notification.userId,
      title: notification.title
    });
  }

  private generateEmailHTML(notification: NotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
          .priority-${notification.priority} { border-left: 4px solid ${this.getPriorityColor(notification.priority)}; padding-left: 16px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">HealthMate.AI</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Your AI-Powered Recovery Partner</p>
          </div>
          <div class="content priority-${notification.priority}">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            ${notification.data ? `<div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <strong>Additional Information:</strong><br>
              ${this.formatNotificationData(notification.data)}
            </div>` : ''}
          </div>
          <div class="footer">
            <p>This notification was sent by HealthMate.AI. If you no longer wish to receive these emails, please update your notification preferences in the app.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#2563eb';
      default: return '#059669';
    }
  }

  private formatNotificationData(data: any): string {
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join('<br>');
    }
    return String(data);
  }

  // Medication reminder specific method
  async sendMedicationReminder(userId: string, medicationName: string, dosage: string, scheduledTime: Date): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'medication',
      title: 'Medication Reminder',
      message: `It's time to take your ${medicationName} (${dosage}).`,
      priority: 'high',
      channels: ['push', 'email'],
      data: {
        medicationName,
        dosage,
        scheduledTime: scheduledTime.toISOString()
      },
      scheduledFor: scheduledTime
    });
  }

  // Appointment reminder specific method
  async sendAppointmentReminder(userId: string, appointmentDetails: any): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: `You have an upcoming appointment with ${appointmentDetails.doctorName} at ${appointmentDetails.time}.`,
      priority: 'high',
      channels: ['push', 'email', 'sms'],
      data: appointmentDetails
    });
  }

  // System alert method
  async sendSystemAlert(userId: string, alertType: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'system',
      title: `System Alert: ${alertType}`,
      message,
      priority,
      channels: priority === 'urgent' ? ['push', 'email', 'sms'] : ['push', 'email']
    });
  }
}