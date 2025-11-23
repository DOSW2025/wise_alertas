import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { envs } from '../config/env';
import { AlertaService } from '../alerta/alerta.service';
import { UnicoMailDto } from './dto/unicoMail.dto';

@Injectable()
export class MailEnvioIndividual extends BaseBusService {

  constructor(protected readonly alertaService: AlertaService) {
    super(alertaService);
  }

  get queueName(): string {
    return "mail.envio.individual";
  }

  get queueConnection(): string {
    return envs.mailenvioindividualconnectionstring;
  }

  get serviceName(): string {
    return 'mail.envio.individual';
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent: UnicoMailDto = this.extractMessageContent(message);

    if (!messageContent) {
      this.logger.error('Mensaje inválido: contenido no encontrado o malformado.');
      return;
    }
    if (!messageContent.mandarCorreo) {
      await this.alertaService.enviarCorreoIndividual(messageContent);
    }
    
    if (messageContent.guardar) {
      await this.alertaService.registrarCorreoEnviado(messageContent); 
      this.logger.log(`Correo enviado y guardado para: ${messageContent.email}`);
    }





  }
}