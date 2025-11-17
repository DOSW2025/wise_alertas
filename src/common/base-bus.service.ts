// common/base-bus.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ServiceBusClient, ServiceBusReceiver } from '@azure/service-bus';
import { MailService } from '../mail/mail.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export abstract class BaseBusService implements OnModuleInit, OnModuleDestroy {
  protected client: ServiceBusClient;
  protected receiver: ServiceBusReceiver;
  protected readonly logger: Logger;
  
  abstract get queueName(): string;
  abstract get queueConnection(): string;
  abstract get serviceName(): string;

  constructor(protected readonly mailService: MailService, protected readonly notificationService: NotificationService) {
    this.logger = new Logger(this.constructor.name);
  }

  async onModuleInit() {
    try {
      this.logger.log(`Iniciando ${this.serviceName} para cola: ${this.queueName}`);
      
      const connectionString = this.queueConnection;
      this.client = new ServiceBusClient(connectionString);
      this.receiver = this.client.createReceiver(this.queueName);

      this.receiver.subscribe({
        processMessage: async (message) => {
          await this.handleMessage(message);
        },
        processError: async (error) => {
          this.logger.error(`Error en receptor de ${this.serviceName}:`, error);
        },
      });

      this.logger.log(`${this.serviceName} iniciado correctamente`);
    } catch (error) {
      this.logger.error(`Error al iniciar ${this.serviceName}:`, error);
      throw error;
    }
  }

  private async handleMessage(message: any): Promise<void> {
    try {
      this.logger.log(`[${this.serviceName}] Mensaje recibido ID: ${message.messageId}`);
      
      await this.processMessage(message);
      await this.receiver.completeMessage(message);
      
      this.logger.log(`[${this.serviceName}] Mensaje ${message.messageId} procesado exitosamente`);
    } catch (error) {
      this.logger.error(`[${this.serviceName}] Error procesando mensaje ${message.messageId}:`, error);
      await this.receiver.abandonMessage(message);
    }
  }

  protected abstract processMessage(message: any): Promise<void>;

  async onModuleDestroy() {
    this.logger.log(`Cerrando ${this.serviceName}...`);
    
    if (this.receiver) {
      await this.receiver.close();
      this.logger.log(`Receptor de ${this.serviceName} cerrado`);
    }
    
    if (this.client) {
      await this.client.close();
      this.logger.log(`Cliente de ${this.serviceName} cerrado`);
    }
  }

  protected extractMessageContent(message: any): any {
    let messageContent = message.body;
    
    if (message.body && message.body.body) {
      this.logger.debug('Mensaje con estructura anidada detectado');
      messageContent = message.body.body;
    }
    
    this.logger.debug(`Contenido extraído:`, this.safeStringify(messageContent));
    return messageContent;
  }

  protected safeStringify(obj: any): string {
    try {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        return value;
      }, 2);
    } catch (error) {
      return `[Error al serializar: ${error.message}]`;
    }
  }
}