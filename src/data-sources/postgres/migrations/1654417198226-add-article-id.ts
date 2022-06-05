import { MigrationInterface, QueryRunner } from "typeorm";

export class addArticleId1654417198226 implements MigrationInterface {
    name = 'addArticleId1654417198226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_event" DROP CONSTRAINT "FK_3be24c99fbe70fd21b6d5ab236f"`);
        await queryRunner.query(`ALTER TABLE "article_event" RENAME COLUMN "articleId" TO "article_id"`);
        await queryRunner.query(`ALTER TABLE "article_event" ALTER COLUMN "article_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article_event" ALTER COLUMN "article_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "article_event" RENAME COLUMN "article_id" TO "articleId"`);
        await queryRunner.query(`ALTER TABLE "article_event" ADD CONSTRAINT "FK_3be24c99fbe70fd21b6d5ab236f" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
