import { ArticleEventRepository } from '../article-event.repository';
import { DataSource } from 'typeorm';
import { postgresDataSource } from '../../postgres-data-source';
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
            const articleEvents = await ArticleEventRepository.create([
				{
				  article_version: 1,
				  article_id: '12ccffee-e073-4934-a8c3-e9d19bfd85d6',
				  event_name: 'ArticleCreatedEvent'
				},
				{
				  article_version: 1,
				  article_id: '12ccffee-e073-4934-a8c3-e9d19bfd85d6',
				  event_name: 'ArticleTitleChangedEvent'
				}
			]);
            expect(articleEvents[0].event_name).toEqual('ArticleCreatedEvent');
            expect(articleEvents[0].article_version).toEqual(1);
        })
    });
});
