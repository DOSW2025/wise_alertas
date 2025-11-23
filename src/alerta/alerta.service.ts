import {Injectable,Logger,NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService as SendGridMailService } from '@sendgrid/mail';
import { envs } from '../config/env';
import * as fs from 'fs';
import * as path from 'path';
import * as hbs from 'handlebars';
import * as dotenv from 'dotenv';
import { User } from './entitys/user.entity';
import { CorreoDto } from './dto/correo.dto';
import { CorreoMasivoDto } from './dto/correoMasivo.dto';
import { UnicoMailDto } from 'src/bus/dto/unicoMail.dto';
import { MasivoMailDto } from 'src/bus/dto/masivoMail.dto';

dotenv.config();

@Injectable()
export class AlertaService {
  private readonly logger = new Logger(AlertaService.name);
  private readonly sgMail: SendGridMailService;

  private templatesDir = path.join(process.cwd(), 'src', 'templates');

  constructor(private prisma: PrismaService) {
    this.sgMail = new SendGridMailService();
    this.sgMail.setApiKey(envs.sendgridapikey);
  }

  //Endpoint

  async findByUser(userId: string) {
    const res = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { fechaCreacion: 'desc' },
    });

    return res.map(r => ({ ...r, id: String(r.id) }));
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: { userId, visto: false },
    });
  }

  async deleteById(id: string) {
    const res = await this.prisma.notification.delete({
      where: { id: Number(id) },
    });
    if (!res) throw new NotFoundException('Notificación no encontrada');
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, visto: false },
      data: { visto: true },
    });
  }

  async markRead(id: string) {
    const res = await this.prisma.notification.update({
      where: { id: Number(id) },
      data: { visto: true },
    });
    if (!res) throw new NotFoundException('Notificación no encontrada');
  }

  //Crear notificaciones

  /** Crear notificación en BD */
  private async crearNotificacionEnBD(userId: string, titulo: string, mensaje: string) {
    await this.prisma.notification.create({
      data: {
        userId,
        asunto: titulo,
        resumen: mensaje,
      },
    });
  }

  /** Buscar usuario por email */
  private async getUsuarioPorEmail(mail: string): Promise<User> {
    const user = await this.prisma.usuario.findUnique({ where: { email: mail } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  /** Crear notificación para un receptor */
  async registrarCorreoEnviado(informacion: UnicoMailDto) {
    const user = await this.getUsuarioPorEmail(informacion.email);
    await this.crearNotificacionEnBD(user.id, informacion.template, informacion.resumen);
  }

  /** Crear notificaciones para varios receptores */
  async registrarCorreoEnviadoMasivas(informacion: MasivoMailDto) {
    for (const receptor of informacion.receptores) {
        const notificacion: UnicoMailDto = {
            email: receptor.email,
            name: receptor.name,
            template: informacion.template,
            resumen: informacion.resumen,
            guardar: informacion.guardar,
      };
      await this.registrarCorreoEnviado(notificacion);
    }
  }

  //CORREOS

  private loadTemplate(templateName: string): string {
    const filePath = path.join(this.templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(filePath)) {
      this.logger.warn(`Template no encontrada: ${filePath}. Usando fallback.`);
      return `<p>Hola {{name}},</p><p>{{mensaje}}</p>`;
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  /** Enviar correo con plantilla */
  async enviarCorreoIndividual(correo: CorreoDto ) {
    const source = this.loadTemplate(correo.template);
    const compiled = hbs.compile(source);
    const html = compiled({...correo, year: new Date().getFullYear()});

    const logoPath = path.join(process.cwd(), 'doc', 'imgs', 'logo.png');
    const attachments: any[] = [];

    if (fs.existsSync(logoPath)) {
      try {
        const buffer = fs.readFileSync(logoPath);
        const content = buffer.toString('base64');
        attachments.push({
          content,
          filename: 'logo.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'logo',
        });
      } catch (readErr) {
        this.logger.warn(`No se pudo leer logo en ${logoPath}: ${readErr.message}`);
      }
    } else {
      this.logger.debug(`Logo no encontrado en ${logoPath}, se enviará plantilla sin inline logo.`);
    }

    const msg: any = {
      to: correo.email,
      from: { email: envs.mailfrom, name: 'Eciwise Alerts' },
      subject: `ECIWISE - ${correo.template}`,
      html,
    };

    if (attachments.length) msg.attachments = attachments;

    try {
      await this.sgMail.send(msg);
      this.logger.log(`Correo enviado a ${correo.email} con plantilla ${correo.template}`);
    } catch (err) {
      this.logger.error('Error enviando correo', err);
      throw err;
    }
  }

  async enviarCorreoMasivos(info : CorreoMasivoDto){
    for(const receptor of info.receptores){
      const correo: CorreoDto = {
        email: receptor.email,
        name: receptor.name,
        template: info.template,
      };
      await this.enviarCorreoIndividual(correo);
    }
  }

}