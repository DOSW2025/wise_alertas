// bus/auth-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { AlertaService } from '../alerta/alerta.service';
import { envs } from '../config/env';
import { MasivoMailDto } from './dto/masivoMail.dto';

/**
 * Servicio que procesa mensajes del bus para envío masivo de correos.
 */
@Injectable()
export class MailEnvioMasivo extends BaseBusService {

    /**
   * Recibe el servicio de alertas y lo pasa a la clase base del bus.
   */
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

  /**
   * Procesa el mensaje recibido desde la cola:
   * Valida el contenido
   * Envía correos masivos según la bandera mandarCorreo
   * Registra notificaciones si guardar es true
   */
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