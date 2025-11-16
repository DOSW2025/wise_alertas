import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { BusModule } from './bus/bus.module';
import { NotificationModule } from './notification/notification.module';
import { envs } from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envs.database,
      synchronize: false,
      autoLoadEntities: true,
    }),
    MailModule,
    BusModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}