import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReportSeverity } from '../entities/water-report.entity.js';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  location: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsEnum(ReportSeverity, { message: 'La severidad debe ser LOW, MEDIUM, HIGH o CRITICAL' })
  @IsOptional()
  severity?: ReportSeverity;
}
