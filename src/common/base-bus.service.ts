import {Injectable,OnModuleInit,OnModuleDestroy,Logger,} from '@nestjs/common';
import {ServiceBusClient,ServiceBusReceiver,ServiceBusReceivedMessage,} from '@azure/service-bus';
import { AlertaService } from '../alerta/alerta.service';

@Injectable()
export abstract class BaseBusService implements OnModuleInit, OnModuleDestroy{
  protected client: ServiceBusClient;
  protected receiver: ServiceBusReceiver;
  protected readonly logger: Logger;

  /** Nombre visible del servicio hijo */
  abstract get serviceName(): string;

  /** Nombre de la cola */
  abstract get queueName(): string;

  /** Connection string específico de la cola */
  abstract get queueConnection(): string;

  /** Cada hijo implementará cómo procesar el mensaje */
  protected abstract processMessage(
    message: ServiceBusReceivedMessage,
  ): Promise<void>;

  constructor(protected readonly alertaService: AlertaService) {
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Inicializa el cliente y el receptor de Service Bus, y comienza a escuchar mensajes.
   */
  async onModuleInit() {
    try {
      this.client = new ServiceBusClient(this.queueConnection);
      this.receiver = this.client.createReceiver(this.queueName);

      this.receiver.subscribe({
        processMessage: async (msg) => this.handleMessage(msg),
        processError: async (err) => {
          this.logger.error(`Error en receptor de ${this.serviceName}:`,err);
        },
      });

      this.logger.log(`${this.serviceName} iniciado correctamente`);
    } catch (error) {
      this.logger.error(`Error al iniciar ${this.serviceName}:`,error);
      throw error;
    }
  }

  /** Maneja el mensaje recibido, procesándolo y completándolo o abandonándolo según corresponda */
  private async handleMessage(message: ServiceBusReceivedMessage) {
    try {
      await this.processMessage(message);

      await this.receiver.completeMessage(message);

      this.logger.log(
        `[${this.serviceName}] Mensaje ${message.messageId} procesado exitosamente`,
      );
    } catch (error) {
      this.logger.error(
        `[${this.serviceName}] Error procesando mensaje ${message.messageId}:`,
        error,
      );
      // Evitar reintentos infinitos: mover a DLQ cuando se excede el límite de entregas.
      const maxDelivery = parseInt('3', 10);
      const deliveryCount = (message.deliveryCount ?? 0) as number;

      if (deliveryCount >= maxDelivery) {
        try {
          await this.receiver.deadLetterMessage(message, {
            deadLetterReason: 'MaxDeliveryExceeded',
            deadLetterErrorDescription: `Exceeded max delivery count (${deliveryCount} >= ${maxDelivery})`,
          });
          this.logger.warn(
            `[${this.serviceName}] Mensaje ${message.messageId} enviado a DLQ después de ${deliveryCount} entregas`,
          );
        } catch (dlErr) {
          this.logger.error(
            `[${this.serviceName}] Error al mover mensaje ${message.messageId} a DLQ:`,
            dlErr,
          );
          await this.receiver.abandonMessage(message);
        }
      } else {
        // Abandonar para que el broker reprograme el mensaje (incrementa deliveryCount)
        await this.receiver.abandonMessage(message);
      }
    }
  }

  /** Cierra el receptor y el cliente de Service Bus */
  async onModuleDestroy() {
    this.logger.log(`Cerrando ${this.serviceName}...`);

    if (this.receiver) {
      await this.receiver.close();
      this.logger.log(`Receptor cerrado`);
    }

    if (this.client) {
      await this.client.close();
      this.logger.log(`Cliente de Service Bus cerrado`);
    }
  }

  /** Extrae el contenido del mensaje, manejando estructuras anidadas si es necesario */
  protected extractMessageContent(message: ServiceBusReceivedMessage) {
    let content = message.body;

    if (content?.body) {
      this.logger.debug('Estructura anidada detectada en el mensaje');
      content = content.body;
    }

    this.logger.debug(
      `Payload extraído:\n${this.safeStringify(content)}`,
    );

    return content;
  }
  
  /** Serializa un objeto a JSON de forma segura, manejando referencias circulares */
  protected safeStringify(obj: any): string {
    try {
      const seen = new WeakSet();
      return JSON.stringify(
        obj,
        (key, value) => {
          if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
          }
          return value;
        },
        2,
      );
    } catch (err) {
      return `[Error al serializar: ${err.message}]`;
    }
  }
}
