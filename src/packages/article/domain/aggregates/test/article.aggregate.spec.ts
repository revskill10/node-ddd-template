import ArticleAggregate from 'src/packages/article/domain/aggregates/article.aggregate';
import { DomainEvents, DomainId } from 'types-ddd/dist';
import { ArticleTitleValueObject } from 'src/packages/article/domain/value-objects/article-title.value-object';

describe('artice.aggregate', () => {
	afterEach(() => {
		DomainEvents.clearHandlers();
	});
	it('should be defined', () => {
		const aggregate = ArticleAggregate.create;
		expect(aggregate).toBeDefined();
	});

	it('should create a valid aggregate', () => {
		const aggregate = ArticleAggregate.create(
			{
				ID: DomainId.create(),
				title: ArticleTitleValueObject.create('title').getResult(),
			}
		);
		const task = aggregate.getResult();
		expect(aggregate.isSuccess).toBeTruthy();
		expect(task.title.value).toBe('title');
	});

	it('should change title', () => {
		const task = ArticleAggregate.create(
			{
				ID: DomainId.create(),
				title: ArticleTitleValueObject.create('valid_description').getResult(),
			}
		).getResult();
		const newTitle = ArticleTitleValueObject.create('new title').getResult();
		task.changeTitle(newTitle);
		expect(task.getEvents().length).toEqual(2);
		const newArticle = ArticleAggregate.applyEvents(task, task.getEvents());
		expect(newArticle.title.value).toEqual('new title');
		expect(newArticle.id.toValue()).toEqual(task.id.toValue());
	});
});
