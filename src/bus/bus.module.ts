import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { AuthBusService } from './authbus.service';
import { NotificationBusService } from './generalbus.service';
import { ChatBusService } from './chatbus.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [MailModule, NotificationModule],
  providers: [
    AuthBusService,
    NotificationBusService,
    ChatBusService,
  ],
  exports: [
    AuthBusService,
    NotificationBusService,
    ChatBusService,
  ],
})
export class BusModule {}
