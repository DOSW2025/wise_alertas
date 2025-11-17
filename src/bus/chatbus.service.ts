// bus/auth-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { MailService } from '../mail/mail.service';
import { envs } from '../config/env';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ChatBusService extends BaseBusService {

  constructor(protected readonly mailService: MailService, protected readonly notificationService: NotificationService) {
    super(mailService, notificationService);
  }

  get queueName(): string {
    return "queue-chat";
  }

  get queueConnection(): string {
    return envs.chatservicebusconnectionstring;
  }

  get serviceName(): string {
    return 'Chat Service Bus';
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent = this.extractMessageContent(message);

    await this.notificationService.crearNotificacion(messageContent.email, messageContent.template, messageContent.resumen);
  }
}