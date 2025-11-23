import { Module } from '@nestjs/common';
import { MailEnvioIndividual } from './mailEnvioIndividual.service';
import { MailEnvioRol } from './mailEnvioRol.service';
import { MailEnvioMasivo } from './mailEnvioMasivo.service';
import { AlertaModule } from 'src/alerta/alerta.module';


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
