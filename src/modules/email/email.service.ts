import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const gmailEmail = process.env.GMAIL_EMAIL;
    const gmailPassword = process.env.GMAIL_PASSWORD;

    if (!gmailEmail || !gmailPassword) {
      this.logger.error('GMAIL_EMAIL or GMAIL_PASSWORD not configured');
      throw new Error('Email credentials are not configured');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailPassword,
      },
    });

    this.logger.log('Email transporter initialized successfully');
  }

  /**
   * Envía un correo electrónico
   * @param options - Opciones del correo (destinatario, asunto, contenido)
   * @returns Promise con el resultado del envío
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { to, subject, html, text } = options;

      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      this.logger.log(`Email sent successfully to ${to}. MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Envía un correo electrónico simple con texto plano
   * @param to - Destinatario(s)
   * @param subject - Asunto del correo
   * @param text - Contenido en texto plano
   */
  async sendTextEmail(to: string | string[], subject: string, text: string): Promise<boolean> {
    return this.sendEmail({ to, subject, text });
  }

  /**
   * Envía un correo electrónico con contenido HTML
   * @param to - Destinatario(s)
   * @param subject - Asunto del correo
   * @param html - Contenido HTML
   */
  async sendHtmlEmail(to: string | string[], subject: string, html: string): Promise<boolean> {
    return this.sendEmail({ to, subject, html });
  }

  /**
   * Envía notificaciones a múltiples destinatarios
   * @param recipients - Lista de destinatarios
   * @param subject - Asunto del correo
   * @param html - Contenido HTML
   */
  async sendBulkNotification(
    recipients: string[],
    subject: string,
    html: string,
  ): Promise<{ successful: number; failed: number; errors: string[] }> {
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const recipient of recipients) {
      try {
        await this.sendHtmlEmail(recipient, subject, html);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to send to ${recipient}: ${error.message}`);
      }
    }

    this.logger.log(
      `Bulk notification completed. Successful: ${results.successful}, Failed: ${results.failed}`,
    );

    return results;
  }

  /**
   * Verifica la configuración del transportador
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email transporter connection verified');
      return true;
    } catch (error) {
      this.logger.error('Email transporter verification failed', error.stack);
      return false;
    }
  }
}
