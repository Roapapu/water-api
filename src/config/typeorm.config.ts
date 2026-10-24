import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { User } from '../auth/entities/user.entity.js';
import { WaterReport } from '../reports/entities/water-report.entity.js';


// Cargamos el .env para que el CLI sepa las credenciales
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, WaterReport], // <-- Importadas explícitamente
  migrations: [fileURLToPath(new URL('../migrations/*{.ts,.js}', import.meta.url))],
  synchronize: false,
});
