import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { envs } from '../config/env';
import { ServiceBusClient } from '@azure/service-bus';

/**
 * Agrupa el controlador y el servicio de notificaciones.
 * Expone AlertaService para que pueda ser usado desde otros módulos.
 */
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