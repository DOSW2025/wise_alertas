import { Module } from '@nestjs/common';
import { MailEnvioIndividual } from './mailEnvioIndividual.service';
import { MailEnvioRol } from './mailEnvioRol.service';
import { MailEnvioMasivo } from './mailEnvioMasivo.service';
import { AlertaModule } from 'src/alerta/alerta.module';

/**
 * Módulo que agrupa los servicios de envío de correos
 * y reutiliza la lógica de notificaciones del AlertaModule.
 */
@Module({
  imports: [AlertaModule],
  providers: [
    MailEnvioIndividual,
    MailEnvioRol,
    MailEnvioMasivo,
  ],
  exports: [
    MailEnvioIndividual,
    MailEnvioRol,
    MailEnvioMasivo,
  ],
})
export class BusModule {}
