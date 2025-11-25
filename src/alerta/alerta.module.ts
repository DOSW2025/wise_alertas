import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';

/**
 * Agrupa el controlador y el servicio de notificaciones.
 * Expone AlertaService para que pueda ser usado desde otros módulos.
 */
@Module({
  controllers: [AlertaController],
  providers: [AlertaService],
  exports: [AlertaService],
})
export class AlertaModule { }