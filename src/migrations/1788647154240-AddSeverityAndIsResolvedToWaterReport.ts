import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSeverityAndIsResolvedToWaterReport1788647154240 implements MigrationInterface {
    name = 'AddSeverityAndIsResolvedToWaterReport1788647154240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."WATER_REPORT_severity_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`);
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" ADD "severity" "public"."WATER_REPORT_severity_enum" NOT NULL DEFAULT 'MEDIUM'`);
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" ADD "isResolved" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" DROP COLUMN "isResolved"`);
        await queryRunner.query(`ALTER TABLE "WATER_REPORT" DROP COLUMN "severity"`);
        await queryRunner.query(`DROP TYPE "public"."WATER_REPORT_severity_enum"`);
    }

}
