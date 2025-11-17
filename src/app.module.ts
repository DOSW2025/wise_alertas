import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { BusModule } from './bus/bus.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [MailModule,BusModule,PrismaModule,NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

