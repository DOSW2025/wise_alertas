import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from  '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  private logger = new Logger('PrismaService');

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Conexión a la base de datos establecida.');
    } catch (error) {
      this.logger.error('Error al conectar a la base de datos', error);
      throw error;
    }
  }
}
