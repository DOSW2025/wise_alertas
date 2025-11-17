// bus/auth-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { MailService } from '../mail/mail.service';
import { envs } from '../config/env';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class AuthBusService extends BaseBusService {

  constructor(protected readonly mailService: MailService, protected readonly notificationService: NotificationService) {
    super(mailService, notificationService);
  }

  get queueName(): string {
    return "queue-auth";
  }

  get queueConnection(): string {
    return envs.authservicebusconnectionstring;
  }

  get serviceName(): string {
    return 'Auth Service Bus';
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent = this.extractMessageContent(message);

    await this.mailService.sendTemplateMail({
      to: messageContent.email,
      name: messageContent.name,
      template: messageContent.template,
      context: { ...messageContent }
    });
    if(messageContent.template === 'nuevoUsuario'){
      await this.notificationService.crearUsuario(messageContent.id, messageContent.email, messageContent.name);
    }

  }
}