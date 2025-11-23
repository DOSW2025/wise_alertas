// bus/auth-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { AlertaService } from '../alerta/alerta.service';
import { envs } from '../config/env';
import { MasivoMailDto } from './dto/masivoMail.dto';

@Injectable()
export class MailEnvioMasivo extends BaseBusService {

  constructor(protected readonly alertaService: AlertaService) {
    super(alertaService);
  }

  get queueName(): string {
    return "mail.envio.masivo";
  }

  get queueConnection(): string {
    return envs.mailenviomasivoconnectionstring;
  }

  get serviceName(): string {
    return 'Chat Service Bus';
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent : MasivoMailDto = this.extractMessageContent(message);
    
      if (!messageContent) {
        this.logger.error('Mensaje inválido: contenido no encontrado o malformado.');
        return;
      }

      if (!messageContent.mandarCorreo) {  
        await this.alertaService.enviarCorreoMasivos(messageContent);
      }

      if (messageContent.guardar) {
        await this.alertaService.registrarCorreoEnviadoMasivas(messageContent); 
        this.logger.log(`Correo masivo enviado y guardado para plantilla: ${messageContent.template}`);
      }
  }

}