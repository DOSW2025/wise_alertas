import { Injectable, Logger } from '@nestjs/common';
import { MailService as SendGridMailService } from '@sendgrid/mail';
import * as fs from 'fs';
import { envs } from '../config/env';
import * as path from 'path';
import * as hbs from 'handlebars';
import * as dotenv from 'dotenv';
import { EventoDto } from './dto/evento.dto';

// Cargar variables de entorno
dotenv.config();

/**
 * Servicio para el envío de correos electrónicos utilizando SendGrid y plantillas Handlebars
 * @author Eciwise Development Team
 * @version 1.0.0
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private templatesDir = path.join(process.cwd(), 'src', 'templates');
  private readonly sgMail: SendGridMailService;

  /* Inicializa el servicio de correo con la clave API de SendGrid */
  constructor() {
    this.sgMail = new SendGridMailService();
    this.sgMail.setApiKey(envs.sendgridapikey);
  }

  /**
   *  Carga una plantilla Handlebars desde el sistema de archivos
   * @param templateName Nombre de la plantilla a cargar
   * @returns Contenido de la plantilla como cadena de texto
   */
  private loadTemplate(templateName: string): string {
    const filePath = path.join(this.templatesDir, `${templateName}.hbs`);
    if (!fs.existsSync(filePath)) {
      this.logger.warn(
        `Template no encontrada: ${filePath}. Usando plantilla por defecto.`,
      );
      return `<p>Hola {{name}},</p><p>Tienes una nueva notificación.</p>`;
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  /**
   * Envía un correo electrónico utilizando una plantilla Handlebars
   * @param to Dirección de correo del destinatario
   * @param name Nombre del destinatario (opcional)
   * @param template Nombre de la plantilla a utilizar
   * @param context Contexto para la plantilla Handlebars (data)
   */
  async sendTemplateMail({
    to,
    name,
    template,
    context,
  }: {
    to: string;
    name?: string;
    template: string;
    context: any;
  }) {
    const eventGridUrl = envs.mailfrom;
    const source = this.loadTemplate(template);
    const compiled = hbs.compile(source);
    const html = compiled({ name, ...context });

    const msg = {
      to,
      from: { email: eventGridUrl , name: 'Eciwise Alerts' },
      subject: `ECIWISE-${template}-DOSW-Flowbyte`,
      html,
    };


    try {
      await this.sgMail.send(msg);
      this.logger.log(`Correo enviado a ${to}`);
    } catch (err) {
      this.logger.error('SendGrid error', err);
      throw err;
    }
  }

  async sendMail(data: EventoDto) {
    this.logger.log("Enviando correos a los receptores...");
    for (const receptor of data.receptores) {
      this.logger.log(`Preparando correo para: ${receptor.email}`);
      await this.sendTemplateMail({
        to: receptor.email,
        name: receptor.name,
        template: data.template,
        context: { ...data },
      });
    }
  }
}
