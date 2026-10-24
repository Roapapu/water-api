import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportPhotosAndPhone1792772000000 implements MigrationInterface {
  name = 'AddReportPhotosAndPhone1792772000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "WATER_REPORT"
      ADD "photoUrl" character varying,
      ADD "repairPhotoUrl" character varying,
      ADD "phone" character varying`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "WATER_REPORT"
      DROP COLUMN "phone", DROP COLUMN "repairPhotoUrl", DROP COLUMN "photoUrl"`);
  }
}
