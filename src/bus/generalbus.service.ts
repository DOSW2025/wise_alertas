// bus/notification-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { MailService } from '../mail/mail.service';
import { envs } from '../config/env';

@Injectable()
export class NotificationBusService extends BaseBusService {
  get queueName(): string {
    return "queue-alert";
  }

  get queueConnection(): string {
    return envs.servicebusconnectionstring;
  }

  get serviceName(): string {
    return 'Notification Service Bus';
  }

  constructor(protected readonly mailService: MailService) {
    super(mailService);
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent = this.extractMessageContent(message);

    await this.mailService.sendMail(messageContent);
  }

}