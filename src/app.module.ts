import { Module } from '@nestjs/common';
import { BusModule } from './bus/bus.module';
import { PrismaModule } from './prisma/prisma.module';
import { AlertaModule } from './alerta/alerta.module';

@Module({
  imports: [BusModule,PrismaModule, AlertaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

