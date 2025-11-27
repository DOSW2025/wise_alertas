import { Module } from '@nestjs/common';
import { MailEnvioIndividual } from './mailEnvioIndividual.service';
import { MailEnvioRol } from './mailEnvioRol.service';
import { AlertaModule } from 'src/alerta/alerta.module';


@Module({
  imports: [AlertaModule],
  providers: [
    MailEnvioIndividual,
    MailEnvioRol,
  ],
  exports: [
    MailEnvioIndividual,
    MailEnvioRol,
  ],
})
export class BusModule {}
