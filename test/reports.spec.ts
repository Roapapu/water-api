import { Test } from '@nestjs/testing';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ReportsController } from '../src/reports/reports.controller.js';
import { ReportsService } from '../src/reports/reports.service.js';
import { generateReportTemplate } from '../src/reports/templates/report.template.js';

describe('Report photos (HTTP)', () => {
  let app: INestApplication;
  const url = 'https://example.s3.us-east-1.amazonaws.com/reports/photo.png';
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  const storage = { uploadFile: vi.fn() };
  const mail = { sendWaterLeakAlert: vi.fn() };
  const repository = { create: vi.fn(), save: vi.fn(), find: vi.fn() };
  const dto = { title: 'Fuga', location: 'Calle 1', description: 'Agua en la calle', phone: '5551234567' };

  beforeEach(async () => {
    vi.resetAllMocks();
    storage.uploadFile.mockResolvedValue(url);
    repository.create.mockImplementation((data) => ({ id: 1, repairPhotoUrl: null, ...data }));
    repository.save.mockImplementation(async (data) => data);
    mail.sendWaterLeakAlert.mockResolvedValue({ success: true });
    const module = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useFactory: () => new ReportsService(repository as never, mail as never, storage as never) }],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterEach(async () => { await app.close(); });

  it('rejects missing photo without uploading or saving', async () => {
    await request(app.getHttpServer()).post('/reports').field(dto).expect(400);
    expect(storage.uploadFile).not.toHaveBeenCalled();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects text disguised as an image', async () => {
    await request(app.getHttpServer()).post('/reports').field(dto)
      .attach('photo', Buffer.from('not an image'), { filename: 'fake.png', contentType: 'image/png' }).expect(400);
    expect(storage.uploadFile).not.toHaveBeenCalled();
  });

  it('keeps DTO validation for multipart requests', async () => {
    await request(app.getHttpServer()).post('/reports').field({ ...dto, title: '' })
      .attach('photo', png, 'photo.png').expect(400);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('uploads, persists the URL and sends the photo and phone in the email', async () => {
    const response = await request(app.getHttpServer()).post('/reports').field(dto)
      .attach('photo', png, 'photo.png').expect(201);
    expect(response.body).toMatchObject({ ...dto, photoUrl: url, repairPhotoUrl: null });
    expect(storage.uploadFile).toHaveBeenCalledWith(expect.objectContaining({ buffer: png }), 'reports/');
    expect(repository.save).toHaveBeenCalled();
    expect(mail.sendWaterLeakAlert).toHaveBeenCalledWith(expect.any(String), expect.stringContaining(`<img src="${url}"`), 'Fuga');
    expect(mail.sendWaterLeakAlert.mock.calls[0][1]).toContain(dto.phone);
  });

  it('returns both photo fields in GET', async () => {
    repository.find.mockResolvedValue([{ id: 1, photoUrl: url, repairPhotoUrl: null }]);
    const response = await request(app.getHttpServer()).get('/reports').expect(200);
    expect(response.body[0]).toMatchObject({ photoUrl: url, repairPhotoUrl: null });
  });

  it('does not save or email a report when S3 fails', async () => {
    storage.uploadFile.mockRejectedValue(new Error('S3 unavailable'));
    await request(app.getHttpServer()).post('/reports').field(dto).attach('photo', png, 'photo.png').expect(500);
    expect(repository.save).not.toHaveBeenCalled();
    expect(mail.sendWaterLeakAlert).not.toHaveBeenCalled();
  });

  it('escapes citizen input in email HTML', () => {
    const html = generateReportTemplate({ ...dto, title: '<script>alert(1)</script>' }, url);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
