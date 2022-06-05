import { DataSource } from 'typeorm';
import { postgresDataSource } from '../../postgres-data-source';
import { ArticleRepository } from '../article.repository';

describe('BusinessRepository', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await postgresDataSource.initialize();
        // Drops DB and re-creates schema
        await connection.dropDatabase();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    beforeEach(async () => {
        await connection.synchronize();
    });

    describe('save()', () => {
        it('creates a business in db and is retrievable', async () => {
            const article = await ArticleRepository.create({
                title: 'test',
                version: 1
            });
            expect(article.title).toEqual('test');
            expect(article.version).toEqual(1);
        })
    });
});
