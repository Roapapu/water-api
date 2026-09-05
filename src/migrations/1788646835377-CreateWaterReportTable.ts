import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWaterReportTable1788646835377 implements MigrationInterface {
    name = 'CreateWaterReportTable1788646835377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."WATER_REPORT_status_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED')`);
        await queryRunner.query(`CREATE TABLE "WATER_REPORT" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "location" character varying NOT NULL, "description" text NOT NULL, "status" "public"."WATER_REPORT_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b232cdd6d3e95978564720c2ebe" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "WATER_REPORT"`);
        await queryRunner.query(`DROP TYPE "public"."WATER_REPORT_status_enum"`);
    }

}
