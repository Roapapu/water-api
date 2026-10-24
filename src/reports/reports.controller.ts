import { Controller, Get, Post, Body, UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportsService } from './reports.service.js';
import { CreateReportDto } from './dto/create-report.dto.js';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  create(
    @Body() createReportDto: CreateReportDto,
    @UploadedFile(new ParseFilePipe({
      fileIsRequired: true,
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/, overrideMimeType: true }),
      ],
    })) photo: Express.Multer.File,
  ) {
    return this.reportsService.create(createReportDto, photo);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }
}
