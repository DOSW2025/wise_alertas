// bus/auth-bus.service.ts
import { Injectable } from '@nestjs/common';
import { BaseBusService } from '../common/base-bus.service';
import { MailService } from '../mail/mail.service';
import { envs } from '../config/env';

@Injectable()
export class ChatBusService extends BaseBusService {

  get queueName(): string {
    return "queue-chat";
  }

  get queueConnection(): string {
    return envs.chatservicebusconnectionstring;
  }

  get serviceName(): string {
    return 'Chat Service Bus';
  }

  constructor(protected readonly mailService: MailService) {
    super(mailService);
  }

  protected async processMessage(message: any): Promise<void> {
    const messageContent = this.extractMessageContent(message);

    // await this.mailService.sendTemplateMail({
    //   to: messageContent.email,
    //   name: messageContent.name,
    //   template: messageContent.template,
    //   context: { ...messageContent }
    // });
  }
}