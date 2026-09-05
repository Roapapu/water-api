import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service.js';
import { ReportsController } from './reports.controller.js';
import { WaterReport } from './entities/water-report.entity.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([WaterReport]),
    MailModule, // Para inyectar MailService en ReportsService
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
