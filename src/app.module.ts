import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AlertaModule } from './alerta/alerta.module';

@Module({
  imports: [PrismaModule, AlertaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

