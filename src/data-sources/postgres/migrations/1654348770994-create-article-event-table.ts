import { MigrationInterface, QueryRunner } from "typeorm";

export class createArticleEventTable1654348770994 implements MigrationInterface {
    name = 'createArticleEventTable1654348770994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article_event" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_name" character varying NOT NULL, "article_version" integer NOT NULL, "articleId" uuid, CONSTRAINT "PK_e597a55fe152d0f7db44c9dc9bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "article" ADD "version" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "article_event" ADD CONSTRAINT "FK_3be24c99fbe70fd21b6d5ab236f" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_event" DROP CONSTRAINT "FK_3be24c99fbe70fd21b6d5ab236f"`);
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "version"`);
        await queryRunner.query(`DROP TABLE "article_event"`);
    }

}
