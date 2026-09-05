import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterReport } from './entities/water-report.entity.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { MailService } from '../mail/mail.service.js';
import { generateReportTemplate } from './templates/report.template.js';
import { envs } from '../config/envs.js';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(WaterReport)
    private readonly reportRepository: Repository<WaterReport>,
    private readonly mailService: MailService,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const report = this.reportRepository.create(createReportDto);
    await this.reportRepository.save(report);

    // Generar template HTML y disparar correo de alerta a la cuadrilla
    try {
      const htmlTemplate = generateReportTemplate(createReportDto);
      await this.mailService.sendWaterLeakAlert(envs.MAIL_TO, htmlTemplate, report.title);
      this.logger.log(`Correo de alerta enviado para reporte #${report.id}`);
    } catch (error) {
      this.logger.error(`Error al enviar correo de alerta para reporte #${report.id}`, error);
    }

    return report;
  }

  async findAll() {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
