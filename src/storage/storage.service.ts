import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import { envs } from '../config/envs.js';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({ region: envs.AWS_REGION });

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const prefix = folder.replace(/^\/+|\/+$/g, '');
    const key = `${prefix}/${randomUUID()}.${extensions[file.mimetype] ?? 'bin'}`;
    await this.client.send(new PutObjectCommand({
      Bucket: envs.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));
    return `https://${envs.AWS_S3_BUCKET}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
  }
}
