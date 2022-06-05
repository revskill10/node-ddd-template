import { DataSource } from 'typeorm';
import { postgresDataSource } from '../../postgres-data-source';
import { DomainId } from 'types-ddd';
import ArticleAggregate from '../../../../packages/article/domain/aggregates/article.aggregate';
import ArticleTitleValueObject from '../../../../packages/article/domain/value-objects/article-title.value-object';
import { ArticleAggregatePostgresRepository as ArticleAggregateRepository } from '../article-aggregate.postgres.repository';
import { ArticleEventRepository } from '../article-event.repository';
import { ArticleRepository } from '../article.repository';
import { TypeOrmUnitOfWork } from '../../postgres-unit-of-work';


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
			const task = ArticleAggregate.create(
				{
					ID: DomainId.create(),
					title: ArticleTitleValueObject.create('valid_description').getResult(),
				}
			).getResult();
			const newTitle = ArticleTitleValueObject.create('new title').getResult();
			task.changeTitle(newTitle);
			const repo = new ArticleAggregateRepository();
			await repo.save(task);
			const art = await ArticleRepository.findOne({
				where: {
					id: task.id.value.toString()
				}
			});
			expect(art?.id).toEqual(task.id.value.toString());
			const evt = await ArticleEventRepository.find({
				where: {
					article_id: art?.id
				}
			});
			expect(evt.length).toEqual(2);
		})
	});

	describe('uow', () => {
		it('supports uow', async () => {
			const handler = async (uow: TypeOrmUnitOfWork) => {
				const arRepo = uow.withRepository(ArticleRepository);
				const arEvtRepo = uow.withRepository(ArticleEventRepository);
				const repo = new ArticleAggregateRepository(arRepo, arEvtRepo);
				const task = ArticleAggregate.create(
					{
						ID: DomainId.create(),
						title: ArticleTitleValueObject.create('valid_description').getResult(),
					}
				).getResult();
				const newTitle = ArticleTitleValueObject.create('new title').getResult();
				task.changeTitle(newTitle);
				await repo.save(task);
			}
			const uow = new TypeOrmUnitOfWork();
			await uow.start();
			await uow.complete(handler);

			const arts = await ArticleRepository.find();
			const art = arts[0];
			const evt = await ArticleEventRepository.find({
				where: {
					article_id: art?.id
				}
			});
			expect(evt.length).toEqual(2);
		})
	});
});
