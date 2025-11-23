import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { AlertaService } from '../alerta/alerta.service';
import { envs } from '../config/env';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolMailDto } from './dto/rolMail.dto';
import { UnicoMailDto } from './dto/unicoMail.dto';
import { User } from 'src/alerta/entitys/user.entity';

@Injectable()
export class MailEnvioRol extends BaseBusService {

  constructor(protected readonly alertaService: AlertaService,private prisma: PrismaService) {
      super(alertaService);

    }
  
  get queueName(): string {
    return "mail.envio.rol";
  }

  get queueConnection(): string {
    return envs.mailenviorolconnectionstring;
  }

  get serviceName(): string {
    return 'Notification Service Bus';
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent: RolMailDto = this.extractMessageContent(message);

    // Buscar usuarios por el nombre del rol usando el filtro relacional de Prisma
    
    const usuarios : User[] = await this.prisma.usuario.findMany({
      where: {
        rol: { nombre: messageContent.rol },
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
      },
    });

    for (const usuario of usuarios) {
      const individualMessage: UnicoMailDto = {
        email: usuario.email,
        name: `${usuario.nombre} ${usuario.apellido}`.trim(),
        template: messageContent.template,
        resumen: messageContent.resumen,
        guardar: messageContent.guardar,

      };

      if (!messageContent.mandarCorreo) {
        await this.alertaService.enviarCorreoIndividual(individualMessage);
      }

      if (messageContent.guardar) {
        await this.alertaService.registrarCorreoEnviado(individualMessage);
        this.logger.log(`Correo enviado y guardado para: ${individualMessage.email}`);
      }
    }
  }
}