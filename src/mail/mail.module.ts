import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

/**
 * Módulo para la funcionalidad de envío de correos electrónicos
 * @author Eciwise Development Team
 * @version 1.0.0
 */
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
