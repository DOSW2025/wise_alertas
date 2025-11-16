// bus/auth-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { MailService } from '../mail/mail.service';
import { envs } from '../config/env';

@Injectable()
export class AuthBusService extends BaseBusService {

  get queueName(): string {
    return "queue-auth";
  }

  get queueConnection(): string {
    return envs.authservicebusconnectionstring;
  }

  get serviceName(): string {
    return 'Auth Service Bus';
  }

  constructor(protected readonly mailService: MailService) {
    super(mailService);
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent = this.extractMessageContent(message);

    await this.mailService.sendTemplateMail({
      to: messageContent.email,
      name: messageContent.name,
      template: messageContent.template,
      context: { ...messageContent }
    });
  }
}