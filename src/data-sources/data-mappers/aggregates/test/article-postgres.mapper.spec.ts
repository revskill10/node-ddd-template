import { DataSource } from 'typeorm';
import { postgresDataSource } from '../../../postgres/postgres-data-source';
import { ArticleRepository } from '../../../postgres/repositories/article.repository';
import ArticleAggregate from 'src/packages/article/domain/aggregates/article.aggregate';
import ArticleTitleValueObject from 'src/packages/article/domain/value-objects/article-title.value-object';
import { DomainEvents, DomainId } from 'types-ddd';
import { ArticleDomainMapper, ArticleMapper } from '../article-postgres.mapper';
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

    afterEach(() => {
        DomainEvents.clearHandlers();
    });

    describe('save()', () => {
        it('creates a business in db and is retrievable', async () => {
            const ID = DomainId.create();
            const articleAggregate = ArticleAggregate.create({
                ID,
                title: ArticleTitleValueObject.create('test').getResult()
            }).getResult();
            const articleMapper = new ArticleMapper();
            const articleModel = articleMapper.map(articleAggregate);
            const article = await ArticleRepository.create(articleModel.getResult());
            expect(article.title).toEqual('test');
            const savedArticle = await ArticleRepository.findOne({
                where: {
                    id: ID.value.toString()
                }
            });
            if (savedArticle) {
                const articleDomainMapper = new ArticleDomainMapper();
                const aggregate = articleDomainMapper.map(savedArticle).getResult();
                expect(aggregate.title).toEqual(savedArticle.title);
            }

        })
    });
});
