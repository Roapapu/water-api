import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';

@Module({
  providers: [MailService],
  exports: [MailService], // <-- Importante para usarlo fuera de este módulo
})
export class MailModule {}