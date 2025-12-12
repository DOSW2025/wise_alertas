import {Injectable,Logger,NotFoundException,HttpException,HttpStatus} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService as SendGridMailService } from '@sendgrid/mail';
import { envs } from '../config/env';
import * as fs from 'fs';
import * as path from 'path';
import * as hbs from 'handlebars';
import * as dotenv from 'dotenv';
import { User } from './entitys/user.entity';
import { UnicoMailDto } from 'src/alerta/dto/unicoMail.dto';
import { NotificacionDto } from './dto/notificacion.dto';
import { TemplateEnum } from './enums/template.enum';
import { ServiceBusClient} from '@azure/service-bus';
import { RolMailDto } from './dto/rolMail.dto';
import { TypeEnum } from './enums/type.enum';


dotenv.config();

@Injectable()
export class AlertaService {
  private readonly logger = new Logger(AlertaService.name);
  private readonly sgMail: SendGridMailService;
  private rolQueue;
  private uniqueQueue; 
  private templatesDir = path.join(process.cwd(), 'src', 'templates');

  constructor(private prisma: PrismaService,private readonly client: ServiceBusClient) {
    this.sgMail = new SendGridMailService();
    this.sgMail.setApiKey(envs.sendgridapikey);
    this.rolQueue = this.client.createReceiver('mail.envio.rol');
    this.uniqueQueue = this.client.createReceiver('mail.envio.individual');
    this.listenForUniqueQueue();
    this.listenForRolQueue();
  }

  //Endpoints

