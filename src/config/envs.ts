import { config } from 'dotenv';
import env from 'env-var';

config();

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  AWS_REGION: env.get('AWS_REGION').required().asString(),
  AWS_S3_BUCKET: env.get('AWS_S3_BUCKET').required().asString(),
  
  // Base de datos
  DB_HOST: env.get('DB_HOST').required().asString(),
  DB_PORT: env.get('DB_PORT').required().asPortNumber(),
  DB_USERNAME: env.get('DB_USERNAME').required().asString(),
  DB_PASSWORD: env.get('DB_PASSWORD').required().asString(),
  DB_NAME: env.get('DB_NAME').required().asString(),
  
  // Nodemailer
  MAIL_HOST: env.get('MAIL_HOST').required().asString(),
  MAIL_PORT: env.get('MAIL_PORT').required().asPortNumber(),
  MAIL_USER: env.get('MAIL_USER').required().asString(),
  MAIL_PASS: env.get('MAIL_PASS').required().asString(),
  MAIL_FROM: env.get('MAIL_FROM').required().asString(),
  MAIL_TO: env.get('MAIL_TO').required().asString(),
};
