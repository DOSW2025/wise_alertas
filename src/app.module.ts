import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { BusModule } from './bus/bus.module';

@Module({
  imports: [MailModule,BusModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