  async findByUser(userId: string): Promise<NotificacionDto[]> {
    try {
      const res = await this.prisma.notifications.findMany({
        where: { userId },
        orderBy: { fechaCreacion: 'desc' },
      });

      return res.map(n => ({
        id: n.id,
        asunto: n.asunto,
        resumen: n.resumen,
        visto: n.visto,
        fechaCreacion: n.fechaCreacion,
        type: n.type,
      }));
    } catch (err) {
      this.logger.error(`Error obteniendo notificaciones para usuario ${userId}:`, err);
      throw new HttpException('Error al obtener notificaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countUnread(userId: string) {
    try {
      return await this.prisma.notifications.count({ where: { userId, visto: false } });
    } catch (err) {
      this.logger.error(`Error contando notificaciones no leídas para usuario ${userId}:`, err);
      throw new HttpException('Error al contar notificaciones no leídas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteById(id: string) {
    try {
      await this.prisma.notifications.delete({ where: { id: Number(id) } });
    } catch (err: any) {
      this.logger.error(`Error eliminando notificación ${id}:`, err);
      if (err?.code === 'P2025' || /not found/i.test(err.message || '')) {
        throw new NotFoundException('Notificación no encontrada');
      }
      throw new HttpException('Error al eliminar notificación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markAllRead(userId: string) {
    try {
      const res = await this.prisma.notifications.updateMany({
        where: { userId, visto: false },
        data: { visto: true },
      });
      return res.count;
    } catch (err) {
      this.logger.error(`Error marcando como leídas las notificaciones de ${userId}:`, err);
      throw new HttpException('Error al marcar notificaciones como leídas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markRead(id: string) {
    try {
      const res = await this.prisma.notifications.update({
        where: { id: Number(id) },
        data: { visto: true },
      });
      return res;
    } catch (err: any) {
      this.logger.error(`Error marcando notificación ${id} como leída:`, err);
      if (err?.code === 'P2025' || /not found/i.test(err.message || '')) {
        throw new NotFoundException('Notificación no encontrada');
      }
      throw new HttpException('Error al marcar notificación como leída', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //Crear notificaciones

  /** Crear notificación en BD */
  private async crearNotificacionEnBD(userId: string, titulo: string, mensaje: string, type: string) {
    await this.prisma.notifications.create({
      data: {
        userId,
        asunto: titulo,
        resumen: mensaje,
        type: type,
      },
    });
  }

  /** Buscar usuario por email */
  private async getUsuarioPorEmail(mail: string): Promise<User> {
    const user = await this.prisma.usuarios.findUnique({ where: { email: mail } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  /** Crear notificación para un receptor */
  async registrarCorreoIndividual(informacion: UnicoMailDto) {
    const user = await this.getUsuarioPorEmail(informacion.email);
    const subject = (TemplateEnum as any)[informacion.template];
    const type = (TypeEnum as any)[informacion.type.toUpperCase()];
    if (subject === TemplateEnum.nuevoMensaje) {
      const asunto = subject + `${informacion.nombreGrupo}`;
      this.logger.debug(`Registrando notificación para ${informacion.email} con asunto: ${asunto}`);
      await this.crearNotificacionEnBD(user.id, asunto, informacion.resumen, type);
    }else {
      this.logger.debug(`Registrando notificación para ${informacion.email} con asunto: ${subject}`);
      await this.crearNotificacionEnBD(user.id, subject, informacion.resumen, type);
    }
  }

  /** Crear notificaciones para varios receptores */
  async registrarCorreoPorRol(informacion: RolMailDto) {
    const users = await this.encontrarUsuariosPorRol(informacion.rol);
    for (const user of users) {
        const notificacion: UnicoMailDto = {
        email: user.email,
        name: `${user.nombre} ${user.apellido}`,...informacion,
      };
      await this.registrarCorreoIndividual(notificacion);
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
  async enviarCorreoIndividual(correo: UnicoMailDto ) {
    const source = this.loadTemplate(correo.template);
    const compiled = hbs.compile(source);
    const html = compiled({...correo});

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

    const subject = (TemplateEnum as any)[correo.template] ?? `ECIWISE - ${correo.template}`;

    const msg: any = {
      to: correo.email,
      from: { email: envs.mailfrom, name: 'Eciwise Alerts' },
      subject,
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

  private async encontrarUsuariosPorRol(rol: string): Promise<User[]> {
    const usuarios : User[] = await this.prisma.usuarios.findMany({
      where: {
        roles: { nombre: rol },
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
      },
    });
    return usuarios;
  }

  async enviarCorreoPorRol(info : RolMailDto){
    const usuarios  = await this.encontrarUsuariosPorRol(info.rol);
    for(const usuario of usuarios){
      const correo: UnicoMailDto = {
        email: usuario.email,
        name: `${usuario.nombre} ${usuario.apellido}`,...info,
      };
      await this.enviarCorreoIndividual(correo);
    }
  }

  //metodos para escuchar las colas


  /**
   * Escuchar la cola de roles para procesar mensajes
   */
  private listenForRolQueue() {
    this.rolQueue.subscribe({
      processMessage: async (message) => {
        
        if (message.body.type === undefined || message.body.type === null) {
          message.body.type = TypeEnum.SUCCESS;
        }

        if (message.body.mandarCorreo === undefined || message.body.mandarCorreo === null) {
          message.body.mandarCorreo = true;
        }
        
        if (message.body.mandarCorreo) {
          await this.enviarCorreoPorRol(message.body as RolMailDto);
        }
        if (message.body.guardar) {
          await this.registrarCorreoPorRol(message.body as RolMailDto);
        }
        this.logger.log(`Mensaje procesado en rolQueue: ${message.body}`);
      },
      processError: async (err) => { 
        this.logger.error('Error en rolQueue: ', err); 
      }, 
    });
  }

  /** Escuchar la cola de únicos para procesar mensajes
   */
  private listenForUniqueQueue() {
    
    this.uniqueQueue.subscribe({
      processMessage: async (message) => {

        if (message.body.type === undefined || message.body.type === null) {
          message.body.type = TypeEnum.SUCCESS;
        }
        
        if (message.body.mandarCorreo === undefined || message.body.mandarCorreo === null) {
          message.body.mandarCorreo = true;
        }
        
        if (message.body.mandarCorreo) {
          await this.enviarCorreoIndividual(message.body as UnicoMailDto);
        }
        if (message.body.guardar) {
          await this.registrarCorreoIndividual(message.body as UnicoMailDto);
        }


        this.logger.log(`Mensaje procesado en uniqueQueue: ${message.body}`);
      },
      processError: async (err) => { 
        this.logger.error('Error en uniqueQueue: ', err); 
      }, 
    }); 
  }

}
