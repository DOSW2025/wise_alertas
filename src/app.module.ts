import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { BusModule } from './bus/bus.module';
import { envs } from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: envs.database,
      synchronize: false,      // poner true sólo en desarrollo si lo deseas
      autoLoadEntities: true,  // carga las entidades registradas con forFeature()
    }),
    MailModule,
    BusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}