import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { envs } from 'src/config/env';
import { ServiceBusClient } from '@azure/service-bus';

@Module({
  controllers: [AlertaController],
  providers: [AlertaService,
    { provide: ServiceBusClient, 
      useFactory: () => { 
        return new ServiceBusClient(envs.serviceBusConnectionString); 
      }, 
    },
  ],
  exports: [AlertaService],
})
export class AlertaModule { }