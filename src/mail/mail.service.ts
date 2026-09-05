import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: envs.MAIL_HOST,
      port: envs.MAIL_PORT,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: envs.MAIL_USER,
        pass: envs.MAIL_PASS,
      },
    });
  }

  /**
   * Método genérico para enviar correos con contenido HTML.
   */
  async sendEmail(to: string, subject: string, htmlContent: string) {
    const mailOptions = {
      from: `"Water Leak System" <${envs.MAIL_FROM}>`,
      to,
      subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Correo enviado correctamente a ${to}`);
      return { success: true, message: 'Correo enviado correctamente' };
    } catch (error) {
      this.logger.error(`Error al enviar correo a ${to}`, error);
      return { success: false, message: 'No se pudo enviar el correo' };
    }
  }

  /**
   * Envía una alerta de fuga de agua utilizando el template HTML de reportes.
   */
  async sendWaterLeakAlert(to: string, htmlTemplate: string, title: string) {
    return this.sendEmail(to, `🚨 Alerta de Fuga: ${title}`, htmlTemplate);
  }
}