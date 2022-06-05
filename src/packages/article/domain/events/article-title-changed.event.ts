import { IDomainEvent, UniqueEntityID } from 'types-ddd';
import ArticleAggregate from 'src/packages/article/domain/aggregates/article.aggregate';
import ArticleTitleValueObject from '../value-objects/article-title.value-object';

export class ArticleTitleChangedEvent implements IDomainEvent {
	public dateTimeOccurred: Date;
	public article: ArticleAggregate;
	public title: ArticleTitleValueObject;
	public oldTitle: ArticleTitleValueObject;

	constructor(
		article: ArticleAggregate,
		newTitle: ArticleTitleValueObject
	) {
		this.article = article;
		this.oldTitle = article.title;
		this.title = newTitle;
		this.dateTimeOccurred = new Date();
	}

	getAggregateId(): UniqueEntityID {
		return this.article.id.value;
	}

}

export default ArticleTitleChangedEvent;
