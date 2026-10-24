import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StorageService } from './storage.service.js';

describe('StorageService', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uploads bytes without an ACL and returns a unique public URL', async () => {
    const send = vi.spyOn(S3Client.prototype, 'send').mockResolvedValue({} as never);
    const service = new StorageService();
    const file = { buffer: Buffer.from('image'), mimetype: 'image/jpeg' } as Express.Multer.File;
    const first = await service.uploadFile(file, 'reports/');
    const second = await service.uploadFile(file, 'reports/');
    expect(first).not.toBe(second);
    expect(first).toMatch(/^https:\/\/.+\.s3\..+\.amazonaws\.com\/reports\/.+\.jpg$/);
    const command = send.mock.calls[0][0] as PutObjectCommand;
    expect(command.input).toMatchObject({ Body: file.buffer, ContentType: 'image/jpeg' });
    expect(command.input.ACL).toBeUndefined();
  });
});
