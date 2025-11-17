// bus/notification-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { MailService } from '../mail/mail.service';
import { envs } from '../config/env';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class NotificationBusService extends BaseBusService {

  constructor(protected readonly mailService: MailService, protected readonly notificationService: NotificationService) {
    super(mailService, notificationService);
  }
  
  get queueName(): string {
    return "queue-alert";
  }

  get queueConnection(): string {
    return envs.servicebusconnectionstring;
  }

  get serviceName(): string {
    return 'Notification Service Bus';
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent = this.extractMessageContent(message);

    await this.mailService.sendMail(messageContent);

    await this.notificationService.crearNotificacion(messageContent.email, messageContent.template, messageContent.resumen);
  }

}